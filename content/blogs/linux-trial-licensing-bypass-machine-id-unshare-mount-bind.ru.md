---
title: "Уязвимость обхода триала Linux: доверие к /etc/machine-id и обход через unshare и mount --bind"
date: 2026-08-28T10:00:00+00:00
draft: false
author: "Mahmoud Adel"
tags: ["Linux","Trial Bypass","machine-id","unshare","mount","Namespaces","Reverse Engineering","Responsible Disclosure"]
categories: ["Security Research"]
image: /images/linux-machine-id-trial-bypass.png
images: [/images/linux-machine-id-trial-bypass.png]
description: "Контролируемая симуляция проверок триала Linux, доверяющих /etc/machine-id — изолированный обход через unshare и mount --bind, детекция через strings/strace и серверное харднение."
toc: true
---
> **Только исследование:** Тестировалось в изолированной VM на собственном триальном бинарнике (анонимизирован `licensed_app_linux`); обхода в проде нет, распространения нет. Для *защитного* обучения — как не привязывать лицензирование к `/etc/machine-id`.

## Краткое резюме

Выявлена слабая проверка триального лицензирования в Linux-бинарнике (`licensed_app_linux` — анонимизированный лаб-бинарник). Приложение привязывало состояние триала только к `/etc/machine-id` хоста. Через `strings` и `strace` подтверждено `openat("/etc/machine-id")`, затем протестирован изолированный обход через пространства имён Linux: `unshare -m` с `mount --bind` поверх поддельного `machine-id` — статус триала восстановился в `Trial Active` без модификации хост-файла. Хостовый `/etc/machine-id` остался нетронутым.

Ключевые этапы: статическая разведка `strings | grep -i machine` → динамика `strace -e openat,read` → базовый прогон «Expired trial» → изолированный обход `unshare -r -m bash -c 'mount --bind /tmp/fake-machine-id /etc/machine-id; exec ...'` → объяснение приватной таблицы монтирований mount namespace (`CAP_SYS_ADMIN` через `unshare -r`) → митигации (привязка к железу/TPM, серверно-подписанные JWT-лицензии с `machine-id` + HWID + expiry, кросс-чек `boot_id`/`org.freedesktop.machine1`, серверное время).

> 🇷🇺 **Перевод в процессе** — выше краткое резюме. Полная версия с командами, фигурами и PoC: [English version](/blogs/linux-trial-licensing-bypass-machine-id-unshare-mount-bind/).
> Команды `strings`, `strace`, `unshare`, `mount --bind`, пути `/etc/machine-id`, категории и теги оставлены на английском.

