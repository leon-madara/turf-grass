import '../ui/brokerLoginModal.js';
import '../effects/slider.js';
import '../components/header.js';
// public/js/pages/index.js
(() => {
    // homepage-only JS here

    document.addEventListener('DOMContentLoaded', async () => {
        // Hero slider
        const slides = document.querySelectorAll('.hero-slide');
        let currentIndex = 0;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        }

        if (slides.length > 0) {
            showSlide(currentIndex);
            setInterval(nextSlide, 5000);
        }

        // Keep cart badge updated
        if (window.Cart && window.Cart.subscribe) {
            window.Cart.subscribe((state) => {
                const countEl = document.getElementById('cartCount');
                if (countEl) countEl.textContent = state.items.length;
            });
        }
    });
})();