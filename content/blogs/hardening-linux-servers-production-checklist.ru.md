---
title: "Харденинг Linux-серверов: чек-лист для продакшена"
date: 2024-12-15T10:00:00+00:00
draft: false
author: "Mahmoud Adel"
tags: ["Linux","Security","System Administration","Hardening","Server Security","DevSecOps"]
categories: []
image: /images/linux-hardening.png
description: "Подробное руководство по харденингу Linux-серверов для продакшен-окружений: SSH, firewall, параметры ядра и мониторинг."
toc: true
---
## Краткое резюме

Базовый чек-лист харденинга, который я применяю для любого прод-сервера (веб, БД, app-хост).

**Покрытие:**
- **Initial Setup:** создание non-root админа (`useradd`, `usermod -aG sudo/wheel`, `/etc/sudoers.d`), обновления (`apt`/`dnf`, `unattended-upgrades`).
- **SSH:** генерация `ssh-keygen -t ed25519`, харднинг `/etc/ssh/sshd_config` (`PermitRootLogin no`, `PasswordAuthentication no`, `KexAlgorithms`, `Ciphers`, `MACs`, `MaxAuthTries 3`, `AllowUsers`, `Port 2222`, `X11Forwarding no`), проверка `sshd -T`.
- **Firewall:** UFW (`ufw default deny incoming`, `allow 2222/tcp`) и iptables (flush, `INPUT DROP`, `ESTABLISHED`, rate limit `recent --hitcount 4`, `LOG --log-prefix`).
- **Kernel:** `/etc/sysctl.d/99-security.conf` (`rp_filter`, `tcp_syncookies`, `dmesg_restrict`, `kptr_restrict`, `ptrace_scope`, `randomize_va_space=2` и др., `sysctl -p`).
- **Fail2Ban:** `jail.local` (`bantime 1h/24h`, `maxretry 3/5`, `sshd`/`nginx`).
- **Filesystem:** `tmpfs /tmp noexec,nosuid,nodev`, `find -perm -0002`, SUID/SGID, `chmod 600 /etc/shadow`.
- **Auditd:** `audit.rules` (`-w /etc/passwd`, `-w /etc/shadow`, `-w /etc/ssh/sshd_config`, `-w /etc/cron*`, `-a path=/usr/bin/sudo -F perm=x`).
- **Верификация:** `sshd -T | grep`, `ssh-audit localhost:2222` (95/100), `lynis audit system` (hardening index 85), `auditctl -s/-l`, `rkhunter --check`.
- Таблица чек-листа и вывод: харднинг — непрерывный процесс, принцип least privilege.

> 🇷🇺 **Перевод в процессе** — выше краткое резюме. Полный гайд со всеми блоками кода Bash/INI и таблицей: [English version](/blogs/hardening-linux-servers-production-checklist/).
> Все команды, пути, пакеты и конфиги оставлены на английском.

