document.addEventListener("DOMContentLoaded", () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Track current animation phase
    let currentPhase = 0;

    // Get debug elements for real-time feedback
    const phaseDisplay = document.getElementById('phase-display');
    const progressDisplay = document.getElementById('progress-display');
    const directionDisplay = document.getElementById('direction-display');

    // Configuration for the flip animation
    const config = {
        perspective: 1200,
        flipDuration: 1.2,
        ease: "power2.inOut"
    };

    // Set initial states - all cards in the same position
    gsap.set(".product-card", {
        position: "absolute",
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        rotationX: 0,
        rotationY: 0,
        opacity: 0,
        z: 0,
        scale: 1
    });

    // Only show the first card initially
    gsap.set(".col-1", {
        opacity: 1,
        z: 0,
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        zIndex: 6
    });

    // Main ScrollTrigger configuration
    ScrollTrigger.create({
        trigger: ".product-showcase",
        start: "top top",
        end: `+=${window.innerHeight * 6}`,
        scrub: 1.2,
        pin: true,
        pinSpacing: true,
        markers: false,

        onUpdate: (self) => {
            const progress = self.progress;
            const direction = self.direction;

            // Update debug display
            progressDisplay.textContent = Math.round(progress * 100) + '%';
            directionDisplay.textContent = direction === 1 ? 'Forward' : 'Backward';

            /**
             * FORWARD ANIMATIONS
             */

            // PHASE 1: 0% to 16.6% progress
            // Flip from Card 1 to Card 2
            if (progress >= 0.166 && currentPhase === 0) {
                currentPhase = 1;
                phaseDisplay.textContent = currentPhase;

                // Card 1: Flip forward (like turning a page)
                gsap.to(".col-1", {
                    rotationX: 90,
                    opacity: 0,
                    duration: config.flipDuration,
                    ease: config.ease,
                    onComplete: () => {
                        // After flip completes, reset z-index and opacity
                        gsap.set(".col-1", {
                            zIndex: 1,
                            opacity: 0
                        });
                    }
                });

                // Card 2: Flip up from behind
                gsap.set(".col-2", {
                    zIndex: 6,
                    rotationX: -90,
                    opacity: 1
                });

                gsap.to(".col-2", {
                    rotationX: 0,
                    duration: config.flipDuration,
                    ease: config.ease
                });
            }

            // PHASE 2: 16.6% to 33.2% progress
            // Flip from Card 2 to Card 3
            if (progress >= 0.332 && currentPhase === 1) {
                currentPhase = 2;
                phaseDisplay.textContent = currentPhase;

                // Card 2: Flip forward
                gsap.to(".col-2", {
                    rotationX: 90,
                    opacity: 0,
                    duration: config.flipDuration,
                    ease: config.ease,
                    onComplete: () => {
                        gsap.set(".col-2", {
                            zIndex: 1,
                            opacity: 0
                        });
                    }
                });

                // Card 3: Flip up from behind
                gsap.set(".col-3", {
                    zIndex: 6,
                    rotationX: -90,
                    opacity: 1
                });

                gsap.to(".col-3", {
                    rotationX: 0,
                    duration: config.flipDuration,
                    ease: config.ease
                });
            }

            // PHASE 3: 33.2% to 49.8% progress
            // Flip from Card 3 to Card 4
            if (progress >= 0.498 && currentPhase === 2) {
                currentPhase = 3;
                phaseDisplay.textContent = currentPhase;

                // Card 3: Flip forward
                gsap.to(".col-3", {
                    rotationX: 90,
                    opacity: 0,
                    duration: config.flipDuration,
                    ease: config.ease,
                    onComplete: () => {
                        gsap.set(".col-3", {
                            zIndex: 1,
                            opacity: 0
                        });
                    }
                });

                // Card 4: Flip up from behind
                gsap.set(".col-4", {
                    zIndex: 6,
                    rotationX: -90,
                    opacity: 1
                });

                gsap.to(".col-4", {
                    rotationX: 0,
                    duration: config.flipDuration,
                    ease: config.ease
                });
            }

            // PHASE 4: 49.8% to 66.4% progress
            // Flip from Card 4 to Card 5
            if (progress >= 0.664 && currentPhase === 3) {
                currentPhase = 4;
                phaseDisplay.textContent = currentPhase;

                // Card 4: Flip forward
                gsap.to(".col-4", {
                    rotationX: 90,
                    opacity: 0,
                    duration: config.flipDuration,
                    ease: config.ease,
                    onComplete: () => {
                        gsap.set(".col-4", {
                            zIndex: 1,
                            opacity: 0
                        });
                    }
                });

                // Card 5: Flip up from behind
                gsap.set(".col-5", {
                    zIndex: 6,
                    rotationX: -90,
                    opacity: 1
                });

                gsap.to(".col-5", {
                    rotationX: 0,
                    duration: config.flipDuration,
                    ease: config.ease
                });
            }

            // PHASE 5: 66.4% to 83% progress
            // Flip from Card 5 to Card 6
            if (progress >= 0.83 && currentPhase === 4) {
                currentPhase = 5;
                phaseDisplay.textContent = currentPhase;

                // Card 5: Flip forward
                gsap.to(".col-5", {
                    rotationX: 90,
                    opacity: 0,
                    duration: config.flipDuration,
                    ease: config.ease,
                    onComplete: () => {
                        gsap.set(".col-5", {
                            zIndex: 1,
                            opacity: 0
                        });
                    }
                });

                // Card 6: Flip up from behind
                gsap.set(".col-6", {
                    zIndex: 6,
                    rotationX: -90,
                    opacity: 1
                });

                gsap.to(".col-6", {
                    rotationX: 0,
                    duration: config.flipDuration,
                    ease: config.ease
                });
            }

            /**
             * REVERSE ANIMATIONS
             */

            // Reverse from Phase 5 to Phase 4
            if (progress < 0.83 && currentPhase === 5) {
                currentPhase = 4;
                phaseDisplay.textContent = currentPhase;

                // Card 6: Flip backward
                gsap.to(".col-6", {
                    rotationX: -90,
                    opacity: 0,
                    duration: config.flipDuration,
                    ease: config.ease,
                    onComplete: () => {
                        gsap.set(".col-6", {
                            zIndex: 1,
                            opacity: 0
                        });
                    }
                });

                // Card 5: Flip down from above
                gsap.set(".col-5", {
                    zIndex: 6,
                    rotationX: 90,
                    opacity: 1
                });

                gsap.to(".col-5", {
                    rotationX: 0,
                    duration: config.flipDuration,
                    ease: config.ease
                });
            }

            // Reverse from Phase 4 to Phase 3
            if (progress < 0.664 && currentPhase === 4) {
                currentPhase = 3;
                phaseDisplay.textContent = currentPhase;

                // Card 5: Flip backward
                gsap.to(".col-5", {
                    rotationX: -90,
                    opacity: 0,
                    duration: config.flipDuration,
                    ease: config.ease,
                    onComplete: () => {
                        gsap.set(".col-5", {
                            zIndex: 1,
                            opacity: 0
                        });
                    }
                });

                // Card 4: Flip down from above
                gsap.set(".col-4", {
                    zIndex: 6,
                    rotationX: 90,
                    opacity: 1
                });

                gsap.to(".col-4", {
                    rotationX: 0,
                    duration: config.flipDuration,
                    ease: config.ease
                });
            }

            // Reverse from Phase 3 to Phase 2
            if (progress < 0.498 && currentPhase === 3) {
                currentPhase = 2;
                phaseDisplay.textContent = currentPhase;

                // Card 4: Flip backward
                gsap.to(".col-4", {
                    rotationX: -90,
                    opacity: 0,
                    duration: config.flipDuration,
                    ease: config.ease,
                    onComplete: () => {
                        gsap.set(".col-4", {
                            zIndex: 1,
                            opacity: 0
                        });
                    }
                });

                // Card 3: Flip down from above
                gsap.set(".col-3", {
                    zIndex: 6,
                    rotationX: 90,
                    opacity: 1
                });

                gsap.to(".col-3", {
                    rotationX: 0,
                    duration: config.flipDuration,
                    ease: config.ease
                });
            }

            // Reverse from Phase 2 to Phase 1
            if (progress < 0.332 && currentPhase === 2) {
                currentPhase = 1;
                phaseDisplay.textContent = currentPhase;

                // Card 3: Flip backward
                gsap.to(".col-3", {
                    rotationX: -90,
                    opacity: 0,
                    duration: config.flipDuration,
                    ease: config.ease,
                    onComplete: () => {
                        gsap.set(".col-3", {
                            zIndex: 1,
                            opacity: 0
                        });
                    }
                });

                // Card 2: Flip down from above
                gsap.set(".col-2", {
                    zIndex: 6,
                    rotationX: 90,
                    opacity: 1
                });

                gsap.to(".col-2", {
                    rotationX: 0,
                    duration: config.flipDuration,
                    ease: config.ease
                });
            }

            // Reverse from Phase 1 to Phase 0
            if (progress < 0.166 && currentPhase === 1) {
                currentPhase = 0;
                phaseDisplay.textContent = currentPhase;

                // Card 2: Flip backward
                gsap.to(".col-2", {
                    rotationX: -90,
                    opacity: 0,
                    duration: config.flipDuration,
                    ease: config.ease,
                    onComplete: () => {
                        gsap.set(".col-2", {
                            zIndex: 1,
                            opacity: 0
                        });
                    }
                });

                // Card 1: Flip down from above
                gsap.set(".col-1", {
                    zIndex: 6,
                    rotationX: 90,
                    opacity: 1
                });

                gsap.to(".col-1", {
                    rotationX: 0,
                    duration: config.flipDuration,
                    ease: config.ease
                });
            }
        }
    });

    // Refresh ScrollTrigger
    ScrollTrigger.refresh();

    // Handle window resize
    window.addEventListener('resize', () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.refresh());
    });
});