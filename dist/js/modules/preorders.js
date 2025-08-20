// Preorders Module - Enhanced functionality for preorder management
(() => {
    let products = [];
    let preorderItems = [];
    let nextPreorderId = 1;

    // Initialize the preorders module
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

    // Add a new preorder item
    function addPreorder() {
        const preorder = {
            id: nextPreorderId++,
            productId: '',
            product: null,
            quantity: 1,
            unitPrice: 0,
            total: 0,
            expectedDate: '',
            specialNotes: ''
        };

        preorderItems.push(preorder);
        updateUI();
        showToast('Preorder item added', 'success');
        
        // Update cart count
        if (window.BrokerDashboard && window.BrokerDashboard.updateCartCount) {
            window.BrokerDashboard.updateCartCount();
        }
    }

    // Remove a preorder item
    function removePreorder(preorderId) {
        preorderItems = preorderItems.filter(preorder => preorder.id !== preorderId);
        updateUI();
        showToast('Preorder item removed', 'success');
        
        // Update cart count
        if (window.BrokerDashboard && window.BrokerDashboard.updateCartCount) {
            window.BrokerDashboard.updateCartCount();
        }
    }

    // Update preorder details
    function updatePreorder(preorderId, field, value) {
        const preorder = preorderItems.find(preorder => preorder.id === preorderId);
        if (!preorder) return;

        if (field === 'productId') {
            const product = products.find(p => p.id === value);
            preorder.productId = value;
            preorder.product = product;
            preorder.unitPrice = product ? product.price : 0;
            preorder.total = preorder.unitPrice * preorder.quantity;
        } else if (field === 'quantity') {
            preorder.quantity = parseFloat(value) || 0;
            preorder.total = preorder.unitPrice * preorder.quantity;
        } else if (field === 'expectedDate') {
            preorder.expectedDate = value;
        } else if (field === 'specialNotes') {
            preorder.specialNotes = value;
        }

        updateUI();
    }

    // Calculate preorder total
    function calculateTotal() {
        return preorderItems.reduce((sum, item) => sum + item.total, 0);
    }

    // Update the UI
    function updateUI() {
        const tableBody = document.getElementById('preorderTableBody');
        const emptyState = document.getElementById('emptyPreorderState');
        const preorderTotal = document.getElementById('preorderTotal');
        const submitBtn = document.getElementById('submitPreordersBtn');

        if (!tableBody || !emptyState || !preorderTotal || !submitBtn) return;

        // Show/hide empty state
        if (preorderItems.length === 0) {
            tableBody.innerHTML = '';
            emptyState.style.display = 'block';
            submitBtn.disabled = true;
        } else {
            emptyState.style.display = 'none';
            submitBtn.disabled = false;
            
            // Render table rows
            tableBody.innerHTML = preorderItems.map(preorder => createPreorderRow(preorder)).join('');
            
            // Add event listeners to new elements
            preorderItems.forEach(preorder => {
                const productSelect = document.getElementById(`preorder-product-${preorder.id}`);
                const quantityInput = document.getElementById(`preorder-quantity-${preorder.id}`);
                const dateInput = document.getElementById(`preorder-date-${preorder.id}`);
                const notesInput = document.getElementById(`preorder-notes-${preorder.id}`);
                const deleteBtn = document.getElementById(`delete-preorder-${preorder.id}`);

                if (productSelect) {
                    productSelect.addEventListener('change', (e) => {
                        updatePreorder(preorder.id, 'productId', e.target.value);
                    });
                }

                if (quantityInput) {
                    quantityInput.addEventListener('input', (e) => {
                        updatePreorder(preorder.id, 'quantity', e.target.value);
                    });
                }

                if (dateInput) {
                    dateInput.addEventListener('change', (e) => {
                        updatePreorder(preorder.id, 'expectedDate', e.target.value);
                    });
                }

                if (notesInput) {
                    notesInput.addEventListener('input', (e) => {
                        updatePreorder(preorder.id, 'specialNotes', e.target.value);
                    });
                }

                if (deleteBtn) {
                    deleteBtn.addEventListener('click', () => {
                        removePreorder(preorder.id);
                    });
                }
            });
        }

        // Update total
        const total = calculateTotal();
        preorderTotal.textContent = total.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // Create preorder row HTML
    function createPreorderRow(preorder) {
        const productOptions = products.map(product => 
            `<option value="${product.id}" ${preorder.productId === product.id ? 'selected' : ''}>
                ${product.name} (${product.thickness})
            </option>`
        ).join('');

        return `
            <tr>
                <td>
                    <select class="table-select" id="preorder-product-${preorder.id}">
                        <option value="">Select a product</option>
                        ${productOptions}
                    </select>
                </td>
                <td>
                    <input type="number" class="table-input" id="preorder-quantity-${preorder.id}" 
                           value="${preorder.quantity}" min="0.1" step="0.1" placeholder="0">
                </td>
                <td>
                    <input type="text" class="table-input" readonly 
                           value="${preorder.unitPrice.toLocaleString('en-US')}">
                </td>
                <td>
                    <input type="date" class="table-input" id="preorder-date-${preorder.id}" 
                           value="${preorder.expectedDate}" placeholder="Expected date">
                </td>
                <td>
                    <input type="text" class="table-input" id="preorder-notes-${preorder.id}" 
                           value="${preorder.specialNotes}" placeholder="Special notes">
                </td>
                <td>
                    <strong>${preorder.total.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}</strong>
                </td>
                <td>
                    <button class="delete-btn" id="delete-preorder-${preorder.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;
    }

    // Submit preorders
    function submitPreorders() {
        if (preorderItems.length === 0) {
            showToast('No preorder items to submit', 'error');
            return;
        }

        // Validate all items have products and quantities
        const invalidItems = preorderItems.filter(item => 
            !item.productId || item.quantity <= 0
        );

        if (invalidItems.length > 0) {
            showToast('Please complete all preorder items before submitting', 'error');
            return;
        }

        try {
            // Prepare preorder data for WhatsApp
            const preorderData = {
                brokerName: 'Broker User', // You can make this dynamic
                brokerEmail: 'broker@eastleighturf.com', // You can make this dynamic
                items: preorderItems.map(item => ({
                    product: item.product,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    total: item.total
                })),
                expectedDate: preorderItems[0]?.expectedDate || 'Not specified',
                specialNotes: preorderItems[0]?.specialNotes || 'None',
                total: calculateTotal()
            };

            // Send to WhatsApp
            const success = window.WhatsAppService.sendPreorderForm(preorderData);
            
            if (success) {
                showToast('Preorders submitted successfully! WhatsApp will open with your preorder details.', 'success');
                
                // Clear preorders
                preorderItems = [];
                nextPreorderId = 1;
                updateUI();
                
                // Update cart count
                if (window.BrokerDashboard && window.BrokerDashboard.updateCartCount) {
                    window.BrokerDashboard.updateCartCount();
                }
            } else {
                showToast('Failed to send preorders. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Preorder submission error:', error);
            showToast('An error occurred while submitting the preorders.', 'error');
        }
    }

    // Get item count for cart
    function getItemCount() {
        return preorderItems.length;
    }

    // Expose module functions
    window.PreordersModule = {
        init,
        addPreorder,
        removePreorder,
        updatePreorder,
        submitPreorders,
        getItemCount
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
