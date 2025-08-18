// Orders Module - Enhanced functionality for order management
(() => {
    let products = [];
    let orderItems = [];
    let nextItemId = 1;

    // Initialize the orders module
    function init() {
        loadProducts();
        updateUI();
    }

    // Load products from the main site's JSON
    async function loadProducts() {
        try {
            const response = await fetch('../public/data/products.json');
            products = await response.json();
        } catch (error) {
            console.error('Failed to load products:', error);
            showToast('Failed to load products', 'error');
        }
    }

    // Add a new item to the order
    function addItem() {
        const item = {
            id: nextItemId++,
            productId: '',
            product: null,
            quantity: 1,
            unitPrice: 0,
            total: 0
        };

        orderItems.push(item);
        updateUI();
        showToast('Item added to order', 'success');
        
        // Update cart count
        if (window.BrokerDashboard && window.BrokerDashboard.updateCartCount) {
            window.BrokerDashboard.updateCartCount();
        }
    }

    // Remove an item from the order
    function removeItem(itemId) {
        orderItems = orderItems.filter(item => item.id !== itemId);
        updateUI();
        showToast('Item removed from order', 'success');
        
        // Update cart count
        if (window.BrokerDashboard && window.BrokerDashboard.updateCartCount) {
            window.BrokerDashboard.updateCartCount();
        }
    }

    // Update item details
    function updateItem(itemId, field, value) {
        const item = orderItems.find(item => item.id === itemId);
        if (!item) return;

        if (field === 'productId') {
            const product = products.find(p => p.id === value);
            item.productId = value;
            item.product = product;
            item.unitPrice = product ? product.price : 0;
            item.total = item.unitPrice * item.quantity;
        } else if (field === 'quantity') {
            item.quantity = parseFloat(value) || 0;
            item.total = item.unitPrice * item.quantity;
        }

        updateUI();
    }

    // Calculate order total
    function calculateTotal() {
        return orderItems.reduce((sum, item) => sum + item.total, 0);
    }

    // Update the UI
    function updateUI() {
        const tableBody = document.getElementById('orderTableBody');
        const emptyState = document.getElementById('emptyOrderState');
        const orderTotal = document.getElementById('orderTotal');
        const submitBtn = document.getElementById('submitOrderBtn');

        if (!tableBody || !emptyState || !orderTotal || !submitBtn) return;

        // Show/hide empty state
        if (orderItems.length === 0) {
            tableBody.innerHTML = '';
            emptyState.style.display = 'block';
            submitBtn.disabled = true;
        } else {
            emptyState.style.display = 'none';
            submitBtn.disabled = false;
            // Render table rows
            tableBody.innerHTML = orderItems.map(item => createOrderRow(item)).join('');
            // Add event listeners to new elements
            orderItems.forEach(item => {
                const productSelect = document.getElementById(`product-${item.id}`);
                const quantityInput = document.getElementById(`quantity-${item.id}`);
                const deleteBtn = document.getElementById(`delete-${item.id}`);

                if (productSelect) {
                    productSelect.addEventListener('change', (e) => {
                        updateItem(item.id, 'productId', e.target.value);
                    });
                }

                if (quantityInput) {
                    // Only update the item value on input, don't re-render the table
                    quantityInput.addEventListener('input', (e) => {
                        const value = e.target.value;
                        const itemObj = orderItems.find(it => it.id === item.id);
                        if (itemObj) {
                            itemObj.quantity = parseFloat(value) || 0;
                            itemObj.total = itemObj.unitPrice * itemObj.quantity;
                            // Only update the total cell, not the whole table
                            const totalCell = quantityInput.closest('tr').querySelector('.order-field strong');
                            if (totalCell) {
                                totalCell.textContent = itemObj.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                            }
                            // Also update the order total
                            const orderTotal = document.getElementById('orderTotal');
                            if (orderTotal) {
                                const total = calculateTotal();
                                orderTotal.textContent = total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                            }
                        }
                    });
                    // On blur or Enter, re-render the table to ensure everything is in sync
                    quantityInput.addEventListener('blur', () => updateUI());
                    quantityInput.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            updateUI();
                        }
                    });
                }

                if (deleteBtn) {
                    deleteBtn.addEventListener('click', () => {
                        removeItem(item.id);
                    });
                }
            });
        }

        // Update total
        const total = calculateTotal();
        orderTotal.textContent = total.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // Create order row HTML
    function createOrderRow(item) {
        const productOptions = products.map(product => 
            `<option value="${product.id}" ${item.productId === product.id ? 'selected' : ''}>
                ${product.name} (${product.thickness})
            </option>`
        ).join('');

        return `
            <tr>
                <td>
                  <div class="order-field">
                    <label for="product-${item.id}">Product Name</label>
                    <select class="table-select" id="product-${item.id}">
                        <option value="">Select a product</option>
                        ${productOptions}
                    </select>
                  </div>
                </td>
                <td>
                  <div class="order-field">
                    <label for="quantity-${item.id}">Quantity (m²)</label>
                    <input type="number" inputmode="decimal" class="table-input" id="quantity-${item.id}" 
                           value="${item.quantity}" min="0.1" step="0.1" placeholder="0">
                  </div>
                </td>
                <td>
                  <div class="order-field">
                    <label>Unit Price (KES)</label>
                    <input type="text" class="table-input" readonly 
                           value="${item.unitPrice.toLocaleString('en-US')}">
                  </div>
                </td>
                <td>
                  <div class="order-field">
                    <label>Total (KES)</label>
                    <strong>${item.total.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}</strong>
                  </div>
                </td>
                <td>
                  <div class="order-field">
                    <label>Action</label>
                    <button class="delete-btn" id="delete-${item.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                  </div>
                </td>
            </tr>
        `;
    }

    // Add any other module exports or initialization here if needed

})();