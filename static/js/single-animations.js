/* ============================================================
   SINGLE PAGE ANIMATIONS — GSAP ScrollTrigger for project/blog pages
   + Ambient cursor glow
   ============================================================ */

(function () {
    'use strict';

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    var singleSection = document.getElementById('single');
    if (!singleSection) return;

    // ---- Title entrance ----
    var titleEl = singleSection.querySelector('.title h1');
    if (titleEl) {
        gsap.from(titleEl, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
        });
    }

    // ---- Subtitle / meta ----
    var metaEl = singleSection.querySelector('.title .text-center');
    if (metaEl) {
        gsap.from(metaEl, {
            y: 20,
            opacity: 0,
            duration: 0.6,
            delay: 0.15,
            ease: 'power3.out',
        });
    }

    // ---- GitHub button ----
    var ghBtn = singleSection.querySelector('.title .btn-primary');
    if (ghBtn) {
        gsap.from(ghBtn, {
            scale: 0.8,
            opacity: 0,
            duration: 0.5,
            delay: 0.3,
            ease: 'back.out(1.4)',
        });
    }

    // ---- Featured image ----
    var featImg = singleSection.querySelector('.featured-image img');
    if (featImg) {
        gsap.from(featImg, {
            scrollTrigger: { trigger: '.featured-image', start: 'top 85%' },
            y: 40,
            opacity: 0,
            scale: 0.97,
            duration: 0.8,
            ease: 'power3.out',
        });
    }

    // ---- Article content blocks ----
    var contentEls = gsap.utils.toArray('.page-content > h2, .page-content > h3, .page-content > h4, .page-content > p, .page-content > ul, .page-content > ol, .page-content > pre, .page-content > blockquote, .page-content > .highlight');
    if (contentEls.length) {
        contentEls.forEach(function (el) {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                    toggleActions: 'play none none none',
                },
                y: 20,
                opacity: 0,
                duration: 0.5,
                ease: 'power2.out',
            });
        });
    }

    // ---- Sidebar TOC + tags ----
    var sidebarItems = gsap.utils.toArray('.sticky-sidebar aside');
    if (sidebarItems.length) {
        gsap.from(sidebarItems, {
            scrollTrigger: { trigger: '.sticky-sidebar', start: 'top 80%' },
            x: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power3.out',
        });
    }

    // ---- Social share icons ----
    var shareIcons = gsap.utils.toArray('.social .list-inline-item');
    if (shareIcons.length) {
        gsap.from(shareIcons, {
            scrollTrigger: { trigger: '.social', start: 'top 85%' },
            scale: 0.5,
            opacity: 0,
            duration: 0.4,
            stagger: 0.08,
            ease: 'back.out(1.6)',
        });
    }

    // Ensure no cursor glow exists on project/single pages
    var existingGlow = document.getElementById('cursor-glow');
    if (existingGlow) { existingGlow.remove(); }

})();
