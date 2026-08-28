---
title: "Linux Trial Reset via /etc/machine-id — unshare & mount --bind (Lab Research)"
date: 2026-08-29T10:00:00+00:00
draft: false
author: "Mahmoud Adel"
tags: ["Linux","Trial Bypass","machine-id","unshare","mount","Namespaces","Reverse Engineering","Responsible Disclosure"]
categories: ["Security Research"]
image: /images/linux-machine-id-trial-bypass.png
images: [/images/linux-machine-id-trial-bypass.png]
description: "Lab research: how Linux trial licensing checks /etc/machine-id and how mount namespaces isolate it — strings, strace openat/read, and unshare -m mount --bind fake id without touching host. Includes mitigations."
toc: true
---

> **Research Only:** Tested in isolated VM on lab-owned trial binary (anonymized `licensed_app_linux`); no production bypass, no redistribution. For *defensive* learning — how not to bind licensing to `/etc/machine-id`.
> ⚠️ Authorized security testing & educational purposes only — reverse engineering research.

## Summary

Identified and validated a weak trial-licensing check in a Linux trial binary (`licensed_app_linux` — anonymized lab binary). The application bound its trial state to the host's `/etc/machine-id` alone. Assessed the binary with `strings` and `strace`, then tested an isolated bypass using Linux mount namespaces: `unshare -m` with `mount --bind` over a fake `machine-id` — trial restored to active without modifying the host file. This post documents defensive detection and hardening.

## Background — Why Vendors Use /etc/machine-id

Vendors assessed `/etc/machine-id` as a stable, trivial fingerprint for Linux trial licensing. Identified common pattern: on first run, hash or store `machine-id` with an expiry timestamp; on each launch, read `/etc/machine-id` and compare.

Validated assumptions vendors make:

- File exists on systemd hosts and is unique per installation.
- Read via plain `openat()`/`read()` — no privilege required.
- Simple to implement, no hardware query needed.

Tested lab environment and confirmed base dependencies were present before analysis. Dependencies identified via package check.

<figure class="verisign-reward-figure">
  <img src="/images/linux-trial-01-deps.png" alt="Dependency check — validated installed tools before testing licensed_app_linux" loading="lazy" decoding="async">
  <figcaption>Validated lab dependencies — prerequisites checked in isolated VM before testing</figcaption>
</figure>

This convenience is the weakness. The identifier is world-readable, predictable, and trivially virtualized per-process via Linux namespaces. Linux trial licensing that trusts `machine-id` alone was assessed as insufficient.

## Recon — Static Analysis: strings Shows Hardcoded /etc/machine-id

Identified hardcoded path with `strings`. Tested on anonymized binary `licensed_app_linux` (lab-owned trial binary, generic name).

```bash
strings /usr/local/bin/licensed_app_linux | grep -i "machine"
# validated output included:
# /etc/machine-id
```

Assessed that the binary contains a literal `/etc/machine-id` reference. No obfuscation was observed for this path. This identified the file as the likely trial anchor before any dynamic run.

<figure class="verisign-reward-figure">
  <img src="/images/linux-trial-03-strings.png" alt="strings output showing hardcoded /etc/machine-id path in licensed_app_linux" loading="lazy" decoding="async">
  <figcaption>Static recon — <code>strings</code> identified hardcoded <code>/etc/machine-id</code> in <code>licensed_app_linux</code></figcaption>
</figure>

SEO note: `strings` is the fastest Linux trial licensing recon for `machine-id` checks — vendor fingerprint without execution.

## Dynamic — strace Validates openat/read of /etc/machine-id

Validated the static signal dynamically with `strace`. Tested launch under `strace -e trace=openat,read`.

```bash
strace -e openat,read /usr/local/bin/licensed_app_linux --no-sandbox 2>&1 | grep -i machine
# identified: openat(AT_FDCWD, "/etc/machine-id", O_RDONLY) = 3
# validated: read(3, "<host-id>\n", 32) = 33
```

