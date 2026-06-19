/* ============================================================
   PORTFOLIO CONSTELLATION — Data Model (Infosec Edition)
   All nodes (me, skills, awards, experience, education,
   courses, certificates) and their connections.
   ============================================================ */

var PORTFOLIO_DATA = (function () {
    'use strict';

    // ---- Category color palette (light / dark) ----
    var CAT_COLORS = {
        me:          { light: '#1a1a1a', dark: '#ffffff' },
        pentesting:  { light: '#e74c3c', dark: '#ff6b6b' },
        networking:  { light: '#2e86de', dark: '#54a0ff' },
        sysadmin:    { light: '#8854d0', dark: '#a55eea' },
        tools:       { light: '#00b894', dark: '#55efc4' },
        scripting:   { light: '#e06c2e', dark: '#f0863f' },
        concepts:    { light: '#20bf6b', dark: '#26de81' },
        award:       { light: '#d4a017', dark: '#f9ca24' },
        experience:  { light: '#f39c12', dark: '#fdcb6e' },
        education:   { light: '#0984e3', dark: '#74b9ff' },
        course:      { light: '#636e72', dark: '#b2bec3' },
        certificate: { light: '#6c5ce7', dark: '#a29bfe' },
        blog:        { light: '#00cec9', dark: '#81ecec' },
    };

    // ============================================================
    //  NODES
    // ============================================================

    // ---- Central node ----
    var meNode = {
        id: 'me', type: 'me', name: 'Mahmoud', cat: 'me',
        subtitle: 'Penetration Tester & System Admin',
        image: '/images/5864118673042246735.jpg',
        icon: '',
        content: "Experienced Penetration Tester and System Administrator specializing in web, mobile, and network security assessments, along with enterprise infrastructure management. Proven track record of identifying critical vulnerabilities for leading organizations.",
        links: {
            github: 'https://github.com/mahmoud0x01',
            linkedin: 'https://www.linkedin.com/in/mahmoudadelOx01/',
            email: 'mailto:contact@mahmoudouf.com',
        },
    };

    // ---- Skills ----
    var skills = [
        // Pentesting
        { id: 'redteam',    name: 'Red Team',              icon: 'fas fa-crosshairs',      cat: 'pentesting' },
        { id: 'privesc',    name: 'Privilege Escalation',   icon: 'fas fa-arrow-up',        cat: 'pentesting' },
        { id: 'exploitdev', name: 'Exploit Development',    icon: 'fas fa-bug',             cat: 'pentesting' },
        { id: 'vulnassess', name: 'Vuln Assessment',        icon: 'fas fa-magnifying-glass', cat: 'pentesting' },

        // Networking
        { id: 'tcpip',      name: 'TCP/IP',                icon: 'fas fa-network-wired',   cat: 'networking' },
        { id: 'netsec',     name: 'Network Security',      icon: 'fas fa-shield-halved',   cat: 'networking' },

        // Sysadmin
        { id: 'windows',    name: 'Windows',               icon: 'fab fa-windows',         cat: 'sysadmin' },
        { id: 'linux',      name: 'Linux',                 icon: 'fab fa-linux',           cat: 'sysadmin' },
        { id: 'activedir',  name: 'Active Directory',      icon: 'fas fa-sitemap',         cat: 'sysadmin' },
        { id: 'sysadm',     name: 'System Administration', icon: 'fas fa-server',          cat: 'sysadmin' },

        // Tools
        { id: 'burpsuite',  name: 'Burp Suite',            icon: 'fas fa-spider',          cat: 'tools' },
        { id: 'metasploit', name: 'Metasploit',            icon: 'fas fa-skull-crossbones', cat: 'tools' },
        { id: 'cobaltstrike', name: 'Cobalt Strike',       icon: 'fas fa-bullseye',        cat: 'tools' },
        { id: 'sliver',     name: 'Sliver',                icon: 'fas fa-ghost',           cat: 'tools' },
        { id: 'ghidra',     name: 'Ghidra',                icon: 'fas fa-microchip',       cat: 'tools' },
        { id: 'nmap',       name: 'Nmap',                  icon: 'fas fa-radar',           cat: 'tools' },
        { id: 'wireshark',  name: 'Wireshark',             icon: 'fas fa-fish',            cat: 'tools' },
        { id: 'bloodhound', name: 'BloodHound',            icon: 'fas fa-dog',             cat: 'tools' },
        { id: 'impacket',   name: 'Impacket',              icon: 'fas fa-terminal',        cat: 'tools' },
        { id: 'sqlmap',     name: 'SQLMap',                icon: 'fas fa-database',        cat: 'tools' },
        { id: 'nuclei',     name: 'Nuclei',                icon: 'fas fa-atom',            cat: 'tools' },
        { id: 'ffuf',       name: 'ffuf',                  icon: 'fas fa-bolt',            cat: 'tools' },

        // Scripting
        { id: 'python',     name: 'Python',                icon: 'fab fa-python',          cat: 'scripting' },
        { id: 'bash',       name: 'Bash',                  icon: 'fas fa-terminal',        cat: 'scripting' },
        { id: 'javascript', name: 'JavaScript',            icon: 'fab fa-js',              cat: 'scripting' },
        { id: 'cplusplus',  name: 'C/C++',                 icon: 'custom-cc',              cat: 'scripting' },
        { id: 'assembly',   name: 'Assembly',              icon: 'fas fa-microchip',       cat: 'scripting' },
        { id: 'sql',        name: 'SQL',                   icon: 'fas fa-table',           cat: 'scripting' },

        // Concepts
        { id: 'owasp',      name: 'OWASP',                icon: 'fas fa-shield-halved',   cat: 'concepts' },
        { id: 'mitreattack', name: 'MITRE ATT&CK',        icon: 'fas fa-chess-rook',      cat: 'concepts' },
        { id: 'malwareanalysis', name: 'Malware Analysis', icon: 'fas fa-virus',           cat: 'concepts' },
        { id: 'threatintel', name: 'Threat Intelligence',  icon: 'fas fa-eye',             cat: 'concepts' },

        // Additional tools / networking
        { id: 'docker',     name: 'Docker',                icon: 'fab fa-docker',          cat: 'tools' },
        { id: 'git',        name: 'Git',                   icon: 'fab fa-git-alt',         cat: 'tools' },
        { id: 'kerberos',   name: 'Kerberos',              icon: 'fas fa-key',             cat: 'networking' },
        { id: 'websec',     name: 'Web Security',          icon: 'fas fa-globe',           cat: 'pentesting' },
        { id: 'firewall',   name: 'Firewall',              icon: 'fas fa-fire',            cat: 'networking' },
    ].map(function (s) { s.type = 'skill'; return s; });

    // ---- Awards (Bug Bounties) ----
    var awards = [
        {
            id: 'award-ctf', type: 'award', cat: 'award',
            name: 'CTF Top-5', icon: 'fas fa-trophy',
            subtitle: 'Bastion Inc, Moscow',
            date: 'August 2024',
            content: 'Ranked in top 5 out of all participants in penetration testing & privilege escalation challenges at Bastion Inc.',
            relatedSkills: ['redteam', 'privesc', 'exploitdev', 'linux'],
        },
        {
            id: 'award-digitalocean', type: 'award', cat: 'award',
            name: 'DigitalOcean HoF', icon: 'fas fa-medal',
            subtitle: 'Bug Bounty Hall of Fame',
            date: 'April 2019',
            content: 'Responsible disclosure of a critical vulnerability via DigitalOcean bug bounty program.',
            relatedSkills: ['vulnassess', 'burpsuite', 'netsec'],
        },
        {
            id: 'award-pinterest', type: 'award', cat: 'award',
            name: 'Pinterest HoF', icon: 'fas fa-medal',
            subtitle: 'Bug Bounty Hall of Fame',
            date: 'June 2018',
            content: 'Recognized for responsible disclosure of a validated security vulnerability at Pinterest.',
            relatedSkills: ['vulnassess', 'burpsuite', 'owasp'],
        },
        {
            id: 'award-verisign', type: 'award', cat: 'award',
            name: 'Verisign HoF', icon: 'fas fa-medal',
            subtitle: 'Bug Bounty Hall of Fame',
            date: 'April 2018',
            content: 'Recognized for responsible vulnerability disclosure at Verisign.',
            relatedSkills: ['vulnassess', 'netsec', 'owasp'],
        },
        {
            id: 'award-dell', type: 'award', cat: 'award',
            name: 'Dell HoF', icon: 'fas fa-medal',
            subtitle: 'Bug Bounty Hall of Fame',
            date: 'April 2018',
            content: 'Validated security finding submitted through Dell official bug bounty program.',
            relatedSkills: ['vulnassess', 'burpsuite'],
        },
    ];

    // ---- Experience ----
    var experience = [
        {
            id: 'exp-tsu', type: 'experience', cat: 'experience',
            name: 'Software Engineer Intern', icon: 'fas fa-laptop-code',
            subtitle: 'Tomsk State University',
            date: 'Feb 2025',
            companyUrl: 'https://www.tsu.ru',
            content: 'Designed and developed software solutions for university research projects. Created technical documentation, architectural diagrams (UML, component, activity). Participated in the full software development lifecycle.',
            relatedSkills: ['python', 'linux'],
        },
        {
            id: 'exp-bastion', type: 'experience', cat: 'experience',
            name: 'Penetration Tester Intern', icon: 'fas fa-shield-halved',
            subtitle: 'Bastion Cybersec Solutions',
            date: 'May 2024 - Sep 2024',
            companyUrl: '',
            content: 'Executed comprehensive security assessments across application and network infrastructure. Achieved Top 5 in internal CTF. Performed web app and network pentesting. Developed technical presentations on security vulnerabilities.',
            relatedSkills: ['redteam', 'privesc', 'burpsuite', 'metasploit', 'linux', 'netsec', 'websec'],
        },
    ];

    // ---- Education ----
    var education = [
        {
            id: 'edu-bse', type: 'education', cat: 'education',
            name: "Bachelor's in SE", icon: 'fas fa-graduation-cap',
            subtitle: 'Tomsk State University',
            date: 'Sep 2022 - Jul 2026',
            schoolUrl: 'https://www.tsu.ru',
            content: "Bachelor of Software Engineering at Tomsk State University.",
        },
    ];

    // ---- Courses ----
    var courses = [
        { id: 'crs-isc2',      name: 'ISC2 Candidate',        icon: 'fas fa-id-badge',       provider: 'ISC2',         date: '2024', relatedSkills: ['netsec', 'owasp'] },
        { id: 'crs-jrpentest',  name: 'Jr Penetration Tester', icon: 'fas fa-crosshairs',     provider: 'TryHackMe',    date: '2024', relatedSkills: ['redteam', 'privesc', 'burpsuite'] },
        { id: 'crs-linuxplus',  name: 'CompTIA Linux+',        icon: 'fab fa-linux',          provider: 'CompTIA',      date: '2024', relatedSkills: ['linux', 'sysadm', 'bash'] },
        { id: 'crs-ibmcti',     name: 'IBM Cyber Threat Intel', icon: 'fas fa-eye',           provider: 'IBM',          date: '2023', relatedSkills: ['mitreattack', 'netsec', 'threatintel'] },
        { id: 'crs-ibmir',      name: 'PenTest, IR & Forensics', icon: 'fas fa-fingerprint',  provider: 'IBM',          date: '2023', relatedSkills: ['redteam', 'vulnassess'] },
        { id: 'crs-sbtja',      name: 'Blue Team Jr Analyst',  icon: 'fas fa-shield-halved',  provider: 'SecurityBlue', date: '2023', relatedSkills: ['netsec', 'wireshark', 'mitreattack'] },
        { id: 'crs-ccna',       name: 'CCNA',                  icon: 'fas fa-network-wired',  provider: 'Cisco',        date: '2023', relatedSkills: ['tcpip', 'netsec', 'firewall'] },
        { id: 'crs-pentestplus', name: 'CompTIA Pentest+',     icon: 'fas fa-bug',            provider: 'CompTIA',      date: '2023', relatedSkills: ['redteam', 'vulnassess', 'privesc'] },
    ].map(function (c) { c.type = 'course'; c.cat = 'course'; return c; });

    // ---- Certificates ----
    var certificates = [
        { id: 'cert-jrpent',  name: 'Jr Pentester (THM)',     icon: 'fas fa-certificate', provider: 'TryHackMe',    date: '2024', content: 'Junior Penetration Tester certification from TryHackMe.' },
        { id: 'cert-ibmcti',  name: 'Cyber Threat Intel',     icon: 'fas fa-certificate', provider: 'IBM',          date: '2023', content: 'IBM certification in Cyber Threat Intelligence.' },
        { id: 'cert-sbtja',   name: 'Blue Team Jr Analyst',   icon: 'fas fa-certificate', provider: 'SecurityBlue', date: '2023', content: 'SecurityBlue Team Junior Analyst certification.' },
    ].map(function (c) { c.type = 'certificate'; c.cat = 'certificate'; return c; });

    // ---- Blog posts (6 most recent) ----
    var blogs = [
        { id: 'blog-malware-docker',  name: 'Malware Analysis with Docker', icon: 'fas fa-virus',         url: '/blogs/secure-malware-analysis-with-docker/' },
        { id: 'blog-av-evasion',      name: 'AV Evasion Techniques',        icon: 'fas fa-mask',          url: '/blogs/modern-av-evasion-techniques/' },
        { id: 'blog-linux-hardening', name: 'Linux Server Hardening',       icon: 'fas fa-server',        url: '/blogs/hardening-linux-servers-production-checklist/' },
        { id: 'blog-ad-attacks',      name: 'AD Attack Paths',              icon: 'fas fa-sitemap',       url: '/blogs/active-directory-attack-paths-red-team/' },
        { id: 'blog-monitoring',      name: 'Prometheus & Grafana Lab',     icon: 'fas fa-chart-line',    url: '/blogs/monitoring-stack-prometheus-grafana-docker/' },
        { id: 'blog-api-security',    name: 'API Security Testing',         icon: 'fas fa-plug',          url: '/blogs/api-security-testing-vulnerabilities/' },
    ].map(function (b) { b.type = 'blog'; b.cat = 'blog'; return b; });

    // Overflow node for remaining 3 posts
    var blogMore = {
        id: 'blog-more', type: 'blog-more', cat: 'blog',
        name: '+3 more', icon: 'fas fa-ellipsis',
        url: '/blogs/',
    };

    // ============================================================
    //  EDGES
    // ============================================================
    var edges = [];

    // Skill ↔ Skill (infosec relationships)
    var skillEdges = [
        ['redteam', 'privesc'],       ['redteam', 'exploitdev'],
        ['redteam', 'vulnassess'],    ['redteam', 'metasploit'],
        ['privesc', 'exploitdev'],    ['privesc', 'linux'],
        ['privesc', 'windows'],       ['vulnassess', 'burpsuite'],
        ['vulnassess', 'nmap'],       ['vulnassess', 'nuclei'],
        ['vulnassess', 'owasp'],      ['exploitdev', 'python'],
        ['exploitdev', 'cplusplus'],   ['exploitdev', 'assembly'],
        ['tcpip', 'netsec'],          ['tcpip', 'wireshark'],
        ['tcpip', 'nmap'],            ['netsec', 'owasp'],
        ['netsec', 'mitreattack'],    ['windows', 'activedir'],
        ['windows', 'sysadm'],        ['linux', 'sysadm'],
        ['linux', 'bash'],            ['activedir', 'bloodhound'],
        ['activedir', 'impacket'],    ['burpsuite', 'sqlmap'],
        ['burpsuite', 'ffuf'],        ['metasploit', 'cobaltstrike'],
        ['metasploit', 'sliver'],     ['cobaltstrike', 'sliver'],
        ['nmap', 'ffuf'],             ['python', 'bash'],
        ['python', 'sql'],            ['ghidra', 'assembly'],
        ['ghidra', 'cplusplus'],      ['owasp', 'mitreattack'],
        ['impacket', 'python'],       ['nuclei', 'ffuf'],
        ['sqlmap', 'sql'],
        ['docker', 'linux'],          ['docker', 'sysadm'],
        ['git', 'python'],            ['git', 'bash'],
        ['kerberos', 'activedir'],    ['kerberos', 'windows'],
        ['websec', 'owasp'],          ['websec', 'burpsuite'],
        ['websec', 'vulnassess'],     ['firewall', 'netsec'],
        ['firewall', 'tcpip'],        ['firewall', 'nmap'],
        ['malwareanalysis', 'ghidra'],['malwareanalysis', 'docker'],
        ['malwareanalysis', 'cplusplus'],
        ['threatintel', 'mitreattack'],['threatintel', 'netsec'],
    ];
    skillEdges.forEach(function (e) {
        edges.push({ from: e[0], to: e[1], type: 'skill-skill' });
    });

    // Award → related skills
    awards.forEach(function (aw) {
        (aw.relatedSkills || []).forEach(function (skillId) {
            edges.push({ from: aw.id, to: skillId, type: 'award-skill' });
        });
    });

    // Experience → related skills
    experience.forEach(function (exp) {
        (exp.relatedSkills || []).forEach(function (skillId) {
            edges.push({ from: exp.id, to: skillId, type: 'experience-skill' });
        });
    });

    // Course → related skills
    courses.forEach(function (crs) {
        (crs.relatedSkills || []).forEach(function (skillId) {
            edges.push({ from: crs.id, to: skillId, type: 'course-skill' });
        });
    });

    // Me → experience + education + blog hub
    ['exp-tsu', 'exp-bastion', 'edu-bse', 'blog-more'].forEach(function (id) {
        edges.push({ from: 'me', to: id, type: 'me-hub' });
    });

    // Blog → blog-more (cluster links)
    blogs.forEach(function (b) {
        edges.push({ from: b.id, to: 'blog-more', type: 'blog-cluster' });
    });

    // ---- Collect all nodes ----
    var allNodes = [meNode].concat(skills, awards, experience, education, courses, certificates, blogs, [blogMore]);

    return {
        nodes: allNodes,
        edges: edges,
        CAT_COLORS: CAT_COLORS,
    };

})();
