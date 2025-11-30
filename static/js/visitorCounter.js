// Visitor Counter using CounterAPI.dev
(function() {
    'use strict';
    
    // CounterAPI.dev configuration
    const COUNTER_API_BASE = 'https://api.counterapi.dev/v2/mahmoud-adels-team-1888/first-counter-1888';
    const API_KEY = 'ut_NVmvC3BzOf7Sxhhh9f5csFVXC4qX32MIf45a7GUo';
    
    // Helper function to create a timeout promise
    function timeout(ms) {
        return new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), ms));
    }

    // Update the visitor count in the hero section
    async function updateVisitorCount() {
        const introElement = document.querySelector('.hero-intro');
        
        if (!introElement) {
            console.warn('Visitor counter: .hero-intro element not found');
            return;
        }
        
        // Show default message immediately to ensure it's always visible
        introElement.textContent = `Hi visitor!`;
        introElement.style.opacity = '1';
        introElement.style.transition = 'opacity 0.3s ease-in';
        
        try {
            // Use API key as query parameter to avoid CORS issues with Authorization header
            // First, increment the counter with timeout
            const incrementUrl = `${COUNTER_API_BASE}/up?api_key=${encodeURIComponent(API_KEY)}`;
            const incrementResponse = await Promise.race([
                fetch(incrementUrl, {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json'
                    }
                }),
                timeout(5000) // 5 second timeout
            ]);
            
            if (!incrementResponse.ok) {
                throw new Error(`Increment failed: ${incrementResponse.status}`);
            }
            
            const incrementData = await incrementResponse.json();
            console.log('Increment response:', incrementData);
            
            // Get the current counter value with timeout
            const getUrl = `${COUNTER_API_BASE}?api_key=${encodeURIComponent(API_KEY)}`;
            const getResponse = await Promise.race([
                fetch(getUrl, {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json'
                    }
                }),
                timeout(5000) // 5 second timeout
            ]);
            
            if (!getResponse.ok) {
                throw new Error(`Get counter failed: ${getResponse.status}`);
            }
            
            const counterData = await getResponse.json();
            console.log('Counter response:', counterData);
            
            // Extract the count value from the API response
            // API returns: { code: "200", data: { up_count: number, ... } }
            let count = 0;
            
            if (counterData && counterData.data) {
                if (counterData.data.up_count !== undefined) {
                    count = parseInt(counterData.data.up_count, 10) || 0;
                } else if (counterData.data.value !== undefined) {
                    count = parseInt(counterData.data.value, 10) || 0;
                } else if (counterData.data.count !== undefined) {
                    count = parseInt(counterData.data.count, 10) || 0;
                }
            } else if (counterData) {
                // Fallback: check top-level fields
                if (counterData.value !== undefined) {
                    count = parseInt(counterData.value, 10) || 0;
                } else if (counterData.count !== undefined) {
                    count = parseInt(counterData.count, 10) || 0;
                } else if (counterData.up_count !== undefined) {
                    count = parseInt(counterData.up_count, 10) || 0;
                }
            }
            
            console.log('Extracted count:', count);
            
            // Update the visitor count if we got a valid count
            if (count > 0) {
                introElement.textContent = `Hi visitor #${count}`;
            }
            // If count is 0, keep the default "Hi visitor!" message
        } catch (error) {
            console.error('Error fetching visitor count from CounterAPI:', error);
            // Keep the default message that was already shown
            // Element is already visible, so no need to change opacity
        }
    }
    
    // Initialize when DOM is ready
    function initVisitorCounter() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(updateVisitorCount, 500);
            });
        } else {
            setTimeout(updateVisitorCount, 500);
        }
    }
    
    // Initialize
    initVisitorCounter();
})();

