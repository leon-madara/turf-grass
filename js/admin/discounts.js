// Discount Manager Module
class DiscountManager {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.discounts = [];
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Add discount button
        const addDiscountBtn = document.getElementById('addDiscountBtn');
        console.log('Add discount button found:', addDiscountBtn);
        if (addDiscountBtn) {
            addDiscountBtn.addEventListener('click', () => {
                console.log('Add discount button clicked');
                this.showAddDiscountModal();
            });
        }

        // Save discount button
        const saveDiscountBtn = document.getElementById('saveDiscountBtn');
        if (saveDiscountBtn) {
            saveDiscountBtn.addEventListener('click', () => {
                this.saveDiscount();
            });
        }

        // Cancel discount button
        const cancelDiscountBtn = document.getElementById('cancelDiscountBtn');
        if (cancelDiscountBtn) {
            cancelDiscountBtn.addEventListener('click', () => {
                this.dashboard.closeModal('discountModal');
            });
        }

        // Form validation
        const discountForm = document.getElementById('discountForm');
        if (discountForm) {
            discountForm.addEventListener('input', this.debounce(() => {
                this.validateDiscountForm();
            }, 300));
        }
    }

    async loadDiscounts() {
        try {
            // Simulate loading discounts from API
            this.discounts = [{
                    id: 1,
                    name: 'First Time Buyer',
                    type: 'percentage',
                    value: 10,
                    minOrder: 50000,
                    maxDiscount: 10000,
                    active: true,
                    description: '10% discount for first-time customers',
                    validFrom: '2024-01-01T00:00:00',
                    validTo: '2024-12-31T23:59:59',
                    usageCount: 45,
                    totalSavings: 125000
                },
                {
                    id: 2,
                    name: 'Bulk Order Discount',
                    type: 'fixed',
                    value: 5000,
                    minOrder: 100000,
                    maxDiscount: 5000,
                    active: true,
                    description: 'KES 5,000 off orders above KES 100,000',
                    validFrom: '2024-01-01T00:00:00',
                    validTo: '2024-12-31T23:59:59',
                    usageCount: 23,
                    totalSavings: 115000
                },
                {
                    id: 3,
                    name: 'Seasonal Sale',
                    type: 'percentage',
                    value: 15,
                    minOrder: 75000,
                    maxDiscount: 15000,
                    active: false,
                    description: '15% off during seasonal promotions',
                    validFrom: '2024-06-01T00:00:00',
                    validTo: '2024-08-31T23:59:59',
                    usageCount: 12,
                    totalSavings: 180000
                }
            ];

            this.renderDiscounts();
            this.dashboard.showToast('success', 'Discounts Loaded', `${this.discounts.length} discounts loaded successfully`);

        } catch (error) {
            console.error('Failed to load discounts:', error);
            this.dashboard.showToast('error', 'Load Error', 'Failed to load discounts');
        }
    }

    renderDiscounts() {
        const container = document.getElementById('discountsGrid');
        if (!container) return;

        if (this.discounts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-percentage"></i>
                    <h3>No Discounts Found</h3>
                    <p>Create your first promotional discount to get started.</p>
                    <button class="btn-primary" onclick="window.adminDashboard.showModal('discountModal')">
                        <i class="fas fa-plus"></i>
                        Add First Discount
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.discounts.map(discount => this.createDiscountCard(discount)).join('');
    }

    createDiscountCard(discount) {
        const statusClass = discount.active ? 'active' : 'inactive';
        const statusText = discount.active ? 'Active' : 'Inactive';
        const valueDisplay = discount.type === 'percentage' ? `${discount.value}%` : `KES ${discount.value.toLocaleString()}`;

        return `
            <div class="discount-card" data-discount-id="${discount.id}">
                <div class="discount-header">
                    <div class="discount-title">
                        <h3>${discount.name}</h3>
                        <span class="discount-status ${statusClass}">${statusText}</span>
                    </div>
                    <div class="discount-actions">
                        <button class="action-btn edit-btn" onclick="window.adminDashboard.managers.discounts.editDiscount(${discount.id})" aria-label="Edit discount">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="window.adminDashboard.managers.discounts.deleteDiscount(${discount.id})" aria-label="Delete discount">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="discount-content">
                    <div class="discount-info">
                        <div class="info-row">
                            <span class="label">Type:</span>
                            <span class="value">${discount.type.charAt(0).toUpperCase() + discount.type.slice(1)}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Value:</span>
                            <span class="value highlight">${valueDisplay}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Min Order:</span>
                            <span class="value">KES ${discount.minOrder?.toLocaleString() || 'None'}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Max Discount:</span>
                            <span class="value">KES ${discount.maxDiscount?.toLocaleString() || 'None'}</span>
                        </div>
                    </div>
                    
                    <div class="discount-stats">
                        <div class="stat-item">
                            <span class="stat-number">${discount.usageCount}</span>
                            <span class="stat-label">Times Used</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">KES ${discount.totalSavings?.toLocaleString() || '0'}</span>
                            <span class="stat-label">Total Savings</span>
                        </div>
                    </div>
                    
                    <div class="discount-description">
                        <p>${discount.description}</p>
                    </div>
                    
                    <div class="discount-validity">
                        <div class="validity-item">
                            <i class="fas fa-calendar-alt"></i>
                            <span>From: ${this.formatDate(discount.validFrom)}</span>
                        </div>
                        <div class="validity-item">
                            <i class="fas fa-calendar-check"></i>
                            <span>To: ${this.formatDate(discount.validTo)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    showAddDiscountModal() {
        const modal = document.getElementById('discountModal');
        const title = document.getElementById('discountModalTitle');
        const form = document.getElementById('discountForm');

        if (modal && title && form) {
            title.textContent = 'Add New Discount';
            form.reset();
            this.dashboard.showModal('discountModal');
        }
    }

    editDiscount(discountId) {
        const discount = this.discounts.find(d => d.id === discountId);
        if (!discount) return;

        const modal = document.getElementById('discountModal');
        const title = document.getElementById('discountModalTitle');
        const form = document.getElementById('discountForm');

        if (modal && title && form) {
            title.textContent = 'Edit Discount';
            this.populateDiscountForm(discount);
            this.dashboard.showModal('discountModal');
        }
    }

    populateDiscountForm(discount) {
        const form = document.getElementById('discountForm');
        if (!form) return;

        // Populate form fields
        form.querySelector('#discountName').value = discount.name;
        form.querySelector('#discountType').value = discount.type;
        form.querySelector('#discountValue').value = discount.value;
        form.querySelector('#discountMinOrder').value = discount.minOrder || '';
        form.querySelector('#discountMaxDiscount').value = discount.maxDiscount || '';
        form.querySelector('#discountActive').value = discount.active.toString();
        form.querySelector('#discountDescription').value = discount.description || '';

        // Format dates for datetime-local input
        if (discount.validFrom) {
            form.querySelector('#discountValidFrom').value = this.formatDateForInput(discount.validFrom);
        }
        if (discount.validTo) {
            form.querySelector('#discountValidTo').value = this.formatDateForInput(discount.validTo);
        }
    }

    async saveDiscount() {
        try {
            const form = document.getElementById('discountForm');
            if (!form) return;

            const formData = new FormData(form);
            const discountData = {
                name: formData.get('name'),
                type: formData.get('type'),
                value: parseFloat(formData.get('value')),
                minOrder: formData.get('minOrder') ? parseFloat(formData.get('minOrder')) : null,
                maxDiscount: formData.get('maxDiscount') ? parseFloat(formData.get('maxDiscount')) : null,
                active: formData.get('active') === 'true',
                description: formData.get('description'),
                validFrom: formData.get('validFrom'),
                validTo: formData.get('validTo')
            };

            // Validate form
            if (!this.validateDiscountData(discountData)) {
                return;
            }

            // Simulate API call
            const isEdit = document.getElementById('discountModalTitle').textContent.includes('Edit');

            if (isEdit) {
                // Update existing discount
                const discountId = this.getEditingDiscountId();
                await this.updateDiscount(discountId, discountData);
            } else {
                // Create new discount
                await this.createDiscount(discountData);
            }

            // Close modal and reload
            this.dashboard.closeModal('discountModal');
            await this.loadDiscounts();

        } catch (error) {
            console.error('Failed to save discount:', error);
            this.dashboard.showToast('error', 'Save Error', 'Failed to save discount');
        }
    }

    async createDiscount(discountData) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newDiscount = {
            id: Date.now(),
            ...discountData,
            usageCount: 0,
            totalSavings: 0
        };

        this.discounts.push(newDiscount);
        this.dashboard.showToast('success', 'Discount Created', 'New discount created successfully');
    }

    async updateDiscount(discountId, discountData) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const index = this.discounts.findIndex(d => d.id === discountId);
        if (index !== -1) {
            this.discounts[index] = {
                ...this.discounts[index],
                ...discountData
            };
        }

        this.dashboard.showToast('success', 'Discount Updated', 'Discount updated successfully');
    }

    async deleteDiscount(discountId) {
        if (!confirm('Are you sure you want to delete this discount? This action cannot be undone.')) {
            return;
        }

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            this.discounts = this.discounts.filter(d => d.id !== discountId);
            this.renderDiscounts();

            this.dashboard.showToast('success', 'Discount Deleted', 'Discount deleted successfully');

        } catch (error) {
            console.error('Failed to delete discount:', error);
            this.dashboard.showToast('error', 'Delete Error', 'Failed to delete discount');
        }
    }

    validateDiscountData(data) {
        if (!data.name || data.name.trim() === '') {
            this.dashboard.showToast('error', 'Validation Error', 'Discount name is required');
            return false;
        }

        if (!data.value || data.value <= 0) {
            this.dashboard.showToast('error', 'Validation Error', 'Discount value must be greater than 0');
            return false;
        }

        if (data.type === 'percentage' && data.value > 100) {
            this.dashboard.showToast('error', 'Validation Error', 'Percentage discount cannot exceed 100%');
            return false;
        }

        if (data.minOrder && data.minOrder < 0) {
            this.dashboard.showToast('error', 'Validation Error', 'Minimum order cannot be negative');
            return false;
        }

        if (data.maxDiscount && data.maxDiscount < 0) {
            this.dashboard.showToast('error', 'Validation Error', 'Maximum discount cannot be negative');
            return false;
        }

        return true;
    }

    validateDiscountForm() {
        const form = document.getElementById('discountForm');
        if (!form) return;

        const submitBtn = document.getElementById('saveDiscountBtn');
        const formData = new FormData(form);

        const isValid = formData.get('name') &&
            formData.get('value') &&
            parseFloat(formData.get('value')) > 0;

        submitBtn.disabled = !isValid;
    }

    getEditingDiscountId() {
        // This would be set when editing, for now return null
        return null;
    }

    formatDate(dateString) {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatDateForInput(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

export {
    DiscountManager
};