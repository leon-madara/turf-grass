// Products Page Controller
(() => {
    document.addEventListener('DOMContentLoaded', async () => {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;

        try {
            const res = await fetch('public/data/products.json', { cache: 'no-cache' });
            const products = await res.json();

            products.forEach((product) => {
                const card = createProductCard(product, (item) => {
                    if (window.Cart && window.Cart.add) {
                        window.Cart.add(item);
                    }
                });
                grid.appendChild(card);
            });
        } catch (err) {
            console.error('Error loading products:', err);
        }
    });
})();
