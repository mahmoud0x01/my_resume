---
title: "Основы компьютерной безопасности и бинарного хакинга: концепции и базовые техники"
date: 2024-01-15T10:00:00+00:00
draft: false
author: "Mahmoud Adel"
tags: ["Security","Binary Hacking","Penetration Testing","Cybersecurity","Exploitation","Buffer Overflow"]
categories: []
image: /images/virtual-memory-management.jpeg
description: "Подробное руководство по фундаментальным принципам безопасности, техникам бинарной эксплуатации и практическим методологиям хакинга для начинающих исследователей."
toc: true
---
Привет! Я исследователь компьютерной безопасности и хочу поделиться базовыми концепциями бинарного хакинга.

## Краткое резюме

Материал вводит три темы: (1) память и виртуальная адресация — как ядро управляет страницами виртуальных/физических адресов, почему обращение вне страницы уходит в interrupt handler, схема Virtual Memory Management; (2) режимы CPU и системные вызовы — как `write` в C/PHP превращается в `sys_write` (`mov eax,4; mov ebx,1; mov ecx,dispMsg; mov edx,len; int 0x80`), роль `int 80h` и таблицы прерываний ядра, привилегии ядра vs user-space и регистр `cr0`; (3) переполнение буфера — опасные вызовы без проверки границ (`gets()`, `scanf("%s",&buffer)`), механика `call`/`ret` и сохранения `eip` в стеке, перезапись адреса возврата, демо `char buffer[4]; int var=0;` и segmentation fault.

Все примеры (`0x774ffffffffff`, `sys_write`, `cr0`, `call`/`ret`, `eip`, `buffer overflow`) и код на `assembly`/`C` оставлены без перевода.

> 🇷🇺 **Перевод в процессе** — выше краткое резюме. Полный оригинал с кодом и иллюстрациями: [English version](/blogs/computer-security-binary-hacking-concepts-and-basics/).

