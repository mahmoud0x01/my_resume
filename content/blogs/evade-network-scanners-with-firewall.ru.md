---
title: "Обход сетевых сканеров с помощью firewall"
date: 2024-01-20T10:00:00+00:00
draft: false
author: "Mahmoud Adel"
tags: ["Security","Network Security","Firewall","NMAP","Defense","TCP/IP"]
categories: []
image: /images/firewall-technique.png
description: "Исследование уклонения от детекции: техники обхода мониторинга сетевой безопасности и IDS через манипуляции с firewall."
toc: true
---
## Краткое резюме

Самый известный сканер — Nmap. Все сканеры тестируют ответы транспортного уровня ядра [ICMP / TCP / UDP / SCTP] на 65k портов. По TCP: если на `192.168.1.15` слушает сокет и `192.168.1.10` шлёт SYN — ядро отвечает ACK, Nmap понимает, что порт открыт; баннеры SSH/HTTP видны в Wireshark. Если порт фильтруется firewall — ядро не отвечает, Nmap показывает filtered. Если процесса нет и приходит SYN — ядро шлёт TCP-RST (RESET).

Техника защиты чувствительного порта (напр., SSH 22): правило `iptables`, которое отвечает RST всем, кроме разрешённого IP:

```bash
iptables -A INPUT ! -s 192.168.1.40 -p tcp -m tcp --dport 22 -j REJECT --reject-with tcp-reset
```

Результат — сканер видит closed вместо filtered/open для неразрешённых источников, тогда как `192.168.1.40` по-прежнему проходит. Иллюстрации: `nc` на 22 и схема firewall-technique.

> 🇷🇺 **Перевод в процессе** — выше краткое резюме. Полный оригинал с командами iptables и скриншотами: [English version](/blogs/evade-network-scanners-with-firewall/).
> Команды, IP и флаги TCP оставлены на английском.

