---
title: "AppArmor как аварийный выключатель RCE: валидация защиты на стороне Blue Team"
date: 2025-02-10T10:00:00+00:00
draft: false
author: "Mahmoud Adel"
tags:
  - AppArmor
  - Linux
  - Hardening
  - Blue Team
  - RCE
  - Defense
  - System Administration
image: /images/apparmor-rce.png
description: "Авторизованная оценка Blue Team: эксплуатируем тривиальный PHP RCE на Apache, сдерживаем его на рантайме профилем AppArmor, затем устраняем первопричину в коде. Включает сниппеты профилей, логи аудита и результаты валидации."
toc: true
---

Это **авторизованное** упражнение по валидации защиты на стороне Blue Team: доказать, что известный PHP remote-code-execution (RCE) эксплуатируем, сдержать его на рантайме с помощью **AppArmor**, повторно протестировать и убедиться, что эксплойт нейтрализован, и наконец исправить первопричину в исходном коде. Всё ниже использует диапазоны документации (`10.0.0.0/8`, `example.com`) — только примерные артефакты.

> ⚠️ **Техническое примечание:** AppArmor — это LSM, основанный на *путях и capabilities*. Он ограничивает процесс, запрещая **исполнение конкретных бинарников**, запись файлов и сетевой доступ — это **не** фильтр системных вызовов (за это отвечает **seccomp**). Что он *делает* — не даёт веб-процессу выполнить `execve()` на `/bin/sh`, а именно это и нужно полезной нагрузке RCE. С точки зрения атакующего результат тот же: RCE мёртв.

## 1. Цель: уязвимый эндпоинт

Базовый демо-эндпоинт PHP напрямую передаёт несанитизированный пользовательский ввод в shell:

```php
<?php
  // vuln.php — intentionally vulnerable, demo only
  $cmd = $_GET['cmd'];
  system($cmd);
?>
```

**Первопричина:** контролируемый пользователем ввод конкатенируется в команду shell через `system()`. Никакой валидации, экранирования, allowlist.

## 2. Эксплуатация (доказательство концепции)

```bash
$ curl "http://10.0.0.5/vuln.php?cmd=id"
uid=33(www-data) gid=33(www-data) groups=33(www-data)

$ curl "http://10.0.0.5/vuln.php?cmd=cat+/etc/passwd"
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin/nologin
...

$ curl "http://10.0.0.5/vuln.php?cmd=rm+-rf+/var/www/html/evil.php"
# arbitrary command execution as the web user — RCE confirmed
```

Эксплойт **работает**. Мы получили исполнение команд в контексте пользователя `www-data`, под которым работает Apache + `mod_php`.

## 3. Митигация A — ограничение AppArmor (компенсирующая мера)

AppArmor ограничивает *процесс интерпретатора* (Apache/`mod_php`), а не PHP-код. Мы подключаем профиль, который запрещает веб-процессу порождать интерпретаторы/shell, открывать сетевые соединения или писать за пределы docroot.

`/etc/apparmor.d/usr.sbin.apache2` (добавленные правила):

```apparmor
profile apache2 /usr/sbin/apache2 flags=(attach_disconnected) {
  #include <abstractions/apache2>
  #include <abstractions/base>

  # Deny executing interpreters / shells -> kills RCE payload exec
  deny /bin/** x,
  deny /usr/bin/** x,
  deny /usr/sbin/** x,
  deny /bin/sh ix,
  deny /bin/bash ix,
  deny /usr/bin/python* ix,

  # Deny raw network egress from the web process
  deny network inet,
  deny network inet6,

  # Deny writes outside the docroot
  deny /var/www/** w,
  audit /var/www/html/** w,

  # Drop capabilities the web server never needs
  deny capability sys_admin,
  deny capability dac_override,
}
```

Применяем:

```bash
$ sudo aa-enforce apache2
$ sudo systemctl reload apparmor

$ aa-status | grep apache2
   apache2 (enforce)
```

> Совет: сначала переведите профиль в режим **complain** (`aa-complain apache2`), наблюдайте за `/var/log/audit/audit.log`, затем переключайте в **enforce**, когда легитимный трафик чист. Слишком жёсткий профиль заблокирует также бинарники обработки изображений, поэтому валидируйте до включения.

## 4. Повторный тест — эксплойт заблокирован

```bash
$ curl "http://10.0.0.5/vuln.php?cmd=id"
<br />
<b>Warning</b>:  system(): Unable to execute command via shell: Permission denied ...
```

Ядро на уровне LSM отклоняет `execve()`, поэтому полезная нагрузка даже не запускается:

```bash
$ sudo dmesg | tail -n 3
[ 1284.62] audit: type=1400 apparmor="DENIED" operation="exec"
           profile="apache2" name="/bin/sh" pid=2148
           requested_mask="x" denied_mask="x" fsuid=33 ouid=0
```

**RCE нейтрализован на границе процесса — хотя уязвимый PHP-код всё ещё присутствует.** В этом и смысл компенсирующей меры: выиграть время и ограничить blast radius до момента, когда будет доставлен фикс исходников.

## 5. Митигация B — исправление исходного кода (настоящий фикс)

AppArmor — это defense-in-depth, а не исправление первопричины. Правильное исправление полностью убирает опасный примитив.

**Плохо:**

```php
system($_GET['cmd']);   // never do this
```

**Хорошо — валидируем по allowlist, избегаем shell:**

```php
<?php
  // safe.php
  $allowed = ['status', 'version'];
  $cmd = $_GET['cmd'] ?? '';
  if (!in_array($cmd, $allowed, true)) {
      http_response_code(400);
      exit('invalid command');
  }
  echo match ($cmd) {
      'status'  => shell_exec('systemctl is-active apache2'),
      'version' => phpversion(),
  };
?>
```

И глобально отключаем опасные функции в `php.ini`:

```ini
disable_functions = exec,passthru,shell_exec,system,proc_open,popen,pcntl_exec
```

Повторный тест после фикса — и после удаления профиля AppArmor — эндпоинт возвращает `400` для всего, что вне allowlist.

## 6. Сводка процесса валидации

| Шаг | Действие | Результат |
|------|--------|--------|
| 1 | Эксплуатация `vuln.php?cmd=id` | ✅ RCE как `www-data` |
| 2 | Подключение профиля AppArmor, `aa-enforce` | Профиль `enforce` |
| 3 | Повторная эксплуатация | ❌ `apparmor="DENIED" exec /bin/sh` |
| 4 | Исправление кода + `disable_functions` | Первопричина закрыта |
| 5 | Удаление компенсирующего профиля, повторный тест | Всё ещё безопасно (allowlist) |

## 7. Извлечённые уроки

1. **AppArmor = сдерживание на рантайме** — аварийный выключатель RCE, пока вы деплоите настоящий фикс.
2. **Фикс кода = первопричина** — никогда не полагайтесь на LSM как на единственную защиту.
3. **Принцип наименьших привилегий** — веб-процесс не должен уметь исполнять shell или открывать произвольные сокеты.
4. **seccomp дополняет** — если нужно ограничение на уровне *системных вызовов* (например, заблокировать `execve` системно для сервиса), наслаивайте seccomp/BPF-LSM сверху.
5. **Complain → Enforce** — безопасно профилируйте перед включением в продакшене.

Эшелонированная защита: ограничьте процесс, исправьте код, отключите опасные функции. 🛡️
