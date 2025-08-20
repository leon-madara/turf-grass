/**
 * Floating Navbar Controller
 * 
 * Implements a floating navbar that activates when user scrolls past hero section
 * Works with both glassmorphism and floating states
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const header = document.querySelector('.header');
    const heroSection = document.querySelector('.contact-hero') || document.querySelector('.hero') || document.querySelector('.title-page');
    
    // Configuration
    const config = {
        // Distance from top when floating should activate
        offset: 100,
        // Class to add when floating
        floatingClass: 'floating',
        // Smoothness of the transition
        debounceDelay: 100
    };

    // State tracking
    let isFloating = false;
    let ticking = false;
    let lastScrollY = window.scrollY;

    /**
     * Check scroll position and update navbar state
     */
    function checkScroll() {
        const currentScrollY = window.scrollY;
        
        // Determine if we should be floating
        const shouldBeFloating = currentScrollY >= config.offset;
        
        // Only update if state changed
        if (shouldBeFloating !== isFloating) {
            updateFloatingState(shouldBeFloating);
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }

    /**
     * Update the floating state of the navbar
     * @param {boolean} floating - Whether to activate floating state
     */
    function updateFloatingState(floating) {
        if (floating) {
            header.classList.add(config.floatingClass);
            // Add data attribute for CSS targeting
            header.setAttribute('data-state', 'floating');
        } else {
            header.classList.remove(config.floatingClass);
            header.removeAttribute('data-state');
        }
        
        isFloating = floating;
        
        // Dispatch custom event for other scripts to listen to
        const event = new CustomEvent('navbarStateChange', {
            detail: { floating: isFloating }
        });
        window.dispatchEvent(event);
    }

    /**
     * Debounced scroll handler to improve performance
     */
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                checkScroll();
                ticking = false;
            });
            ticking = true;
        }
    }

    /**
     * Initialize the floating navbar
     */
    function init() {
        // Initial state check
        checkScroll();
        
        // Add scroll event listener
        window.addEventListener('scroll', onScroll, { passive: true });
        
        // Handle resize events (important for mobile)
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Refresh scroll position on resize
                lastScrollY = -1; // Force update on next scroll
                checkScroll();
            }, 250);
        });
        
        // Handle orientation change (mobile)
        window.addEventListener('orientationchange', () => {
            // Small delay to ensure DOM has settled
            setTimeout(checkScroll, 300);
        });
        
        // Optional: Add smooth transition when page loads
        setTimeout(() => {
            header.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }, 100);
    }

    // Initialize when DOM is ready
    init();

    // Expose public methods for external use
    window.Navbar = {
        enableFloating: () => updateFloatingState(true),
        disableFloating: () => updateFloatingState(false),
        toggleFloating: () => updateFloatingState(!isFloating),
        getState: () => ({ floating: isFloating }),
        refresh: () => checkScroll()
    };
});