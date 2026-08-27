/* ============================================================
   THREE.JS HERO — Particle Network + Floating Geometry
   Matches the warm pastel gradient palette of the portfolio
   ============================================================ */

(function () {
    'use strict';

    // ---- Guard: only run on pages with Three.js + hero section ----
    if (typeof THREE === 'undefined') return;
    var heroEl = document.getElementById('hero');
    if (!heroEl) return;

    // ---- Detect dark mode ----
    function isDark() {
        return document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');
    }

    // ---- Color palettes (light / dark) matching design.css ----
    const PALETTE_LIGHT = [
        new THREE.Color(0xfff5b4), // warm yellow
        new THREE.Color(0xffd2c8), // soft pink
        new THREE.Color(0xdcc3f0), // lavender
        new THREE.Color(0xc8dcff), // pale blue
        new THREE.Color(0xf5f4f0), // bg
    ];
    const PALETTE_DARK = [
        new THREE.Color(0x28231a), // dark gold
        new THREE.Color(0x32191e), // dark rose
        new THREE.Color(0x231437), // dark purple
        new THREE.Color(0x141e37), // dark navy
        new THREE.Color(0x222222), // bg accent
    ];

    function getPalette() { return isDark() ? PALETTE_DARK : PALETTE_LIGHT; }

    const canvas = document.createElement('canvas');
    canvas.id = 'hero-three-canvas';
    heroEl.insertBefore(canvas, heroEl.firstChild);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 30;

    let w = heroEl.offsetWidth;
    let h = heroEl.offsetHeight;

    function resize() {
        w = heroEl.offsetWidth;
        h = heroEl.offsetHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
    resize();

    // ---- Mouse tracking ----
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    heroEl.addEventListener('mousemove', function (e) {
        const rect = heroEl.getBoundingClientRect();
        mouse.tx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.ty = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });

    // ---- Particles ----
    const PARTICLE_COUNT = 120;
    const SPREAD = 35;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = [];
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        positions[i * 3] = (Math.random() - 0.5) * SPREAD * 2;
        positions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
        velocities.push({
            x: (Math.random() - 0.5) * 0.015,
            y: (Math.random() - 0.5) * 0.015,
            z: (Math.random() - 0.5) * 0.008
        });
        const c = getPalette()[Math.floor(Math.random() * getPalette().length)];
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
        size: isDark() ? 0.22 : 0.18,
        vertexColors: true,
        transparent: true,
        opacity: isDark() ? 0.7 : 0.55,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ---- Connection lines between close particles ----
    const MAX_CONNECTIONS = 300;
    const linePositions = new Float32Array(MAX_CONNECTIONS * 6);
    const lineColors = new Float32Array(MAX_CONNECTIONS * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
    lineGeo.setDrawRange(0, 0);

    const lineMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: isDark() ? 0.2 : 0.12,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    // ---- Floating geometry (subtle translucent shapes) ----
    const floatingShapes = [];
    const shapeGeoList = [
        new THREE.IcosahedronGeometry(1.8, 0),
        new THREE.TorusGeometry(1.4, 0.4, 8, 16),
        new THREE.OctahedronGeometry(1.5, 0),
        new THREE.TetrahedronGeometry(1.6, 0),
        new THREE.TorusKnotGeometry(1, 0.3, 48, 8, 2, 3),
    ];

    for (let i = 0; i < 5; i++) {
        const palette = getPalette();
        const col = palette[i % palette.length];
        const mat = new THREE.MeshBasicMaterial({
            color: col,
            transparent: true,
            opacity: isDark() ? 0.06 : 0.045,
            wireframe: true,
            depthWrite: false,
        });
        const mesh = new THREE.Mesh(shapeGeoList[i], mat);
        mesh.position.set(
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 25,
            -5 - Math.random() * 10
        );
        mesh.userData = {
            rotSpeed: { x: (Math.random() - 0.5) * 0.003, y: (Math.random() - 0.5) * 0.003, z: (Math.random() - 0.5) * 0.002 },
            floatSpeed: 0.3 + Math.random() * 0.4,
            floatAmp: 0.8 + Math.random() * 1.2,
            baseY: mesh.position.y,
            scale: 1.5 + Math.random() * 2,
        };
        mesh.scale.setScalar(mesh.userData.scale);
        scene.add(mesh);
        floatingShapes.push(mesh);
    }

    // ---- Animation loop ----
    const CONNECTION_DIST = 6.5;
    let time = 0;

    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        // Smooth mouse
        mouse.x += (mouse.tx - mouse.x) * 0.05;
        mouse.y += (mouse.ty - mouse.y) * 0.05;

        // Update particles
        const pos = particleGeo.attributes.position.array;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            pos[i * 3] += velocities[i].x + mouse.x * 0.003;
            pos[i * 3 + 1] += velocities[i].y + mouse.y * 0.002;
            pos[i * 3 + 2] += velocities[i].z;

            // Wrap around
            if (pos[i * 3] > SPREAD) pos[i * 3] = -SPREAD;
            if (pos[i * 3] < -SPREAD) pos[i * 3] = SPREAD;
            if (pos[i * 3 + 1] > SPREAD / 2) pos[i * 3 + 1] = -SPREAD / 2;
            if (pos[i * 3 + 1] < -SPREAD / 2) pos[i * 3 + 1] = SPREAD / 2;
            if (pos[i * 3 + 2] > 8) pos[i * 3 + 2] = -8;
            if (pos[i * 3 + 2] < -8) pos[i * 3 + 2] = 8;
        }
        particleGeo.attributes.position.needsUpdate = true;

        // Update connections
        let lineIdx = 0;
        const lp = lineGeo.attributes.position.array;
        const lc = lineGeo.attributes.color.array;
        const palette = getPalette();

        for (let i = 0; i < PARTICLE_COUNT && lineIdx < MAX_CONNECTIONS; i++) {
            for (let j = i + 1; j < PARTICLE_COUNT && lineIdx < MAX_CONNECTIONS; j++) {
                const dx = pos[i * 3] - pos[j * 3];
                const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
                const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
                const dist = dx * dx + dy * dy + dz * dz;

                if (dist < CONNECTION_DIST * CONNECTION_DIST) {
                    const idx = lineIdx * 6;
                    lp[idx] = pos[i * 3];
                    lp[idx + 1] = pos[i * 3 + 1];
                    lp[idx + 2] = pos[i * 3 + 2];
                    lp[idx + 3] = pos[j * 3];
                    lp[idx + 4] = pos[j * 3 + 1];
                    lp[idx + 5] = pos[j * 3 + 2];

                    const alpha = 1 - dist / (CONNECTION_DIST * CONNECTION_DIST);
                    const c = palette[lineIdx % palette.length];
                    lc[idx] = c.r * alpha;
                    lc[idx + 1] = c.g * alpha;
                    lc[idx + 2] = c.b * alpha;
                    lc[idx + 3] = c.r * alpha;
                    lc[idx + 4] = c.g * alpha;
                    lc[idx + 5] = c.b * alpha;

                    lineIdx++;
                }
            }
        }
        lineGeo.setDrawRange(0, lineIdx * 2);
        lineGeo.attributes.position.needsUpdate = true;
        lineGeo.attributes.color.needsUpdate = true;

        // Floating shapes
        for (const mesh of floatingShapes) {
            const ud = mesh.userData;
            mesh.rotation.x += ud.rotSpeed.x;
            mesh.rotation.y += ud.rotSpeed.y;
            mesh.rotation.z += ud.rotSpeed.z;
            mesh.position.y = ud.baseY + Math.sin(time * ud.floatSpeed) * ud.floatAmp;
            // Subtle mouse parallax
            mesh.position.x += mouse.x * 0.002;
            mesh.position.y += mouse.y * 0.001;
        }

        // Camera subtle sway
        camera.position.x += (mouse.x * 2 - camera.position.x) * 0.01;
        camera.position.y += (mouse.y * 1.5 - camera.position.y) * 0.01;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }
    animate();

    // ---- Resize handler ----
    window.addEventListener('resize', resize);

    // ---- Dark mode change handler ----
    const observer = new MutationObserver(function () {
        const dark = isDark();
        particleMat.opacity = dark ? 0.7 : 0.55;
        particleMat.size = dark ? 0.22 : 0.18;
        lineMat.opacity = dark ? 0.2 : 0.12;

        const palette = getPalette();
        // Update particle colors
        const colArr = particleGeo.attributes.color.array;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const c = palette[i % palette.length];
            colArr[i * 3] = c.r;
            colArr[i * 3 + 1] = c.g;
            colArr[i * 3 + 2] = c.b;
        }
        particleGeo.attributes.color.needsUpdate = true;

        // Update floating shapes
        for (let i = 0; i < floatingShapes.length; i++) {
            const c = palette[i % palette.length];
            floatingShapes[i].material.color.copy(c);
            floatingShapes[i].material.opacity = dark ? 0.06 : 0.045;
        }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

})();
