// Typing Effect for Hero Section - Resilient Version
(function() {
    'use strict';
    
    function typeWriter(element, text, speed, callback) {
        let i = 0;
        const currentText = element.textContent || '';
        element.textContent = currentText;
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else if (callback) {
                setTimeout(callback, 200);
            }
        }
        
        type();
    }
    
    function initTypingEffect() {
        const heroTitle = document.querySelector('#hero-name');
        const heroSubtitle = document.querySelector('#hero-subtitle');
        const heroContent = document.querySelector('#hero-content');
        
        if (!heroTitle || !heroSubtitle) {
            console.warn('Hero elements not found, skipping typing effect');
            return;
        }
        
        // Store original text BEFORE clearing
        const originalTitle = heroTitle.textContent.trim();
        const originalSubtitle = heroSubtitle.textContent.trim();
        const originalContent = heroContent ? heroContent.textContent.trim() : '';
        
        // Safety check: if original text is empty, don't proceed
        if (!originalTitle && !originalSubtitle) {
            console.warn('No original text found in hero elements');
            return;
        }
        
        // Clear initial text
        heroTitle.textContent = '';
        heroSubtitle.textContent = '';
        if (heroContent) {
            heroContent.textContent = '';
        }
        
        // Fallback: restore text after 5 seconds if typing doesn't complete
        const fallbackTimeout = setTimeout(() => {
            if (!heroTitle.textContent || heroTitle.textContent.trim() === '') {
                console.warn('Typing effect timeout, restoring original text');
                heroTitle.textContent = originalTitle;
                heroSubtitle.textContent = originalSubtitle;
                if (heroContent) {
                    heroContent.textContent = originalContent;
                }
            }
        }, 5000);
        
        // Wait for visitor counter or start after short delay
        const startDelay = 1500;
        const startTimeout = setTimeout(() => {
            try {
                // Step 1: Type "I am"
                typeWriter(heroTitle, 'I am ', 100, () => {
                    // Step 2: Type the name
                    typeWriter(heroTitle, originalTitle, 80, () => {
                        // Step 3: Type subtitle
                        typeWriter(heroSubtitle, originalSubtitle, 70, () => {
                            // Step 4: Type content paragraph
                            if (heroContent && originalContent) {
                                setTimeout(() => {
                                    typeWriter(heroContent, originalContent, 30, () => {
                                        clearTimeout(fallbackTimeout);
                                    });
                                }, 400);
                            } else {
                                clearTimeout(fallbackTimeout);
                            }
                        });
                    });
                });
            } catch (error) {
                console.error('Error in typing effect:', error);
                // Restore original text on error
                heroTitle.textContent = originalTitle;
                heroSubtitle.textContent = originalSubtitle;
                if (heroContent) {
                    heroContent.textContent = originalContent;
                }
                clearTimeout(fallbackTimeout);
            }
        }, startDelay);
        
        // Clear timeout if page unloads
        window.addEventListener('beforeunload', () => {
            clearTimeout(startTimeout);
            clearTimeout(fallbackTimeout);
        });
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTypingEffect);
    } else {
        // If DOM is already loaded, wait a bit for other scripts
        setTimeout(initTypingEffect, 100);
    }
})();

