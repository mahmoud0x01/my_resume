/* ============================================================
   PORTFOLIO CONSTELLATION — Detail Panel
   Slide-out panel showing node details on click
   ============================================================ */

(function () {
    'use strict';

    // ---- Create panel DOM ----
    var overlay = document.createElement('div');
    overlay.className = 'cpanel-overlay';
    overlay.setAttribute('aria-hidden', 'true');

    var panel = document.createElement('div');
    panel.className = 'cpanel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Detail panel');

    var closeBtn = document.createElement('button');
    closeBtn.className = 'cpanel-close';
    closeBtn.setAttribute('aria-label', 'Close panel');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    panel.appendChild(closeBtn);

    var panelBody = document.createElement('div');
    panelBody.className = 'cpanel-body';
    panel.appendChild(panelBody);

    document.body.appendChild(overlay);
    document.body.appendChild(panel);

    var isOpen = false;

    function closePanel() {
        if (!isOpen) return;
        isOpen = false;
        panel.classList.remove('cpanel--open');
        overlay.classList.remove('cpanel-overlay--open');
        overlay.setAttribute('aria-hidden', 'true');
        var constellation = document.getElementById('portfolio-constellation');
        if (constellation) constellation.classList.remove('constellation--panel-open');
    }

    function openPanel(node, nodeMap, edgeEls, edgeLookup) {
        panelBody.innerHTML = '';
        isOpen = true;

        // Build content based on node type
        var html = '';

        if (node.type === 'me') {
            html += '<div class="cpanel-header cpanel-header--me">';
            html += '<img src="' + node.image + '" alt="' + node.name + '" class="cpanel-avatar">';
            html += '<h2 class="cpanel-title">' + node.name + '</h2>';
            html += '<p class="cpanel-subtitle">' + node.subtitle + '</p>';
            html += '</div>';
            html += '<div class="cpanel-content"><p>' + node.content + '</p></div>';
            html += '<div class="cpanel-links">';
            if (node.links.github) html += '<a href="' + node.links.github + '" target="_blank" class="cpanel-link"><i class="fab fa-github"></i> GitHub</a>';
            if (node.links.linkedin) html += '<a href="' + node.links.linkedin + '" target="_blank" class="cpanel-link"><i class="fab fa-linkedin"></i> LinkedIn</a>';
            if (node.links.email) html += '<a href="' + node.links.email + '" class="cpanel-link"><i class="fas fa-envelope"></i> Email</a>';
            html += '</div>';

        } else if (node.type === 'skill') {
            html += '<div class="cpanel-header">';
            html += '<div class="cpanel-icon-lg" style="color:' + getCatColor(node.cat) + '">';
            if (node.icon === 'custom-dj') html += '<span class="cpanel-custom-icon">Dj</span>';
            else if (node.icon === 'custom-cs') html += '<span class="cpanel-custom-icon">C#</span>';
            else html += '<i class="' + node.icon + '"></i>';
            html += '</div>';
            html += '<h2 class="cpanel-title">' + node.name + '</h2>';
            html += '<span class="cpanel-badge" style="background:' + getCatColor(node.cat) + '">' + node.cat + '</span>';
            html += '</div>';

            // Related awards
            var relatedAwards = findConnected(node.id, edgeEls, edgeLookup, nodeMap, 'award');
            if (relatedAwards.length) {
                html += '<div class="cpanel-section"><h3>Related Awards</h3><ul class="cpanel-project-list">';
                relatedAwards.forEach(function (a) {
                    html += '<li><i class="' + a.icon + '"></i> ' + a.name + ' <small>(' + a.subtitle + ')</small></li>';
                });
                html += '</ul></div>';
            }

            // Related skills
            var relatedSkills = findConnected(node.id, edgeEls, edgeLookup, nodeMap, 'skill');
            if (relatedSkills.length) {
                html += '<div class="cpanel-section"><h3>Related Skills</h3><div class="cpanel-tags">';
                relatedSkills.forEach(function (s) {
                    html += '<span class="cpanel-tag" style="border-color:' + getCatColor(s.cat) + '">' + s.name + '</span>';
                });
                html += '</div></div>';
            }

        } else if (node.type === 'project') {
            html += '<div class="cpanel-header">';
            if (node.image) html += '<img src="' + node.image + '" alt="' + node.name + '" class="cpanel-project-img">';
            html += '<h2 class="cpanel-title">' + node.name + '</h2>';
            html += '<p class="cpanel-subtitle">' + (node.subtitle || '') + '</p>';
            html += '</div>';
            html += '<div class="cpanel-content"><p>' + node.content + '</p></div>';

            // Tech badges
            if (node.badges && node.badges.length) {
                html += '<div class="cpanel-section"><h3>Technologies</h3><div class="cpanel-tags">';
                node.badges.forEach(function (b) { html += '<span class="cpanel-tag">' + b + '</span>'; });
                html += '</div></div>';
            }

            // Links
            html += '<div class="cpanel-links">';
            if (node.url) html += '<a href="' + node.url + '" class="cpanel-link cpanel-link--primary"><i class="fas fa-arrow-right"></i> View Project</a>';
            if (node.github) html += '<a href="' + node.github + '" target="_blank" class="cpanel-link"><i class="fab fa-github"></i> Source Code</a>';
            html += '</div>';

        } else if (node.type === 'experience') {
            html += '<div class="cpanel-header">';
            html += '<div class="cpanel-icon-lg" style="color:' + getCatColor(node.cat) + '"><i class="' + node.icon + '"></i></div>';
            html += '<h2 class="cpanel-title">' + node.name + '</h2>';
            html += '<p class="cpanel-subtitle">' + node.subtitle + '</p>';
            html += '<span class="cpanel-date"><i class="fas fa-calendar"></i> ' + node.date + '</span>';
            html += '</div>';
            html += '<div class="cpanel-content"><p>' + node.content + '</p></div>';

            if (node.companyUrl) {
                html += '<div class="cpanel-links"><a href="' + node.companyUrl + '" target="_blank" class="cpanel-link"><i class="fas fa-building"></i> Company Website</a></div>';
            }

        } else if (node.type === 'education') {
            html += '<div class="cpanel-header">';
            html += '<div class="cpanel-icon-lg" style="color:' + getCatColor(node.cat) + '"><i class="' + node.icon + '"></i></div>';
            html += '<h2 class="cpanel-title">' + node.name + '</h2>';
            html += '<p class="cpanel-subtitle">' + node.subtitle + '</p>';
            html += '<span class="cpanel-date"><i class="fas fa-calendar"></i> ' + node.date + '</span>';
            html += '</div>';
            html += '<div class="cpanel-content"><p>' + node.content + '</p></div>';

        } else if (node.type === 'course') {
            html += '<div class="cpanel-header">';
            html += '<div class="cpanel-icon-lg" style="color:' + getCatColor(node.cat) + '"><i class="' + node.icon + '"></i></div>';
            html += '<h2 class="cpanel-title">' + node.name + '</h2>';
            html += '<p class="cpanel-subtitle">' + node.provider + '</p>';
            html += '<span class="cpanel-date"><i class="fas fa-calendar"></i> ' + node.date + '</span>';
            html += '</div>';

            // Related skills
            var crsSkills = findConnected(node.id, edgeEls, edgeLookup, nodeMap, 'skill');
            if (crsSkills.length) {
                html += '<div class="cpanel-section"><h3>Skills Covered</h3><div class="cpanel-tags">';
                crsSkills.forEach(function (s) {
                    html += '<span class="cpanel-tag" style="border-color:' + getCatColor(s.cat) + '">' + s.name + '</span>';
                });
                html += '</div></div>';
            }

        } else if (node.type === 'certificate') {
            html += '<div class="cpanel-header">';
            html += '<div class="cpanel-icon-lg" style="color:' + getCatColor(node.cat) + '"><i class="' + node.icon + '"></i></div>';
            html += '<h2 class="cpanel-title">' + node.name + '</h2>';
            html += '<p class="cpanel-subtitle">' + node.provider + '</p>';
            html += '<span class="cpanel-date"><i class="fas fa-calendar"></i> ' + node.date + '</span>';
            html += '</div>';
            if (node.content) html += '<div class="cpanel-content"><p>' + node.content + '</p></div>';

        } else if (node.type === 'award') {
            html += '<div class="cpanel-header">';
            html += '<div class="cpanel-icon-lg" style="color:' + getCatColor(node.cat) + '"><i class="' + node.icon + '"></i></div>';
            html += '<h2 class="cpanel-title">' + node.name + '</h2>';
            html += '<p class="cpanel-subtitle">' + (node.subtitle || '') + '</p>';
            html += '<span class="cpanel-date"><i class="fas fa-calendar"></i> ' + node.date + '</span>';
            html += '</div>';
            if (node.content) html += '<div class="cpanel-content"><p>' + node.content + '</p></div>';

            // Related skills
            var awSkills = findConnected(node.id, edgeEls, edgeLookup, nodeMap, 'skill');
            if (awSkills.length) {
                html += '<div class="cpanel-section"><h3>Related Skills</h3><div class="cpanel-tags">';
                awSkills.forEach(function (s) {
                    html += '<span class="cpanel-tag" style="border-color:' + getCatColor(s.cat) + '">' + s.name + '</span>';
                });
                html += '</div></div>';
            }
        }

        panelBody.innerHTML = html;

        panel.classList.add('cpanel--open');
        overlay.classList.add('cpanel-overlay--open');
        overlay.setAttribute('aria-hidden', 'false');
        var constellation = document.getElementById('portfolio-constellation');
        if (constellation) constellation.classList.add('constellation--panel-open');
    }

    // ---- Helpers ----
    function getCatColor(cat) {
        var c = PORTFOLIO_DATA.CAT_COLORS[cat] || PORTFOLIO_DATA.CAT_COLORS.concepts;
        var dark = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');
        return dark ? c.dark : c.light;
    }

    function findConnected(nodeId, edgeEls, edgeLookup, nodeMap, filterType) {
        var ids = {};
        (edgeLookup[nodeId] || []).forEach(function (idx) {
            var e = edgeEls[idx];
            var otherId = e.from === nodeId ? e.to : e.from;
            if (nodeMap[otherId] && nodeMap[otherId].type === filterType) {
                ids[otherId] = nodeMap[otherId];
            }
        });
        return Object.keys(ids).map(function (k) { return ids[k]; });
    }

    // ---- Close events ----
    closeBtn.addEventListener('click', closePanel);
    overlay.addEventListener('click', closePanel);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closePanel();
    });

    // ---- Expose globally for portfolio-graph.js ----
    window.openConstellationPanel = openPanel;

})();
