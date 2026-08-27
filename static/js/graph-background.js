/* ============================================================
   GRAPH BACKGROUND — ambient canvas layer for the constellation
   Painted BEHIND the DOM/SVG graph: radial wash, drifting fog,
   twinkling starfield w/ faint constellation lines, ambient
   particles, vignette + center glow that tracks the me-node.
   Exposes window.GraphBackground = { init, destroy } only.
   ============================================================ */

(function () {
    'use strict';

    var DPR_CAP = 2;
    var STAR_COUNT_DESKTOP = 140;
    var STAR_COUNT_MOBILE = 60;
    var PARTICLE_COUNT = 28;
    var FOG_COUNT = 3;

    // Seeded LCG (same recipe as portfolio-graph.js) -> deterministic field
    var _seed = 42;
    function srand() { _seed = (_seed * 16807) % 2147483647; return (_seed - 1) / 2147483646; }

    function isDark() {
        return document.documentElement.classList.contains('dark') ||
               document.body.classList.contains('dark');
    }

    var canvas = null;
    var ctx = null;
    var wrapEl = null;
    var W = 0, H = 0, dpr = 1;
    var stars = [];
    var fogs = [];
    var startTime = 0;
    var rafId = null;
    var running = false;
    var reduceMotion = false;
    var ro = null;
    var onWinResize = null;
    var onVisChange = null;
    // cached me-node screen position (canvas-local coords) for the center glow
    var glow = { x: 0, y: 0, valid: false };
    var frameCount = 0;

    function buildField() {
        _seed = 42; // re-seed -> identical field after every resize
        var count = (window.innerWidth < 768) ? STAR_COUNT_MOBILE : STAR_COUNT_DESKTOP;
        stars = [];
        for (var i = 0; i < count; i++) {
            stars.push({
                x: srand() * Math.max(W, 1),
                y: srand() * Math.max(H, 1),
                r: 0.4 + srand() * 0.9,
                tw: srand() * Math.PI * 2,
                spd: 0.5 + srand() * 1.2,
                depth: 0.4 + srand() * 0.4,
                ph: srand() * Math.PI * 2
            });
        }
        fogs = [];
        var k = Math.max(0.55, Math.min(W, H) / 900);
        for (var fi = 0; fi < FOG_COUNT; fi++) {
            fogs.push({
                x: (0.15 + srand() * 0.7) * Math.max(W, 1),
                y: (0.1 + srand() * 0.8) * Math.max(H, 1),
                r: (340 + srand() * 240) * k,
                phase: srand() * Math.PI * 2,
                color: ['rgba(59,130,246,', 'rgba(139,92,246,', 'rgba(16,185,129,'][fi % 3]
            });
        }
    }

    function sizeCanvas() {
        if (!canvas || !wrapEl) return;
        W = wrapEl.clientWidth || wrapEl.offsetWidth || 0;
        H = wrapEl.clientHeight || wrapEl.offsetHeight || 0;
        if (!W || !H) return;
        dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        buildField();
        updateGlow(true);
        if (reduceMotion) paintStatic();
    }

    function updateGlow(force) {
        try {
            var me = wrapEl && wrapEl.querySelector ? wrapEl.querySelector('.cnode--me') : null;
            if (!me) { glow.valid = false; return; }
            var mr = me.getBoundingClientRect();
            var wr = wrapEl.getBoundingClientRect();
            if (!mr.width && !mr.height && !force) { glow.valid = false; return; }
            glow.x = mr.left + mr.width / 2 - wr.left;
            glow.y = mr.top + mr.height / 2 - wr.top;
            glow.valid = true;
        } catch (err) {
            glow.valid = false;
        }
    }

    function paintBackground(timeSec) {
        if (!ctx) return;
        var dark = isDark();

        // ---- radial wash ----
        var bg1 = dark ? '#05070f' : '#eef1f6';
        var bg2 = dark ? '#0a0e1a' : '#ffffff';
        var grd = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.8);
        grd.addColorStop(0, bg1);
        grd.addColorStop(1, bg2);
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);

        // ---- drifting fog blobs ----
        for (var fi = 0; fi < fogs.length; fi++) {
            var f = fogs[fi];
            var a = (dark ? 0.06 : 0.04) * (0.7 + 0.3 * Math.sin(timeSec * 0.1 + f.phase));
            var fg = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
            fg.addColorStop(0, f.color + a + ')');
            fg.addColorStop(1, f.color + '0)');
            ctx.fillStyle = fg;
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
            ctx.fill();
        }

        // ---- starfield: twinkle + depth parallax ----
        for (var si = 0; si < stars.length; si++) {
            var s = stars[si];
            // gentle oscillation; shallower stars move more (parallax feel)
            var ox = Math.sin(timeSec * 0.02 + s.ph) * 14 * (1 - s.depth);
            var oy = Math.cos(timeSec * 0.016 + s.ph) * 10 * (1 - s.depth);
            var tw = 0.55 + 0.45 * Math.sin(timeSec * s.spd + s.tw);
            var al = (dark ? 0.55 : 0.35) * tw;
            ctx.fillStyle = 'rgba(' + (dark ? '220,230,255' : '40,50,90') + ',' + al.toFixed(3) + ')';
            ctx.beginPath();
            ctx.arc(s.x + ox, s.y + oy, s.r, 0, Math.PI * 2);
            ctx.fill();
        }

        // ---- faint constellation lines between nearby stars ----
        ctx.strokeStyle = dark ? 'rgba(120,150,220,0.04)' : 'rgba(60,80,160,0.045)';
        ctx.lineWidth = 0.5;
        for (var ci = 0; ci + 1 < stars.length; ci += 7) {
            var sa = stars[ci], sb = stars[ci + 1];
            var ddx = sa.x - sb.x, ddy = sa.y - sb.y;
            if (ddx * ddx + ddy * ddy < 320 * 320) {
                ctx.beginPath();
                ctx.moveTo(sa.x, sa.y);
                ctx.lineTo(sb.x, sb.y);
                ctx.stroke();
            }
        }

        // ---- ambient floating particles ----
        var pk = Math.max(W, H) / 1400;
        for (var pi = 0; pi < PARTICLE_COUNT; pi++) {
            var ang = (pi / PARTICLE_COUNT) * Math.PI * 2 + timeSec * 0.03;
            var pr = (420 + Math.sin(timeSec * 0.2 + pi) * 60) * pk;
            var ppx = W / 2 + Math.cos(ang) * pr;
            var ppy = H / 2 + Math.sin(ang) * pr * 0.72;
            var pa = (dark ? 0.22 : 0.16) * (0.6 + 0.4 * Math.sin(timeSec * 0.8 + pi));
            ctx.fillStyle = dark
                ? 'rgba(180,200,255,' + pa.toFixed(3) + ')'
                : 'rgba(60,90,160,' + pa.toFixed(3) + ')';
            ctx.beginPath();
            ctx.arc(ppx, ppy, 1.1, 0, Math.PI * 2);
            ctx.fill();
        }

        // ---- vignette (dark mode only) ----
        if (dark) {
            var vg = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
            vg.addColorStop(0, 'rgba(0,0,0,0)');
            vg.addColorStop(1, 'rgba(0,0,0,0.42)');
            ctx.fillStyle = vg;
            ctx.fillRect(0, 0, W, H);
        }

        // ---- radial light behind the me-node's current position ----
        if (glow.valid) {
            var ml = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, Math.min(W, H) * 0.4);
            ml.addColorStop(0, dark ? 'rgba(99,102,241,0.10)' : 'rgba(59,130,246,0.06)');
            ml.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = ml;
            ctx.fillRect(0, 0, W, H);
        }
    }

    // Static single frame for prefers-reduced-motion: wash + vignette (+ glow)
    function paintStatic() {
        if (!ctx || !W || !H) return;
        var dark = isDark();
        var bg1 = dark ? '#05070f' : '#eef1f6';
        var bg2 = dark ? '#0a0e1a' : '#ffffff';
        var grd = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.8);
        grd.addColorStop(0, bg1);
        grd.addColorStop(1, bg2);
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
        if (dark) {
            var vg = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
            vg.addColorStop(0, 'rgba(0,0,0,0)');
            vg.addColorStop(1, 'rgba(0,0,0,0.42)');
            ctx.fillStyle = vg;
            ctx.fillRect(0, 0, W, H);
        }
        if (glow.valid) {
            var ml = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, Math.min(W, H) * 0.4);
            ml.addColorStop(0, dark ? 'rgba(99,102,241,0.10)' : 'rgba(59,130,246,0.06)');
            ml.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = ml;
            ctx.fillRect(0, 0, W, H);
        }
    }

    function loop(now) {
        if (!running || !ctx) { rafId = null; return; }
        if (document.hidden) { // paused; visibilitychange -> startLoop() resumes
            running = false;
            rafId = null;
            return;
        }
        if (!startTime) startTime = now;
        var timeSec = (now - startTime) / 1000;
        // refresh the me-node glow position periodically (it drifts with physics)
        if ((frameCount++ % 10) === 0) updateGlow(false);
        paintBackground(timeSec);
        rafId = requestAnimationFrame(loop);
    }

    function startLoop() {
        if (running || !ctx) return;
        running = true;
        if (reduceMotion) { paintStatic(); running = false; return; }
        if (rafId === null) rafId = requestAnimationFrame(loop);
    }

    function stopLoop() {
        running = false;
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    function init(wrap) {
        if (!wrap || typeof wrap.appendChild !== 'function') return;
        destroy(); // idempotent re-init

        wrapEl = wrap;
        reduceMotion = !!(window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches);

        // Re-use an existing canvas if one is already mounted
        canvas = wrapEl.querySelector('#graph-bg-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'graph-bg-canvas';
            // Functional defaults only (no z-index — stacking is owned by CSS).
            canvas.style.cssText =
                'display:block;position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;';
            // FIRST child of the wrap, ahead of the graph container
            wrapEl.insertBefore(canvas, wrapEl.firstChild || null);
        }
        ctx = canvas.getContext('2d');
        if (!ctx) return;

        sizeCanvas();

        if (wrapEl.__graphBgRO) wrapEl.__graphBgRO.disconnect();
        if (typeof ResizeObserver !== 'undefined') {
            ro = new ResizeObserver(function () { sizeCanvas(); });
            ro.observe(wrapEl);
            wrapEl.__graphBgRO = ro;
        }
        onWinResize = function () { sizeCanvas(); };
        window.addEventListener('resize', onWinResize);
        onVisChange = function () {
            if (!document.hidden) startLoop();
        };
        document.addEventListener('visibilitychange', onVisChange);

        startLoop();
    }

    function destroy() {
        stopLoop();
        if (ro) { ro.disconnect(); ro = null; }
        if (wrapEl && wrapEl.__graphBgRO) delete wrapEl.__graphBgRO;
        if (onWinResize) window.removeEventListener('resize', onWinResize);
        if (onVisChange) document.removeEventListener('visibilitychange', onVisChange);
        onWinResize = null;
        onVisChange = null;
        if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
        canvas = null;
        ctx = null;
        wrapEl = null;
        stars = [];
        fogs = [];
        glow.valid = false;
        frameCount = 0;
    }

    window.GraphBackground = {
        init: init,
        destroy: destroy
    };
})();
