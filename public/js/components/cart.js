// Cart Component
(() => {
    let cartItems = [];
    let cartTotal = 0;

    // Initialize cart
    function init() {
        loadCartFromStorage();
        updateCartDisplay();
        bindEvents();
    }

    // Load cart from localStorage
    function loadCartFromStorage() {
        const savedCart = localStorage.getItem('eastleighCart');
        if (savedCart) {
            try {
                cartItems = JSON.parse(savedCart);
                calculateTotal();
            } catch (error) {
                console.error('Error loading cart from storage:', error);
                cartItems = [];
            }
        }
    }

    // Save cart to localStorage
    function saveCartToStorage() {
        localStorage.setItem('eastleighCart', JSON.stringify(cartItems));
    }

    // Add item to cart
    function addItem(item) {
        const existingItemIndex = cartItems.findIndex(cartItem => 
            cartItem.id === item.id && 
            cartItem.length === item.length && 
            cartItem.width === item.width
        );

        if (existingItemIndex !== -1) {
            cartItems[existingItemIndex].quantity += item.quantity;
        } else {
            cartItems.push(item);
        }

        calculateTotal();
        saveCartToStorage();
        updateCartDisplay();
        showToast('Item Added', `${item.name} has been added to your cart`, 'success');
    }

    // Remove item from cart
    function removeItem(index) {
        const removedItem = cartItems[index];
        cartItems.splice(index, 1);
        calculateTotal();
        saveCartToStorage();
        updateCartDisplay();
        showToast('Item Removed', `${removedItem.name} has been removed from your cart`, 'error');
    }

    // Update item quantity
    function updateItemQuantity(index, newQuantity) {
        if (newQuantity <= 0) {
            removeItem(index);
            return;
        }

        cartItems[index].quantity = newQuantity;
        cartItems[index].total = cartItems[index].area * cartItems[index].price * newQuantity;
        calculateTotal();
        saveCartToStorage();
        updateCartDisplay();
    }

    // Calculate total
    function calculateTotal() {
        cartTotal = cartItems.reduce((total, item) => total + item.total, 0);
    }

    // Update cart display
    function updateCartDisplay() {
        updateCartCount();
        updateCartPanel();
        updateCartModal();
    }

    // Update cart count in header
    function updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        const cartCountBadge = document.getElementById('cartCountBadge');
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

        if (cartCount) cartCount.textContent = totalItems;
        if (cartCountBadge) cartCountBadge.textContent = totalItems;
    }

    // Update cart panel
    function updateCartPanel() {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartSummary = document.getElementById('cartSummary');
        const cartTotalElement = document.getElementById('cartTotal');

        if (!cartItemsContainer) return;

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-basket"></i>
                    <p>Your cart is empty</p>
                    <span>Add some products to get started</span>
                </div>
            `;
            if (cartSummary) cartSummary.style.display = 'none';
        } else {
            cartItemsContainer.innerHTML = cartItems.map((item, index) => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}" />
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-dimensions">${item.length}m × ${item.width}m</div>
                        <div class="cart-item-price">KES ${item.total.toLocaleString()}</div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="window.Cart.updateQuantity(${index}, ${item.quantity - 1})">-</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn" onclick="window.Cart.updateQuantity(${index}, ${item.quantity + 1})">+</button>
                        </div>
                        <button class="remove-item-btn" onclick="window.Cart.remove(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');

            if (cartSummary) {
                cartSummary.style.display = 'block';
                if (cartTotalElement) cartTotalElement.textContent = `KES ${cartTotal.toLocaleString()}`;
            }
        }
    }

    // Update cart modal
    function updateCartModal() {
        const cartModalItems = document.getElementById('cartModalItems');
        const cartModalTotal = document.getElementById('cartModalTotal');

        if (cartModalItems) {
            if (cartItems.length === 0) {
                cartModalItems.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-basket"></i>
                        <p>Your cart is empty</p>
                        <span>Add some products to get started</span>
                    </div>
                `;
            } else {
                cartModalItems.innerHTML = cartItems.map((item, index) => `
                    <div class="cart-item">
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.name}" />
                        </div>
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-dimensions">${item.length}m × ${item.width}m</div>
                            <div class="cart-item-price">KES ${item.total.toLocaleString()}</div>
                        </div>
                        <div class="cart-item-actions">
                            <div class="quantity-controls">
                                <button class="quantity-btn" onclick="window.Cart.updateQuantity(${index}, ${item.quantity - 1})">-</button>
                                <span class="quantity-display">${item.quantity}</span>
                                <button class="quantity-btn" onclick="window.Cart.updateQuantity(${index}, ${item.quantity + 1})">+</button>
                            </div>
                            <button class="remove-item-btn" onclick="window.Cart.remove(${index})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('');
            }
        }

        if (cartModalTotal) {
            cartModalTotal.textContent = `KES ${cartTotal.toLocaleString()}`;
        }
    }

    // Show cart modal
    function showCartModal() {
        const cartModal = document.getElementById('cartModal');
        if (cartModal) {
            cartModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // Hide cart modal
    function hideCartModal() {
        const cartModal = document.getElementById('cartModal');
        if (cartModal) {
            cartModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Clear cart
    function clearCart() {
        cartItems = [];
        cartTotal = 0;
        saveCartToStorage();
        updateCartDisplay();
        showToast('Cart Cleared', 'All items have been removed from your cart', 'error');
    }

    // Checkout via WhatsApp
    function checkoutViaWhatsApp() {
        if (cartItems.length === 0) {
            showToast('Empty Cart', 'Please add items to your cart before checkout', 'error');
            return;
        }

        try {
            // Prepare cart data for WhatsApp
            const cartData = {
                customerName: 'Customer', // You can make this dynamic
                customerEmail: 'customer@example.com', // You can make this dynamic
                items: cartItems.map(item => ({
                    product: { name: item.name },
                    quantity: item.quantity,
                    unitPrice: item.price,
                    total: item.total
                })),
                total: cartTotal
            };

            // Send to WhatsApp
            const success = window.WhatsAppService.sendOrderForm(cartData);
            
            if (success) {
                showToast('Checkout', 'WhatsApp will open with your order details. Please complete your purchase there.', 'success');
                // Optionally clear cart after successful checkout
                // clearCart();
            } else {
                showToast('Checkout Failed', 'Failed to open WhatsApp. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            showToast('Checkout Error', 'An error occurred during checkout. Please try again.', 'error');
        }
    }

    // Show toast notification
    function showToast(title, description, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;

        const toastTitle = toast.querySelector('.toast-title');
        const toastDescription = toast.querySelector('.toast-description');

        if (toastTitle) toastTitle.textContent = title;
        if (toastDescription) toastDescription.textContent = description;

        toast.className = `toast ${type}`;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Bind events
    function bindEvents() {
        // Close modal button
        const closeCartModal = document.getElementById('closeCartModal');
        if (closeCartModal) {
            closeCartModal.addEventListener('click', hideCartModal);
        }

        // Modal overlay click
        const cartModalOverlay = document.querySelector('.cart-modal-overlay');
        if (cartModalOverlay) {
            cartModalOverlay.addEventListener('click', hideCartModal);
        }

        // Clear cart buttons
        const clearCartBtn = document.getElementById('clearCartBtn');
        const clearCartModalBtn = document.getElementById('clearCartModalBtn');
        
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', clearCart);
        }
        if (clearCartModalBtn) {
            clearCartModalBtn.addEventListener('click', clearCart);
        }

        // Checkout buttons
        const submitOrderBtn = document.getElementById('submitOrderBtn');
        const checkoutModalBtn = document.getElementById('checkoutModalBtn');
        
        if (submitOrderBtn) {
            submitOrderBtn.addEventListener('click', () => {
                checkoutViaWhatsApp();
            });
        }
        if (checkoutModalBtn) {
            checkoutModalBtn.addEventListener('click', () => {
                hideCartModal();
                checkoutViaWhatsApp();
            });
        }

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hideCartModal();
            }
        });
    }

    // Public API
    window.Cart = {
        init,
        add: addItem,
        remove: removeItem,
        updateQuantity: updateItemQuantity,
        clear: clearCart,
        showModal: showCartModal,
        hideModal: hideCartModal,
        getItems: () => cartItems,
        getTotal: () => cartTotal,
        getCount: () => cartItems.reduce((total, item) => total + item.quantity, 0)
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
