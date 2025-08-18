// Interactive Before/After Slider
(() => {
    let isDragging = false;
    let isActive = false;
    let startPosition = 0;
    let currentPosition = 0;
    let isMobile = false;

    // DOM elements
    let baHandle, baAfter, heroContent, heroTitle, heroButtons, heroStats;

    function init() {
        // Get DOM elements
        baHandle = document.querySelector('.ba-handle');
        baAfter = document.querySelector('.ba-after');
        heroContent = document.querySelector('.hero-content');
        heroTitle = document.querySelector('.hero-title');
        heroButtons = document.querySelector('.hero-buttons');
        heroStats = document.querySelector('.hero-stats');

        if (!baHandle || !baAfter) return;

        // Check if mobile
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Set initial position
        setSliderPosition(50);

        // Bind events
        bindEvents();
    }

    function checkMobile() {
        isMobile = window.innerWidth <= 768;
        updateSliderOrientation();
    }

    function updateSliderOrientation() {
        if (isMobile) {
            // Vertical layout for mobile
            document.body.classList.add('mobile-slider');
            document.body.classList.remove('desktop-slider');
        } else {
            // Horizontal layout for desktop
            document.body.classList.add('desktop-slider');
            document.body.classList.remove('mobile-slider');
        }
    }

    function bindEvents() {
        // Mouse events for desktop
        baHandle.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);

        // Touch events for mobile
        baHandle.addEventListener('touchstart', startDrag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('touchend', endDrag);

        // Click to activate
        baHandle.addEventListener('click', activateSlider);
    }

    function startDrag(e) {
        e.preventDefault();
        isDragging = true;
        isActive = true;
        
        // Hide content
        hideContent();

        // Get start position relative to hero container
        if (isMobile) {
            const heroContainer = document.querySelector('.hero');
            const heroRect = heroContainer.getBoundingClientRect();
            const currentPos = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
            startPosition = currentPos - heroRect.top;
        } else {
            const heroContainer = document.querySelector('.hero');
            const heroRect = heroContainer.getBoundingClientRect();
            const currentPos = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
            startPosition = currentPos - heroRect.left;
        }

        // Add dragging class
        baHandle.classList.add('dragging');
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();

        // Get current position
        let currentPos;
        if (isMobile) {
            currentPos = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
        } else {
            currentPos = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        }

        // Calculate position percentage based on hero container
        let percentage;
        if (isMobile) {
            const heroContainer = document.querySelector('.hero');
            const heroRect = heroContainer.getBoundingClientRect();
            const heroHeight = heroRect.height;
            const heroTop = heroRect.top;
            
            // Calculate position relative to hero container (5vh to 95vh range)
            const relativePos = currentPos - heroTop;
            percentage = Math.max(5, Math.min(95, (relativePos / heroHeight) * 100));
        } else {
            const heroContainer = document.querySelector('.hero');
            const heroRect = heroContainer.getBoundingClientRect();
            const heroWidth = heroRect.width;
            const heroLeft = heroRect.left;
            
            // Calculate position relative to hero container
            const relativePos = currentPos - heroLeft;
            percentage = Math.max(0, Math.min(100, (relativePos / heroWidth) * 100));
        }

        // Update slider position
        setSliderPosition(percentage);
    }

    function endDrag(e) {
        if (!isDragging) return;
        
        isDragging = false;
        baHandle.classList.remove('dragging');

        // Return to center with animation
        returnToCenter();
    }

    function activateSlider(e) {
        if (isDragging) return;
        
        isActive = true;
        hideContent();
        
        // Return to center after a brief delay
        setTimeout(() => {
            returnToCenter();
        }, 100);
    }

    function hideContent() {
        if (heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.pointerEvents = 'none';
        }
    }

    function showContent() {
        if (heroContent) {
            heroContent.style.opacity = '1';
            heroContent.style.pointerEvents = 'auto';
        }
    }

    function setSliderPosition(percentage) {
        currentPosition = percentage;
        
        if (isMobile) {
            // Vertical slider - after image on top, before on bottom
            baHandle.style.top = `${percentage}%`;
            baAfter.style.clipPath = `inset(0 0 ${100 - percentage}% 0)`;
        } else {
            // Horizontal slider
            baHandle.style.left = `${percentage}%`;
            baAfter.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        }
    }

    function returnToCenter() {
        const duration = 800; // 800ms animation
        const startTime = performance.now();
        const startPosition = currentPosition;
        const targetPosition = 50;

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            const newPosition = startPosition + (targetPosition - startPosition) * easeProgress;
            setSliderPosition(newPosition);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Animation complete - reset all states
                isActive = false;
                isDragging = false;
                currentPosition = 50;
                showContent();
                
                // Ensure handle is back to center
                if (isMobile) {
                    baHandle.style.top = '50%';
                } else {
                    baHandle.style.left = '50%';
                }
                
                // Reset clip-path to center
                if (isMobile) {
                    baAfter.style.clipPath = 'inset(0 0 50% 0)';
                } else {
                    baAfter.style.clipPath = 'inset(0 50% 0 0)';
                }
            }
        }

        requestAnimationFrame(animate);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
