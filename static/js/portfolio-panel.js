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
    panel.id = 'portfolio-detail-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-label', 'Detail panel');
    panel.setAttribute('aria-hidden', 'true');
    panel.setAttribute('tabindex', '-1');
    panel.setAttribute('inert', '');
    panel.inert = true;
    panel.hidden = true;

    var closeBtn = document.createElement('button');
    closeBtn.className = 'cpanel-close';
    closeBtn.setAttribute('type', 'button');
    closeBtn.setAttribute('aria-label', 'Close panel');
    closeBtn.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';
    panel.appendChild(closeBtn);

    var panelBody = document.createElement('div');
    panelBody.className = 'cpanel-body';
    panel.appendChild(panelBody);

    document.body.appendChild(overlay);
    document.body.appendChild(panel);

    var panelIconObserver = new MutationObserver(function () {
        markDecorativeIcons(panel);
    });
    panelIconObserver.observe(panel, { childList: true, subtree: true });

    var isOpen = false;
    var previouslyFocused = null;

    // Graph context, refreshed on every open so in-panel navigation works
    var ctx = { nodeMap: {}, edgeEls: [], edgeLookup: {} };

    function isConnected(el) {
        return !!(el && (el.isConnected || document.documentElement.contains(el)));
    }

    function markDecorativeIcons(root) {
        if (!root) return;
        Array.prototype.forEach.call(root.querySelectorAll('i, svg'), function (icon) {
            icon.setAttribute('aria-hidden', 'true');
            if (icon.tagName && icon.tagName.toLowerCase() === 'svg') {
                icon.setAttribute('focusable', 'false');
            }
        });
    }

    function panelFocusableElements() {
        var selector = 'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), ' +
            'select:not([disabled]), textarea:not([disabled]), iframe, object, embed, ' +
            '[contenteditable], [tabindex]:not([tabindex="-1"])';
        return Array.prototype.filter.call(panel.querySelectorAll(selector), function (el) {
            return !el.hidden && el.getAttribute('aria-hidden') !== 'true' && !el.closest('[inert]');
        });
    }

    function closePanel() {
        if (!isOpen) return;
        isOpen = false;
        panel.classList.remove('cpanel--open');
        overlay.classList.remove('cpanel-overlay--open');
        overlay.setAttribute('aria-hidden', 'true');
        panel.setAttribute('aria-hidden', 'true');
        panel.setAttribute('inert', '');
        panel.inert = true;
        panel.hidden = true;
        var constellation = document.getElementById('portfolio-constellation');
        if (constellation) constellation.classList.remove('constellation--panel-open');

        var restoreFocus = previouslyFocused;
        previouslyFocused = null;
        if (isConnected(restoreFocus) && typeof restoreFocus.focus === 'function') {
            restoreFocus.focus();
        }
    }

    function openPanel(node, nodeMap, edgeEls, edgeLookup) {
        if (!node) return;
        if (nodeMap) ctx = { nodeMap: nodeMap, edgeEls: edgeEls, edgeLookup: edgeLookup };
        if (!isOpen) previouslyFocused = document.activeElement;

        panelBody.innerHTML = '';

        // Build content based on node type
        var html = '';

        if (node.type === 'me') {
            html += '<div class="cpanel-header cpanel-header--me">';
            html += '<img src="' + node.image + '" alt="' + esc(node.name) + '" class="cpanel-avatar">';
            html += '<h2 class="cpanel-title">' + esc(node.name) + '</h2>';
            html += '<p class="cpanel-subtitle">' + esc(node.subtitle) + '</p>';
            html += '</div>';
            html += '<div class="cpanel-content"><p>' + esc(node.content) + '</p></div>';
            html += '<div class="cpanel-links">';
            if (node.links.github) html += '<a href="' + node.links.github + '" target="_blank" rel="noopener noreferrer" class="cpanel-link"><i class="fab fa-github"></i> GitHub</a>';
            if (node.links.linkedin) html += '<a href="' + node.links.linkedin + '" target="_blank" rel="noopener noreferrer" class="cpanel-link"><i class="fab fa-linkedin"></i> LinkedIn</a>';
            if (node.links.email) html += '<a href="' + node.links.email + '" class="cpanel-link"><i class="fas fa-envelope"></i> Email</a>';
            html += '</div>';

        } else if (node.type === 'skill') {
            html += '<div class="cpanel-header">';
            html += '<div class="cpanel-icon-lg" style="color:' + getCatColor(node.cat) + '">';
            if (node.icon === 'custom-dj') html += '<span class="cpanel-custom-icon">Dj</span>';
            else if (node.icon === 'custom-cs') html += '<span class="cpanel-custom-icon">C#</span>';
            else html += '<i class="' + node.icon + '"></i>';
            html += '</div>';
            html += '<h2 class="cpanel-title">' + esc(node.name) + '</h2>';
            html += '<span class="cpanel-badge" style="background:' + getCatColor(node.cat) + '">' + esc(node.cat) + '</span>';
            html += '</div>';

            html += blogSection(node.id, 'Related Writing');
            html += navSection(node.id, 'experience', 'Applied In');
            html += navSection(node.id, ['course', 'certificate'], 'Courses & Certifications');
            html += navSection(node.id, 'award', 'Related Awards');
            html += tagSection(node.id, 'skill', 'Related Skills');

        } else if (node.type === 'project') {
            html += '<div class="cpanel-header">';
            if (node.image) html += '<img src="' + node.image + '" alt="' + esc(node.name) + '" class="cpanel-project-img">';
            html += '<h2 class="cpanel-title">' + esc(node.name) + '</h2>';
            html += '<p class="cpanel-subtitle">' + esc(node.subtitle || '') + '</p>';
            html += '</div>';
            html += '<div class="cpanel-content"><p>' + esc(node.content) + '</p></div>';

            // Tech badges
            if (node.badges && node.badges.length) {
                html += '<div class="cpanel-section"><h3>Technologies</h3><div class="cpanel-tags">';
                node.badges.forEach(function (b) { html += '<span class="cpanel-tag">' + esc(b) + '</span>'; });
                html += '</div></div>';
            }

            html += blogSection(node.id, 'Related Writing');

            // Links
            html += '<div class="cpanel-links">';
            if (node.url) html += '<a href="' + node.url + '" class="cpanel-link cpanel-link--primary"><i class="fas fa-arrow-right"></i> View Project</a>';
            if (node.github) html += '<a href="' + node.github + '" target="_blank" rel="noopener noreferrer" class="cpanel-link"><i class="fab fa-github"></i> Source Code</a>';
            html += '</div>';

        } else if (node.type === 'blog') {
            html += '<div class="cpanel-header">';
            html += '<div class="cpanel-icon-lg" style="color:' + getCatColor(node.cat) + '"><i class="' + node.icon + '"></i></div>';
            html += '<h2 class="cpanel-title">' + esc(node.name) + '</h2>';
            html += '<span class="cpanel-badge" style="background:' + getCatColor(node.cat) + '">Article</span>';
            html += '</div>';
            if (node.content) html += '<div class="cpanel-content"><p>' + esc(node.content) + '</p></div>';

            html += tagSection(node.id, 'skill', 'Topics Covered');

            html += '<div class="cpanel-links">';
            html += '<a href="#writing" data-blog-jump class="cpanel-link cpanel-link--primary"><i class="fas fa-book-open"></i> Read Article</a>';
            html += '<a href="/blogs/" class="cpanel-link"><i class="fas fa-list"></i> All Posts</a>';
            html += '</div>';

        } else if (node.type === 'blog-more') {
            html += '<div class="cpanel-header">';
            html += '<div class="cpanel-icon-lg" style="color:' + getCatColor(node.cat) + '"><i class="fas fa-feather-pointed"></i></div>';
            html += '<h2 class="cpanel-title">Writing</h2>';
            html += '<p class="cpanel-subtitle">Notes, walkthroughs and research write-ups.</p>';
            html += '</div>';
            html += linkList('All Articles', allOfType('blog'));
            html += '<div class="cpanel-links"><a href="/blogs/" class="cpanel-link cpanel-link--primary"><i class="fas fa-arrow-right"></i> Browse Blog</a></div>';

        } else if (node.type === 'experience') {
            html += '<div class="cpanel-header">';
            html += '<div class="cpanel-icon-lg" style="color:' + getCatColor(node.cat) + '"><i class="' + node.icon + '"></i></div>';
            html += '<h2 class="cpanel-title">' + esc(node.name) + '</h2>';
            html += '<p class="cpanel-subtitle">' + esc(node.subtitle) + '</p>';
            html += '<span class="cpanel-date"><i class="fas fa-calendar"></i> ' + esc(node.date) + '</span>';
            html += '</div>';
            html += '<div class="cpanel-content"><p>' + esc(node.content) + '</p></div>';

            html += tagSection(node.id, 'skill', 'Skills Used');
            html += blogSection(node.id, 'Related Writing');

            if (node.companyUrl) {
                html += '<div class="cpanel-links"><a href="' + node.companyUrl + '" target="_blank" rel="noopener noreferrer" class="cpanel-link"><i class="fas fa-building"></i> Company Website</a></div>';
            }

        } else if (node.type === 'education') {
            html += '<div class="cpanel-header">';
            html += '<div class="cpanel-icon-lg" style="color:' + getCatColor(node.cat) + '"><i class="' + node.icon + '"></i></div>';
            html += '<h2 class="cpanel-title">' + esc(node.name) + '</h2>';
            html += '<p class="cpanel-subtitle">' + esc(node.subtitle) + '</p>';
            html += '<span class="cpanel-date"><i class="fas fa-calendar"></i> ' + esc(node.date) + '</span>';
            html += '</div>';
            html += '<div class="cpanel-content"><p>' + esc(node.content) + '</p></div>';

        } else if (node.type === 'course') {
            html += '<div class="cpanel-header">';
            html += '<div class="cpanel-icon-lg" style="color:' + getCatColor(node.cat) + '"><i class="' + node.icon + '"></i></div>';
            html += '<h2 class="cpanel-title">' + esc(node.name) + '</h2>';
            html += '<p class="cpanel-subtitle">' + esc(node.provider) + '</p>';
            html += '<span class="cpanel-date"><i class="fas fa-calendar"></i> ' + esc(node.date) + '</span>';
            html += '</div>';

            html += tagSection(node.id, 'skill', 'Skills Covered');
            html += blogSection(node.id, 'Related Writing');

        } else if (node.type === 'certificate') {
            html += '<div class="cpanel-header">';
            html += '<div class="cpanel-icon-lg" style="color:' + getCatColor(node.cat) + '"><i class="' + node.icon + '"></i></div>';
            html += '<h2 class="cpanel-title">' + esc(node.name) + '</h2>';
            html += '<p class="cpanel-subtitle">' + esc(node.provider) + '</p>';
            html += '<span class="cpanel-date"><i class="fas fa-calendar"></i> ' + esc(node.date) + '</span>';
            html += '</div>';
            if (node.content) html += '<div class="cpanel-content"><p>' + esc(node.content) + '</p></div>';

            html += tagSection(node.id, 'skill', 'Skills Covered');

        } else if (node.type === 'award') {
            html += '<div class="cpanel-header">';
            html += '<div class="cpanel-icon-lg" style="color:' + getCatColor(node.cat) + '"><i class="' + node.icon + '"></i></div>';
            html += '<h2 class="cpanel-title">' + esc(node.name) + '</h2>';
            html += '<p class="cpanel-subtitle">' + esc(node.subtitle || '') + '</p>';
            html += '<span class="cpanel-date"><i class="fas fa-calendar"></i> ' + esc(node.date) + '</span>';
            html += '</div>';
            if (node.content) html += '<div class="cpanel-content"><p>' + esc(node.content) + '</p></div>';

            html += tagSection(node.id, 'skill', 'Related Skills');
            html += blogSection(node.id, 'Related Writing');

        } else if (node.type === 'category' || node.type === 'subgroup') {
            html += '<div class="cpanel-header">';
            if (node.icon) html += '<div class="cpanel-icon-lg" style="color:' + getCatColor(node.cat) + '"><i class="' + node.icon + '"></i></div>';
            html += '<h2 class="cpanel-title">' + esc(node.name) + '</h2>';
            html += '<span class="cpanel-badge" style="background:' + getCatColor(node.cat) + '">' + esc(node.group || '') + '</span>';
            html += '</div>';
            if (node.content) html += '<div class="cpanel-content"><p>' + esc(node.content) + '</p></div>';

            html += childrenSection(node.id);
            var hasArticleChildren = childrenOf(node.id).some(function (c) { return c.type === 'blog'; });
            if (!hasArticleChildren) html += blogSection(node.id, 'Related Writing');
        }

        panelBody.innerHTML = html;
        markDecorativeIcons(panel);
        panelBody.scrollTop = 0;
        panel.scrollTop = 0;

        panel.hidden = false;
        panel.removeAttribute('inert');
        panel.inert = false;
        panel.setAttribute('aria-hidden', 'false');
        isOpen = true;
        panel.classList.add('cpanel--open');
        overlay.classList.add('cpanel-overlay--open');
        overlay.setAttribute('aria-hidden', 'false');
        var constellation = document.getElementById('portfolio-constellation');
        if (constellation) constellation.classList.add('constellation--panel-open');
        closeBtn.focus();
    }

    // ============================================================
    //  SECTION BUILDERS
    // ============================================================

    // Clickable list of related blog posts (navigates to the article)
    function blogSection(nodeId, title) {
        var posts = relatedBlogs(nodeId);
        if (!posts.length) return '';
        return linkList(title || 'Related Writing', posts);
    }

    // Direct blog edges first; otherwise blogs that share a skill with this node
    function relatedBlogs(nodeId) {
        var direct = findConnected(nodeId, 'blog');
        if (direct.length) return direct;

        var skillIds = {};
        findConnected(nodeId, 'skill').forEach(function (s) { skillIds[s.id] = true; });
        childrenOf(nodeId).forEach(function (c) {
            if (c.type === 'skill') skillIds[c.id] = true;
            childrenOf(c.id).forEach(function (g) { if (g.type === 'skill') skillIds[g.id] = true; });
        });
        if (!Object.keys(skillIds).length) return [];

        var found = {};
        Object.keys(skillIds).forEach(function (sid) {
            findConnected(sid, 'blog').forEach(function (b) { found[b.id] = b; });
        });
        return Object.keys(found).map(function (k) { return found[k]; });
    }

    // Renders external/article links (anchor -> real page)
    function linkList(title, items) {
        if (!items || !items.length) return '';
        var html = '<div class="cpanel-section"><h3>' + esc(title) + '</h3><ul class="cpanel-project-list">';
        items.forEach(function (n) {
            html += '<li><a href="' + (n.type === 'blog' ? '#writing' : n.url) + '"' + (n.type === 'blog' ? ' data-blog-jump' : '') + '>';
            html += '<i class="' + (n.icon || 'fas fa-file-lines') + '"></i>';
            html += '<span class="cpanel-item-name">' + esc(n.name) + '</span>';
            html += '<i class="fas fa-arrow-right cpanel-item-go"></i>';
            html += '</a></li>';
        });
        html += '</ul></div>';
        return html;
    }

    // Renders related nodes that re-open the panel in place
    function navSection(nodeId, types, title) {
        var list = [];
        (Array.isArray(types) ? types : [types]).forEach(function (t) {
            list = list.concat(findConnected(nodeId, t));
        });
        if (!list.length) return '';
        var html = '<div class="cpanel-section"><h3>' + esc(title) + '</h3><ul class="cpanel-project-list">';
        list.forEach(function (n) {
            html += '<li><a href="#" data-node="' + n.id + '">';
            html += '<i class="' + (n.icon || 'fas fa-circle-nodes') + '"></i>';
            html += '<span class="cpanel-item-name">' + esc(n.name) + '</span>';
            if (n.subtitle || n.provider) {
                html += '<small class="cpanel-item-sub">' + esc(n.subtitle || n.provider) + '</small>';
            }
            html += '</a></li>';
        });
        html += '</ul></div>';
        return html;
    }

    // Renders related nodes as clickable pills
    function tagSection(nodeId, type, title) {
        var list = findConnected(nodeId, type);
        if (!list.length) return '';
        var html = '<div class="cpanel-section"><h3>' + esc(title) + '</h3><div class="cpanel-tags">';
        list.forEach(function (n) {
            html += '<button type="button" class="cpanel-tag cpanel-tag--btn" data-node="' + n.id +
                '" style="border-color:' + getCatColor(n.cat) + '">' + esc(n.name) + '</button>';
        });
        html += '</div></div>';
        return html;
    }

    // For category / subgroup nodes: list what lives underneath
    function childrenSection(nodeId) {
        var kids = childrenOf(nodeId);
        if (!kids.length) return '';

        var articles = kids.filter(function (n) { return n.type === 'blog'; });
        var others = kids.filter(function (n) { return n.type !== 'blog' && n.type !== 'blog-more'; });
        var groups = others.filter(function (n) { return n.type === 'subgroup'; });
        var leaves = others.filter(function (n) { return n.type !== 'subgroup'; });

        var html = '';
        if (groups.length) {
            html += '<div class="cpanel-section"><h3>Areas</h3><ul class="cpanel-project-list">';
            groups.forEach(function (n) {
                html += '<li><a href="#" data-node="' + n.id + '"><i class="fas fa-folder-open"></i>' +
                    '<span class="cpanel-item-name">' + esc(n.name) + '</span>' +
                    '<small class="cpanel-item-sub">' + childrenOf(n.id).length + '</small></a></li>';
            });
            html += '</ul></div>';
        }
        if (leaves.length) {
            html += '<div class="cpanel-section"><h3>Inside</h3><div class="cpanel-tags">';
            leaves.forEach(function (n) {
                html += '<button type="button" class="cpanel-tag cpanel-tag--btn" data-node="' + n.id +
                    '" style="border-color:' + getCatColor(n.cat) + '">' + esc(n.name) + '</button>';
            });
            html += '</div></div>';
        }
        if (articles.length) html += linkList('Articles', articles);
        return html;
    }

    // ============================================================
    //  HELPERS
    // ============================================================
    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function getCatColor(cat) {
        var c = PORTFOLIO_DATA.CAT_COLORS[cat] || PORTFOLIO_DATA.CAT_COLORS.concepts;
        var dark = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');
        return dark ? c.dark : c.light;
    }

    function findConnected(nodeId, filterType) {
        var nodeMap = ctx.nodeMap, edgeEls = ctx.edgeEls, edgeLookup = ctx.edgeLookup;
        if (!nodeMap || !edgeLookup) return [];
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

    function childrenOf(nodeId) {
        return PORTFOLIO_DATA.nodes.filter(function (n) { return n.parent === nodeId; });
    }

    function allOfType(type) {
        return PORTFOLIO_DATA.nodes.filter(function (n) { return n.type === type; });
    }

    // ---- In-panel navigation (related item -> its own panel) ----
    panelBody.addEventListener('click', function (e) {
        var trigger = e.target.closest('[data-node]');
        if (!trigger) return;
        e.preventDefault();
        var target = ctx.nodeMap[trigger.getAttribute('data-node')];
        if (target) openPanel(target);
    });

    // ---- Close events ----
    closeBtn.addEventListener('click', closePanel);
    overlay.addEventListener('click', closePanel);
    panel.addEventListener('keydown', function (e) {
        if (!isOpen) return;
        if (e.key === 'Escape') {
            e.preventDefault();
            closePanel();
            return;
        }
        if (e.key !== 'Tab') return;

        var focusable = panelFocusableElements();
        if (!focusable.length) {
            e.preventDefault();
            panel.focus();
            return;
        }

        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && (document.activeElement === last || document.activeElement === panel)) {
            e.preventDefault();
            first.focus();
        }
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isOpen) closePanel();
    });

    // ---- Expose globally for portfolio-graph.js ----
    window.openConstellationPanel = openPanel;

})();
