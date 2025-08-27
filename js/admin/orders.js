// Order Manager Module
class OrderManager {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.orders = [];
        this.filters = {
            status: 'all',
            dateRange: '30',
            search: ''
        };
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Export orders button
        const exportOrdersBtn = document.getElementById('exportOrdersBtn');
        if (exportOrdersBtn) {
            exportOrdersBtn.addEventListener('click', () => {
                this.exportOrders();
            });
        }

        // Filter orders button
        const filterOrdersBtn = document.getElementById('filterOrdersBtn');
        if (filterOrdersBtn) {
            filterOrdersBtn.addEventListener('click', () => {
                this.showFilterModal();
            });
        }
    }

    async loadOrders() {
        try {
            // Simulate loading orders from API
            this.orders = [{
                    id: 'ORD-001',
                    customer: {
                        name: 'John Doe',
                        phone: '+254700123456',
                        location: 'Nairobi'
                    },
                    products: [{
                        name: 'EnduraTurf',
                        quantity: 2,
                        area: 484,
                        price: 2100,
                        total: 1016400
                    }],
                    subtotal: 1016400,
                    discount: 0,
                    total: 1016400,
                    status: 'pending',
                    date: '2024-01-15T10:30:00',
                    broker: 'John Doe',
                    paymentMethod: 'WhatsApp'
                },
                {
                    id: 'ORD-002',
                    customer: {
                        name: 'Jane Smith',
                        phone: '+254711234567',
                        location: 'Mombasa'
                    },
                    products: [{
                        name: 'FlexTurf',
                        quantity: 1,
                        area: 225,
                        price: 1800,
                        total: 405000
                    }],
                    subtotal: 405000,
                    discount: 40500,
                    total: 364500,
                    status: 'completed',
                    date: '2024-01-14T14:20:00',
                    broker: 'Jane Smith',
                    paymentMethod: 'WhatsApp'
                },
                {
                    id: 'ORD-003',
                    customer: {
                        name: 'Mike Johnson',
                        phone: '+254722345678',
                        location: 'Kisumu'
                    },
                    products: [{
                        name: 'UltraTurf',
                        quantity: 3,
                        area: 729,
                        price: 2400,
                        total: 1749600
                    }],
                    subtotal: 1749600,
                    discount: 0,
                    total: 1749600,
                    status: 'processing',
                    date: '2024-01-13T09:15:00',
                    broker: 'Mike Johnson',
                    paymentMethod: 'WhatsApp'
                }
            ];

            this.renderOrders();
            this.dashboard.showToast('success', 'Orders Loaded', `${this.orders.length} orders loaded successfully`);

        } catch (error) {
            console.error('Failed to load orders:', error);
            this.dashboard.showToast('error', 'Load Error', 'Failed to load orders');
        }
    }

    renderOrders() {
        const tbody = document.getElementById('ordersTableBody');
        if (!tbody) return;

        const filteredOrders = this.getFilteredOrders();

        if (filteredOrders.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">
                        <i class="fas fa-shopping-cart"></i>
                        <h3>No Orders Found</h3>
                        <p>No orders match your current filters.</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = filteredOrders.map(order => this.createOrderRow(order)).join('');
    }

    createOrderRow(order) {
        const statusClass = this.getStatusClass(order.status);
        const statusText = this.getStatusText(order.status);

        return `
            <tr data-order-id="${order.id}">
                <td>
                    <div class="order-id">
                        <strong>${order.id}</strong>
                        <span class="order-date">${this.formatDate(order.date)}</span>
                    </div>
                </td>
                <td>
                    <div class="customer-info">
                        <div class="customer-name">${order.customer.name}</div>
                        <div class="customer-phone">${order.customer.phone}</div>
                        <div class="customer-location">${order.customer.location}</div>
                    </div>
                </td>
                <td>
                    <div class="products-info">
                        ${order.products.map(product => `
                            <div class="product-item">
                                <span class="product-name">${product.name}</span>
                                <span class="product-details">${product.quantity} × ${product.area}m²</span>
                            </div>
                        `).join('')}
                    </div>
                </td>
                <td>
                    <div class="order-total">
                        <div class="subtotal">KES ${order.subtotal.toLocaleString()}</div>
                        ${order.discount > 0 ? `<div class="discount">-KES ${order.discount.toLocaleString()}</div>` : ''}
                        <div class="final-total">KES ${order.total.toLocaleString()}</div>
                    </div>
                </td>
                <td>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </td>
                <td>
                    <div class="order-meta">
                        <div class="order-date">${this.formatDate(order.date)}</div>
                        <div class="order-time">${this.formatTime(order.date)}</div>
                    </div>
                </td>
                <td>
                    <div class="order-actions">
                        <button class="action-btn view-btn" onclick="window.adminDashboard.managers.orders.viewOrder('${order.id}')" aria-label="View order">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit-btn" onclick="window.adminDashboard.managers.orders.editOrder('${order.id}')" aria-label="Edit order">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn status-btn" onclick="window.adminDashboard.managers.orders.updateStatus('${order.id}')" aria-label="Update status">
                            <i class="fas fa-flag"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    getFilteredOrders() {
        let filtered = [...this.orders];

        // Filter by status
        if (this.filters.status !== 'all') {
            filtered = filtered.filter(order => order.status === this.filters.status);
        }

        // Filter by date range
        if (this.filters.dateRange !== 'all') {
            const days = parseInt(this.filters.dateRange);
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);

            filtered = filtered.filter(order => new Date(order.date) >= cutoffDate);
        }

        // Filter by search
        if (this.filters.search) {
            const searchTerm = this.filters.search.toLowerCase();
            filtered = filtered.filter(order =>
                order.id.toLowerCase().includes(searchTerm) ||
                order.customer.name.toLowerCase().includes(searchTerm) ||
                order.customer.phone.includes(searchTerm) ||
                order.customer.location.toLowerCase().includes(searchTerm)
            );
        }

        return filtered;
    }

    getStatusClass(status) {
        const statusClasses = {
            'pending': 'pending',
            'processing': 'processing',
            'completed': 'completed',
            'cancelled': 'cancelled'
        };
        return statusClasses[status] || 'pending';
    }

    getStatusText(status) {
        const statusTexts = {
            'pending': 'Pending',
            'processing': 'Processing',
            'completed': 'Completed',
            'cancelled': 'Cancelled'
        };
        return statusTexts[status] || 'Pending';
    }

    viewOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        // Show order details modal
        this.showOrderDetailsModal(order);
    }

    editOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        // Show order edit modal
        this.showOrderEditModal(order);
    }

    updateStatus(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        // Show status update modal
        this.showStatusUpdateModal(order);
    }

    showOrderDetailsModal(order) {
        const modalContent = `
            <div class="order-details">
                <div class="order-header">
                    <h3>Order ${order.id}</h3>
                    <span class="status-badge ${this.getStatusClass(order.status)}">${this.getStatusText(order.status)}</span>
                </div>
                
                <div class="order-sections">
                    <div class="section">
                        <h4>Customer Information</h4>
                        <div class="customer-details">
                            <p><strong>Name:</strong> ${order.customer.name}</p>
                            <p><strong>Phone:</strong> ${order.customer.phone}</p>
                            <p><strong>Location:</strong> ${order.customer.location}</p>
                        </div>
                    </div>
                    
                    <div class="section">
                        <h4>Order Items</h4>
                        <div class="order-items">
                            ${order.products.map(product => `
                                <div class="order-item">
                                    <div class="item-info">
                                        <span class="item-name">${product.name}</span>
                                        <span class="item-details">${product.quantity} × ${product.area}m²</span>
                                    </div>
                                    <div class="item-price">
                                        <span class="unit-price">KES ${product.price.toLocaleString()}/m²</span>
                                        <span class="total-price">KES ${product.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="section">
                        <h4>Order Summary</h4>
                        <div class="order-summary">
                            <div class="summary-row">
                                <span>Subtotal:</span>
                                <span>KES ${order.subtotal.toLocaleString()}</span>
                            </div>
                            ${order.discount > 0 ? `
                                <div class="summary-row discount">
                                    <span>Discount:</span>
                                    <span>-KES ${order.discount.toLocaleString()}</span>
                                </div>
                            ` : ''}
                            <div class="summary-row total">
                                <span>Total:</span>
                                <span>KES ${order.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <h4>Order Information</h4>
                        <div class="order-info">
                            <p><strong>Date:</strong> ${this.formatDate(order.date)}</p>
                            <p><strong>Time:</strong> ${this.formatTime(order.date)}</p>
                            <p><strong>Broker:</strong> ${order.broker}</p>
                            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Create and show modal
        this.showModal('Order Details', modalContent);
    }

    showOrderEditModal(order) {
        // This would show a form to edit order details
        this.dashboard.showToast('info', 'Edit Order', 'Order editing functionality coming soon');
    }

    showStatusUpdateModal(order) {
        const modalContent = `
            <div class="status-update">
                <h4>Update Order Status</h4>
                <p>Current status: <span class="status-badge ${this.getStatusClass(order.status)}">${this.getStatusText(order.status)}</span></p>
                
                <div class="status-options">
                    <label class="status-option">
                        <input type="radio" name="status" value="pending" ${order.status === 'pending' ? 'checked' : ''}>
                        <span class="status-badge pending">Pending</span>
                    </label>
                    <label class="status-option">
                        <input type="radio" name="status" value="processing" ${order.status === 'processing' ? 'checked' : ''}>
                        <span class="status-badge processing">Processing</span>
                    </label>
                    <label class="status-option">
                        <input type="radio" name="status" value="completed" ${order.status === 'completed' ? 'checked' : ''}>
                        <span class="status-badge completed">Completed</span>
                    </label>
                    <label class="status-option">
                        <input type="radio" name="status" value="cancelled" ${order.status === 'cancelled' ? 'checked' : ''}>
                        <span class="status-badge cancelled">Cancelled</span>
                    </label>
                </div>
                
                <div class="form-group">
                    <label for="statusNotes">Notes (optional)</label>
                    <textarea id="statusNotes" rows="3" placeholder="Add any notes about this status change..."></textarea>
                </div>
            </div>
        `;

        // Create and show modal with update functionality
        this.showModal('Update Status', modalContent, () => {
            const selectedStatus = document.querySelector('input[name="status"]:checked').value;
            const notes = document.getElementById('statusNotes').value;
            this.updateOrderStatus(order.id, selectedStatus, notes);
        });
    }

    async updateOrderStatus(orderId, newStatus, notes) {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const order = this.orders.find(o => o.id === orderId);
            if (order) {
                order.status = newStatus;
                this.renderOrders();
            }

            this.dashboard.closeAllModals();
            this.dashboard.showToast('success', 'Status Updated', `Order status updated to ${this.getStatusText(newStatus)}`);

        } catch (error) {
            console.error('Failed to update order status:', error);
            this.dashboard.showToast('error', 'Update Error', 'Failed to update order status');
        }
    }

    showFilterModal() {
        const modalContent = `
            <div class="order-filters">
                <h4>Filter Orders</h4>
                
                <div class="form-group">
                    <label for="statusFilter">Status</label>
                    <select id="statusFilter">
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="dateRangeFilter">Date Range</label>
                    <select id="dateRangeFilter">
                        <option value="7">Last 7 days</option>
                        <option value="30" selected>Last 30 days</option>
                        <option value="90">Last 90 days</option>
                        <option value="365">Last year</option>
                        <option value="all">All time</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="searchFilter">Search</label>
                    <input type="text" id="searchFilter" placeholder="Search by order ID, customer name, phone, or location">
                </div>
            </div>
        `;

        // Create and show modal with filter functionality
        this.showModal('Filter Orders', modalContent, () => {
            this.filters.status = document.getElementById('statusFilter').value;
            this.filters.dateRange = document.getElementById('dateRangeFilter').value;
            this.filters.search = document.getElementById('searchFilter').value;
            this.renderOrders();
        });
    }

    exportOrders() {
        try {
            const filteredOrders = this.getFilteredOrders();

            // Create CSV content
            const csvContent = this.createCSVContent(filteredOrders);

            // Download CSV file
            const blob = new Blob([csvContent], {
                type: 'text/csv'
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            this.dashboard.showToast('success', 'Export Successful', `${filteredOrders.length} orders exported to CSV`);

        } catch (error) {
            console.error('Failed to export orders:', error);
            this.dashboard.showToast('error', 'Export Error', 'Failed to export orders');
        }
    }

    createCSVContent(orders) {
        const headers = ['Order ID', 'Customer Name', 'Phone', 'Location', 'Products', 'Subtotal', 'Discount', 'Total', 'Status', 'Date', 'Broker'];

        const rows = orders.map(order => [
            order.id,
            order.customer.name,
            order.customer.phone,
            order.customer.location,
            order.products.map(p => `${p.name} (${p.quantity}×${p.area}m²)`).join('; '),
            order.subtotal,
            order.discount,
            order.total,
            this.getStatusText(order.status),
            this.formatDate(order.date),
            order.broker
        ]);

        return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    }

    showModal(title, content, onConfirm) {
        // Create modal HTML
        const modalHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                ${onConfirm ? `
                    <div class="modal-footer">
                        <button class="btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                        <button class="btn-primary" onclick="this.closest('.modal').querySelector('.confirm-btn').click()">Confirm</button>
                    </div>
                ` : ''}
            </div>
        `;

        // Add modal to page
        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal-overlay active';
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);

        // Add confirm functionality if provided
        if (onConfirm) {
            const confirmBtn = modalContainer.querySelector('.btn-primary');
            confirmBtn.addEventListener('click', () => {
                onConfirm();
                modalContainer.remove();
            });
        }

        // Close on overlay click
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                modalContainer.remove();
            }
        });
    }

    formatDate(dateString) {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatTime(dateString) {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleTimeString('en-KE', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

export {
    OrderManager
};