/* ============================================================
   PORTFOLIO CONSTELLATION — Layout, Renderer, Interactions
   Full-viewport interactive network graph
   ============================================================ */

(function () {
    'use strict';

    if (typeof PORTFOLIO_DATA === 'undefined') return;

    // ---- Core data + helpers (must be initialized before list view) ----
    var data = PORTFOLIO_DATA;
    var nodes = data.nodes;
    var edges = data.edges;
    var CAT_COLORS = data.CAT_COLORS;
    var GROUP_COLORS = data.GROUP_COLORS;
    var reduceMotion = !!(window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    function isDark() {
        return document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');
    }
    function getCatColor(cat) {
        var c = GROUP_COLORS[cat] || GROUP_COLORS.security;
        return isDark() ? c.dark : c.light;
    }
    function escapeHtml(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function nodeAriaLabel(n) {
        var parts = [n.name || 'Portfolio item', String(n.type || 'item').replace(/-/g, ' ')];
        if (n.subtitle) parts.push(n.subtitle);
        if (n.provider && n.provider !== n.subtitle) parts.push(n.provider);
        if (n.date) parts.push(n.date);
        return parts.join(', ');
    }

    function markDecorativeIcons(root) {
        if (!root) return;
        Array.prototype.forEach.call(root.querySelectorAll('i, svg'), function (icon) {
            icon.setAttribute('aria-hidden', 'true');
            if (icon.tagName && icon.tagName.toLowerCase() === 'svg') {
                icon.setAttribute('focusable', 'false');
            }
        });
        Array.prototype.forEach.call(root.querySelectorAll('.cnode-icon, .cnode-dot'), function (iconWrap) {
            iconWrap.setAttribute('aria-hidden', 'true');
        });
    }

    function openNodePanel(id) {
        var node = nodeMap && nodeMap[id];
        if (!node || typeof window.openConstellationPanel !== 'function') return;
        window.openConstellationPanel(node, nodeMap, edgeEls || [], edgeLookup || {});
    }

    function goToWriting(e) {
        if (e) e.preventDefault();
        var w = document.getElementById('writing');
        if (w) {
            w.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            window.location.href = '/#writing';
        }
    }
    window.goToWriting = goToWriting;

    // Any panel/blog link marked [data-blog-jump] scrolls to the writing
    // section instead of opening the single-post page.
    document.addEventListener('click', function (e) {
        var a = e.target && e.target.closest ? e.target.closest('[data-blog-jump]') : null;
        if (a) {
            e.preventDefault();
            if (typeof window.closeConstellationPanel === 'function') window.closeConstellationPanel();
            goToWriting(e);
        }
    });

    function activateNode(id) {
        var node = nodeMap && nodeMap[id];
        if (!node) return;
        if (node.type === 'blog' && node.url) {
            goToWriting();
            return;
        }
        openNodePanel(id);
    }

    // "A | B | C" or "A · B · C" -> roles with dimmed separators, each kept unbreakable
    function formatRoles(subtitle) {
        return String(subtitle || '').split(/\||·/).map(function (part, i) {
            var role = '<span class="cterm-role">' + escapeHtml(part.trim()) + '</span>';
            return (i ? '<span class="cterm-sep">·</span>' : '') + role;
        }).join(' ');
    }

    // Hero terminal intro: starts empty, types `$ whoami`, then reveals the
    // role output, then drops a fresh prompt. Degrades to final state if the
    // user prefers reduced motion or if anything throws.
    function animateTerminal(term) {
        if (!term) return;
        var cmd = term.querySelector('.cterm-cmd');
        var caretTyping = term.querySelector('.cterm-caret--typing');
        var out = term.querySelector('.cterm-out');
        var nextLine = term.querySelector('.cterm-next');
        if (!cmd || !out) return;

        var cmdText = 'whoami';
        var reduce = window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function showFinal() {
            cmd.textContent = cmdText;
            if (caretTyping) caretTyping.style.display = 'none';
            out.hidden = false;
            out.style.visibility = '';
            Array.prototype.forEach.call(
                out.querySelectorAll('.cterm-role, .cterm-sep'),
                function (p) { p.style.visibility = ''; }
            );
            if (nextLine) nextLine.hidden = false;
        }

        if (reduce) { showFinal(); return; }

        try {
            cmd.textContent = '';
            if (caretTyping) caretTyping.style.display = '';
            out.hidden = true;
            if (nextLine) nextLine.hidden = true;

            var i = 0;
            (function typeCmd() {
                cmd.textContent = cmdText.slice(0, i);
                if (i <= cmdText.length) {
                    i++;
                    window.setTimeout(typeCmd, 70);
                    return;
                }
                if (caretTyping) caretTyping.style.display = 'none';
                out.hidden = false;
                var pieces = Array.prototype.slice.call(
                    out.querySelectorAll('.cterm-role, .cterm-sep')
                );
                pieces.forEach(function (p) { p.style.visibility = 'hidden'; });
                var k = 0;
                (function reveal() {
                    if (k < pieces.length) {
                        pieces[k].style.visibility = '';
                        k++;
                        window.setTimeout(reveal, 180);
                    } else if (nextLine) {
                        nextLine.hidden = false;
                    }
                })();
            })();
        } catch (err) {
            showFinal();
        }
    }

    // ============================================================
    //  LIST VIEW (Escape Hatch)
    // ============================================================
    (function buildListView() {
        var listEl = document.getElementById('portfolio-list-view');
        if (!listEl) return;

        var groups = [
            { key: 'security',       label: 'Security' },
            { key: 'development',    label: 'Development' },
            { key: 'infrastructure', label: 'Infrastructure' },
            { key: 'experience',     label: 'Experience' },
            { key: 'recognition',    label: 'Recognition' },
        ];

        var byGroup = {};
        PORTFOLIO_DATA.nodes.forEach(function (n) {
            if (n.type === 'me' || n.type === 'blog-more' || n.type === 'category' || n.type === 'subgroup') return;
            var g = n.group || 'security';
            if (!byGroup[g]) byGroup[g] = [];
            byGroup[g].push(n);
        });

        var frag = document.createDocumentFragment();
        groups.forEach(function (grp) {
            var items = byGroup[grp.key] || [];
            if (!items.length) return;
            var color = getCatColor(grp.key);

            var block = document.createElement('div');
            block.className = 'plv-block';
            block.style.setProperty('--group-color', color);

            var title = document.createElement('h3');
            title.className = 'plv-title';
            title.textContent = grp.label;
            block.appendChild(title);

            var wrap = document.createElement('div');
            wrap.className = 'plv-items';
            items.forEach(function (n) {
                var item = document.createElement(n.type === 'blog' && n.url ? 'a' : 'button');
                item.className = 'plv-item';
                item.setAttribute('data-node', n.id);
                item.setAttribute('aria-label', nodeAriaLabel(n));
                if (n.type === 'blog' && n.url) {
                    item.setAttribute('href', '#writing');
                    item.addEventListener('click', goToWriting);
                } else {
                    item.setAttribute('type', 'button');
                }
                var name = document.createElement('span');
                name.className = 'plv-name';
                name.textContent = n.name;
                item.appendChild(name);
                if (n.subtitle) {
                    var sub = document.createElement('span');
                    sub.className = 'plv-sub';
                    sub.textContent = n.subtitle;
                    item.appendChild(sub);
                }
                wrap.appendChild(item);
            });
            block.appendChild(wrap);
            frag.appendChild(block);
        });
        listEl.innerHTML = '';
        var listStatus = document.createElement('p');
        listStatus.className = 'plv-status';
        listStatus.id = 'portfolio-list-status';
        listStatus.setAttribute('role', 'status');
        listStatus.setAttribute('aria-live', 'polite');
        listStatus.setAttribute('aria-atomic', 'true');
        listEl.appendChild(listStatus);
        listEl.appendChild(frag);

        listEl.addEventListener('click', function (e) {
            var trigger = e.target.closest('button[data-node]');
            if (!trigger || !listEl.contains(trigger)) return;
            e.preventDefault();
            openNodePanel(trigger.getAttribute('data-node'));
        });
    })();

    // ---- View toggle + mobile default ----
    (function listToggle() {
        var toggleBtn = document.getElementById('graph-list-toggle');
        if (!toggleBtn) return;

        function applyMode(listMode) {
            document.body.classList.toggle('portfolio-list-mode', listMode);
            toggleBtn.textContent = listMode ? 'Switch to Graph View' : 'Switch to List View';
            toggleBtn.setAttribute('aria-pressed', String(!!listMode));
            toggleBtn.setAttribute('aria-label', listMode ? 'Switch to graph view' : 'Switch to list view');
            toggleBtn.setAttribute('aria-controls', 'portfolio-constellation portfolio-list-view');
            var listStatus = document.getElementById('portfolio-list-status');
            if (listStatus) listStatus.textContent = listMode ? 'List view active.' : '';
        }

        toggleBtn.addEventListener('click', function () {
            applyMode(!document.body.classList.contains('portfolio-list-mode'));
        });

        // Mobile (<768px) defaults to list view (graphs are unusable on touch)
        applyMode(window.innerWidth < 992 || document.body.classList.contains('portfolio-list-mode'));
        window.addEventListener('resize', function () {
            if (window.innerWidth < 992 && !document.body.classList.contains('portfolio-list-mode')) {
                applyMode(true);
            }
        });
    })();

    var container = document.getElementById('portfolio-constellation');
    if (!container) return;

    // ---- Layout dimensions (responsive) ----
    var isMobile = window.innerWidth <= 767;
    var LW = isMobile ? 700 : 2600;
    var LH = isMobile ? 1400 : 1400;

    // ---- Seed-based PRNG ----
    var _seed = 42;
    function srand() { _seed = (_seed * 16807) % 2147483647; return (_seed - 1) / 2147483646; }

    // ---- Cluster centers, derived dynamically from the data ----
    // Positions every category on a ring around Me and fans each subgroup
    // around its parent category, so the layout no longer depends on
    // hard-coded category/subgroup ids (works for any dataset).
    function buildClusters(isMobile, nodes) {
        var cats = nodes.filter(function (n) { return n.type === 'category'; });
        var subs = nodes.filter(function (n) { return n.type === 'subgroup'; });
        var N = cats.length || 1;
        var me = { x: 0.50, y: isMobile ? 0.06 : 0.46 };
        var C = { me: me };
        if (isMobile) {
            // Portrait canvas: stack categories down the centre column.
            cats.forEach(function (c, i) {
                C[c.id] = { x: 0.50, y: 0.20 + (N > 1 ? i / (N - 1) : 0) * 0.64 };
            });
            var byP = {};
            subs.forEach(function (s) { (byP[s.parent] = byP[s.parent] || []).push(s); });
            Object.keys(byP).forEach(function (pid) {
                var pc = C[pid] || me, arr = byP[pid], m = arr.length;
                arr.forEach(function (s, k) {
                    var side = (k % 2 === 0) ? -1 : 1;
                    var off = 0.15 + Math.floor(k / 2) * 0.02;
                    C[s.id] = { x: pc.x + side * off, y: pc.y + (k - (m - 1) / 2) * 0.05 };
                });
            });
        } else {
            // Wide canvas: ring of categories around Me (uses horizontal space).
            var rx = 0.42, ry = 0.40;
            cats.forEach(function (c, i) {
                var ang = -Math.PI / 2 + (i / N) * Math.PI * 2;
                C[c.id] = { x: me.x + Math.cos(ang) * rx, y: me.y + Math.sin(ang) * ry };
            });
            var byP2 = {};
            subs.forEach(function (s) { (byP2[s.parent] = byP2[s.parent] || []).push(s); });
            Object.keys(byP2).forEach(function (pid) {
                var pc = C[pid] || me, arr = byP2[pid], m = arr.length;
                arr.forEach(function (s, k) {
                    var ang = -Math.PI / 2 + (k / m) * Math.PI * 2;
                    var r = 0.15;
                    C[s.id] = { x: pc.x + Math.cos(ang) * r, y: pc.y + Math.sin(ang) * r };
                });
            });
        }
        return C;
    }
    var CLUSTERS = buildClusters(isMobile, nodes);
    // ---- Initial positions ----
    var nodeMap = {};

    nodes.forEach(function (n) {
        nodeMap[n.id] = n;
        var cl = CLUSTERS[n.cluster] || CLUSTERS.me;

        if (n.type === 'me') {
            n.x = CLUSTERS.me.x * LW;
            n.y = CLUSTERS.me.y * LH;
        } else {
            // Spread each node around its cluster center; categories sit on the
            // center, subgroups a little out, leaves fan around their subgroup.
            var spread = n.type === 'category' ? 0 : (n.type === 'subgroup' ? 70 : 135);
            var ang = srand() * Math.PI * 2;
            var rad = srand() * spread;
            n.x = cl.x * LW + Math.cos(ang) * rad;
            n.y = cl.y * LH + Math.sin(ang) * rad;
        }
        // Clamp
        n.x = Math.max(90, Math.min(LW - 90, n.x));
        n.y = Math.max(60, Math.min(LH - 60, n.y));
    });

    // ---- Force relaxation ----
    var minDists = isMobile
        ? { me: 160, category: 120, subgroup: 80, skill: 105, award: 100, experience: 100, education: 100, course: 60, certificate: 60, blog: 70, 'blog-more': 90 }
        : { me: 320, category: 240, subgroup: 150, skill: 175, award: 200, experience: 180, education: 180, course: 110, certificate: 110, blog: 120, 'blog-more': 150 };

    // The central node is a tall column (photo + name + console + CTA), so a
    // circular exclusion leaves its corners — where the CTA sits — exposed.
    // We instead keep every other node outside an ellipse sized to the actual
    // rendered node. `meKeepOut` is recomputed once the DOM exists.
    var meKeepOut = computeMeKeepOut();

    function computeMeKeepOut() {
        var estW = isMobile ? 300 : 400;   // terminal width (px)
        var estH = isMobile ? 330 : 380;   // full stack height (px)
        var scale = container && container.clientWidth ? LW / container.clientWidth : 1;
        var rx = (estW / 2 + 46) / scale;
        var ry = (estH / 2 + 46) / scale;
        if (meEl && container && container.clientWidth) {
            var rect = meEl.getBoundingClientRect();
            rx = (rect.width / 2 + 46) / scale;
            ry = (rect.height / 2 + 46) / scale;
        }
        return { rx: rx, ry: ry };
    }

    function applyMeKeepOut(n) {
        if (n.type === 'me') return;
        var cx = CLUSTERS.me.x * LW, cy = CLUSTERS.me.y * LH;
        var dx = n.x - cx, dy = n.y - cy;
        var d = Math.sqrt((dx / meKeepOut.rx) * (dx / meKeepOut.rx) +
                          (dy / meKeepOut.ry) * (dy / meKeepOut.ry));
        if (d < 1) {
            if (d === 0) { dx = (Math.random() - 0.5) || 1; dy = (Math.random() - 0.5) || 1; }
            d = Math.sqrt((dx / meKeepOut.rx) * (dx / meKeepOut.rx) +
                          (dy / meKeepOut.ry) * (dy / meKeepOut.ry)) || 1;
            n.x = cx + meKeepOut.rx * (dx / d);
            n.y = cy + meKeepOut.ry * (dy / d);
        }
    }

    for (var iter = 0; iter < 250; iter++) {
        // Repulsion
        for (var i = 0; i < nodes.length; i++) {
            for (var j = i + 1; j < nodes.length; j++) {
                var a = nodes[i], b = nodes[j];
                var dx = b.x - a.x, dy = b.y - a.y;
                var dist = Math.sqrt(dx * dx + dy * dy) || 1;
                var minD = Math.max(minDists[a.type] || 60, minDists[b.type] || 60);
                if (dist < minD) {
                    var f = (minD - dist) / dist * 0.25;
                    if (a.type === 'me') { b.x += dx * f * 2; b.y += dy * f * 2; }
                    else if (b.type === 'me') { a.x -= dx * f * 2; a.y -= dy * f * 2; }
                    else { a.x -= dx * f; a.y -= dy * f; b.x += dx * f; b.y += dy * f; }
                }
            }
        }
        // Attraction along edges
        edges.forEach(function (e) {
            if (e.type === 'rel') return; // relationships do not affect layout
            var a = nodeMap[e.from], b = nodeMap[e.to];
            if (!a || !b) return;
            var dx = b.x - a.x, dy = b.y - a.y;
            var dist = Math.sqrt(dx * dx + dy * dy) || 1;
            var ideal = isMobile
                ? (e.type === 'me-cat' ? 220 : e.type === 'cat-sub' ? 150 : e.type === 'sub-leaf' ? 90 : 150)
                : (e.type === 'me-cat' ? 360 : e.type === 'cat-sub' ? 240 : e.type === 'sub-leaf' ? 150 : 300);
            if (dist > ideal) {
                var f = (dist - ideal) / dist * 0.03;
                if (a.type !== 'me') { a.x += dx * f; a.y += dy * f; }
                if (b.type !== 'me') { b.x -= dx * f; b.y -= dy * f; }
            }
        });
        // Keep in bounds, keep Me centered
        nodes.forEach(function (n) {
            if (n.type === 'me') {
                n.x = CLUSTERS.me.x * LW;
                n.y = CLUSTERS.me.y * LH;
                return;
            }
            n.x = Math.max(90, Math.min(LW - 90, n.x));
            n.y = Math.max(60, Math.min(LH - 60, n.y));
            applyMeKeepOut(n);
        });
    }

    // ============================================================
    //  BUILD DOM
    // ============================================================
    container.innerHTML = '';
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.maxWidth = LW + 'px';
    container.style.margin = '0 auto';

    // ---- Ambient background canvas (BEHIND the SVG/nodes; stacking owned by CSS) ----
    // Mounted as the FIRST child of .constellation-wrap, ahead of the graph container.
    if (window.GraphBackground && typeof window.GraphBackground.init === 'function') {
        try { window.GraphBackground.init(container.parentElement); } catch (err) { /* non-fatal */ }
    }

    // ---- SVG for edges ----
    var SVG_NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'constellation-svg');
    svg.setAttribute('viewBox', '0 0 ' + LW + ' ' + LH);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    container.appendChild(svg);

    // Quadratic-curve geometry shared by edge creation + per-frame updates:
    // control point offset perpendicular to the chord (~8% of length, bending
    // more on longer spans) for a subtle organic arc instead of hard lines.
    function edgePathD(ax, ay, bx, by) {
        var mx = (ax + bx) / 2, my = (ay + by) / 2;
        var dx = bx - ax, dy = by - ay;
        var len = Math.sqrt(dx * dx + dy * dy) || 1;
        var bendPct = 0.06 + Math.min(len / 3000, 1) * 0.05;
        var cpx = mx + (-dy / len) * len * bendPct;
        var cpy = my + (dx / len) * len * bendPct;
        return 'M' + ax + ' ' + ay + ' Q' + cpx + ' ' + cpy + ' ' + bx + ' ' + by;
    }

    // Draw edges (curved paths; same classes/attrs the engine already tracks)
    var edgeEls = [];
    var edgeLookup = {}; // nodeId -> [edgeIndex]

    edges.forEach(function (e) {
        var a = nodeMap[e.from], b = nodeMap[e.to];
        if (!a || !b) return;

        var edge = document.createElementNS(SVG_NS, 'path');
        edge.setAttribute('d', edgePathD(a.x, a.y, b.x, b.y));
        edge.setAttribute('fill', 'none'); // paths default to black fill — edges must be stroke-only
        edge.setAttribute('class', 'constellation-edge constellation-edge--' + e.type);
        edge.setAttribute('data-from', e.from);
        edge.setAttribute('data-to', e.to);
        // Color each edge by its non-central endpoint's group
        var colorNode = a.type === 'me' ? b : a;
        edge.style.setProperty('--edge-color', getCatColor(colorNode.group));
        svg.appendChild(edge);
        var edgeIdx = edgeEls.push({ el: edge, from: e.from, to: e.to, type: e.type }) - 1;

        // Lookup (index into edgeEls, not into the raw edge list)
        if (!edgeLookup[e.from]) edgeLookup[e.from] = [];
        if (!edgeLookup[e.to]) edgeLookup[e.to] = [];
        edgeLookup[e.from].push(edgeIdx);
        edgeLookup[e.to].push(edgeIdx);
    });

    // ---- Nodes container ----
    var nodesWrap = document.createElement('div');
    nodesWrap.className = 'constellation-nodes';
    container.appendChild(nodesWrap);

    // ---- Build node elements ----
    var nodeEls = {};
    var meEl = null;

    nodes.forEach(function (n) {
        var el = document.createElement('div');
        el.className = 'cnode cnode--' + n.type;
        if (n.type === 'me') meEl = el;
        el.setAttribute('data-id', n.id);
        el.setAttribute('data-type', n.type);
        el.setAttribute('tabindex', n.type === 'me' ? '-1' : '0');
        el.setAttribute('aria-label', nodeAriaLabel(n));
        el.setAttribute('role', n.type === 'me' ? 'group' : (n.type === 'blog' && n.url ? 'link' : 'button'));
        el.style.left = (n.x / LW * 100) + '%';
        el.style.top = (n.y / LH * 100) + '%';
        el.style.setProperty('--node-color', getCatColor(n.group));

        if (n.type === 'me') {
            // Profile photo + name
            var img = document.createElement('img');
            img.src = n.image;
            img.alt = n.name;
            img.className = 'cnode-photo';
            el.appendChild(img);
            var ring = document.createElement('div');
            ring.className = 'cnode-ring';
            el.appendChild(ring);
            var nameLbl = document.createElement('div');
            nameLbl.className = 'cnode-me-name';
            nameLbl.textContent = n.name;
            el.appendChild(nameLbl);
            // Mini console frame: `$ whoami` -> role line
            var term = document.createElement('div');
            term.className = 'cterm cnode-me-subtitle';
            term.setAttribute('role', 'group');
            term.setAttribute('aria-label', 'Interactive terminal — type a command');
            var termTitle = (n.terminalTitle || 'zsh — ~');
            term.innerHTML =
                '<div class="cterm-bar" aria-hidden="true">' +
                    '<span class="cterm-dot cterm-dot--red"></span>' +
                    '<span class="cterm-dot cterm-dot--amber"></span>' +
                    '<span class="cterm-dot cterm-dot--green"></span>' +
                    '<span class="cterm-title">' + escapeHtml(termTitle) + '</span>' +
                '</div>' +
                '<div class="cterm-body">' +
                    '<div class="cterm-line"><span class="cterm-prompt">$</span>' +
                        '<span class="cterm-cmd"></span>' +
                        '<span class="cterm-caret cterm-caret--typing"></span></div>' +
                    '<div class="cterm-out" hidden>' + formatRoles(n.subtitle) + '</div>' +
                    '<div class="cterm-input-line">' +
                        '<span class="cterm-prompt">$</span>' +
                        '<input type="text" class="cterm-input" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="type something…" aria-label="Type a command in the terminal" />' +
                    '</div>' +
                '</div>';
            el.appendChild(term);
            animateTerminal(term);

            /* Single-line interactive prompt inside the me-node terminal.
               Hover opens it (auto-focus) and leaving closes it immediately;
               the existing node hover (float card + spotlight) is untouched. */
            var ctermInput = term.querySelector('.cterm-input');
            if (ctermInput) {
                var ctermInputLine = ctermInput.closest('.cterm-input-line');
                ctermInput.addEventListener('keydown', function (e) {
                    if (e.key !== 'Enter') return;
                    e.preventDefault();
                    var body = term.querySelector('.cterm-body');
                    var echo = document.createElement('div');
                    echo.className = 'cterm-echo';
                    var p = document.createElement('span');
                    p.className = 'cterm-prompt';
                    p.textContent = '$';
                    echo.appendChild(p);
                    echo.appendChild(document.createTextNode(' ' + ctermInput.value));
                    body.insertBefore(echo, ctermInputLine);
                    var resp = document.createElement('div');
                    resp.className = 'cterm-response';
                    resp.textContent = '{ mahmoud : Are you looking for an RCE in my portofolio ? }';
                    body.insertBefore(resp, ctermInputLine);
                    ctermInput.value = '';
                    body.scrollTop = body.scrollHeight;
                });
                term.addEventListener('mouseenter', function () { ctermInput.focus(); });
                term.addEventListener('mouseleave', function () { ctermInput.blur(); });
                term.addEventListener('click', function () { ctermInput.focus(); });
            }

            // Centered CTA beneath the photo
            var cta = document.createElement('button');
            cta.className = 'cnode-cta hire-me-btn';
            cta.setAttribute('type', 'button');
            cta.setAttribute('aria-expanded', 'false');
            cta.textContent = 'Want me in your team ?';
            el.appendChild(cta);

            // Contact popup (toggled by the CTA)
            var popup = document.createElement('div');
            popup.className = 'hire-me-popup';
            popup.setAttribute('aria-hidden', 'true');
            popup.innerHTML =
                '<a href="https://t.me/rdmsr" target="_blank" rel="noopener noreferrer"><i class="fab fa-telegram"></i> Telegram</a>' +
                '<a href="mailto:contact@mahmoudouf.com"><i class="fas fa-envelope"></i> Email</a>' +
                '<a href="https://www.facebook.com/mahmoud0x01/" target="_blank" rel="noopener noreferrer"><i class="fab fa-facebook-f"></i> Facebook</a>' +
                '<a href="https://instagram.com/0xkernel" target="_blank" rel="noopener noreferrer"><i class="fab fa-instagram"></i> Instagram</a>' +
                '<a href="https://twitter.com/0xvdso" target="_blank" rel="noopener noreferrer"><i class="fab fa-x-twitter"></i> Twitter</a>';
            el.appendChild(popup);
        } else if (n.type === 'category') {
            var catIcon = document.createElement('span');
            catIcon.className = 'cnode-icon cnode-icon--category';
            catIcon.innerHTML = '<i class="' + n.icon + '"></i>';
            el.appendChild(catIcon);
            var catName = document.createElement('span');
            catName.className = 'cnode-label';
            catName.textContent = n.name;
            el.appendChild(catName);
        } else if (n.type === 'subgroup') {
            var sgIcon = document.createElement('span');
            sgIcon.className = 'cnode-icon cnode-icon--subgroup';
            sgIcon.innerHTML = '<i class="' + n.icon + '"></i>';
            el.appendChild(sgIcon);
            var sgName = document.createElement('span');
            sgName.className = 'cnode-label cnode-label--sub';
            sgName.textContent = n.name;
            el.appendChild(sgName);
        } else if (n.type === 'skill') {
            // Icon + label pill
            var iconWrap = document.createElement('span');
            iconWrap.className = 'cnode-icon';
            if (n.icon === 'custom-cc') {
                iconWrap.innerHTML = '<span class="cnode-custom-icon">C++</span>';
            } else {
                iconWrap.innerHTML = '<i class="' + n.icon + '"></i>';
            }
            el.appendChild(iconWrap);
            var lbl = document.createElement('span');
            lbl.className = 'cnode-label';
            lbl.textContent = n.name;
            el.appendChild(lbl);
        } else if (n.type === 'award') {
            // Gold award pill with icon
            var awIcon = document.createElement('span');
            awIcon.className = 'cnode-icon cnode-icon--award';
            awIcon.innerHTML = '<i class="' + n.icon + '"></i>';
            el.appendChild(awIcon);
            var awName = document.createElement('span');
            awName.className = 'cnode-label';
            awName.textContent = n.name;
            el.appendChild(awName);
        } else if (n.type === 'experience') {
            var eIcon = document.createElement('span');
            eIcon.className = 'cnode-icon';
            eIcon.innerHTML = '<i class="' + n.icon + '"></i>';
            el.appendChild(eIcon);
            var eName = document.createElement('span');
            eName.className = 'cnode-label';
            eName.textContent = n.name;
            el.appendChild(eName);
        } else if (n.type === 'education') {
            var edIcon = document.createElement('span');
            edIcon.className = 'cnode-icon';
            edIcon.innerHTML = '<i class="' + n.icon + '"></i>';
            el.appendChild(edIcon);
            var edName = document.createElement('span');
            edName.className = 'cnode-label';
            edName.textContent = n.name;
            el.appendChild(edName);
        } else if (n.type === 'blog') {
            // Teal pill linking to the blog post
            var bIcon = document.createElement('span');
            bIcon.className = 'cnode-icon cnode-icon--blog';
            bIcon.innerHTML = '<i class="' + n.icon + '"></i>';
            el.appendChild(bIcon);
            var bName = document.createElement('span');
            bName.className = 'cnode-label';
            bName.textContent = n.name;
            el.appendChild(bName);
            el.style.cursor = 'pointer';
            el.addEventListener('click', (function (url) {
                return function (e) { e.stopImmediatePropagation(); goToWriting(e); };
            })(n.url));
        } else if (n.type === 'blog-more') {
            // Counter badge — opens the panel with the full article index
            var bmDot = document.createElement('span');
            bmDot.className = 'cnode-blog-more-badge';
            bmDot.innerHTML = '<i class="' + (n.icon || 'fas fa-ellipsis') + '"></i>' + escapeHtml(n.name);
            el.appendChild(bmDot);
            var bmLbl = document.createElement('span');
            bmLbl.className = 'cnode-hover-label';
            bmLbl.textContent = 'View all posts';
            el.appendChild(bmLbl);
            el.style.cursor = 'pointer';
        } else if (n.type === 'course' || n.type === 'certificate') {
            // Small dot with hover label
            var cDot = document.createElement('span');
            cDot.className = 'cnode-dot';
            cDot.innerHTML = '<i class="' + n.icon + '"></i>';
            el.appendChild(cDot);
            var cLbl = document.createElement('span');
            cLbl.className = 'cnode-hover-label';
            cLbl.textContent = n.name;
            el.appendChild(cLbl);
        }

        markDecorativeIcons(el);
        nodesWrap.appendChild(el);
        nodeEls[n.id] = el;
    });

    // Font Awesome may replace <i> elements asynchronously. Keep any
    // resulting SVGs decorative so the node's accessible label remains the
    // single source of its name and type.
    var nodeIconObserver = new MutationObserver(function () {
        markDecorativeIcons(nodesWrap);
    });
    nodeIconObserver.observe(nodesWrap, { childList: true, subtree: true });

    // ============================================================
    //  HOVER INTERACTIONS
    // ============================================================
    var activeHover = null;
    var hoveredNode = null;
    var focusedNode = null;

    // Walk up the tree from a node to the root (me), collecting the
    // ancestor path: element -> subcategory -> category -> me
    function getPath(id) {
        var pathNodes = {};
        var pathEdges = {};
        var cur = id;
        while (cur && nodeMap[cur]) {
            pathNodes[cur] = true;
            var parent = nodeMap[cur].parent;
            if (parent && nodeMap[parent]) {
                (edgeLookup[cur] || []).forEach(function (idx) {
                    var e = edgeEls[idx];
                    var other = e.from === cur ? e.to : e.from;
                    if (other === parent) pathEdges[idx] = true;
                });
                cur = parent;
            } else {
                break;
            }
        }
        return { nodes: pathNodes, edges: pathEdges };
    }

    function highlightNode(id) {
        if (activeHover === id) return;
        activeHover = id;

        var pathNodes = {};
        var pathEdges = {};
        if (id) {
            if (id === 'me') {
                // Center: light the hub + all main topics
                pathNodes['me'] = true;
                (edgeLookup['me'] || []).forEach(function (idx) {
                    pathEdges[idx] = true;
                    var e = edgeEls[idx];
                    var other = e.from === 'me' ? e.to : e.from;
                    pathNodes[other] = true;
                });
            } else {
                var p = getPath(id);
                pathNodes = p.nodes;
                pathEdges = p.edges;
            }
            // Also light the node's direct relationships (related items shine)
            (edgeLookup[id] || []).forEach(function (idx) {
                pathEdges[idx] = true;
                var e = edgeEls[idx];
                var other = e.from === id ? e.to : e.from;
                pathNodes[other] = true;
            });
        }

        // Dim nodes not on the path (+ contract classes for the glass reskin)
        nodes.forEach(function (n) {
            var el = nodeEls[n.id];
            el.classList.remove('cnode--active', 'cnode--dimmed');
            if (id && !pathNodes[n.id]) el.classList.add('cnode--dimmed');
            el.classList.toggle('is-hover', !!id && id === n.id);
            el.classList.toggle('is-dim', !!id && !pathNodes[n.id]);
        });

        // Dim edges not on the path
        edgeEls.forEach(function (e, idx) {
            e.el.classList.remove('constellation-edge--active', 'constellation-edge--dimmed');
            if (id && !pathEdges[idx]) e.el.classList.add('constellation-edge--dimmed');
            e.el.classList.toggle('is-lit', !!id && !!pathEdges[idx]);
        });

        if (!id) return;

        // Light the path nodes + edges
        Object.keys(pathNodes).forEach(function (cid) {
            if (nodeEls[cid]) nodeEls[cid].classList.add('cnode--active');
        });
        Object.keys(pathEdges).forEach(function (idx) {
            edgeEls[idx].el.classList.add('constellation-edge--active');
        });
    }

    // ============================================================
    //  FLOAT CARD (build-once, cursor-following preview)
    // ============================================================
    var coarsePointer = window.matchMedia &&
        window.matchMedia('(pointer: coarse)').matches;
    var floatCard = null;
    var floatCardId = null;
    var GROUP_LABELS = {
        security: 'Security', development: 'Development', infrastructure: 'Infrastructure',
        experience: 'Experience', recognition: 'Recognition'
    };

    function ensureFloatCard() {
        if (floatCard) return floatCard;
        floatCard = document.createElement('div');
        floatCard.className = 'graph-float-card';
        floatCard.setAttribute('aria-hidden', 'true');
        floatCard.innerHTML = '<span class="gfc-title"></span><div class="gfc-badges"></div>';
        container.appendChild(floatCard);
        return floatCard;
    }

    function buildFloatBadges(n) {
        var badges = [];
        var gl = GROUP_LABELS[n.group];
        if (gl) badges.push(gl);
        var pc = String(n.cat || '').replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
        if (pc && badges.indexOf(pc) === -1) badges.push(pc);
        if (n.provider) badges.push(n.provider);
        if (n.date) badges.push(String(n.date));
        return badges.slice(0, 4);
    }

    // Keep the card near the cursor / node, clamped to the visible portion of
    // the container AND the viewport.
    function positionFloatCard(nodeEl, ev) {
        if (!floatCard || !nodeEl) return;
        var cr = container.getBoundingClientRect();
        var cw = floatCard.offsetWidth || 240;
        var ch = floatCard.offsetHeight || 110;
        var nr = nodeEl.getBoundingClientRect();
        var vx = (ev && typeof ev.clientX === 'number') ? ev.clientX : nr.right;
        var vy = (ev && typeof ev.clientY === 'number') ? ev.clientY : nr.top;
        var visL = Math.max(0, -cr.left);
        var visT = Math.max(0, -cr.top);
        var visR = Math.min(cr.width, window.innerWidth - cr.left);
        var visB = Math.min(cr.height, window.innerHeight - cr.top);
        var px = vx - cr.left + 16;
        var py = vy - cr.top + 14;
        if (px + cw > visR - 8) px = vx - cr.left - cw - 16; // flip left of cursor
        px = Math.max(visL + 8, Math.min(px, Math.max(visL + 8, visR - cw - 8)));
        py = Math.max(visT + 8, Math.min(py, Math.max(visT + 8, visB - ch - 8)));
        floatCard.style.transform = 'translate(' + px + 'px,' + py + 'px)';
    }

    function showFloatCard(id) {
        if (coarsePointer) return;
        if (document.body.classList.contains('portfolio-list-mode')) return;
        var n = nodeMap[id];
        if (!n) { hideFloatCard(); return; }
        var fc = ensureFloatCard();
        if (floatCardId !== id) {
            var titleEl = fc.querySelector('.gfc-title');
            titleEl.textContent = n.name;
            titleEl.style.color = getCatColor(n.group);
            fc.querySelector('.gfc-badges').innerHTML =
                buildFloatBadges(n).map(function (b) {
                    return '<span class="gfc-badge">' + escapeHtml(b) + '</span>';
                }).join('');
            var oldLink = fc.querySelector('.gfc-link');
            if (oldLink && oldLink.parentNode) oldLink.parentNode.removeChild(oldLink);
            if (n.url) {
                var link = document.createElement('a');
                link.className = 'gfc-link';
                if (n.type === 'blog') {
                    link.href = '#writing';
                    link.setAttribute('aria-label', 'View writing by ' + n.name);
                    link.textContent = 'View writing →';
                    link.addEventListener('click', goToWriting);
                } else {
                    link.href = n.url;
                    link.setAttribute('aria-label', 'Open ' + n.name);
                    link.textContent = 'Open →';
                    link.addEventListener('click', function (e) { e.stopPropagation(); });
                }
                fc.appendChild(link);
            }
            floatCardId = id;
        }
        fc.classList.add('graph-float-card--open');
        fc.setAttribute('aria-hidden', 'false');
    }

    function moveFloatCard(id, ev) {
        if (!floatCard || floatCardId !== id) return;
        positionFloatCard(nodeEls[id], ev);
    }

    function hideFloatCard() {
        if (!floatCard) return;
        floatCard.classList.remove('graph-float-card--open');
        floatCard.setAttribute('aria-hidden', 'true');
        floatCardId = null;
    }

    function restoreNodeInteraction(id) {
        var next = focusedNode || hoveredNode;
        if (next && next !== id) {
            highlightNode(next);
            showFloatCard(next);
            positionFloatCard(nodeEls[next], null);
            return;
        }
        if (!next) {
            highlightNode(null);
            hideFloatCard();
        }
    }

    // ---- Attach hover events ----
    Object.keys(nodeEls).forEach(function (id) {
        nodeEls[id].addEventListener('mouseenter', function () {
            hoveredNode = id;
            highlightNode(id);
            showFloatCard(id);
            positionFloatCard(nodeEls[id], null);
        });
        nodeEls[id].addEventListener('mousemove', function (e) {
            moveFloatCard(id, e);
        });
        nodeEls[id].addEventListener('mouseleave', function () {
            if (hoveredNode === id) hoveredNode = null;
            if (focusedNode !== id) {
                restoreNodeInteraction(id);
            }
        });
        nodeEls[id].addEventListener('focusin', function () {
            focusedNode = id;
            highlightNode(id);
            showFloatCard(id);
            positionFloatCard(nodeEls[id], null);
        });
        nodeEls[id].addEventListener('focusout', function (e) {
            if (e.relatedTarget && nodeEls[id].contains(e.relatedTarget)) return;
            if (focusedNode === id) focusedNode = null;
            if (hoveredNode !== id) {
                restoreNodeInteraction(id);
            }
        });
    });

    // Hide the float card on touch / drag gestures
    container.addEventListener('touchstart', function () { hideFloatCard(); }, { passive: true });

    // ============================================================
    //  EDGE FLOW PARTICLES (one per lit edge along its curve)
    // ============================================================
    var flowReduce = reduceMotion;
    var flowDots = {}; // edgeIdx -> { el, t }

    function purgeFlowDots() {
        Object.keys(flowDots).forEach(function (k) {
            if (flowDots[k].el.parentNode) flowDots[k].el.parentNode.removeChild(flowDots[k].el);
            delete flowDots[k];
        });
    }

    function updateFlowDots() {
        if (!svg || document.body.classList.contains('portfolio-list-mode')) {
            purgeFlowDots();
            return;
        }
        edgeEls.forEach(function (e, idx) {
            var fd = flowDots[idx];
            if (e.el.classList.contains('is-lit')) {
                try {
                    if (!fd) {
                        var dot = document.createElementNS(SVG_NS, 'circle');
                        dot.setAttribute('r', '2.4');
                        dot.setAttribute('class', 'constellation-flow-dot');
                        var col = e.el.style.getPropertyValue('--edge-color');
                        dot.style.setProperty('--edge-color', col);
                        dot.style.fill = col;
                        svg.appendChild(dot);
                        fd = flowDots[idx] = { el: dot, t: (idx * 0.13) % 1 };
                    }
                    var len = e.el.getTotalLength();
                    if (len > 0) {
                        fd.t = (fd.t + 90 / len) % 1;
                        var p = e.el.getPointAtLength(fd.t * len);
                        fd.el.setAttribute('cx', p.x);
                        fd.el.setAttribute('cy', p.y);
                    }
                } catch (err) { /* path geometry not ready yet */ }
            } else if (fd) {
                if (fd.el.parentNode) fd.el.parentNode.removeChild(fd.el);
                delete flowDots[idx];
            }
        });
    }

    if (!flowReduce) {
        (function flowLoop() {
            updateFlowDots();
            requestAnimationFrame(flowLoop);
        })();
    }

    // ---- Keyboard and click → activate node ----
    Object.keys(nodeEls).forEach(function (id) {
        nodeEls[id].addEventListener('keydown', function (e) {
            if (e.target !== nodeEls[id]) return;
            if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
            e.preventDefault();
            activateNode(id);
        });
        nodeEls[id].addEventListener('click', function (e) {
            e.stopPropagation();
            openNodePanel(id);
        });
        // Touch support
        nodeEls[id].addEventListener('touchstart', function (e) {
            e.preventDefault();
            if (activeHover !== id) {
                highlightNode(id);
            } else {
                openNodePanel(id);
            }
        }, { passive: false });
    });

    // Click outside to deselect
    container.addEventListener('click', function () { highlightNode(null); });

    // ============================================================
    //  LIVE PHYSICS SIMULATION
    // ============================================================
    // Now that the DOM exists, size the keep-out ellipse to the real node,
    // and keep it correct when the viewport/fonts change.
    meKeepOut = computeMeKeepOut();
    var _recalcKeep = function () { meKeepOut = computeMeKeepOut(); };
    window.addEventListener('resize', _recalcKeep);
    window.addEventListener('load', _recalcKeep);

    // Give each node a velocity
    nodes.forEach(function (n) { n.vx = 0; n.vy = 0; });

    var REPULSE   = isMobile ? 600 : 1800;
    var ME_REPULSE = REPULSE * 4;
    var SPRING    = isMobile ? 0.004 : 0.003;
    var DAMPING   = 0.92;
    var JITTER    = isMobile ? 0.1 : 0.15;
    var DT        = 1;

    function physicsStep() {
        var i, j, a, b, dx, dy, dist, force;

        // ---- Repulsion between all node pairs ----
        for (i = 0; i < nodes.length; i++) {
            for (j = i + 1; j < nodes.length; j++) {
                a = nodes[i]; b = nodes[j];
                dx = b.x - a.x; dy = b.y - a.y;
                dist = Math.sqrt(dx * dx + dy * dy) || 1;
                var minD = Math.max(minDists[a.type] || 80, minDists[b.type] || 80);
                var isMe = a.type === 'me' || b.type === 'me';
                var rangeMulti = isMe ? 4 : 2.5;
                if (dist < minD * rangeMulti) {
                    var repStr = isMe ? ME_REPULSE : REPULSE;
                    force = repStr / (dist * dist);
                    var fx = dx / dist * force;
                    var fy = dy / dist * force;
                    if (a.type !== 'me') { a.vx -= fx; a.vy -= fy; }
                    if (b.type !== 'me') { b.vx += fx; b.vy += fy; }
                }
            }
        }

        // ---- Spring attraction along edges ----
        edges.forEach(function (e) {
            if (e.type === 'rel') return; // relationships do not affect layout
            a = nodeMap[e.from]; b = nodeMap[e.to];
            if (!a || !b) return;
            dx = b.x - a.x; dy = b.y - a.y;
            dist = Math.sqrt(dx * dx + dy * dy) || 1;
            var ideal = isMobile
                ? (e.type === 'me-cat' ? 220 : e.type === 'cat-sub' ? 150 : e.type === 'sub-leaf' ? 90 : 150)
                : (e.type === 'me-cat' ? 360 : e.type === 'cat-sub' ? 240 : e.type === 'sub-leaf' ? 150 : 300);
            force = (dist - ideal) * SPRING;
            var sx = dx / dist * force;
            var sy = dy / dist * force;
            if (a.type !== 'me') { a.vx += sx; a.vy += sy; }
            if (b.type !== 'me') { b.vx -= sx; b.vy -= sy; }
        });

        // ---- Gentle gravity toward original cluster center ----
        nodes.forEach(function (n) {
            if (n.type === 'me') return;
            var cl = CLUSTERS[n.cluster] || CLUSTERS.me;
            var cx = cl.x * LW, cy = cl.y * LH;
            n.vx += (cx - n.x) * 0.0004;
            n.vy += (cy - n.y) * 0.0004;
        });

        // ---- Random jitter for organic feel ----
        nodes.forEach(function (n) {
            if (n.type === 'me') return;
            n.vx += (Math.random() - 0.5) * JITTER;
            n.vy += (Math.random() - 0.5) * JITTER;
        });

        // ---- Integrate + damp + clamp ----
        nodes.forEach(function (n) {
            if (n.type === 'me') {
                n.x = CLUSTERS.me.x * LW;
                n.y = CLUSTERS.me.y * LH;
                return;
            }
            n.vx *= DAMPING;
            n.vy *= DAMPING;
            // Cap max velocity
            var speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
            if (speed > 2) { n.vx = n.vx / speed * 2; n.vy = n.vy / speed * 2; }
            n.x += n.vx * DT;
            n.y += n.vy * DT;
            n.x = Math.max(90, Math.min(LW - 90, n.x));
            n.y = Math.max(60, Math.min(LH - 60, n.y));
            applyMeKeepOut(n);
        });

        // ---- Update DOM positions ----
        nodes.forEach(function (n) {
            var el = nodeEls[n.id];
            el.style.left = (n.x / LW * 100) + '%';
            el.style.top = (n.y / LH * 100) + '%';
        });

        // ---- Update edge curves ----
        edgeEls.forEach(function (e) {
            var a = nodeMap[e.from], b = nodeMap[e.to];
            if (!a || !b) return;
            e.el.setAttribute('d', edgePathD(a.x, a.y, b.x, b.y));
        });

        requestAnimationFrame(physicsStep);
    }
    // Start after entrance animation; the static layout is already complete
    // when motion is reduced.
    if (!reduceMotion) setTimeout(physicsStep, 2000);

    // ============================================================
    //  GSAP ENTRANCE ANIMATION
    // ============================================================
    if (!reduceMotion && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Me node first
        var meEl = nodeEls['me'];
        gsap.set(meEl, { opacity: 0, scale: 0 });
        gsap.to(meEl, { opacity: 1, scale: 1, duration: 0.8, delay: 0.3, ease: 'back.out(1.4)' });

        // Skills
        var skillEls = nodes.filter(function (n) { return n.type === 'skill'; }).map(function (n) { return nodeEls[n.id]; });
        gsap.set(skillEls, { opacity: 0, scale: 0.3 });
        gsap.to(skillEls, { opacity: 1, scale: 1, duration: 0.5, delay: 0.6, stagger: 0.03, ease: 'back.out(1.2)' });

        // Awards
        var awardEls = nodes.filter(function (n) { return n.type === 'award'; }).map(function (n) { return nodeEls[n.id]; });
        gsap.set(awardEls, { opacity: 0, scale: 0.3 });
        gsap.to(awardEls, { opacity: 1, scale: 1, duration: 0.5, delay: 0.9, stagger: 0.05, ease: 'back.out(1.2)' });

        // Experience + Education
        var careerEls = nodes.filter(function (n) { return n.type === 'experience' || n.type === 'education'; }).map(function (n) { return nodeEls[n.id]; });
        gsap.set(careerEls, { opacity: 0, scale: 0.3 });
        gsap.to(careerEls, { opacity: 1, scale: 1, duration: 0.5, delay: 1.1, stagger: 0.06, ease: 'back.out(1.2)' });

        // Courses + Certs
        var smallEls = nodes.filter(function (n) { return n.type === 'course' || n.type === 'certificate'; }).map(function (n) { return nodeEls[n.id]; });
        gsap.set(smallEls, { opacity: 0, scale: 0 });
        gsap.to(smallEls, { opacity: 1, scale: 1, duration: 0.4, delay: 1.3, stagger: 0.03, ease: 'power2.out' });

        // Blog nodes
        var blogEls = nodes.filter(function (n) { return n.type === 'blog' || n.type === 'blog-more'; }).map(function (n) { return nodeEls[n.id]; });
        gsap.set(blogEls, { opacity: 0, scale: 0.3 });
        gsap.to(blogEls, { opacity: 1, scale: 1, duration: 0.5, delay: 1.4, stagger: 0.04, ease: 'back.out(1.2)' });

        // Edges
        var edgeElArr = edgeEls.map(function (e) { return e.el; });
        gsap.set(edgeElArr, { opacity: 0 });
        gsap.to(edgeElArr, { opacity: 1, duration: 0.8, delay: 0.8, stagger: 0.01, ease: 'power2.out' });
    }

    // ============================================================
    //  DARK MODE OBSERVER
    // ============================================================
    var observer = new MutationObserver(function () {
        nodes.forEach(function (n) {
            nodeEls[n.id].style.setProperty('--node-color', getCatColor(n.group));
        });
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // ---- Scroll indicator ----
    var scrollHint = document.createElement('div');
    scrollHint.className = 'constellation-scroll-hint';
    scrollHint.innerHTML = '<i class="fas fa-arrows-left-right"></i><span>Swipe to explore</span>';
    container.parentElement.appendChild(scrollHint);

    // ---- Hire Me popup toggle ----
    var hireBtn = document.querySelector('.hire-me-btn');
    var hirePopup = document.querySelector('.hire-me-popup');
    if (hireBtn && hirePopup) {
        hireBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            var open = hirePopup.classList.toggle('hire-me-popup--open');
            hireBtn.setAttribute('aria-expanded', open);
            hirePopup.setAttribute('aria-hidden', !open);
        });
        document.addEventListener('click', function () {
            hirePopup.classList.remove('hire-me-popup--open');
            hireBtn.setAttribute('aria-expanded', 'false');
            hirePopup.setAttribute('aria-hidden', 'true');
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                hirePopup.classList.remove('hire-me-popup--open');
                hireBtn.setAttribute('aria-expanded', 'false');
                hirePopup.setAttribute('aria-hidden', 'true');
            }
        });
        hirePopup.addEventListener('click', function (e) { e.stopPropagation(); });
    }

})();
