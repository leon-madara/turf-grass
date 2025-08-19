// js/state/cartState.js — Central cart state management

const Cart = (() => {
    let items = []; // Array of { id, product, width, height, area, total }
    let discount = 0;
    let subscribers = [];

    function getItems() {
        return [...items]; // return a shallow copy
    }

    function add(item) {
        const id = Date.now();
        items.push({ id, ...item });
        render();
    }

    function remove(id) {
        items = items.filter(it => it.id !== id);
        render();
    }

    function clear() {
        items = [];
        discount = 0;
        render();
    }

    function applyDiscount(code) {
        // Simple demo: hardcoded 10% if code is "SAVE10"
        if (code === "SAVE10") {
            discount = 0.1;
        } else {
            discount = 0;
        }
        render();
    }

    function getTotal() {
        const subtotal = items.reduce((sum, it) => sum + it.total, 0);
        return subtotal - subtotal * discount;
    }

    function render() {
        // Notify all subscribers
        subscribers.forEach(callback => {
            try {
                callback({ items: getItems(), total: getTotal(), discount });
            } catch (e) {
                console.error('Cart subscriber error:', e);
            }
        });
        
        // Optional: trigger UI updates
        if (window.renderCartUI) {
            window.renderCartUI(getItems(), getTotal(), discount);
        }
    }

    function subscribe(callback) {
        subscribers.push(callback);
        // Return unsubscribe function
        return () => {
            const index = subscribers.indexOf(callback);
            if (index > -1) {
                subscribers.splice(index, 1);
            }
        };
    }

    return {
        getItems,
        add,
        remove,
        clear,
        applyDiscount,
        getTotal,
        subscribe
    };
})();

export { Cart };
