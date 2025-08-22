// 3D Product Carousel Animation System
// Creates a tactile, physical feeling with 3D perspective and rotation

document.addEventListener("DOMContentLoaded", () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Animation state management
    const state = {
        currentCard: 1,
        totalCards: 6,
        isAnimating: false,
        scrollProgress: 0
    };

    // Get debug elements
    const debugElements = {
        panel: document.querySelector('.debug-panel'),
        phaseDisplay: document.getElementById('phase-display'),
        progressDisplay: document.getElementById('progress-display'),
        directionDisplay: document.getElementById('direction-display'),
        cardDisplay: document.getElementById('card-display')
    };

    /**
     * Debug logging function
     */
    const debugLog = (message, data = null) => {
        if (debugElements.panel && window.location.hostname === 'localhost') {
            console.log(`[3D Carousel] ${message}`, data || '');
        }
    };

    /**
     * Update debug panel
     */
    const updateDebugDisplay = (progress, direction) => {
        if (!debugElements.panel) return;

        if (debugElements.progressDisplay) {
            debugElements.progressDisplay.textContent = Math.round(progress * 100) + '%';
        }

        if (debugElements.directionDisplay) {
            debugElements.directionDisplay.textContent = direction === 1 ? '↓' : '↑';
        }

        if (debugElements.cardDisplay) {
            debugElements.cardDisplay.textContent = `Card ${state.currentCard}`;
        }
    };

    /**
     * Initialize 3D card stack
     */
    const initialize3DCardStack = () => {
        debugLog('Initializing 3D card stack');

        // Set initial 3D positions for all cards
        for (let i = 1; i <= state.totalCards; i++) {
            const selector = `.col-${i}`;
            const zIndex = state.totalCards - i + 1;

            // Calculate 3D position based on card number
            const depth = (i - 1) * 100; // Z-depth in pixels
            const rotation = (i - 1) * 15; // X-rotation in degrees
            const scale = 1 - (i - 1) * 0.1; // Scale factor
            const opacity = Math.max(0.05, 1 - (i - 1) * 0.3); // Opacity

            gsap.set(selector, {
                zIndex: zIndex,
                opacity: opacity,
                transform: `translate(-50%, -50%) rotateX(${rotation}deg) translateZ(-${depth}px) scale(${scale})`,
                transformOrigin: "center center"
            });
        }

        debugLog('3D card stack initialized');
    };

    /**
     * Calculate target card from scroll progress
     */
    const calculateTargetCard = (progress) => {
        const section = Math.floor(progress * state.totalCards);
        return Math.min(Math.max(section + 1, 1), state.totalCards);
    };

    /**
     * 3D card transition animation
     */
    const transitionToCard = (targetCard) => {
        if (state.isAnimating || targetCard === state.currentCard) return;

        state.isAnimating = true;
        debugLog(`3D transition to card ${targetCard} from card ${state.currentCard}`);

        const tl = gsap.timeline({
            onComplete: () => {
                state.isAnimating = false;
                state.currentCard = targetCard;
                debugLog(`3D transition complete - now showing card ${targetCard}`);
            }
        });

        // Animate all cards to their new 3D positions
        for (let i = 1; i <= state.totalCards; i++) {
            const selector = `.col-${i}`;
            const newPosition = i - targetCard + 1; // Relative position to target card

            // Calculate new 3D properties
            const depth = Math.max(0, (newPosition - 1) * 100);
            const rotation = Math.max(0, (newPosition - 1) * 15);
            const scale = Math.max(0.5, 1 - (newPosition - 1) * 0.1);
            const opacity = Math.max(0.05, 1 - (newPosition - 1) * 0.3);

            tl.to(selector, {
                opacity: opacity,
                transform: `translate(-50%, -50%) rotateX(${rotation}deg) translateZ(-${depth}px) scale(${scale})`,
                duration: 0.8,
                ease: "power2.out"
            }, 0); // All animations start at the same time
        }
    };

    /**
     * Setup ScrollTrigger for 3D carousel
     */
    const setup3DScrollTrigger = () => {
        debugLog('Setting up 3D ScrollTrigger');

        ScrollTrigger.create({
            trigger: ".product-showcase",
            start: "top top",
            end: `+=${window.innerHeight * 4}`, // 4x viewport for 6 cards
            scrub: 1,
            pin: true,
            pinSpacing: true,
            markers: false,

            onUpdate: (self) => {
                const progress = self.progress;
                const direction = self.direction;

                // Update debug display
                updateDebugDisplay(progress, direction);

                // Calculate target card based on progress
                const targetCard = calculateTargetCard(progress);

                // Only animate if target card changed
                if (targetCard !== state.currentCard && !state.isAnimating) {
                    transitionToCard(targetCard);
                }

                // Store current progress
                state.scrollProgress = progress;
            },

            onStart: () => {
                debugLog('3D ScrollTrigger animation started');
            },

            onComplete: () => {
                debugLog('3D ScrollTrigger animation completed');
            }
        });
    };

    /**
     * Handle window resize
     */
    const handleResize = () => {
        debugLog('Window resized, refreshing 3D system');
        ScrollTrigger.getAll().forEach(trigger => trigger.refresh());
    };

    /**
     * Initialize the 3D carousel system
     */
    const initialize = () => {
        debugLog('Initializing 3D carousel system');

        try {
            // Core initialization
            initialize3DCardStack();
            setup3DScrollTrigger();

            // Event listeners
            window.addEventListener('resize', handleResize);

            // Final setup
            ScrollTrigger.refresh();

            debugLog('3D carousel system initialization complete');

        } catch (error) {
            console.error('Failed to initialize 3D carousel system:', error);
        }
    };

    /**
     * Cleanup function
     */
    const cleanup = () => {
        debugLog('Cleaning up 3D carousel system');
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        gsap.globalTimeline.clear();
    };

    // Event listeners for lifecycle management
    window.addEventListener('beforeunload', cleanup);

    // Start the system
    initialize();

    // Expose API for external control (development only)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.carousel3D = {
            goToCard: transitionToCard,
            getCurrentCard: () => state.currentCard,
            getState: () => ({
                ...state
            }),
            refresh: () => {
                ScrollTrigger.refresh();
                debugLog('Manual refresh triggered');
            }
        };

        debugLog('Development API exposed as window.carousel3D');
    }
});