// Coupon Manager Module
class CouponManager {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.coupons = [];
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Add coupon button
        const addCouponBtn = document.getElementById('addCouponBtn');
        if (addCouponBtn) {
            addCouponBtn.addEventListener('click', () => {
                this.showAddCouponModal();
            });
        }

        // Save coupon button
        const saveCouponBtn = document.getElementById('saveCouponBtn');
        if (saveCouponBtn) {
            saveCouponBtn.addEventListener('click', () => {
                this.saveCoupon();
            });
        }

        // Cancel coupon button
        const cancelCouponBtn = document.getElementById('cancelCouponBtn');
        if (cancelCouponBtn) {
            cancelCouponBtn.addEventListener('click', () => {
                this.dashboard.closeModal('couponModal');
            });
        }

        // Form validation
        const couponForm = document.getElementById('couponForm');
        if (couponForm) {
            couponForm.addEventListener('input', this.debounce(() => {
                this.validateCouponForm();
            }, 300));
        }
    }

    async loadCoupons() {
        try {
            // Simulate loading coupons from API
            this.coupons = [{
                    id: 1,
                    code: 'WELCOME10',
                    type: 'percentage',
                    value: 10,
                    minOrder: 25000,
                    maxDiscount: 5000,
                    usageLimit: 100,
                    usedCount: 45,
                    active: true,
                    description: 'Welcome discount for new customers',
                    validFrom: '2024-01-01T00:00:00',
                    validTo: '2024-12-31T23:59:59',
                    totalSavings: 225000
                },
                {
                    id: 2,
                    code: 'SAVE15',
                    type: 'percentage',
                    value: 15,
                    minOrder: 50000,
                    maxDiscount: 10000,
                    usageLimit: 50,
                    usedCount: 23,
                    active: true,
                    description: '15% off for orders above KES 50,000',
                    validFrom: '2024-01-01T00:00:00',
                    validTo: '2024-06-30T23:59:59',
                    totalSavings: 230000
                },
                {
                    id: 3,
                    code: 'FLAT500',
                    type: 'fixed',
                    value: 500,
                    minOrder: 10000,
                    maxDiscount: 500,
                    usageLimit: 200,
                    usedCount: 156,
                    active: false,
                    description: 'Flat KES 500 off any order above KES 10,000',
                    validFrom: '2024-01-01T00:00:00',
                    validTo: '2024-03-31T23:59:59',
                    totalSavings: 78000
                }
            ];

            this.renderCoupons();
            this.dashboard.showToast('success', 'Coupons Loaded', `${this.coupons.length} coupons loaded successfully`);

        } catch (error) {
            console.error('Failed to load coupons:', error);
            this.dashboard.showToast('error', 'Load Error', 'Failed to load coupons');
        }
    }

    renderCoupons() {
        const container = document.getElementById('couponsGrid');
        if (!container) return;

        if (this.coupons.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-ticket-alt"></i>
                    <h3>No Coupons Found</h3>
                    <p>Create your first coupon code to get started.</p>
                    <button class="btn-primary" onclick="window.adminDashboard.showModal('couponModal')">
                        <i class="fas fa-plus"></i>
                        Add First Coupon
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.coupons.map(coupon => this.createCouponCard(coupon)).join('');
    }

    createCouponCard(coupon) {
        const statusClass = coupon.active ? 'active' : 'inactive';
        const statusText = coupon.active ? 'Active' : 'Inactive';
        const valueDisplay = coupon.type === 'percentage' ? `${coupon.value}%` : `KES ${coupon.value.toLocaleString()}`;
        const usagePercentage = Math.round((coupon.usedCount / coupon.usageLimit) * 100);

        return `
            <div class="coupon-card" data-coupon-id="${coupon.id}">
                <div class="coupon-header">
                    <div class="coupon-title">
                        <h3>${coupon.code}</h3>
                        <span class="coupon-status ${statusClass}">${statusText}</span>
                    </div>
                    <div class="coupon-actions">
                        <button class="action-btn edit-btn" onclick="window.adminDashboard.managers.coupons.editCoupon(${coupon.id})" aria-label="Edit coupon">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="window.adminDashboard.managers.coupons.deleteCoupon(${coupon.id})" aria-label="Delete coupon">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="coupon-content">
                    <div class="coupon-info">
                        <div class="info-row">
                            <span class="label">Type:</span>
                            <span class="value">${coupon.type.charAt(0).toUpperCase() + coupon.type.slice(1)}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Value:</span>
                            <span class="value highlight">${valueDisplay}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Min Order:</span>
                            <span class="value">KES ${coupon.minOrder?.toLocaleString() || 'None'}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Max Discount:</span>
                            <span class="value">KES ${coupon.maxDiscount?.toLocaleString() || 'None'}</span>
                        </div>
                    </div>
                    
                    <div class="coupon-usage">
                        <div class="usage-info">
                            <span class="usage-text">Usage: ${coupon.usedCount}/${coupon.usageLimit}</span>
                            <div class="usage-bar">
                                <div class="usage-fill" style="width: ${usagePercentage}%"></div>
                            </div>
                        </div>
                        <div class="usage-percentage">${usagePercentage}%</div>
                    </div>
                    
                    <div class="coupon-stats">
                        <div class="stat-item">
                            <span class="stat-number">${coupon.usedCount}</span>
                            <span class="stat-label">Times Used</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">KES ${coupon.totalSavings?.toLocaleString() || '0'}</span>
                            <span class="stat-label">Total Savings</span>
                        </div>
                    </div>
                    
                    <div class="coupon-description">
                        <p>${coupon.description}</p>
                    </div>
                    
                    <div class="coupon-validity">
                        <div class="validity-item">
                            <i class="fas fa-calendar-alt"></i>
                            <span>From: ${this.formatDate(coupon.validFrom)}</span>
                        </div>
                        <div class="validity-item">
                            <i class="fas fa-calendar-check"></i>
                            <span>To: ${this.formatDate(coupon.validTo)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    showAddCouponModal() {
        const modal = document.getElementById('couponModal');
        const title = document.getElementById('couponModalTitle');
        const form = document.getElementById('couponForm');

        if (modal && title && form) {
            title.textContent = 'Add New Coupon';
            form.reset();
            this.dashboard.showModal('couponModal');
        }
    }

    editCoupon(couponId) {
        const coupon = this.coupons.find(c => c.id === couponId);
        if (!coupon) return;

        const modal = document.getElementById('couponModal');
        const title = document.getElementById('couponModalTitle');
        const form = document.getElementById('couponForm');

        if (modal && title && form) {
            title.textContent = 'Edit Coupon';
            this.populateCouponForm(coupon);
            this.dashboard.showModal('couponModal');
        }
    }

    populateCouponForm(coupon) {
        const form = document.getElementById('couponForm');
        if (!form) return;

        // Populate form fields
        form.querySelector('#couponCode').value = coupon.code;
        form.querySelector('#couponType').value = coupon.type;
        form.querySelector('#couponValue').value = coupon.value;
        form.querySelector('#couponMinOrder').value = coupon.minOrder || '';
        form.querySelector('#couponMaxDiscount').value = coupon.maxDiscount || '';
        form.querySelector('#couponUsageLimit').value = coupon.usageLimit || '';
        form.querySelector('#couponDescription').value = coupon.description || '';

        // Format dates for datetime-local input
        if (coupon.validFrom) {
            form.querySelector('#couponValidFrom').value = this.formatDateForInput(coupon.validFrom);
        }
        if (coupon.validTo) {
            form.querySelector('#couponValidTo').value = this.formatDateForInput(coupon.validTo);
        }
    }

    async saveCoupon() {
        try {
            const form = document.getElementById('couponForm');
            if (!form) return;

            const formData = new FormData(form);
            const couponData = {
                code: formData.get('code').toUpperCase(),
                type: formData.get('type'),
                value: parseFloat(formData.get('value')),
                minOrder: formData.get('minOrder') ? parseFloat(formData.get('minOrder')) : null,
                maxDiscount: formData.get('maxDiscount') ? parseFloat(formData.get('maxDiscount')) : null,
                usageLimit: formData.get('usageLimit') ? parseInt(formData.get('usageLimit')) : null,
                description: formData.get('description'),
                validFrom: formData.get('validFrom'),
                validTo: formData.get('validTo')
            };

            // Validate form
            if (!this.validateCouponData(couponData)) {
                return;
            }

            // Check if coupon code already exists
            const existingCoupon = this.coupons.find(c => c.code === couponData.code);
            if (existingCoupon) {
                this.dashboard.showToast('error', 'Validation Error', 'Coupon code already exists');
                return;
            }

            // Simulate API call
            const isEdit = document.getElementById('couponModalTitle').textContent.includes('Edit');

            if (isEdit) {
                // Update existing coupon
                const couponId = this.getEditingCouponId();
                await this.updateCoupon(couponId, couponData);
            } else {
                // Create new coupon
                await this.createCoupon(couponData);
            }

            // Close modal and reload
            this.dashboard.closeModal('couponModal');
            await this.loadCoupons();

        } catch (error) {
            console.error('Failed to save coupon:', error);
            this.dashboard.showToast('error', 'Save Error', 'Failed to save coupon');
        }
    }

    async createCoupon(couponData) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newCoupon = {
            id: Date.now(),
            ...couponData,
            usedCount: 0,
            totalSavings: 0,
            active: true
        };

        this.coupons.push(newCoupon);
        this.dashboard.showToast('success', 'Coupon Created', 'New coupon created successfully');
    }

    async updateCoupon(couponId, couponData) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const index = this.coupons.findIndex(c => c.id === couponId);
        if (index !== -1) {
            this.coupons[index] = {
                ...this.coupons[index],
                ...couponData
            };
        }

        this.dashboard.showToast('success', 'Coupon Updated', 'Coupon updated successfully');
    }

    async deleteCoupon(couponId) {
        if (!confirm('Are you sure you want to delete this coupon? This action cannot be undone.')) {
            return;
        }

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            this.coupons = this.coupons.filter(c => c.id !== couponId);
            this.renderCoupons();

            this.dashboard.showToast('success', 'Coupon Deleted', 'Coupon deleted successfully');

        } catch (error) {
            console.error('Failed to delete coupon:', error);
            this.dashboard.showToast('error', 'Delete Error', 'Failed to delete coupon');
        }
    }

    validateCouponData(data) {
        if (!data.code || data.code.trim() === '') {
            this.dashboard.showToast('error', 'Validation Error', 'Coupon code is required');
            return false;
        }

        if (data.code.length < 3) {
            this.dashboard.showToast('error', 'Validation Error', 'Coupon code must be at least 3 characters');
            return false;
        }

        if (!data.value || data.value <= 0) {
            this.dashboard.showToast('error', 'Validation Error', 'Coupon value must be greater than 0');
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

        if (data.usageLimit && data.usageLimit <= 0) {
            this.dashboard.showToast('error', 'Validation Error', 'Usage limit must be greater than 0');
            return false;
        }

        return true;
    }

    validateCouponForm() {
        const form = document.getElementById('couponForm');
        if (!form) return;

        const submitBtn = document.getElementById('saveCouponBtn');
        const formData = new FormData(form);

        const isValid = formData.get('code') &&
            formData.get('code').length >= 3 &&
            formData.get('value') &&
            parseFloat(formData.get('value')) > 0;

        submitBtn.disabled = !isValid;
    }

    getEditingCouponId() {
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
    CouponManager
};