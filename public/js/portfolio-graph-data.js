/* ============================================================
   PORTFOLIO CONSTELLATION — Data Model (Infosec Edition)
   Evidence / Career graph — skills → projects → writing → disclosure
   All nodes (me, skills, awards, experience, education,
   courses, certificates, blogs, projects) and their connections.
   Preserves Gravity Atlas tokens, physics, float-card, legend.
   ============================================================ */

var PORTFOLIO_DATA = (function () {
    'use strict';

    // ---- Category color palette (light / dark) ----
    var CAT_COLORS = {
        me:          { light: '#1a1a1a', dark: '#ffffff' },
        pentesting:  { light: '#10b981', dark: '#34d399' },
        networking:  { light: '#64748b', dark: '#94a3b8' },
        sysadmin:    { light: '#6b7280', dark: '#9ca3af' },
        tools:       { light: '#14b8a6', dark: '#2dd4bf' },
        scripting:   { light: '#3b82f6', dark: '#60a5fa' },
        concepts:    { light: '#059669', dark: '#10b981' },
        award:       { light: '#f59e0b', dark: '#fbbf24' },
        experience:  { light: '#8b5cf6', dark: '#a78bfa' },
        education:   { light: '#db2777', dark: '#f472b6' },
        course:      { light: '#f59e0b', dark: '#fbbf24' },
        certificate: { light: '#f59e0b', dark: '#fbbf24' },
        blog:        { light: '#0ea5e9', dark: '#38bdf8' },
        project:     { light: '#3b82f6', dark: '#60a5fa' },
    };

    // ---- Coarse category groups (prototype color system) ----
    var GROUP_COLORS = {
        me:             { light: '#1a1a1a', dark: '#ffffff' }, // neutral ink/white for the hub
        security:       { light: '#10b981', dark: '#34d399' },
        development:    { light: '#3b82f6', dark: '#60a5fa' },
        infrastructure: { light: '#6b7280', dark: '#9ca3af' },
        experience:     { light: '#8b5cf6', dark: '#a78bfa' },
        recognition:    { light: '#f59e0b', dark: '#fbbf24' },
    };

    // Maps a fine-grained `cat` to a coarse group
    var GROUP_MAP = {
        pentesting: 'security',
        networking: 'security',
        concepts:   'security',
        scripting:  'development',
        project:    'development',
        sysadmin:   'infrastructure',
        tools:      'infrastructure',
        experience: 'experience',
        education:  'experience',
        award:       'recognition',
        certificate: 'recognition',
        course:      'recognition',
        blog:        'recognition',
        me:          'me',
    };
    // ---- Skill -> subgroup mapping (hierarchy) ----
    var SKILL_PARENT = {
        // Security
        redteam: 'sg-offsec', privesc: 'sg-offsec', exploitdev: 'sg-offsec', vulnassess: 'sg-offsec', websec: 'sg-offsec',
        tcpip: 'sg-netsec', netsec: 'sg-defsec', kerberos: 'sg-netsec', firewall: 'sg-netsec',
        owasp: 'sg-defsec', mitreattack: 'sg-defsec', malwareanalysis: 'sg-defsec', threatintel: 'sg-defsec',
        // Development
        python: 'sg-langs', bash: 'sg-langs', javascript: 'sg-langs', cplusplus: 'sg-langs', assembly: 'sg-langs', sql: 'sg-langs',
        docker: 'sg-devtooling', git: 'sg-devtooling', hugo: 'sg-devtooling',
        // Infrastructure
        windows: 'sg-systems', linux: 'sg-systems', activedir: 'sg-systems', sysadm: 'sg-systems', apparmor: 'sg-defsec',
        burpsuite: 'sg-sectools', metasploit: 'sg-sectools', cobaltstrike: 'sg-sectools', sliver: 'sg-sectools',
        ghidra: 'sg-sectools', nmap: 'sg-sectools', wireshark: 'sg-sectools', bloodhound: 'sg-sectools',
        impacket: 'sg-sectools', sqlmap: 'sg-sectools', nuclei: 'sg-sectools', ffuf: 'sg-sectools'
    };

    // ---- Main category (tier-1) nodes ----
    var categories = [
        { id: 'cat-security',       name: 'Security',       group: 'security',       cat: 'pentesting', icon: 'fas fa-shield-halved', content: 'Offensive, defensive and analytical security work across web, network, and binary domains.' },
        { id: 'cat-development',    name: 'Development',    group: 'development',    cat: 'scripting',  icon: 'fas fa-laptop-code',  content: 'Scripting, automation and tooling built to support security workflows — now including evidence-bound projects.' },
        { id: 'cat-infrastructure', name: 'Infrastructure', group: 'infrastructure', cat: 'sysadmin',   icon: 'fas fa-server',       content: 'Systems, Active Directory and the tooling that holds enterprise infrastructure together.' },
        { id: 'cat-experience',     name: 'Experience',     group: 'experience',     cat: 'experience', icon: 'fas fa-briefcase',    content: 'Professional roles, internships and academic background.' },
        { id: 'cat-recognition',    name: 'Recognition',    group: 'recognition',    cat: 'award',      icon: 'fas fa-award',        content: 'Bug-bounty hall-of-fames, certifications, courses and published writing — evidence trail.' }
    ].map(function (c) { c.type = 'category'; c.parent = 'me'; return c; });

    // ---- Sub-group (tier-2) nodes ----
    var subgroups = [
        // Security
        { id: 'sg-offsec',   name: 'Offensive',            group: 'security',       cat: 'pentesting', parent: 'cat-security',       icon: 'fas fa-bolt' },
        { id: 'sg-defsec',   name: 'Web & AppSec',         group: 'security',       cat: 'networking', parent: 'cat-security',       icon: 'fas fa-magnifying-glass-chart' },
        { id: 'sg-netsec',   name: 'Network',              group: 'security',       cat: 'networking', parent: 'cat-security',       icon: 'fas fa-ethernet' },
        // Development
        { id: 'sg-langs',    name: 'Languages',            group: 'development',    cat: 'scripting',  parent: 'cat-development',    icon: 'fas fa-code' },
        { id: 'sg-devtooling', name: 'Tooling',            group: 'development',    cat: 'scripting',  parent: 'cat-development',    icon: 'fas fa-toolbox' },
        { id: 'sg-projects', name: 'Projects',             group: 'development',    cat: 'project',    parent: 'cat-development',    icon: 'fas fa-diagram-project' },
        // Infrastructure
        { id: 'sg-systems',  name: 'Systems & AD',         group: 'infrastructure', cat: 'sysadmin',   parent: 'cat-infrastructure', icon: 'fas fa-computer' },
        { id: 'sg-sectools', name: 'Security Tooling',     group: 'infrastructure', cat: 'tools',      parent: 'cat-infrastructure', icon: 'fas fa-screwdriver-wrench' },
        // Experience
        { id: 'sg-work',     name: 'Work',                 group: 'experience',     cat: 'experience', parent: 'cat-experience',     icon: 'fas fa-building' },
        { id: 'sg-edu',      name: 'Education',            group: 'experience',     cat: 'education',  parent: 'cat-experience',     icon: 'fas fa-school' },
        // Recognition
        { id: 'sg-awards',   name: 'Disclosure & Awards',  group: 'recognition',    cat: 'award',      parent: 'cat-recognition',    icon: 'fas fa-trophy' },
        { id: 'sg-certs',    name: 'Certifications',       group: 'recognition',    cat: 'award',      parent: 'cat-recognition',    icon: 'fas fa-certificate' },
        { id: 'sg-writing',  name: 'Research & Writing',   group: 'recognition',    cat: 'award',      parent: 'cat-recognition',    icon: 'fas fa-pen-nib' }
    ].map(function (s) { s.type = 'subgroup'; return s; });

    // ============================================================
    //  NODES
    // ============================================================

    // ---- Central node ----
    var meNode = {
        id: 'me', type: 'me', name: 'Mahmoud Adel', cat: 'me',
        roles: ['Application Security & Offensive Security Engineer', 'B.Sc. Software Engineering'],
        subtitle: 'Application Security & Offensive Security Engineer | B.Sc. Software Engineering',
        terminalTitle: 'zsh — mahmoud@portfolio',
        image: '/images/me-avatar.png',
        icon: '',
        content: "Junior penetration tester building toward security analyst and infrastructure-security roles, with authorized web/API and network assessment experience plus Linux, Windows, Active Directory, and blue-team foundations from labs and coursework. Recognized through Hall of Fame programs at DigitalOcean, Pinterest, Verisign, and Dell; ranked Top 5 / 100 in Bastion's internal CTF; and pursuing a Software Engineering degree.",
        links: {
            github: 'https://github.com/mahmoud0x01',
            linkedin: 'https://www.linkedin.com/in/mahmoudadel0x01/',
            email: 'mailto:contact@mahmoudouf.com',
        },
    };

    // ---- Skills ----
    var skills = [
        // Pentesting
        { id: 'redteam',    name: 'Red Team',              icon: 'fas fa-user-ninja',      cat: 'pentesting' },
        { id: 'privesc',    name: 'Privilege Escalation',   icon: 'fas fa-stairs',          cat: 'pentesting' },
        { id: 'exploitdev', name: 'Exploit Development',    icon: 'fas fa-bomb',            cat: 'pentesting' },
        { id: 'vulnassess', name: 'Vuln Assessment',        icon: 'fas fa-magnifying-glass', cat: 'pentesting' },

        // Networking
        { id: 'tcpip',      name: 'TCP/IP',                icon: 'fas fa-network-wired',   cat: 'networking' },
        { id: 'netsec',     name: 'Network Security',      icon: 'fas fa-lock',            cat: 'networking' },

        // Sysadmin
        { id: 'windows',    name: 'Windows',               icon: 'fab fa-windows',         cat: 'sysadmin' },
        { id: 'linux',      name: 'Linux',                 icon: 'fab fa-linux',           cat: 'sysadmin' },
        { id: 'activedir',  name: 'Active Directory',      icon: 'fas fa-sitemap',         cat: 'sysadmin' },
        { id: 'sysadm',     name: 'System Administration', icon: 'fas fa-gears',           cat: 'sysadmin' },
        { id: 'apparmor',   name: 'AppArmor',              icon: 'fas fa-user-shield',     cat: 'sysadmin' },

        // Tools
        { id: 'burpsuite',  name: 'Burp Suite',            icon: 'fas fa-spider',          cat: 'tools' },
        { id: 'metasploit', name: 'Metasploit',            icon: 'fas fa-bug',             cat: 'tools' },
        { id: 'cobaltstrike', name: 'Cobalt Strike',       icon: 'fas fa-tower-broadcast', cat: 'tools' },
        { id: 'sliver',     name: 'Sliver',                icon: 'fas fa-ghost',           cat: 'tools' },
        { id: 'ghidra',     name: 'Ghidra',                icon: 'fas fa-microscope',      cat: 'tools' },
        { id: 'nmap',       name: 'Nmap',                  icon: 'fas fa-satellite-dish',  cat: 'tools' },
        { id: 'wireshark',  name: 'Wireshark',             icon: 'fas fa-wave-square',     cat: 'tools' },
        { id: 'bloodhound', name: 'BloodHound',            icon: 'fas fa-diagram-project', cat: 'tools' },
        { id: 'impacket',   name: 'Impacket',              icon: 'fas fa-terminal',        cat: 'tools' },
        { id: 'sqlmap',     name: 'SQLMap',                icon: 'fas fa-syringe',         cat: 'tools' },
        { id: 'nuclei',     name: 'Nuclei',                icon: 'fas fa-radiation',       cat: 'tools' },
        { id: 'ffuf',       name: 'ffuf',                  icon: 'fas fa-wind',            cat: 'tools' },

        // Scripting
        { id: 'python',     name: 'Python',                icon: 'fab fa-python',          cat: 'scripting' },
        { id: 'bash',       name: 'Bash',                  icon: 'fas fa-dollar-sign',     cat: 'scripting' },
        { id: 'javascript', name: 'JavaScript',            icon: 'fab fa-js',              cat: 'scripting' },
        { id: 'cplusplus',  name: 'C/C++',                 icon: 'custom-cc',              cat: 'scripting' },
        { id: 'assembly',   name: 'Assembly',              icon: 'fas fa-microchip',       cat: 'scripting' },
        { id: 'sql',        name: 'SQL',                   icon: 'fas fa-database',        cat: 'scripting' },

        // Concepts
        { id: 'owasp',      name: 'OWASP',                icon: 'fas fa-list-check',      cat: 'concepts' },
        { id: 'mitreattack', name: 'MITRE ATT&CK',        icon: 'fas fa-crosshairs',      cat: 'concepts' },
        { id: 'malwareanalysis', name: 'Malware Analysis', icon: 'fas fa-virus',           cat: 'concepts' },
        { id: 'threatintel', name: 'Threat Intelligence',  icon: 'fas fa-eye',             cat: 'concepts' },

        // Additional tools / networking
        { id: 'docker',     name: 'Docker',                icon: 'fab fa-docker',          cat: 'tools' },
        { id: 'git',        name: 'Git',                   icon: 'fab fa-git-alt',         cat: 'tools' },
        { id: 'hugo',       name: 'Hugo',                  icon: 'fas fa-cubes',           cat: 'tools' },
        { id: 'kerberos',   name: 'Kerberos',              icon: 'fas fa-key',             cat: 'networking' },
        { id: 'websec',     name: 'Web Security',          icon: 'fas fa-globe',           cat: 'pentesting' },
        { id: 'firewall',   name: 'Firewall',              icon: 'fas fa-filter',          cat: 'networking' },
    ].map(function (s) { s.type = 'skill'; s.parent = SKILL_PARENT[s.id]; return s; });
    // Mark CORE vs familiar for visual hierarchy (CORE = 10 toolkit tier-1 — practical strengths, lab-qualified where noted)
    var CORE_IDS = { websec:1, vulnassess:1, linux:1, windows:1, tcpip:1, privesc:1, burpsuite:1, nmap:1, python:1, bash:1 };
    skills.forEach(function (s) { s.isCore = !!CORE_IDS[s.id]; s.tier = s.isCore ? 'core' : 'familiar'; });

    // ---- Awards (Bug Bounties) ----
    var awards = [
        {
            id: 'award-ctf', type: 'award', cat: 'award',
            name: 'CTF Top 5 / 100', icon: 'fas fa-flag-checkered',
            subtitle: 'Bastion Security',
            date: 'August 2024',
            content: 'Ranked Top 5 among 100 participants in penetration testing and privilege escalation challenges at Bastion Security.',
            relatedSkills: ['redteam', 'privesc', 'exploitdev', 'linux'],
        },
        {
            id: 'award-digitalocean', type: 'award', cat: 'award',
            name: 'DigitalOcean HoF', icon: 'fab fa-digital-ocean',
            subtitle: 'Bug Bounty Hall of Fame',
            date: 'April 2019',
            content: 'Responsible disclosure recognized through the DigitalOcean bug bounty program.',
            relatedSkills: ['vulnassess', 'burpsuite', 'netsec'],
        },
        {
            id: 'award-pinterest', type: 'award', cat: 'award',
            name: 'Pinterest HoF', icon: 'fab fa-pinterest',
            subtitle: 'Bug Bounty Hall of Fame',
            date: 'June 2018',
            content: 'Recognized for responsible disclosure of a security vulnerability at Pinterest.',
            relatedSkills: ['vulnassess', 'burpsuite', 'owasp'],
        },
        {
            id: 'award-verisign', type: 'award', cat: 'award',
            name: 'Verisign HoF · $1,000', icon: 'fas fa-medal',
            subtitle: 'CSRF → ATO — Bug Bounty Hall of Fame',
            date: 'April 2018',
            content: 'CSRF in DomainScope Google OAuth linking (missing state → attacker Google linked to victim session → full ATO). Validated via proxy replay, triaged via Bugcrowd, rewarded $1,000. Evidence chain: Web Security → OWASP (Auth) → OAuth/CSRF → Verisign ATO → Disclosure.',
            relatedSkills: ['websec', 'owasp', 'vulnassess', 'burpsuite', 'netsec'],
        },
        {
            id: 'award-dell', type: 'award', cat: 'award',
            name: 'Dell HoF', icon: 'fas fa-crown',
            subtitle: 'Bug Bounty Hall of Fame',
            date: 'April 2018',
            content: 'Security finding submitted through Dell official bug bounty program.',
            relatedSkills: ['vulnassess', 'burpsuite'],
        },
    ];

    // ---- Experience ----
    var experience = [
        {
            id: 'exp-tsu', type: 'experience', cat: 'experience',
            name: 'Software Engineer Intern', icon: 'fas fa-code-branch',
            subtitle: 'Tomsk State University',
            date: 'Feb 2025',
            companyUrl: 'https://www.tsu.ru',
            content: 'Software engineering work on university research projects spanning implementation, architecture, and documentation. Created UML, component, and activity diagrams and participated in the full software development lifecycle.',
            relatedSkills: ['python', 'linux'],
        },
        {
            id: 'exp-bastion', type: 'experience', cat: 'experience',
            name: 'Security Engineering Intern', icon: 'fas fa-user-secret',
            subtitle: 'Bastion Security',
            date: 'May 2024 - Sep 2024',
            companyUrl: '',
            content: 'Authorized scope: assessed 8 web apps & 2 network ranges for auth bypass, injection and privesc — 11 validated findings (6 Linux + 4 Windows root), 8 reports 0 rework. Ranked Top 5 / 100 in Bastion internal CTF.',
            relatedSkills: ['redteam', 'privesc', 'vulnassess', 'linux', 'netsec', 'websec'],
        },
    ];

    // ---- Education ----
    var education = [
        {
            id: 'edu-bse', type: 'education', cat: 'education',
            name: "Bachelor's in Software Engineering", icon: 'fas fa-graduation-cap',
            subtitle: 'Tomsk State University',
            date: 'Sep 2022 - Jul 2026',
            schoolUrl: 'https://www.tsu.ru',
            content: "Bachelor of Software Engineering at Tomsk State University.",
        },
    ];

    // ---- Courses ----
    var courses = [
        { id: 'crs-oscp',       name: 'OSCP (In Progress)',    icon: 'fas fa-shield-halved', provider: 'OffSec',       date: '2025 — In Progress', relatedSkills: ['privesc', 'linux', 'vulnassess'] },
        { id: 'crs-linuxplus',  name: 'CompTIA Linux+',        icon: 'fab fa-centos',         provider: 'CompTIA',      date: '2024', relatedSkills: ['linux', 'sysadm', 'bash'] },
        { id: 'crs-sbtja',      name: 'Blue Team Jr Analyst',  icon: 'fas fa-headset',        provider: 'SecurityBlue', date: '2023', relatedSkills: ['netsec', 'wireshark', 'mitreattack'] },
        { id: 'crs-ibmcti',     name: 'IBM Cyber Threat Intel', icon: 'fas fa-binoculars',    provider: 'IBM',          date: '2023', relatedSkills: ['mitreattack', 'netsec', 'threatintel'] },
        { id: 'crs-jrpentest',  name: 'Jr Penetration Tester', icon: 'fas fa-chalkboard-user', provider: 'TryHackMe',    date: '2024', relatedSkills: ['redteam', 'privesc', 'burpsuite'] },
        { id: 'crs-ccna',       name: 'CCNA',                  icon: 'fas fa-route',          provider: 'Cisco',        date: '2023', relatedSkills: ['tcpip', 'netsec', 'firewall'] },
        { id: 'crs-ibmir',      name: 'PenTest, IR & Forensics', icon: 'fas fa-fingerprint',  provider: 'IBM',          date: '2023', relatedSkills: ['redteam', 'vulnassess'] },
        { id: 'crs-pnpt',       name: 'PNPT (In Progress)',    icon: 'fas fa-flag',           provider: 'TCM Security', date: '2025 — In Progress', relatedSkills: ['netsec', 'privesc', 'activedir'] },
    ].map(function (c) { c.type = 'course'; c.cat = 'course'; return c; });

    // ---- Certificates ----
    var certificates = [
        { id: 'cert-jrpent',  name: 'Jr Pentester (THM)',     icon: 'fas fa-ribbon',      provider: 'TryHackMe',    date: '2024', content: 'Junior Penetration Tester certification from TryHackMe.' },
        { id: 'cert-ibmcti',  name: 'Cyber Threat Intel',     icon: 'fas fa-scroll',      provider: 'IBM',          date: '2023', content: 'IBM certification in Cyber Threat Intelligence.' },
        { id: 'cert-sbtja',   name: 'Blue Team Jr Analyst',   icon: 'fas fa-stamp',       provider: 'SecurityBlue', date: '2023', content: 'SecurityBlue Team Junior Analyst certification.' },
    ].map(function (c) { c.type = 'certificate'; c.cat = 'certificate'; return c; });

    // ---- Featured security writing ----
    var blogs = [
        { id: 'blog-malware-docker',  name: 'Malware Analysis with Docker', icon: 'fas fa-flask',         url: '/blogs/secure-malware-analysis-with-docker/', content: 'Docker-isolated malware analysis pipeline: static triage, dynamic sandbox, network capture.' },
        { id: 'blog-av-evasion',      name: 'AV Evasion Techniques',        icon: 'fas fa-mask',          url: '/blogs/modern-av-evasion-techniques/', content: 'Modern AV evasion: payload encoding, in-memory execution, and detection bypass.' },
        { id: 'blog-linux-hardening', name: 'Linux Server Hardening',       icon: 'fas fa-user-lock',     url: '/blogs/hardening-linux-servers-production-checklist/', content: 'Production hardening checklist for Linux servers: CIS, SSH, firewall, audit.' },
        { id: 'blog-ad-attacks',      name: 'AD Attack Paths',              icon: 'fas fa-door-open',     url: '/blogs/active-directory-attack-paths-red-team/', content: 'Active Directory attack paths from the red-team perspective: Kerberoasting, BloodHound, Impacket.' },
        { id: 'blog-monitoring',      name: 'Prometheus & Grafana Lab',     icon: 'fas fa-chart-line',    url: '/blogs/monitoring-stack-prometheus-grafana-docker/', content: 'Docker-based observability: Prometheus metrics + Grafana dashboards for infra monitoring.' },
        { id: 'blog-api-security',    name: 'API Security Testing',         icon: 'fas fa-plug',          url: '/blogs/api-security-testing-vulnerabilities/', content: 'API security assessment: OWASP API Top 10, authz, rate limiting, mass assignment — tested with Burp Suite.' },
        { id: 'blog-apparmor-rce',    name: 'AppArmor RCE Mitigation',       icon: 'fas fa-shield-virus',   url: '/blogs/apparmor-rce-mitigation/', content: 'Authorized blue-team validation: PHP RCE contained at runtime by AppArmor profile (deny exec /bin/sh → audit DENIED), then fixed in source. Defense-in-depth killswitch.' },
        { id: 'blog-verisign-csrf',   name: 'Verisign CSRF → ATO · $1,000', icon: 'fas fa-link',          url: '/blogs/verisign-csrf-account-takeover-domainscope/', content: 'CSRF in DomainScope Google OAuth linking — missing state allowed attacker Google account linked to victim session → full account takeover. $1,000 bounty via Bugcrowd. Chain: Web Security → Auth → OAuth/CSRF → Verisign ATO → Disclosure.' },
        { id: 'blog-linux-trial',     name: 'Linux Trial Bypass · unshare', icon: 'fas fa-unlock-keyhole', url: '/blogs/linux-trial-licensing-bypass-machine-id-unshare-mount-bind/', content: 'Lab research: trial bound to /etc/machine-id bypassed via unshare -m + mount --bind fake id. Detection via strings/strace; hardening via HWID + server-signed license.' },
        { id: 'blog-captcha-bypass',  name: 'Captcha Bypass · IDOR',        icon: 'fas fa-robot',          url: '/blogs/two-captcha-bypasses-idor-and-token-reuse/', content: 'Two captcha bypasses: token reuse (Burp Repeater token not invalidated) and IDOR fail=0. Evidence of auth/bypass logic testing.' },
    ].map(function (b) { b.type = 'blog'; b.cat = 'blog'; return b; });

    // Overflow node for remaining posts
    var blogMore = {
        id: 'blog-more', type: 'blog-more', cat: 'blog',
        name: '+2 more', icon: 'fas fa-ellipsis',
        url: '/blogs/',
        content: 'Explore the full research archive — including binary hacking basics and firewall evasion notes.'
    };

    // ---- Projects (Engineering + Security angled) ----
    var projects = [
        {
            id: 'proj-ticketpro', type: 'project', cat: 'project',
            name: 'TicketPro · Support Tickets', icon: 'fas fa-ticket',
            subtitle: 'RBAC · Django · WebSockets · PostgreSQL',
            content: 'Full-stack support ticket management with ticket lifecycle (Open/In Progress/Resolved/Closed), real-time chat, prioritization, SLA monitoring and analytics. Security angle: RBAC and authentication clarify role boundaries and ticket authorization paths.',
            image: '/images/projects/profile.png',
            url: 'https://github.com/mahmoud0x01/Ticket_Support_full_stack',
            github: 'https://github.com/mahmoud0x01/Ticket_Support_full_stack',
            badges: ['Python','Django','DRF','WebSockets','PostgreSQL','Tailwind CSS'],
        },
        {
            id: 'proj-restaurant', type: 'project', cat: 'project',
            name: 'Restaurant Delivery API', icon: 'fas fa-utensils',
            subtitle: 'C# · .NET · API · OpenAPI/Swagger',
            content: 'Restaurant delivery API with auth, dish management, cart, orders, ratings and settings. Full OpenAPI/Swagger docs. Security angle: authentication, API endpoints and OpenAPI documentation support API validation.',
            image: '/images/projects/converter.jpg',
            url: 'https://github.com/mahmoud0x01/restaurant_website',
            github: 'https://github.com/mahmoud0x01/restaurant_website',
            badges: ['C#','.NET','PostgreSQL','JavaScript','HTML/CSS'],
        },
        {
            id: 'proj-cashflow', type: 'project', cat: 'project',
            name: 'CashFlow · Finance Manager', icon: 'fas fa-chart-pie',
            subtitle: 'Django · SQLite · Bootstrap · Admin',
            content: 'Django cash-flow manager with income/expense records, statuses, categories/subcategories, filtering and admin. Security angle: Django admin and superuser workflows provide authorization test cases.',
            image: '/images/projects/profile2.jpg',
            url: 'https://github.com/mahmoud0x01/finance_management_system',
            github: 'https://github.com/mahmoud0x01/finance_management_system',
            badges: ['Python','Django','SQLite3','Bootstrap'],
        },
        {
            id: 'proj-newsbot', type: 'project', cat: 'project',
            name: 'Telegram News Bot', icon: 'fas fa-paper-plane',
            subtitle: 'Python · aiogram · PostgreSQL · Docker',
            content: 'Telegram news aggregation bot: /news <source>, default source, subscription intervals, /listsources, PostgreSQL persistence, Docker Compose. Security angle: subscription access, persistence and Docker deployment expose configuration concerns.',
            image: '/images/projects/profile.png',
            url: 'https://github.com/mahmoud0x01/news_bot_telegram',
            github: 'https://github.com/mahmoud0x01/news_bot_telegram',
            badges: ['Python','aiogram','SQLAlchemy','PostgreSQL','Docker'],
        },
        {
            id: 'proj-socialapi', type: 'project', cat: 'project',
            name: 'Social Network API', icon: 'fas fa-users',
            subtitle: 'FastAPI · SQLAlchemy · Auth · RBAC',
            content: 'RESTful social network API: users, posts, comments, likes with auth checks, secure password storage and business-logic safeguards (no duplicate likes). Security angle: authentication, authorization, password storage and error handling.',
            image: '/images/projects/converter.jpg',
            url: 'https://github.com/mahmoud0x01/myrestful',
            github: 'https://github.com/mahmoud0x01/myrestful',
            badges: ['Python','FastAPI','SQLAlchemy'],
        },
        {
            id: 'proj-cryptobot', type: 'project', cat: 'project',
            name: 'Crypto Trading Bot', icon: 'fas fa-coins',
            subtitle: 'Python · Bybit API · Mailgun · Telegram',
            content: 'Automated crypto trading bot: TradingView → Mailgun → Bybit execution, stop-loss/take-profit, Telegram controls, multi-pair instances, simulation mode, chat-ID auth. Security angle: chat-ID authorization and external API integrations.',
            image: '/images/projects/profile2.jpg',
            url: 'https://github.com/mahmoud0x01/Crypto_bot_telegram',
            github: 'https://github.com/mahmoud0x01/Crypto_bot_telegram',
            badges: ['Python','Bybit API','Mailgun API','Telegram Bot API'],
        },
    ];

    // ============================================================
    //  EDGES (hierarchical tree: me -> category -> subgroup -> leaf)
    // ============================================================
    var edges = [];

    // Assign each leaf to its subgroup parent
    awards.forEach(function (a) { a.parent = 'sg-awards'; });
    experience.forEach(function (e) { e.parent = 'sg-work'; });
    education.forEach(function (e) { e.parent = 'sg-edu'; });
    courses.forEach(function (c) { c.parent = 'sg-certs'; });
    certificates.forEach(function (c) { c.parent = 'sg-certs'; });
    blogs.forEach(function (b) { b.parent = 'sg-writing'; });
    blogMore.parent = 'sg-writing';
    projects.forEach(function (p) { p.parent = 'sg-projects'; });

    // Tier 1: me -> category
    categories.forEach(function (c) {
        edges.push({ from: 'me', to: c.id, type: 'me-cat' });
    });

    // Tier 2: category -> subgroup
    subgroups.forEach(function (s) {
        edges.push({ from: s.parent, to: s.id, type: 'cat-sub' });
    });

    // Tier 3: subgroup -> leaf (skills / awards / experience / education / courses / certs / blogs / projects)
    [].concat(skills, awards, experience, education, courses, certificates, blogs, [blogMore], projects).forEach(function (n) {
        if (n.parent) edges.push({ from: n.parent, to: n.id, type: 'sub-leaf' });
    });

    // ============================================================
    //  RELATIONSHIP EDGES (shine on hover; excluded from physics)
    // ============================================================

    // Skill <-> Skill (domain relationships)
    var relSkillEdges = [
        ['redteam', 'privesc'], ['redteam', 'exploitdev'], ['redteam', 'vulnassess'], ['redteam', 'metasploit'],
        ['privesc', 'exploitdev'], ['privesc', 'linux'], ['privesc', 'windows'],
        ['vulnassess', 'burpsuite'], ['vulnassess', 'nmap'], ['vulnassess', 'nuclei'], ['vulnassess', 'owasp'], ['vulnassess', 'sqlmap'], ['vulnassess', 'websec'],
        ['exploitdev', 'python'], ['exploitdev', 'cplusplus'], ['exploitdev', 'assembly'],
        ['tcpip', 'netsec'], ['tcpip', 'wireshark'], ['tcpip', 'nmap'], ['tcpip', 'firewall'],
        ['netsec', 'owasp'], ['netsec', 'mitreattack'], ['netsec', 'threatintel'],
        ['windows', 'activedir'], ['windows', 'sysadm'], ['linux', 'sysadm'], ['linux', 'bash'], ['linux', 'docker'],
        ['activedir', 'bloodhound'], ['activedir', 'impacket'], ['activedir', 'kerberos'], ['kerberos', 'windows'],
        ['burpsuite', 'sqlmap'], ['burpsuite', 'ffuf'], ['burpsuite', 'websec'],
        ['metasploit', 'cobaltstrike'], ['metasploit', 'sliver'], ['cobaltstrike', 'sliver'],
        ['nmap', 'ffuf'], ['python', 'bash'], ['python', 'sql'], ['python', 'git'], ['git', 'bash'],
        ['ghidra', 'assembly'], ['ghidra', 'cplusplus'], ['ghidra', 'malwareanalysis'],
        ['owasp', 'mitreattack'], ['owasp', 'websec'],
        ['impacket', 'python'], ['nuclei', 'ffuf'], ['sqlmap', 'sql'],
        ['docker', 'sysadm'], ['firewall', 'netsec'], ['firewall', 'tcpip'], ['firewall', 'nmap'],
        ['malwareanalysis', 'docker'], ['malwareanalysis', 'cplusplus'],
        ['threatintel', 'mitreattack'], ['threatintel', 'netsec'],
        ['apparmor', 'linux'], ['apparmor', 'sysadm'],
        ['git', 'hugo'], ['javascript', 'hugo'], ['docker', 'hugo']
    ];
    relSkillEdges.forEach(function (e) { edges.push({ from: e[0], to: e[1], type: 'rel' }); });

    // Skill <-> Blog (what was actually used in the writing)
    var blogRels = {
        'blog-malware-docker': ['malwareanalysis', 'docker', 'ghidra'],
        'blog-av-evasion': ['redteam', 'cobaltstrike', 'sliver', 'metasploit'],
        'blog-linux-hardening': ['linux', 'sysadm', 'firewall', 'bash'],
        'blog-ad-attacks': ['activedir', 'bloodhound', 'impacket', 'windows'],
        'blog-monitoring': ['linux', 'docker'],
        'blog-api-security': ['burpsuite', 'owasp', 'websec', 'vulnassess', 'sqlmap'],
        'blog-apparmor-rce': ['apparmor', 'linux', 'sysadm', 'websec', 'owasp'],
        'blog-verisign-csrf': ['websec', 'owasp', 'vulnassess', 'burpsuite', 'netsec'],
        'blog-linux-trial': ['linux', 'sysadm', 'bash', 'docker', 'assembly'],
        'blog-captcha-bypass': ['websec', 'owasp', 'burpsuite', 'vulnassess']
    };
    Object.keys(blogRels).forEach(function (bid) {
        blogRels[bid].forEach(function (sid) {
            edges.push({ from: bid, to: sid, type: 'rel' });
        });
    });

    // Skill <-> Project (what powers each engineering project)
    var projectRels = {
        'proj-ticketpro': ['python', 'sql', 'javascript', 'websec', 'owasp'],
        'proj-restaurant': ['sql', 'javascript', 'websec', 'owasp'],
        'proj-cashflow': ['python', 'sql', 'linux', 'websec'],
        'proj-newsbot': ['python', 'docker', 'sql', 'linux'],
        'proj-socialapi': ['python', 'sql', 'websec', 'owasp', 'burpsuite'],
        'proj-cryptobot': ['python', 'docker', 'linux', 'bash']
    };
    Object.keys(projectRels).forEach(function (pid) {
        projectRels[pid].forEach(function (sid) {
            edges.push({ from: pid, to: sid, type: 'rel' });
        });
    });

    // Award / Experience / Course / Certificate <-> related Skill
    awards.forEach(function (aw) { (aw.relatedSkills || []).forEach(function (s) { edges.push({ from: aw.id, to: s, type: 'rel' }); }); });
    experience.forEach(function (ex) { (ex.relatedSkills || []).forEach(function (s) { edges.push({ from: ex.id, to: s, type: 'rel' }); }); });
    courses.forEach(function (c) { (c.relatedSkills || []).forEach(function (s) { edges.push({ from: c.id, to: s, type: 'rel' }); }); });
    certificates.forEach(function (c) { (c.relatedSkills || []).forEach(function (s) { edges.push({ from: c.id, to: s, type: 'rel' }); }); });

    // Direct evidence-chain edges (so hover lights the narrative path)
    // Web Security → OWASP/Auth → Verisign CSRF blog → Verisign award (disclosure + $1k)
    // plus cross-links that make the chain glow even without sharing a skill
    var chainEdges = [
        ['websec', 'blog-verisign-csrf'],
        ['owasp', 'blog-verisign-csrf'],
        ['blog-verisign-csrf', 'award-verisign'],
        ['vulnassess', 'blog-verisign-csrf'],
        ['award-verisign', 'exp-bastion'],
        // AppArmor killswitch chain
        ['apparmor', 'blog-apparmor-rce'],
        ['linux', 'blog-apparmor-rce'],
        ['blog-apparmor-rce', 'proj-cashflow'],
        // Linux trial chain
        ['linux', 'blog-linux-trial'],
        ['docker', 'blog-linux-trial'],
        // Captcha / API chain
        ['websec', 'blog-captcha-bypass'],
        ['blog-captcha-bypass', 'proj-ticketpro'],
        ['blog-api-security', 'proj-socialapi'],
        ['blog-api-security', 'proj-restaurant'],
        // Project ↔ Writing bridges
        ['proj-newsbot', 'blog-monitoring'],
        ['proj-ticketpro', 'blog-api-security']
    ];
    chainEdges.forEach(function (e) { edges.push({ from: e[0], to: e[1], type: 'rel' }); });

    // ---- Collect all nodes ----
    var allNodes = [meNode].concat(categories, subgroups, skills, awards, experience, education, courses, certificates, blogs, [blogMore], projects);

    // Assign coarse group + layout cluster to each node
    allNodes.forEach(function (n) {
        n.group = GROUP_MAP[n.cat] || 'security';
        if (n.type === 'category' || n.type === 'subgroup') {
            n.cluster = n.id;
        } else {
            n.cluster = n.parent || 'me';
        }
    });

    return {
        nodes: allNodes,
        edges: edges,
        CAT_COLORS: CAT_COLORS,
        GROUP_COLORS: GROUP_COLORS,
        GROUP_MAP: GROUP_MAP,
    };

})();
