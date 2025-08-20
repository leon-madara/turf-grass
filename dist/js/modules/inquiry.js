// Inquiry Module - Enhanced functionality for price inquiries
(() => {
    let products = [];
    let inquiryItems = [];
    let nextInquiryId = 1;

    // Initialize the inquiry module
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

    // Add a new inquiry
    function addInquiry() {
        const inquiry = {
            id: nextInquiryId++,
            productId: '',
            product: null,
            originalPrice: 0,
            bargainPrice: 0,
            difference: 0
        };

        inquiryItems.push(inquiry);
        updateUI();
        showToast('Inquiry added', 'success');
        
        // Update cart count
        if (window.BrokerDashboard && window.BrokerDashboard.updateCartCount) {
            window.BrokerDashboard.updateCartCount();
        }
    }

    // Remove an inquiry
    function removeInquiry(inquiryId) {
        inquiryItems = inquiryItems.filter(inquiry => inquiry.id !== inquiryId);
        updateUI();
        showToast('Inquiry removed', 'success');
        
        // Update cart count
        if (window.BrokerDashboard && window.BrokerDashboard.updateCartCount) {
            window.BrokerDashboard.updateCartCount();
        }
    }

    // Update inquiry details
    function updateInquiry(inquiryId, field, value) {
        const inquiry = inquiryItems.find(inquiry => inquiry.id === inquiryId);
        if (!inquiry) return;

        if (field === 'productId') {
            const product = products.find(p => p.id === value);
            inquiry.productId = value;
            inquiry.product = product;
            inquiry.originalPrice = product ? product.price : 0;
            inquiry.difference = inquiry.bargainPrice - inquiry.originalPrice;
        } else if (field === 'bargainPrice') {
            inquiry.bargainPrice = parseFloat(value) || 0;
            inquiry.difference = inquiry.bargainPrice - inquiry.originalPrice;
        }

        updateUI();
    }

    // Get price difference class
    function getPriceDifferenceClass(difference) {
        if (difference < 0) return 'negative';
        if (difference > 0) return 'positive';
        return 'neutral';
    }

    // Format price difference
    function formatPriceDifference(difference) {
        const absDiff = Math.abs(difference);
        const sign = difference < 0 ? '-' : difference > 0 ? '+' : '';
        return `${sign}KES ${absDiff.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    }

    // Update the UI
    function updateUI() {
        const tableBody = document.getElementById('inquiryTableBody');
        const emptyState = document.getElementById('emptyInquiryState');
        const submitBtn = document.getElementById('submitInquiriesBtn');

        if (!tableBody || !emptyState || !submitBtn) return;

        // Show/hide empty state
        if (inquiryItems.length === 0) {
            tableBody.innerHTML = '';
            emptyState.style.display = 'block';
            submitBtn.disabled = true;
        } else {
            emptyState.style.display = 'none';
            submitBtn.disabled = false;
            
            // Render table rows
            tableBody.innerHTML = inquiryItems.map(inquiry => createInquiryRow(inquiry)).join('');
            
            // Add event listeners to new elements
            inquiryItems.forEach(inquiry => {
                const productSelect = document.getElementById(`inquiry-product-${inquiry.id}`);
                const bargainInput = document.getElementById(`bargain-${inquiry.id}`);
                const deleteBtn = document.getElementById(`delete-inquiry-${inquiry.id}`);

                if (productSelect) {
                    productSelect.addEventListener('change', (e) => {
                        updateInquiry(inquiry.id, 'productId', e.target.value);
                    });
                }

                if (bargainInput) {
                    bargainInput.addEventListener('input', (e) => {
                        updateInquiry(inquiry.id, 'bargainPrice', e.target.value);
                    });
                }

                if (deleteBtn) {
                    deleteBtn.addEventListener('click', () => {
                        removeInquiry(inquiry.id);
                    });
                }
            });
        }
    }

    // Create inquiry row HTML
    function createInquiryRow(inquiry) {
        const productOptions = products.map(product => 
            `<option value="${product.id}" ${inquiry.productId === product.id ? 'selected' : ''}>
                ${product.name} (${product.thickness})
            </option>`
        ).join('');

        const differenceClass = getPriceDifferenceClass(inquiry.difference);
        const differenceText = formatPriceDifference(inquiry.difference);

        return `
            <tr>
                <td>
                    <select class="table-select" id="inquiry-product-${inquiry.id}">
                        <option value="">Select a product</option>
                        ${productOptions}
                    </select>
                </td>
                <td>
                    <input type="text" class="table-input" readonly 
                           value="${inquiry.originalPrice.toLocaleString('en-US')}">
                </td>
                <td>
                    <input type="number" class="table-input" id="bargain-${inquiry.id}" 
                           value="${inquiry.bargainPrice}" min="0" step="0.01" placeholder="0">
                </td>
                <td>
                    <span class="price-difference ${differenceClass}">${differenceText}</span>
                </td>
                <td>
                    <button class="delete-btn" id="delete-inquiry-${inquiry.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;
    }

    // Submit all inquiries
    function submitInquiries() {
        if (inquiryItems.length === 0) {
            showToast('No inquiries to submit', 'error');
            return;
        }

        // Validate all inquiries have products and bargain prices
        const invalidInquiries = inquiryItems.filter(inquiry => 
            !inquiry.productId || inquiry.bargainPrice <= 0
        );

        if (invalidInquiries.length > 0) {
            showToast('Please complete all inquiries before submitting', 'error');
            return;
        }

        try {
            // Prepare inquiry data for WhatsApp
            const inquiryData = {
                brokerName: 'Broker User', // You can make this dynamic
                brokerEmail: 'broker@eastleighturf.com', // You can make this dynamic
                items: inquiryItems.map(inquiry => ({
                    product: inquiry.product,
                    originalPrice: inquiry.originalPrice,
                    bargainPrice: inquiry.bargainPrice
                })),
                totalOriginal: inquiryItems.reduce((sum, inquiry) => sum + inquiry.originalPrice, 0),
                totalBargain: inquiryItems.reduce((sum, inquiry) => sum + inquiry.bargainPrice, 0)
            };

            // Send to WhatsApp
            const success = window.WhatsAppService.sendInquiryForm(inquiryData);
            
            if (success) {
                showToast('Inquiries submitted successfully! WhatsApp will open with your inquiry details.', 'success');
                
                // Clear inquiries
                inquiryItems = [];
                nextInquiryId = 1;
                updateUI();
                
                // Update cart count
                if (window.BrokerDashboard && window.BrokerDashboard.updateCartCount) {
                    window.BrokerDashboard.updateCartCount();
                }
            } else {
                showToast('Failed to send inquiries. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Inquiry submission error:', error);
            showToast('An error occurred while submitting the inquiries.', 'error');
        }
    }

    // Get item count for cart
    function getItemCount() {
        return inquiryItems.length;
    }

    // Expose module functions
    window.InquiryModule = {
        init,
        addInquiry,
        removeInquiry,
        updateInquiry,
        submitInquiries,
        getItemCount
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