Assessed that the trial path issues `openat()` on `/etc/machine-id` at startup and reads the identifier before deciding trial state. This confirmed the control is file-bound, not hardware-bound, and is a candidate for mount-namespace isolation via `unshare` and `mount --bind`.

<figure class="verisign-reward-figure">
  <img src="/images/linux-trial-04-strace.png" alt="strace log showing openat and read of /etc/machine-id by licensed_app_linux" loading="lazy" decoding="async">
  <figcaption>Dynamic validation — <code>strace</code> shows <code>openat("/etc/machine-id")</code> followed by <code>read</code></figcaption>
</figure>

## Baseline — Expired Trial Validation

Tested the binary without isolation to establish baseline. Executed directly on the VM:

```bash
/usr/local/bin/licensed_app_linux --no-sandbox
# => "Expired trial" / "Trial expired" — validated baseline
```

Identified baseline behavior: clean launch reported expired trial. This validated that the VM's real `machine-id` was already in expired state, providing a controlled before/after for the namespace bypass.

<figure class="verisign-reward-figure">
  <img src="/images/linux-trial-02-expired.png" alt="licensed_app_linux reports Expired trial — baseline before mount namespace bypass" loading="lazy" decoding="async">
  <figcaption>Baseline — direct execution validated <em>Expired trial</em> on host <code>machine-id</code></figcaption>
</figure>

## Exploit — Isolated Bypass via unshare & mount --bind

Tested an isolated bypass that does **not** touch the host. Created a fake identifier and bound it over `/etc/machine-id` inside a private mount namespace.

Prose redaction: fake identifier shown as `[REDACTED_FAKE_ID]` in narrative. Sanitized example previously tested used a random hex-like placeholder (`New83a3ceNew` pattern) — value redacted here.

Sanitized reproduction:

```bash
# 1. Prepare fake machine-id (redacted value — example placeholder)
echo "[REDACTED_FAKE_ID]" > /tmp/fake-machine-id
# original lab placeholder pattern: echo "New83a3ceNew" > /tmp/fake  # redacted

# 2. Enter private mount namespace and bind-mount fake over real
unshare -r -m bash -c 'mount --bind /tmp/fake-machine-id /etc/machine-id; exec /usr/local/bin/licensed_app_linux --no-sandbox "$@"' -- dummy

# validated result: "Trial active" — trial reset inside namespace only
```

Validated outcome: inside the `unshare -m` shell, the application saw the fake `machine-id` and reported **Trial Active**. Host `/etc/machine-id` remained untouched — verified after exit with `cat /etc/machine-id` unchanged.

<figure class="verisign-reward-figure">
  <img src="/images/linux-trial-05-unshare-success.png" alt="Successful isolated bypass — unshare mount --bind fake machine-id shows Trial Active for licensed_app_linux" loading="lazy" decoding="async">
  <figcaption>Exploit validated — <code>unshare -r -m</code> + <code>mount --bind</code> over fake <code>machine-id</code> yielded Trial Active (host untouched)</figcaption>
</figure>

No host modification was tested outside the namespace. All testing was validated in an isolated VM on a lab-owned binary.

## Why It Works — Mount Namespace Private View

Assessed kernel behavior: `unshare -m` creates a new mount namespace with a private copy of the mount table. `mount --bind /tmp/fake-machine-id /etc/machine-id` inside that namespace affects only the current namespace.

- Tested hierarchy: child namespace inherits mounts but writes are copy-on-write.
- Validated isolation: parent (host) and other processes keep original `machine-id` mapping.
- Identified requirement: `CAP_SYS_ADMIN` in the new namespace — achieved with `unshare -r` (unprivileged user namespace + root mapping) on typical lab kernels, without needing host root.

This is standard Linux namespaces behavior — not a vulnerability in the kernel. The flaw is application logic that trusts a virtualizable file as a global identity.

Keywords: Linux namespaces, mount `bind`, `unshare`, `machine-id` isolation.

## Redacted PoC — Sanitized Reproduction Snippet

