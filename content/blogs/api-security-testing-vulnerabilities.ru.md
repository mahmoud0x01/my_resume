---
title: "Тестирование безопасности API: поиск уязвимостей в современных веб-API"
date: 2024-12-05T10:00:00+00:00
draft: false
author: "Mahmoud Adel"
tags: ["API Security","Web Security","Penetration Testing","OWASP","Bug Bounty","Application Security"]
categories: []
image: /images/api-security.png
description: "Практическое руководство по тестированию REST API на уязвимости: обходы аутентификации, IDOR, инъекции и проблемы с rate limiting."
toc: true
---
## Краткое резюме

API — бэкбон современных приложений и любимая цель атакующих: часто экспонируют больше функциональности и данных, чем веб-UI. Гайд построен вокруг OWASP API Security Top 10 и покрывает методологию: enumerate → analyze → test → validate → report.

**Что внутри (техничные термины без перевода):** настройка окружения (Burp Suite, Postman, ffuf, `httpx`, `nuclei`), энумерация эндпоинтов (`/api/v1/`, `/swagger.json`, `ffuf`, `LinkFinder`), атаки на аутентификацию/авторизацию (BOLA/IDOR `GET /api/v1/orders/1001 → 1002`, JWT `alg:none`, key confusion, `hashcat -m 16500`, обход brute-force через `X-Forwarded-For`), BOPLA/mass assignment, инъекции (SQL/NoSQL/Command `{"$ne":""}`, `; id`, `| cat /etc/passwd`), rate limiting/resource exhaustion (`ffuf -rate 100`, GraphQL batching, ReDoS), бизнес-логика (BFLA, смена HTTP-методов, манипуляция ценой `price:0.01`, race conditions `for i in {1..50}; do curl ... & done`), GraphQL (introspection `__schema`, batching `login1/login2`, подсказки полей), чек-лист и шаблон отчёта.

> 🇷🇺 **Перевод в процессе** — выше краткое резюме. Полный материал со всеми сниппетами Bash/GraphQL и чек-листом: [English version](/blogs/api-security-testing-vulnerabilities/).
> Инструменты (Burp Suite, ffuf, nuclei, httpx), эндпоинты и команды оставлены на английском.

