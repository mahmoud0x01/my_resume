---
title: "Современные техники обхода антивирусов: детекция и методы обхода"
date: 2024-12-18T10:00:00+00:00
draft: false
author: "Mahmoud Adel"
tags: ["Red Team","AV Evasion","Malware Development","Penetration Testing","Security Research","Offensive Security"]
categories: []
image: /images/av-evasion.png
description: "Глубокий разбор того, как современные антивирусы детектят угрозы и какие техники используют red team'еры для их обхода в рамках авторизованных тестирований."
toc: true
---
> ⚠️ **Дисклеймер**: Только для обучения и авторизованного тестирования. Всегда получайте разрешение.

## Краткое резюме

Детекция AV: сигнатурная (хеши/паттерны, напр. `Invoke-Mimikatz`), эвристика/поведение (инъекция, дамп кредов, персистентность, сетевые колбэки), AMSI (`PowerShell → AMSI → AV Engine`), ML/AI. Далее — техники обхода по уровням:

**Базовые:** обфускация строк (`"Inv"+"oke-Mim"`, Base64), подмена переменных (`Net.WebClient`), смена регистра в PowerShell (`iNvOkE-eXpReSsIoN`).
**Средние:** шифрование пейлоада (AES CBC, ключ отдельно), in-memory исполнение (`Assembly.Load` в C#), process hollowing (`CreateProcess SUSPENDED → NtUnmapViewOfSection → VirtualAllocEx → WriteProcessMemory → SetThreadContext → ResumeThread`).
**Продвинутые:** AMSI bypass (патч `*siUtils`/`*Context` через `Marshal.Copy`), ETW патчинг (`ntdll!EtwEventWrite → 0xC3 RET`), unhooking/syscalls (direct syscalls `mov eax,0x18; syscall`, свежая ntdll с диска), sleep obfuscation (шифрование пейлоада на время `Sleep`, Ekko/Foliage).

Чек-лист маппинга техник → что обходят, тестирование пейлоадов (изолированная VM, `MpCmdRun.exe -Scan -ScanType 3`, осторожность с VirusTotal/AntiScan), и рекомендации Blue Team (Script Block Logging, Module Logging, мониторинг AMSI, EDR поведенческий, Credential Guard, whitelisting).

> 🇷🇺 **Перевод в процессе** — выше краткое резюме. Полный материал со всем кодом PowerShell/Python/C# и таблицей: [English version](/blogs/modern-av-evasion-techniques/).
> Код, названия API (`NtAllocateVirtualMemory`) и инструменты оставлены на английском.