> **Authorized testing only.** Anonymized binary `licensed_app_linux` on isolated VM. No redistribution. Fake IDs redacted to `[REDACTED_FAKE_ID]`.

```bash
#!/usr/bin/env bash
# sanitized PoC — lab research only
set -euo pipefail
FAKE_ID="[REDACTED_FAKE_ID]"   # redacted — original placeholder: New83a3ceNew-style
FAKE_FILE="/tmp/fake-machine-id"
BIN="/usr/local/bin/licensed_app_linux"

echo "$FAKE_ID" > "$FAKE_FILE"
chmod 644 "$FAKE_FILE"

# Isolated execution — host /etc/machine-id not modified
unshare -r -m bash -c "mount --bind $FAKE_FILE /etc/machine-id; exec $BIN --no-sandbox \"\$@\"" -- "$@"

# Verify host untouched after exit (validate outside namespace)
echo "Host machine-id (should be original):"
cat /etc/machine-id
```

Tested: host file unchanged after namespace exit. Validated: `strace` inside namespace would show `openat("/etc/machine-id")` returning the fake content, while host `strace` shows original.

No production bypass is provided. Binary name is anonymized. Do not use outside your own VM.

## Mitigations — Don't Trust machine-id Alone

Validated mitigations that would have prevented this trial reset:

1. **Bind to hardware/TPM, not just `machine-id`.** Identified that TPM-sealed or CPU-/disk-rooted identifiers resist mount virtualization. Assessed: combine `machine-id` with HWID and server-side verification.
2. **Server-signed trial license.** Tested logic: server issues time-limited JWT / signed blob binding `machine-id` + HWID + expiry; offline grace with signature check, not raw file compare.
3. **Integrity check via namespace-aware anchor.** Don't rely solely on a single world-readable file. Validate via `stat` + bind-mount detection, or require `machine-id` matches D-Bus `org.freedesktop.machine1` and kernel `boot_id` cross-check — still bypassable but raises bar.
4. **Secure time & anti-tamper.** Use server time, not local clock; sign timestamp. Assessed client-only expiry as weak.
5. **Detect trivial virtualization.** If feasible, warn when `/etc/machine-id` differs across quick namespace probes or when mountinfo shows bind overlay — heuristic, not sole control.
6. **Defense in depth.** TPM, online activation, rate-limited trial reset, and no plaintext `machine-id` comparison.

For defenders testing similar Linux trial licensing: run `strings | grep machine-id` and `strace -e openat,read` as first-pass detection.

## Takeaways & Responsible Disclosure

- Tested strictly on an isolated VM with a lab-owned trial binary (`licensed_app_linux` anonymized, generic name). No production systems were tested.
- Identified root cause: trial licensing that trusts a single virtualizable file (`/etc/machine-id`) is insufficient isolation against Linux namespaces (`unshare`, `mount --bind`).
- Validated that private mount namespaces allow per-process `machine-id` views without host modification — expected kernel behavior.
- Assessed hardening: move to hardware-rooted, server-signed licensing; treat `machine-id` as hint, not proof.
- Responsible disclosure stance: this research is published for defensive education after lab validation; no vendor bypass is weaponized, no redistribution, no instructions for production circumvention.

> _Disclaimer:_ Author tested this solely in a lab on an owned VM image. Reverse engineering was performed under authorized, educational laboratory conditions. Do not apply `unshare`/`mount --bind` techniques to software you do not own or on systems where you lack explicit authorization. Respect license agreements and applicable law.

*Keywords: Linux, trial licensing, machine-id, unshare, mount --bind, namespaces, strace, strings, reverse engineering.*

<figure class="verisign-reward-figure">
  <img src="/images/linux-machine-id-trial-bypass.png" alt="Featured — isolated Trial Active via mount namespace over fake machine-id" loading="lazy" decoding="async">
  <figcaption>Featured — Trial Active inside isolated mount namespace; host <code>/etc/machine-id</code> unchanged after exit</figcaption>
</figure>
