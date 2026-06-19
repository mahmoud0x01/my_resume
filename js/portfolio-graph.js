/* ============================================================
   PORTFOLIO CONSTELLATION — Layout, Renderer, Interactions
   Full-viewport interactive network graph
   ============================================================ */

(function () {
    'use strict';

    if (typeof PORTFOLIO_DATA === 'undefined') return;
    var container = document.getElementById('portfolio-constellation');
    if (!container) return;

    var data = PORTFOLIO_DATA;
    var nodes = data.nodes;
    var edges = data.edges;
    var CAT_COLORS = data.CAT_COLORS;

    // ---- Helpers ----
    function isDark() {
        return document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');
    }
    function getCatColor(cat) {
        var c = CAT_COLORS[cat] || CAT_COLORS.concepts;
        return isDark() ? c.dark : c.light;
    }

    // ---- Layout dimensions (responsive) ----
    var isMobile = window.innerWidth <= 767;
    var LW = isMobile ? 700 : 2600;
    var LH = isMobile ? 1400 : 1400;

    // ---- Seed-based PRNG ----
    var _seed = 42;
    function srand() { _seed = (_seed * 16807) % 2147483647; return (_seed - 1) / 2147483646; }

    // ---- Cluster centers per type/category ----
    var CLUSTERS = isMobile ? {
        // MOBILE — compact portrait layout (infosec)
        me:          { x: 0.50, y: 0.10 },
        pentesting:  { x: 0.25, y: 0.26 },
        networking:  { x: 0.75, y: 0.26 },
        sysadmin:    { x: 0.25, y: 0.42 },
        tools:       { x: 0.75, y: 0.42 },
        scripting:   { x: 0.25, y: 0.58 },
        concepts:    { x: 0.75, y: 0.58 },
        award:       { x: 0.50, y: 0.10 },
        experience:  { x: 0.25, y: 0.74 },
        education:   { x: 0.75, y: 0.74 },
        course:      { x: 0.30, y: 0.88 },
        certificate: { x: 0.70, y: 0.88 },
        blog:        { x: 0.50, y: 0.96 },
        'blog-more': { x: 0.50, y: 0.96 },
    } : {
        // DESKTOP — wide landscape layout (infosec)
        me:          { x: 0.50, y: 0.46 },
        pentesting:  { x: 0.26, y: 0.20 },
        networking:  { x: 0.74, y: 0.20 },
        sysadmin:    { x: 0.14, y: 0.50 },
        tools:       { x: 0.50, y: 0.82 },
        scripting:   { x: 0.86, y: 0.50 },
        concepts:    { x: 0.50, y: 0.16 },
        award:       { x: 0.50, y: 0.46 },
        experience:  { x: 0.12, y: 0.14 },
        education:   { x: 0.90, y: 0.10 },
        course:      { x: 0.84, y: 0.80 },
        certificate: { x: 0.14, y: 0.82 },
        blog:        { x: 0.50, y: 0.12 },
        'blog-more': { x: 0.50, y: 0.12 },
    };

    // ---- Initial positions ----
    var nodeMap = {};
    var catCounters = {};

    nodes.forEach(function (n) {
        nodeMap[n.id] = n;
        var cl = CLUSTERS[n.type === 'skill' ? n.cat : n.type] || CLUSTERS.me;
        if (!catCounters[n.cat]) catCounters[n.cat] = 0;
        var idx = catCounters[n.cat]++;

        if (n.type === 'me') {
            n.x = cl.x * LW;
            n.y = cl.y * LH;
        } else if (n.type === 'award') {
            // Wide ring around center (like projects in developer)
            var pa = (idx / 5) * Math.PI * 2 + srand() * 0.4 - 0.2;
            var pr = isMobile ? (160 + srand() * 70) : (340 + srand() * 120);
            n.x = CLUSTERS.me.x * LW + Math.cos(pa) * pr;
            n.y = CLUSTERS.me.y * LH + Math.sin(pa) * pr;
        } else if (n.type === 'blog-more') {
            n.x = cl.x * LW;
            n.y = cl.y * LH;
        } else if (n.type === 'blog') {
            var ba = (idx / 6) * Math.PI * 2 + srand() * 0.5;
            var br = isMobile ? (60 + srand() * 40) : (100 + srand() * 60);
            n.x = CLUSTERS.blog.x * LW + Math.cos(ba) * br;
            n.y = CLUSTERS.blog.y * LH + Math.sin(ba) * br;
        } else if (n.type === 'course' || n.type === 'certificate') {
            var ca = (idx / 6) * Math.PI * 2 + srand() * 0.5;
            var cr = 50 + srand() * 70;
            n.x = cl.x * LW + Math.cos(ca) * cr;
            n.y = cl.y * LH + Math.sin(ca) * cr;
        } else if (n.type === 'skill') {
            // Tight cluster around category center
            var sa = (idx / 7) * Math.PI * 2 + srand() * 1.0;
            var sr = 55 + srand() * 55;
            n.x = cl.x * LW + Math.cos(sa) * sr;
            n.y = cl.y * LH + Math.sin(sa) * sr;
        } else {
            // experience, education
            var angle = (idx / 4) * Math.PI * 2 + srand() * 0.6;
            var radius = 50 + srand() * 40;
            n.x = cl.x * LW + Math.cos(angle) * radius;
            n.y = cl.y * LH + Math.sin(angle) * radius;
        }
        // Clamp
        n.x = Math.max(90, Math.min(LW - 90, n.x));
        n.y = Math.max(60, Math.min(LH - 60, n.y));
    });

    // ---- Force relaxation ----
    var minDists = isMobile
        ? { me: 120, skill: 70, award: 80, experience: 80, education: 80, course: 50, certificate: 50, blog: 60, 'blog-more': 70 }
        : { me: 220, skill: 130, award: 150, experience: 140, education: 140, course: 90, certificate: 90, blog: 100, 'blog-more': 120 };

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
            var a = nodeMap[e.from], b = nodeMap[e.to];
            if (!a || !b) return;
            var dx = b.x - a.x, dy = b.y - a.y;
            var dist = Math.sqrt(dx * dx + dy * dy) || 1;
            var ideal = isMobile
                ? (e.type === 'skill-skill' ? 80 : e.type === 'award-skill' ? 160 : e.type === 'blog-cluster' ? 90 : e.type === 'me-hub' ? 180 : 120)
                : (e.type === 'skill-skill' ? 160 : e.type === 'award-skill' ? 320 : e.type === 'blog-cluster' ? 180 : e.type === 'me-hub' ? 360 : 240);
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

    // ---- SVG for edges ----
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'constellation-svg');
    svg.setAttribute('viewBox', '0 0 ' + LW + ' ' + LH);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    container.appendChild(svg);

    // Draw edges
    var edgeEls = [];
    var edgeLookup = {}; // nodeId -> [edgeIndex]

    edges.forEach(function (e, idx) {
        var a = nodeMap[e.from], b = nodeMap[e.to];
        if (!a || !b) return;

        var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', a.x);
        line.setAttribute('y1', a.y);
        line.setAttribute('x2', b.x);
        line.setAttribute('y2', b.y);
        line.setAttribute('class', 'constellation-edge constellation-edge--' + e.type);
        line.setAttribute('data-from', e.from);
        line.setAttribute('data-to', e.to);
        svg.appendChild(line);
        edgeEls.push({ el: line, from: e.from, to: e.to, type: e.type });

        // Lookup
        if (!edgeLookup[e.from]) edgeLookup[e.from] = [];
        if (!edgeLookup[e.to]) edgeLookup[e.to] = [];
        edgeLookup[e.from].push(idx);
        edgeLookup[e.to].push(idx);
    });

    // ---- Nodes container ----
    var nodesWrap = document.createElement('div');
    nodesWrap.className = 'constellation-nodes';
    container.appendChild(nodesWrap);

    // ---- Build node elements ----
    var nodeEls = {};

    nodes.forEach(function (n) {
        var el = document.createElement('div');
        el.className = 'cnode cnode--' + n.type;
        el.setAttribute('data-id', n.id);
        el.setAttribute('data-type', n.type);
        el.style.left = (n.x / LW * 100) + '%';
        el.style.top = (n.y / LH * 100) + '%';
        el.style.setProperty('--node-color', getCatColor(n.cat));

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
            var subtLbl = document.createElement('div');
            subtLbl.className = 'cnode-me-subtitle';
            subtLbl.textContent = n.subtitle;
            el.appendChild(subtLbl);
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
                return function (e) { e.stopPropagation(); window.location.href = url; };
            })(n.url));
        } else if (n.type === 'blog-more') {
            // Counter badge linking to blog listing
            var bmDot = document.createElement('span');
            bmDot.className = 'cnode-blog-more-badge';
            bmDot.textContent = n.name;
            el.appendChild(bmDot);
            var bmLbl = document.createElement('span');
            bmLbl.className = 'cnode-hover-label';
            bmLbl.textContent = 'View all posts';
            el.appendChild(bmLbl);
            el.style.cursor = 'pointer';
            el.addEventListener('click', (function (url) {
                return function (e) { e.stopPropagation(); window.location.href = url; };
            })(n.url));
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

        nodesWrap.appendChild(el);
        nodeEls[n.id] = el;
    });

    // ============================================================
    //  HOVER INTERACTIONS
    // ============================================================
    var activeHover = null;

    function highlightNode(id) {
        if (activeHover === id) return;
        activeHover = id;

        // Reset all
        nodes.forEach(function (n) {
            var el = nodeEls[n.id];
            el.classList.remove('cnode--active', 'cnode--connected', 'cnode--dimmed');
            if (id) el.classList.add('cnode--dimmed');
        });
        edgeEls.forEach(function (e) {
            e.el.classList.remove('constellation-edge--active');
            if (id) e.el.classList.add('constellation-edge--dimmed');
            else e.el.classList.remove('constellation-edge--dimmed');
        });

        if (!id) {
            nodes.forEach(function (n) { nodeEls[n.id].classList.remove('cnode--dimmed'); });
            return;
        }

        // Active node
        nodeEls[id].classList.remove('cnode--dimmed');
        nodeEls[id].classList.add('cnode--active');

        // Connected nodes via edges
        var connected = {};
        (edgeLookup[id] || []).forEach(function (idx) {
            var e = edgeEls[idx];
            e.el.classList.remove('constellation-edge--dimmed');
            e.el.classList.add('constellation-edge--active');
            var otherId = e.from === id ? e.to : e.from;
            connected[otherId] = true;
        });

        Object.keys(connected).forEach(function (cid) {
            if (nodeEls[cid]) {
                nodeEls[cid].classList.remove('cnode--dimmed');
                nodeEls[cid].classList.add('cnode--connected');
            }
        });
    }

    // ---- Attach hover events ----
    Object.keys(nodeEls).forEach(function (id) {
        nodeEls[id].addEventListener('mouseenter', function () { highlightNode(id); });
        nodeEls[id].addEventListener('mouseleave', function () { highlightNode(null); });
    });

    // ---- Click → open detail panel ----
    Object.keys(nodeEls).forEach(function (id) {
        nodeEls[id].addEventListener('click', function (e) {
            e.stopPropagation();
            if (typeof window.openConstellationPanel === 'function') {
                window.openConstellationPanel(nodeMap[id], nodeMap, edgeEls, edgeLookup);
            }
        });
        // Touch support
        nodeEls[id].addEventListener('touchstart', function (e) {
            e.preventDefault();
            if (activeHover !== id) {
                highlightNode(id);
            } else {
                if (typeof window.openConstellationPanel === 'function') {
                    window.openConstellationPanel(nodeMap[id], nodeMap, edgeEls, edgeLookup);
                }
            }
        }, { passive: false });
    });

    // Click outside to deselect
    container.addEventListener('click', function () { highlightNode(null); });

    // ============================================================
    //  LIVE PHYSICS SIMULATION
    // ============================================================
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
            a = nodeMap[e.from]; b = nodeMap[e.to];
            if (!a || !b) return;
            dx = b.x - a.x; dy = b.y - a.y;
            dist = Math.sqrt(dx * dx + dy * dy) || 1;
            var ideal = isMobile
                ? (e.type === 'skill-skill' ? 80 : e.type === 'award-skill' ? 160 : e.type === 'blog-cluster' ? 90 : e.type === 'me-hub' ? 180 : 120)
                : (e.type === 'skill-skill' ? 160 : e.type === 'award-skill' ? 320 : e.type === 'blog-cluster' ? 180 : e.type === 'me-hub' ? 360 : 240);
            force = (dist - ideal) * SPRING;
            var sx = dx / dist * force;
            var sy = dy / dist * force;
            if (a.type !== 'me') { a.vx += sx; a.vy += sy; }
            if (b.type !== 'me') { b.vx -= sx; b.vy -= sy; }
        });

        // ---- Gentle gravity toward original cluster center ----
        nodes.forEach(function (n) {
            if (n.type === 'me') return;
            var cl = CLUSTERS[n.type === 'skill' ? n.cat : n.type] || CLUSTERS.me;
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
        });

        // ---- Update DOM positions ----
        nodes.forEach(function (n) {
            var el = nodeEls[n.id];
            el.style.left = (n.x / LW * 100) + '%';
            el.style.top = (n.y / LH * 100) + '%';
        });

        // ---- Update edge lines ----
        edgeEls.forEach(function (e) {
            var a = nodeMap[e.from], b = nodeMap[e.to];
            if (!a || !b) return;
            e.el.setAttribute('x1', a.x);
            e.el.setAttribute('y1', a.y);
            e.el.setAttribute('x2', b.x);
            e.el.setAttribute('y2', b.y);
        });

        requestAnimationFrame(physicsStep);
    }
    // Start after entrance animation
    setTimeout(physicsStep, 2000);

    // ============================================================
    //  GSAP ENTRANCE ANIMATION
    // ============================================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
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
            nodeEls[n.id].style.setProperty('--node-color', getCatColor(n.cat));
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
