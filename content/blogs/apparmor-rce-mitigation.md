---
title: "AppArmor as an RCE Killswitch: A Blue-Team Defense Validation"
date: 2025-02-10T10:00:00+00:00
draft: false
author: "Mahmoud Adel"
tags:
  - AppArmor
  - Linux
  - Hardening
  - Blue Team
  - RCE
  - Defense
  - System Administration
image: /images/apparmor-rce.png
description: "An authorized blue-team assessment: exploit a trivial PHP RCE on Apache, contain it at runtime with an AppArmor profile, and then remediate the source. Includes profile snippets, audit logs, and validation output."
toc: true
---

This is an **authorized** blue-team defense-validation exercise: prove a known
PHP remote-code-execution (RCE) is exploitable, contain it at runtime with
**AppArmor**, re-test to confirm the exploit is neutralized, and finally fix the
root cause in source code. Everything below uses documentation ranges
(`10.0.0.0/8`, `example.com`) — sample artifacts only.

> ⚠️ **Technical note:** AppArmor is a *path- and capability-based* LSM. It
> confines a process by denying **execution of specific binaries**, file writes,
> and network access — it is **not** a syscall filter (that is **seccomp**'s
> job). What it *does* is stop the web process from ever `execve()`-ing
> `/bin/sh`, which is exactly what an RCE payload needs. The result is the same
> from the attacker's perspective: the RCE is dead.

## 1. The Target: A Vulnerable Endpoint

A basic PHP demo endpoint passes unsanitized user input straight to a shell:

```php
<?php
  // vuln.php — intentionally vulnerable, demo only
  $cmd = $_GET['cmd'];
  system($cmd);
?>
```

**Root cause:** user-controlled input is concatenated into a shell command via
`system()`. No validation, no escaping, no allowlist.

## 2. Exploitation (Proof of Concept)

```bash
$ curl "http://10.0.0.5/vuln.php?cmd=id"
uid=33(www-data) gid=33(www-data) groups=33(www-data)

$ curl "http://10.0.0.5/vuln.php?cmd=cat+/etc/passwd"
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin/nologin
...

$ curl "http://10.0.0.5/vuln.php?cmd=rm+-rf+/var/www/html/evil.php"
# arbitrary command execution as the web user — RCE confirmed
```

The exploit **works**. We now have command execution in the context of the
`www-data` user that runs Apache + `mod_php`.

## 3. Mitigation A — AppArmor Confinement (Compensating Control)

AppArmor confines the *interpreter process* (Apache/`mod_php`), not the PHP code.
We attach a profile that denies the web process from spawning interpreters/shells,
opening network connections, or writing outside its docroot.

`/etc/apparmor.d/usr.sbin.apache2` (added rules):

```apparmor
profile apache2 /usr/sbin/apache2 flags=(attach_disconnected) {
  #include <abstractions/apache2>
  #include <abstractions/base>

  # Deny executing interpreters / shells -> kills RCE payload exec
  deny /bin/** x,
  deny /usr/bin/** x,
  deny /usr/sbin/** x,
  deny /bin/sh ix,
  deny /bin/bash ix,
  deny /usr/bin/python* ix,

  # Deny raw network egress from the web process
  deny network inet,
  deny network inet6,

  # Deny writes outside the docroot
  deny /var/www/** w,
  audit /var/www/html/** w,

  # Drop capabilities the web server never needs
  deny capability sys_admin,
  deny capability dac_override,
}
```

Enforce it:

```bash
$ sudo aa-enforce apache2
$ sudo systemctl reload apparmor

$ aa-status | grep apache2
   apache2 (enforce)
```

> Tip: profile in **complain** mode first (`aa-complain apache2`), watch
> `/var/log/audit/audit.log`, then flip to **enforce** once legitimate traffic
> is clean. An over-tight profile will also block image-processing binaries,
> so validate before enforcing.

## 4. Re-Test — Exploit Blocked

```bash
$ curl "http://10.0.0.5/vuln.php?cmd=id"
<br />
<b>Warning</b>:  system(): Unable to execute command via shell: Permission denied ...
```

The kernel's LSM denies the `execve()`, so the payload never runs:

```bash
$ sudo dmesg | tail -n 3
[ 1284.62] audit: type=1400 apparmor="DENIED" operation="exec"
           profile="apache2" name="/bin/sh" pid=2148
           requested_mask="x" denied_mask="x" fsuid=33 ouid=0
```

**The RCE is neutralized at the process boundary — even though the vulnerable
PHP code is still present.** That is the whole point of a compensating control:
buy time and limit blast radius before the source fix lands.

## 5. Mitigation B — Source Code Remediation (The Real Fix)

AppArmor is defense-in-depth, not the root fix. The proper remediation removes
the dangerous primitive entirely.

**Bad:**

```php
system($_GET['cmd']);   // never do this
```

**Good — validate against an allowlist, avoid the shell:**

```php
<?php
  // safe.php
  $allowed = ['status', 'version'];
  $cmd = $_GET['cmd'] ?? '';
  if (!in_array($cmd, $allowed, true)) {
      http_response_code(400);
      exit('invalid command');
  }
  echo match ($cmd) {
      'status'  => shell_exec('systemctl is-active apache2'),
      'version' => phpversion(),
  };
?>
```

And disable dangerous functions globally in `php.ini`:

```ini
disable_functions = exec,passthru,shell_exec,system,proc_open,popen,pcntl_exec
```

Re-test after the fix — and after removing the AppArmor profile — the endpoint
returns `400` for anything outside the allowlist.

## 6. Validation Workflow Summary

| Step | Action | Result |
|------|--------|--------|
| 1 | Exploit `vuln.php?cmd=id` | ✅ RCE as `www-data` |
| 2 | Attach AppArmor profile, `aa-enforce` | Profile `enforce` |
| 3 | Re-exploit | ❌ `apparmor="DENIED" exec /bin/sh` |
| 4 | Remediate source + `disable_functions` | Root cause closed |
| 5 | Remove compensating profile, re-test | Still safe (allowlist) |

## 7. Lessons Learned

1. **AppArmor = runtime containment** — an RCE killswitch while you ship the real fix.
2. **Source fix = root cause** — never rely on the LSM as the only defense.
3. **Least privilege** — the web process should not be able to exec shells or open arbitrary sockets.
4. **seccomp is complementary** — if you need *syscall*-level restriction (e.g. block `execve` system-wide for a service), layer seccomp/BPF-LSM on top.
5. **Complain → Enforce** — profile safely before enforcing in production.

Defense in depth: confine the process, fix the code, disable the footguns. 🛡️
