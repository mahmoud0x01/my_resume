(function() {
  'use strict';

  var STORAGE_KEY = 'site-lang';

  /* ══════════════════════════════════════════════════════════════
     HOME PAGE TRANSLATIONS
  ══════════════════════════════════════════════════════════════ */
  var HOME = [

    /* ── NAVBAR ─────────────────────────────────────────────── */
    { sel: 'a.nav-page-link[href$="#about"]',        ru: 'Обо мне' },
    { sel: 'a.nav-page-link[href$="#experience"]',   ru: 'Опыт работы' },
    { sel: 'a.nav-page-link[href$="#education"]',    ru: 'Образование' },
    { sel: 'a.nav-page-link[href$="#achievements"]', ru: 'Сертификаты' },
    { sel: 'a.nav-page-link[href$="#contact"]',      ru: 'Контакты' },
    { sel: 'a.nav-page-link[href="/blogs"]',         ru: 'Блог' },
    { sel: 'a.nav-link[href="/blogs"]',              ru: 'Блог' },

    /* ── HERO ───────────────────────────────────────────────── */
    { sel: '.hero-display-name',  ru: 'Я <strong>Махмуд.</strong>' },
    { sel: '.hero-role',          ru: 'Пентестер | Системный администратор' },
    { sel: '.hero-desc',          ru: 'Опытный пентестер и системный администратор, специализирующийся на комплексном аудите безопасности веб-приложений, мобильных платформ и сетевой инфраструктуры. Подтверждённый опыт обнаружения критических уязвимостей в таких организациях, как Pinterest, Verisign и Dell, через программы ответственного раскрытия.' },
    { sel: '.hero-btn-secondary', ru: 'Связаться со мной <i class="fa fa-paper-plane ms-1"></i>' },

    /* ── ABOUT ──────────────────────────────────────────────── */
    { sel: '#about h3',             ru: 'Обо мне' },
    { sel: '#about .about-content', ru: 'Опытный пентестер и системный администратор, специализирующийся на комплексном аудите безопасности веб-приложений, мобильных платформ и сетевой инфраструктуры, а также на управлении корпоративной инфраструктурой. Подтверждённый опыт обнаружения критических уязвимостей в таких организациях, как Pinterest, Verisign и Dell, через программы ответственного раскрытия. Владею передовыми методологиями тестирования на проникновение, соответствующими стандартам OWASP и MITRE ATT&amp;CK. Опыт управления и укрепления корпоративной инфраструктуры, включая серверы Linux/Windows, среды Active Directory и облачные системы. Активно занимаюсь повышением квалификации через соревновательные платформы и практические исследования в области безопасности.' },

    /* About — Language heading (idx:0 = 1st h5.mb-3), Skills heading (idx:1 = 2nd h5.mb-3) */
    { sel: '#about h5.mb-3', idx: 0, ru: 'Языки:' },
    { sel: '#about h5.mb-3', idx: 1, ru: 'Технологии и навыки:' },

    /* About — Language items */
    { sel: '#about .language-list .mb-2:nth-child(1) .fw-bold',       ru: 'Арабский' },
    { sel: '#about .language-list .mb-2:nth-child(1) .text-secondary', ru: 'Родной' },
    { sel: '#about .language-list .mb-2:nth-child(2) .fw-bold',       ru: 'Английский' },
    { sel: '#about .language-list .mb-2:nth-child(2) .text-secondary', ru: 'C2 — Свободный' },
    { sel: '#about .language-list .mb-2:nth-child(3) .fw-bold',       ru: 'Русский' },
    { sel: '#about .language-list .mb-2:nth-child(3) .text-secondary', ru: 'C1 — Продвинутый' },

    /* ── EXPERIENCE ─────────────────────────────────────────── */
    { sel: '#experience h3', ru: 'Опыт работы' },
    { sel: '#experience .timeline-item--first .timeline-role', ru: 'Инженер-программист, стажёр' },
    { sel: '#experience .timeline-item--first .timeline-body', ru: '<p>Проектировал и разрабатывал программные решения для исследовательских проектов университета, создавая комплексную техническую документацию в соответствии с академическими стандартами.</p><p><strong>Обязанности:</strong></p><ul><li>Проектирование и разработка программных решений в рамках исследовательских проектов</li><li>Создание технической документации в соответствии с академическими стандартами</li><li>Разработка архитектурных диаграмм (UML, диаграммы компонентов, диаграммы деятельности)</li><li>Участие в полном цикле разработки программного обеспечения</li></ul><p><strong>Достижения:</strong></p><ul><li>Самостоятельно разработал инновационные программные проекты с полным пакетом технической документации</li><li>Создал детальные архитектурные диаграммы для визуализации структуры систем</li><li>Подготовил академическую документацию, соответствующую стандартам научных публикаций</li></ul>' },
    { sel: '#experience .timeline-item:not(.timeline-item--first) .timeline-role', ru: 'Пентестер, стажёр' },
    { sel: '#experience .timeline-item:not(.timeline-item--first) .timeline-body', ru: '<p>Проводил комплексные оценки безопасности приложений и сетевой инфраструктуры, выявляя и документируя критические уязвимости в корпоративных средах.</p><ul><li>Занял Топ-5 среди 100 участников внутренних CTF-соревнований.</li><li>Проводил комплексные оценки безопасности веб-приложений и сетевых систем, выявляя уязвимости, включая обход аутентификации и инъекционные атаки.</li><li>Выполнял продвинутые методы эксплуатации, получая доступ уровня root в средах Linux и Windows.</li><li>Разрабатывал и проводил технические презентации по уязвимостям безопасности.</li><li>Успешно завершил интенсивную программу стажировки с сертификацией.</li></ul>' },

    /* ── EDUCATION ──────────────────────────────────────────── */
    { sel: '#education h3',          ru: 'Образование' },
    { sel: '#education .card-title', ru: 'Бакалавр программной инженерии' },
    { sel: '#education .card-body a h6', ru: 'Томский государственный университет' },

    /* ── COURSES ────────────────────────────────────────────── */
    { sel: '#courses h3', ru: 'Курсы и тренинги' },

    /* ── ACHIEVEMENTS ───────────────────────────────────────── */
    { sel: '#achievements h3', ru: 'Сертификаты' },
    { sel: '#achievements .col-lg-4:nth-child(1) .card-title', ru: 'Сертификат Jr Pentester' },
    { sel: '#achievements .col-lg-4:nth-child(2) .card-title', ru: 'Cyber Threat Intelligence от IBM' },
    { sel: '#achievements .col-lg-4:nth-child(3) .card-title', ru: 'SecurityBlue Blue Team Junior Analyst' },
    { sel: '#achievements .col-lg-4:nth-child(1) .card-text', ru: 'Сертификат Junior Penetration Tester от TryHackMe, подтверждающий владение методологиями тестирования на проникновение.' },
    { sel: '#achievements .col-lg-4:nth-child(2) .card-text', ru: 'Сертификат IBM по Cyber Threat Intelligence, охватывающий анализ угроз и методологии оценки безопасности.' },
    { sel: '#achievements .col-lg-4:nth-child(3) .card-text', ru: 'Сертификат SecurityBlue Team Junior Analyst, подтверждающий навыки в операциях blue team и мониторинге безопасности.' },

    /* ── AWARDS ─────────────────────────────────────────────── */
    { sel: '#awards h3', ru: 'Награды' },
    { sel: '#awards .award-card:nth-child(1) .card-title', ru: 'Топ-5 — CTF-соревнование в Bastion Inc, Москва' },
    { sel: '#awards .award-card:nth-child(2) .card-title', ru: 'Зал славы Bug Bounty — DigitalOcean' },
    { sel: '#awards .award-card:nth-child(3) .card-title', ru: 'Зал славы Bug Bounty — Pinterest' },
    { sel: '#awards .award-card:nth-child(4) .card-title', ru: 'Зал славы Bug Bounty — Verisign' },
    { sel: '#awards .award-card:nth-child(5) .card-title', ru: 'Зал славы Bug Bounty — Dell' },
    { sel: '#awards .award-card:nth-child(1) .award-date', ru: 'Август 2024' },
    { sel: '#awards .award-card:nth-child(2) .award-date', ru: 'Апрель 2019' },
    { sel: '#awards .award-card:nth-child(3) .award-date', ru: 'Июнь 2018' },
    { sel: '#awards .award-card:nth-child(4) .award-date', ru: 'Апрель 2018' },
    { sel: '#awards .award-card:nth-child(5) .award-date', ru: 'Апрель 2018' },
    { sel: '#awards .award-card:nth-child(1) .card-text', ru: 'Вошёл в топ-5 среди всех участников соревнований по тестированию на проникновение и повышению привилегий' },
    { sel: '#awards .award-card:nth-child(2) .card-text', ru: 'Ответственное раскрытие критической уязвимости через программу bug bounty' },
    { sel: '#awards .award-card:nth-child(3) .card-text', ru: 'Признан за ответственное раскрытие подтверждённой уязвимости безопасности' },
    { sel: '#awards .award-card:nth-child(4) .card-text', ru: 'Признан за ответственное раскрытие уязвимости' },
    { sel: '#awards .award-card:nth-child(5) .card-text', ru: 'Подтверждённая находка в области безопасности, отправленная через официальную bug bounty программу' },

    /* ── FOOTER ─────────────────────────────────────────────── */
    { sel: '.footer-col:nth-child(1) .footer-col-title',       ru: 'ссылки' },
    { sel: '.footer-col:nth-child(2) .footer-col-title',       ru: 'соцсети' },
    { sel: '.footer-copyright',                                 ru: '&copy; 2026 Махмуд — Все права защищены' },
    { sel: '.footer-col:nth-child(1) a[href="#about"]',        ru: 'Обо мне' },
    { sel: '.footer-col:nth-child(1) a[href="#experience"]',   ru: 'Опыт' },
    { sel: '.footer-col:nth-child(1) a[href="#education"]',    ru: 'Образование' },
    { sel: '.footer-col:nth-child(1) a[href="#achievements"]', ru: 'Сертификаты' },
    { sel: '.footer-col:nth-child(1) a[href="#awards"]',        ru: 'Награды' },
    { sel: 'a.nav-page-link[href$="#awards"]',                  ru: 'Награды' },
  ];

  /* ══════════════════════════════════════════════════════════════
     SHARED (nav + footer) — used on all non-home pages
  ══════════════════════════════════════════════════════════════ */
  var SHARED = [
    { sel: 'a.nav-page-link[href$="#about"]',        ru: 'Обо мне' },
    { sel: 'a.nav-page-link[href$="#experience"]',   ru: 'Опыт работы' },
    { sel: 'a.nav-page-link[href$="#education"]',    ru: 'Образование' },
    { sel: 'a.nav-page-link[href$="#achievements"]', ru: 'Сертификаты' },
    { sel: 'a.nav-page-link[href="/blogs"]',         ru: 'Блог' },
    { sel: 'a.nav-link[href="/blogs"]',              ru: 'Блог' },
    { sel: '.footer-col:nth-child(1) .footer-col-title',       ru: 'ссылки' },
    { sel: '.footer-col:nth-child(2) .footer-col-title',       ru: 'соцсети' },
    { sel: '.footer-copyright',                                 ru: '&copy; 2026 Махмуд — Все права защищены' },
    { sel: '.footer-col:nth-child(1) a[href="#about"]',        ru: 'Обо мне' },
    { sel: '.footer-col:nth-child(1) a[href="#experience"]',   ru: 'Опыт' },
    { sel: '.footer-col:nth-child(1) a[href="#education"]',    ru: 'Образование' },
    { sel: '.footer-col:nth-child(1) a[href="#achievements"]', ru: 'Сертификаты' },
    { sel: '.footer-col:nth-child(1) a[href="#awards"]',        ru: 'Награды' },
    { sel: 'a.nav-page-link[href$="#awards"]',                  ru: 'Награды' },
  ];

  /* ══════════════════════════════════════════════════════════════
     BLOG LIST PAGE
  ══════════════════════════════════════════════════════════════ */
  var BLOG_LIST = [
    { sel: '#list-page h2',   ru: 'Блог' },
    { sel: '.btn-outline-info', ru: 'Читать' },
  ];

  /* ══════════════════════════════════════════════════════════════
     SINGLE PAGE TRANSLATIONS — key = URL slug
  ══════════════════════════════════════════════════════════════ */
  var SINGLE_PAGES = {};

  /* ── 1. Active Directory ─────────────────────────────────── */
  SINGLE_PAGES['active-directory-attack-paths-red-team'] = {
    title: 'Пути атак Active Directory: руководство для Red Team',
    pairs: [
      ['The Kill Chain: Initial Access to Domain Admin', 'Цепочка атаки: от первоначального доступа до администратора домена'],
      ['Phase 1: Initial Access &amp; Enumeration', 'Фаза 1: Первоначальный доступ и перечисление'],
      ['BloodHound: Mapping the Domain', 'BloodHound: картографирование домена'],
      ['LDAP Enumeration', 'Перечисление LDAP'],
      ['SMB Enumeration', 'Перечисление SMB'],
      ['Phase 2: Credential Attacks', 'Фаза 2: Атаки на учётные данные'],
      ['Kerberoasting', 'Kerberoasting'],
      ['AS-REP Roasting', 'AS-REP Roasting'],
      ['LLMNR/NBT-NS Poisoning', 'LLMNR/NBT-NS отравление'],
      ['Password Spraying', 'Распыление паролей'],
      ['Phase 3: Privilege Escalation', 'Фаза 3: Повышение привилегий'],
      ['DCSync Attack', 'Атака DCSync'],
      ['Unconstrained Delegation Abuse', 'Злоупотребление неограниченным делегированием'],
      ['Constrained Delegation Abuse', 'Злоупотребление ограниченным делегированием'],
      ['Resource-Based Constrained Delegation (RBCD)', 'Делегирование на основе ресурсов (RBCD)'],
      ['Phase 4: Lateral Movement', 'Фаза 4: Боковое перемещение'],
      ['Pass-the-Hash', 'Pass-the-Hash'],
      ['Pass-the-Ticket', 'Pass-the-Ticket'],
      ['Overpass-the-Hash', 'Overpass-the-Hash'],
      ['Phase 5: Domain Dominance', 'Фаза 5: Доминирование в домене'],
      ['Golden Ticket', 'Золотой билет'],
      ['Silver Ticket', 'Серебряный билет'],
      ['Skeleton Key', 'Скелетный ключ'],
      ['Detection &amp; Defense', 'Обнаружение и защита'],
      ['Defensive Recommendations', 'Рекомендации по защите'],
      ['Useful Tools', 'Полезные инструменты'],
      ['Conclusion', 'Заключение'],
      ['Active Directory (AD) is the backbone of enterprise Windows environments', 'Active Directory (AD) — основа корпоративных сред Windows'],
      ['and a prime target for attackers', 'и главная цель для злоумышленников'],
      ['Understanding common attack paths is essential for both offensive and defensive security teams', 'Понимание типичных путей атак необходимо как для наступательных, так и для оборонительных команд'],
      ['Why it works', 'Почему это работает'],
      ['Who has DCSync rights by default?', 'Кто имеет права DCSync по умолчанию?'],
      ['Golden tickets persist until krbtgt password is changed (twice!)', 'Золотые билеты действуют до двукратной смены пароля krbtgt!'],
      ['Happy hunting!', 'Удачной охоты!'],
    ]
  };

  /* ── 2. API Security ─────────────────────────────────────── */
  SINGLE_PAGES['api-security-testing-vulnerabilities'] = {
    title: 'Тестирование безопасности API: поиск уязвимостей в современных веб-API',
    pairs: [
      ['Setting Up Your Testing Environment', 'Настройка тестовой среды'],
      ['Essential Tools', 'Необходимые инструменты'],
      ['Intercepting API Traffic', 'Перехват трафика API'],
      ['API Enumeration', 'Перечисление API'],
      ['Discover API Endpoints', 'Обнаружение конечных точек API'],
      ['Fuzz for Hidden Endpoints', 'Фаззинг скрытых конечных точек'],
      ['Analyze JavaScript Files', 'Анализ файлов JavaScript'],
      ['Authentication &amp; Authorization Attacks', 'Атаки на аутентификацию и авторизацию'],
      ['API1: Broken Object Level Authorization (BOLA/IDOR)', 'API1: Нарушение авторизации на уровне объектов (BOLA/IDOR)'],
      ['API2: Broken Authentication', 'API2: Нарушение аутентификации'],
      ['API3: Broken Object Property Level Authorization', 'API3: Нарушение авторизации на уровне свойств объекта'],
      ['Injection Attacks', 'Инъекционные атаки'],
      ['SQL Injection in APIs', 'SQL-инъекция в API'],
      ['NoSQL Injection', 'NoSQL-инъекция'],
      ['Command Injection', 'Инъекция команд'],
      ['Rate Limiting &amp; Resource Consumption', 'Ограничение запросов и потребление ресурсов'],
      ['API4: Unrestricted Resource Consumption', 'API4: Неограниченное потребление ресурсов'],
      ['Resource exhaustion:', 'Исчерпание ресурсов:'],
      ['Business Logic Flaws', 'Уязвимости бизнес-логики'],
      ['API5: Broken Function Level Authorization', 'API5: Нарушение авторизации на уровне функций'],
      ['Price/Quantity Manipulation', 'Манипуляция ценой/количеством'],
      ['Race Conditions', 'Состояние гонки'],
      ['GraphQL Specific Testing', 'Тестирование GraphQL'],
      ['Introspection Query', 'Запрос интроспекции'],
      ['Batching Attacks', 'Атаки пакетной обработки'],
      ['Field Suggestions', 'Подсказки полей'],
      ['Testing Checklist', 'Чек-лист тестирования'],
      ['Reporting Findings', 'Оформление результатов'],
      ['Conclusion', 'Заключение'],
    ]
  };

  /* ── 3. Binary Hacking ───────────────────────────────────── */
  SINGLE_PAGES['computer-security-binary-hacking-concepts-and-basics'] = {
    title: 'Компьютерная безопасность и основы бинарного хакинга',
    pairs: [
      ['Computer Memory and Virtual Addressing', 'Память компьютера и виртуальная адресация'],
      ['CPU Modes and OS Functionality, Control Overview', 'Режимы CPU и функциональность ОС: обзор управления'],
      ['Buffer Overflows', 'Переполнение буфера'],
      ['Conclusion', 'Заключение'],
    ]
  };

  /* ── 4. Evade Scanners ───────────────────────────────────── */
  SINGLE_PAGES['evade-network-scanners-with-firewall'] = {
    title: 'Обход сетевых сканеров с помощью файрвола',
    pairs: [
      ['Conclusion', 'Заключение'],
      ['Introduction', 'Введение'],
    ]
  };

  /* ── 5. Linux Hardening ──────────────────────────────────── */
  SINGLE_PAGES['hardening-linux-servers-production-checklist'] = {
    title: 'Укрепление серверов Linux: чек-лист для продакшена',
    pairs: [
      ['Initial Setup', 'Начальная настройка'],
      ['Create a Non-Root Admin User', 'Создание не-root администратора'],
      ['Update the System', 'Обновление системы'],
      ['SSH Hardening', 'Укрепление SSH'],
      ['Generate Strong SSH Keys', 'Генерация стойких SSH-ключей'],
      ['Harden SSH Configuration', 'Укрепление конфигурации SSH'],
      ['Firewall Configuration', 'Настройка файрвола'],
      ['UFW (Uncomplicated Firewall)', 'UFW (простой файрвол)'],
      ['iptables (Advanced)', 'iptables (продвинутый)'],
      ['Kernel Hardening', 'Укрепление ядра'],
      ['Fail2Ban - Intrusion Prevention', 'Fail2Ban — предотвращение вторжений'],
      ['File System Security', 'Безопасность файловой системы'],
      ['Secure Mount Options', 'Безопасные параметры монтирования'],
      ['Find and Fix Permissions', 'Поиск и исправление прав доступа'],
      ['Audit Logging', 'Журналирование аудита'],
      ['Quick Hardening Checklist', 'Быстрый чек-лист укрепления'],
      ['Conclusion', 'Заключение'],
    ]
  };

  /* ── 6. AV Evasion ───────────────────────────────────────── */
  SINGLE_PAGES['modern-av-evasion-techniques'] = {
    title: 'Современные техники обхода антивирусов: методы обнаружения и обхода',
    pairs: [
      ['How Modern AV Detection Works', 'Как работает современное обнаружение антивирусами'],
      ['1. Signature-Based Detection', '1. Сигнатурное обнаружение'],
      ['2. Heuristic/Behavioral Analysis', '2. Эвристический/поведенческий анализ'],
      ['3. AMSI (Antimalware Scan Interface)', '3. AMSI (интерфейс сканирования вредоносных программ)'],
      ['4. Machine Learning / AI', '4. Машинное обучение / ИИ'],
      ['Basic Evasion Techniques', 'Базовые техники обхода'],
      ['String Obfuscation', 'Обфускация строк'],
      ['Variable Substitution', 'Подстановка переменных'],
      ['Case Manipulation', 'Изменение регистра'],
      ['Intermediate Techniques', 'Промежуточные техники'],
      ['Payload Encryption', 'Шифрование полезной нагрузки'],
      ['In-Memory Execution', 'Выполнение в памяти'],
      ['Process Hollowing', 'Выдалбливание процесса'],
      ['Advanced Techniques', 'Продвинутые техники'],
      ['AMSI Bypass', 'Обход AMSI'],
      ['ETW (Event Tracing for Windows) Patching', 'Патчинг ETW (трассировка событий Windows)'],
      ['Syscall Unhooking', 'Снятие хуков системных вызовов'],
      ['Sleep Obfuscation', 'Обфускация через sleep'],
      ['Evasion Checklist', 'Чек-лист обхода'],
      ['Testing Your Payloads', 'Тестирование полезных нагрузок'],
      ['Safe Testing Environment', 'Безопасная тестовая среда'],
      ['Online Scanners (Careful!)', 'Онлайн-сканеры (осторожно!)'],
      ['Defender Emulation', 'Эмуляция Defender'],
      ['Defense Recommendations', 'Рекомендации по защите'],
      ['Conclusion', 'Заключение'],
      ['Understanding how antivirus evasion works is essential', 'Понимание принципов обхода антивирусов необходимо'],
      ['AV monitors program behavior looking for suspicious patterns:', 'Антивирус отслеживает поведение программ в поисках подозрительных паттернов:'],
      ['The oldest and most common method', 'Старейший и наиболее распространённый метод'],
      ['Weakness:', 'Слабость:'],
    ]
  };

  /* ── 7. Prometheus/Grafana ───────────────────────────────── */
  SINGLE_PAGES['monitoring-stack-prometheus-grafana-docker'] = {
    title: 'Мониторинг домашней лаборатории с Prometheus и Grafana',
    pairs: [
      ['Architecture Overview', 'Обзор архитектуры'],
      ['Project Structure', 'Структура проекта'],
      ['Docker Compose Configuration', 'Конфигурация Docker Compose'],
      ['Prometheus Configuration', 'Конфигурация Prometheus'],
      ['Alert Rules', 'Правила оповещений'],
      ['Alertmanager Configuration', 'Конфигурация Alertmanager'],
      ['Grafana Provisioning', 'Провизия Grafana'],
      ['Datasource', 'Источник данных'],
      ['Dashboard Provisioning', 'Провизия дашборда'],
      ['Deploy the Stack', 'Развёртывание стека'],
      ['Access the Services', 'Доступ к сервисам'],
      ['Useful PromQL Queries', 'Полезные запросы PromQL'],
      ['CPU Usage', 'Использование CPU'],
      ['Memory Usage', 'Использование памяти'],
      ['Disk Usage', 'Использование диска'],
      ['Network Traffic', 'Сетевой трафик'],
      ['Container Memory', 'Память контейнера'],
      ['Adding More Targets', 'Добавление новых целей'],
      ['Conclusion', 'Заключение'],
    ]
  };

  /* ── 8. Docker Malware Analysis ──────────────────────────── */
  SINGLE_PAGES['secure-malware-analysis-with-docker'] = {
    title: 'Безопасный анализ вредоносного ПО с Docker: руководство для сисадмина',
    pairs: [
      ['Why Docker for Malware Analysis?', 'Зачем Docker для анализа вредоносного ПО?'],
      ['Setting Up the Analysis Environment', 'Настройка среды анализа'],
      ['Step 1: Create the Isolated Network', 'Шаг 1: Создание изолированной сети'],
      ['Step 2: Build the Analysis Container', 'Шаг 2: Создание контейнера для анализа'],
      ['Step 3: Run with Maximum Restrictions', 'Шаг 3: Запуск с максимальными ограничениями'],
      ['Static Analysis Workflow', 'Рабочий процесс статического анализа'],
      ['File Type Identification', 'Определение типа файла'],
      ['Check for Packing/Obfuscation', 'Проверка на упаковку/обфускацию'],
      ['Extract Indicators of Compromise (IOCs)', 'Извлечение индикаторов компрометации (IOC)'],
      ['Dynamic Analysis (Behavioral)', 'Динамический анализ (поведенческий)'],
      ['Trace System Calls', 'Трассировка системных вызовов'],
      ['Monitor File System Activity', 'Мониторинг активности файловой системы'],
      ['Capturing Network Traffic', 'Захват сетевого трафика'],
      ['Automated Analysis Script', 'Скрипт автоматизированного анализа'],
      ['Cleanup and Forensics', 'Очистка и форензика'],
      ['Best Practices Summary', 'Сводка лучших практик'],
      ['When NOT to Use Docker', 'Когда НЕ использовать Docker'],
      ['Conclusion', 'Заключение'],
    ]
  };

  /* ── 9. CAPTCHA Bypasses ─────────────────────────────────── */
  SINGLE_PAGES['two-captcha-bypasses-idor-and-token-reuse'] = {
    title: 'Два обхода CAPTCHA — IDOR и повторное использование токенов',
    pairs: [
      ['First One (Captcha Token Reuse)', 'Первый (повторное использование токена CAPTCHA)'],
      ['Second One (IDOR)', 'Второй (IDOR)'],
      ['Conclusion', 'Заключение'],
    ]
  };

  /* ═════════════════════════════════════════════════════════════
     ENGINE
  ═════════════════════════════════════════════════════════════ */
  var isRU = false;
  var snaps = new Map();
  var articleSnap = null;
  var titleSnap = null;
  var singleExtraKeys = [];

  function getSlug() {
    var path = window.location.pathname.replace(/\/+$/, '');
    var parts = path.split('/');
    return parts[parts.length - 1] || '';
  }

  function rememberHTML(key, el) {
    if (!el || snaps.has(key)) return;
    snaps.set(key, { el: el, enHTML: el.innerHTML });
  }

  function normalizeVariants(text) {
    var variants = [text];
    if (text.indexOf('&amp;') !== -1) variants.push(text.split('&amp;').join('&'));
    if (text.indexOf('&') !== -1) variants.push(text.split('&').join('&amp;'));
    return Array.from(new Set(variants));
  }

  function replaceAllVariants(html, from, to) {
    normalizeVariants(from).forEach(function(variant) {
      html = html.split(variant).join(to);
    });
    return html;
  }

  function translateTextNodes(nodeList, dict, keyPrefix) {
    nodeList.forEach(function(el, i) {
      var source = (el.textContent || '').trim();
      if (!source) return;
      var target = dict[source] || dict[source.replace(/\s+/g, ' ').trim()];
      if (!target) return;
      var key = keyPrefix + i;
      rememberHTML(key, el);
      el.textContent = target;
      singleExtraKeys.push(key);
    });
  }

  function isHomePage() {
    var path = window.location.pathname.replace(/\/+$/, '');
    return path === '' || path === '/';
  }

  function isBlogListPage() {
    var path = window.location.pathname.replace(/\/+$/, '');
    return path === '/blogs' || path.indexOf('/blogs/page') === 0;
  }

  function applySelectors(list) {
    list.forEach(function(item) {
      var els = document.querySelectorAll(item.sel);
      els.forEach(function(el, i) {
        if (typeof item.idx === 'number' && item.idx !== i) return;
        var key = item.sel + '||' + i;
        if (!snaps.has(key)) snaps.set(key, { el: el, enHTML: el.innerHTML });
        el.innerHTML = item.ru;
      });
    });
  }

  function applySinglePageTranslation(slug) {
    var page = SINGLE_PAGES[slug];

    /* Always translate nav/footer */
    applySelectors(SHARED);

    if (!page) return;

    var dict = {};
    page.pairs.forEach(function(pair) {
      dict[pair[0]] = pair[1];
      normalizeVariants(pair[0]).forEach(function(variant) {
        dict[variant] = pair[1];
      });
    });

    /* Translate page h1 title */
    var h1 = document.querySelector('#single h1') ||
              document.querySelector('.single-title') ||
              document.querySelector('h1');
    if (h1 && page.title) {
      var key = '__title__';
      rememberHTML(key, h1);
      h1.innerHTML = page.title;
    }

    /* Translate article content by replacing known text variants */
    var article = document.querySelector('article.page-content') ||
                  document.querySelector('article') ||
                  document.querySelector('.page-content');
    if (article && page.pairs) {
      var key = '__article__';
      rememberHTML(key, article);
      var html = article.innerHTML;
      page.pairs.forEach(function(pair) {
        html = replaceAllVariants(html, pair[0], pair[1]);
      });
      article.innerHTML = html;

      translateTextNodes(article.querySelectorAll('h1, h2, h3, h4, h5, h6'), dict, '__article_heading__');
    }

    var tocTitle = document.querySelector('aside.toc h5');
    if (tocTitle) {
      rememberHTML('__toc_title__', tocTitle);
      tocTitle.textContent = 'Содержание';
      singleExtraKeys.push('__toc_title__');
    }

    var tagsTitle = document.querySelector('aside.tags h5');
    if (tagsTitle) {
      rememberHTML('__tags_title__', tagsTitle);
      tagsTitle.textContent = 'Теги';
      singleExtraKeys.push('__tags_title__');
    }

    translateTextNodes(document.querySelectorAll('aside.toc a'), dict, '__toc_link__');
  }

  function restoreSinglePage() {
    var articleSnap = snaps.get('__article__');
    if (articleSnap) {
      articleSnap.el.innerHTML = articleSnap.enHTML;
      snaps.delete('__article__');
    }
    var titleSnap = snaps.get('__title__');
    if (titleSnap) {
      titleSnap.el.innerHTML = titleSnap.enHTML;
      snaps.delete('__title__');
    }

    singleExtraKeys.forEach(function(key) {
      var snap = snaps.get(key);
      if (!snap) return;
      snap.el.innerHTML = snap.enHTML;
      snaps.delete(key);
    });
    singleExtraKeys = [];
  }

  function applyRU() {
    var btn = document.getElementById('lang-toggle-btn');
    if (isHomePage()) {
      applySelectors(HOME);
    } else if (isBlogListPage()) {
      applySelectors(SHARED);
      applySelectors(BLOG_LIST);
    } else {
      applySinglePageTranslation(getSlug());
    }
    isRU = true;
    localStorage.setItem(STORAGE_KEY, 'ru');
    if (btn) { btn.textContent = 'EN'; btn.title = 'Switch to English'; }
    document.documentElement.lang = 'ru';
  }

  function applyEN() {
    var btn = document.getElementById('lang-toggle-btn');
    /* Restore article/title first (special keys), then all other snaps */
    restoreSinglePage();
    snaps.forEach(function(snap) { snap.el.innerHTML = snap.enHTML; });
    snaps.clear();
    isRU = false;
    localStorage.setItem(STORAGE_KEY, 'en');
    if (btn) { btn.textContent = 'RU'; btn.title = 'Перевести на русский'; }
    document.documentElement.lang = 'en';
  }

  function doToggle() {
    if (!isRU) { applyRU(); } else { applyEN(); }
  }

  function init() {
    var btn = document.getElementById('lang-toggle-btn');
    if (btn) btn.addEventListener('click', doToggle);
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'ru') {
      setTimeout(function() { applyRU(); }, 80);
    }
  }

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }

})();
