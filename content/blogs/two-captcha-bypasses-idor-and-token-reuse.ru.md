---
title: "Два обхода капчи — IDOR и повторное использование токенов"
date: 2024-01-25T10:00:00+00:00
draft: false
author: "Mahmoud Adel"
tags: ["Security","Bug Bounty","Web Security","IDOR","CAPTCHA","Vulnerability Research"]
categories: []
image: /images/post.jpg
description: "Оригинальное исследование уязвимостей: новые техники обхода капчи через Insecure Direct Object Reference (IDOR) и уязвимости повторного использования токенов аутентификации."
toc: true
---
Это мой первый write-up. Расскажу, как обошёл капчу у двух компаний.

## Первый — повторное использование токена капчи (Captcha Token Reuse)

При тестировании `site.example.com` на форме регистрации была капча. Решил челлендж, перехватил запрос с кредами и увидел токен ответа капчи:

```
&g-recaptcha-response=03AJpayVGwtrg6bOlwaMCLZ9-vHQcM0jxbgdU_JcPyQI4e4QZlBbj7WrWHw8I13IW5qT6yd-g8txCFoThxlzDB8b-aGvX16idgAktxU5459HNgVFC5n8h0-aHGPH1eOCWJuw5c0mo5sGI9DflNPGfnK5Rq90Zj4gFtCU9y5IGks4SWLH2iA0OGIQ9gISptqd8QuMqKcYROgNQ3huLb-gikJX7VQBvfR2Tw24TAP8OX5LQofNYaFE8sDx77Smtrf7fF9pVvqwVYoETDkoeA8exu2V90YMAw0apTtNhVy2SCikb3aTZI5bt7ZYJVgdObNDDwFTU3nonAJM88GRMA-vmX3atBhGGoQw56QaooPGjVMcJnly-LK154RoBh4R8S-BBNqLZfk4ivJH7K
```

Повторил тот же запрос в Burp Repeater с другим email/паролем — и веб-приложение не инвалидировало валидный токен после использования. Отправил POST в Intruder — создал 100 аккаунтов меньше чем за 40 секунд. Отправил PoC-видео компании, но — дубликат:

> Hi mahmoud, Thank you for your report. The ability to bypass our signup controls is a known issue that our engineers are currently working to address.

Другой хакер зарепортил за 5 месяцев до этого, и проблема не пофикшена.

## Второй — IDOR

Небезопасная прямая ссылка на объект. При тестировании `example.com` — при трёх неверных вводах кредалов появлялась капча. В URL были параметры `fail=1&captcha=1`. Поставил `0` вместо `1` — капча отключилась, и стало возможно брутфорсить. Отчёт триажирован (open).

> 🇷🇺 Краткий перевод — полный оригинал с деталями: [English version](/blogs/two-captcha-bypasses-idor-and-token-reuse/).
> Параметры `g-recaptcha-response`, `fail`/`captcha` и ответы компании оставлены на английском.

