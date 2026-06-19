/* ============================================================
   SCROLL ANIMATIONS — GSAP ScrollTrigger powered
   Reveals sections, cards, timeline items with staggered motion
   + Ambient cursor glow effect
   ============================================================ */

(function () {
    'use strict';

    // Wait for GSAP + ScrollTrigger to load
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // ---- Section header reveals ----
    gsap.utils.toArray('section h3').forEach(function (el) {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none none',
            },
            y: 30,
            opacity: 0,
            duration: 0.7,
            ease: 'power3.out',
        });
    });

    // ---- About section ----
    var aboutImg = document.querySelector('#about .image img');
    if (aboutImg) {
        gsap.from(aboutImg, {
            scrollTrigger: { trigger: '#about', start: 'top 75%' },
            x: -40,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
        });
    }
    var aboutContent = document.querySelector('#about .about-content, #about .content');
    if (aboutContent) {
        gsap.from(aboutContent, {
            scrollTrigger: { trigger: '#about', start: 'top 75%' },
            x: 40,
            opacity: 0,
            duration: 0.9,
            delay: 0.15,
            ease: 'power3.out',
        });
    }

    // ---- Skills badges stagger ----
    var badges = gsap.utils.toArray('#about .skills-list .badge');
    if (badges.length) {
        gsap.from(badges, {
            scrollTrigger: { trigger: '#about .skills-list', start: 'top 85%' },
            scale: 0.7,
            opacity: 0,
            duration: 0.4,
            stagger: 0.04,
            ease: 'back.out(1.4)',
        });
    }

    // ---- Experience timeline items ----
    gsap.utils.toArray('.timeline-item').forEach(function (item, i) {
        gsap.from(item, {
            scrollTrigger: { trigger: item, start: 'top 85%' },
            y: 40,
            opacity: 0,
            duration: 0.7,
            delay: i * 0.1,
            ease: 'power3.out',
        });
    });

    // ---- Education / Courses / Achievements / Projects cards ----
    ['#education', '#courses', '#achievements', '#projects'].forEach(function (sec) {
        var cards = gsap.utils.toArray(sec + ' .card');
        if (cards.length) {
            gsap.from(cards, {
                scrollTrigger: { trigger: sec, start: 'top 78%' },
                y: 50,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out',
            });
        }
    });

    // ---- Contact section ----
    var contactSection = document.querySelector('#contact');
    if (contactSection) {
        gsap.from('#contact .container > *', {
            scrollTrigger: { trigger: '#contact', start: 'top 80%' },
            y: 30,
            opacity: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
        });
    }

    // ---- Footer reveal ----
    var footer = document.querySelector('footer');
    if (footer) {
        gsap.from('footer .footer-inner, footer .footer-copyright', {
            scrollTrigger: { trigger: 'footer', start: 'top 90%' },
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power2.out',
        });
    }

    // ============================================================
    //  AMBIENT CURSOR GLOW — follows mouse across entire page
    // ============================================================
    if (!document.getElementById('cursor-glow') && document.getElementById('hero') && window.innerWidth > 767 && window.matchMedia('(hover: hover)').matches) {
        var glow = document.createElement('div');
        glow.id = 'cursor-glow';
        document.body.appendChild(glow);

        var glowX = 0, glowY = 0, targetX = 0, targetY = 0;
        var glowVisible = false;

        document.addEventListener('mousemove', function (e) {
            targetX = e.clientX;
            targetY = e.clientY;
            var overGraph = e.target.closest && e.target.closest('.constellation-wrap');
            if (overGraph) {
                glow.style.opacity = '0';
                glowVisible = false;
            } else if (!glowVisible) {
                glow.style.opacity = '1';
                glowVisible = true;
            }
        });

        document.addEventListener('mouseleave', function () {
            glow.style.opacity = '0';
            glowVisible = false;
        });

        function animateGlow() {
            glowX += (targetX - glowX) * 0.12;
            glowY += (targetY - glowY) * 0.12;
            glow.style.transform = 'translate(' + (glowX - 200) + 'px, ' + (glowY + window.scrollY - 200) + 'px)';
            requestAnimationFrame(animateGlow);
        }
        animateGlow();
    }

    // ---- Parallax floating dots on sections ----
    // Adds subtle floating dots to alternating sections for depth
    var decorSections = document.querySelectorAll('#about, #experience, #education, #projects');
    decorSections.forEach(function (sec, idx) {
        var dots = document.createElement('div');
        dots.className = 'section-float-dots';
        dots.setAttribute('aria-hidden', 'true');
        // Create 3 floating dot elements
        for (var i = 0; i < 3; i++) {
            var d = document.createElement('span');
            d.className = 'float-dot float-dot-' + i;
            d.style.animationDelay = (i * 1.2 + idx * 0.5) + 's';
            dots.appendChild(d);
        }
        sec.style.position = 'relative';
        sec.style.overflow = 'hidden';
        sec.appendChild(dots);
    });

})();
