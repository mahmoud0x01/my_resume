---
title: "Пути атак на Active Directory: взгляд Red Team"
date: 2024-12-12T10:00:00+00:00
draft: false
author: "Mahmoud Adel"
tags: ["Active Directory","Red Team","Penetration Testing","Windows Security","Privilege Escalation","Kerberos"]
categories: []
image: /images/ad-attack-paths.png
description: "Разбор распространённых путей атак на Active Directory, используемых red team — от первичного закрепления до доминирования в домене, с практическими примерами и стратегиями детекции."
toc: true
---
> ⚠️ **Дисклеймер**: Только для авторизованного тестирования и обучения. Всегда получайте письменное разрешение.

## Краткое резюме

Active Directory — хребет корпоративных Windows-сред и приоритетная цель. В оригинале — полный kill chain: Initial Access → Enumeration → Privilege Escalation → Lateral Movement → Domain Dominance, с разбором каждой фазы.

**Фазы и инструменты (без перевода):** BloodHound + SharpHound (`SharpHound.exe -c All`, `Invoke-BloodHound`), LDAP/SMB энумерация (`Get-ADGroupMember`, `Get-ADComputer`, `crackmapexec smb`), Kerberoasting (`GetUserSPNs.py`, `hashcat -m 13100`), AS-REP Roasting (`GetNPUsers.py`, `hashcat -m 18200`), LLMNR/NBT-NS poisoning (`responder -I eth0`), Password Spraying (`crackmapexec`), DCSync (`secretsdump.py`), Unconstrained/Constrained/RBCD делегации (`Rubeus.exe`, `getST.py`, `Set-ADComputer`), Pass-the-Hash/Ticket/Overpass-the-Hash (`psexec.py`, `Rubeus.exe ptt`), Golden/Silver Ticket (`ticketer.py`), Skeleton Key (`mimikatz`), детекция (4769/4768/4662) и защиты (GPO LLMNR, Protected Users, LAPS, tiered admin, ротация krbtgt, Credential Guard).

> 🇷🇺 **Перевод в процессе** — выше краткое резюме. Полный гайд со всеми командами PowerShell/Bash, таблицами детекции и чек-листом: [English version](/blogs/active-directory-attack-paths-red-team/).
> Названия инструментов (BloodHound, Rubeus, Impacket, CrackMapExec, Mimikatz, PowerView) и команды оставлены на английском.

