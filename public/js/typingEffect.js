// Typing Effect for Hero Section
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
                setTimeout(callback, 200); // Small delay before next action
            }
        }
        
        type();
    }
    
    function initTypingEffect() {
        const heroTitle = document.querySelector('#hero-name');
        const heroSubtitle = document.querySelector('#hero-subtitle');
        const heroContent = document.querySelector('#hero-content');
        
        if (!heroTitle || !heroSubtitle) {
            return;
        }
        
        // Store original text
        const originalTitle = heroTitle.textContent.trim();
        const originalSubtitle = heroSubtitle.textContent.trim();
        const originalContent = heroContent ? heroContent.textContent.trim() : '';
        
        // Clear initial text
        heroTitle.textContent = '';
        heroSubtitle.textContent = '';
        if (heroContent) {
            heroContent.textContent = '';
        }
        
        // Wait for visitor counter to update, then start typing sequence
        setTimeout(() => {
            // Step 1: Type "I am"
            typeWriter(heroTitle, 'I am ', 100, () => {
                // Step 2: Type "Mahmoud" (or the name from config)
                typeWriter(heroTitle, originalTitle, 80, () => {
                    // Step 3: Type subtitle "Penetration Tester"
                    typeWriter(heroSubtitle, originalSubtitle, 70, () => {
                        // Step 4: Type content paragraph
                        if (heroContent && originalContent) {
                            setTimeout(() => {
                                typeWriter(heroContent, originalContent, 30);
                            }, 400);
                        }
                    });
                });
            });
        }, 1500); // Wait 1.5 seconds for visitor counter to display
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTypingEffect);
    } else {
        initTypingEffect();
    }
})();

