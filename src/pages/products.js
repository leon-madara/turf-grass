import {
    Cart
} from '../state/cartState.js';
import {
    createProductCard
} from '../ui/productCard.js';
import '../components/header.js';
// Products Page Controller
(() => {
    document.addEventListener('DOMContentLoaded', async () => {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;

        try {
            const res = await fetch('/data/products.json', {
                cache: 'no-cache'
            });
            const products = await res.json();

            products.forEach((product) => {
                const card = createProductCard(product, (item) => {
                    Cart.add(item);
                });
                grid.appendChild(card);
            });
        } catch (err) {
            console.error('Error loading products:', err);
        }
    });
})();