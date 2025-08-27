// Broker Manager Module
class BrokerManager {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.brokers = [];
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Add broker button
        const addBrokerBtn = document.getElementById('addBrokerBtn');
        if (addBrokerBtn) {
            addBrokerBtn.addEventListener('click', () => {
                this.showAddBrokerModal();
            });
        }

        // Save broker button
        const saveBrokerBtn = document.getElementById('saveBrokerBtn');
        if (saveBrokerBtn) {
            saveBrokerBtn.addEventListener('click', () => {
                this.saveBroker();
            });
        }

        // Cancel broker button
        const cancelBrokerBtn = document.getElementById('cancelBrokerBtn');
        if (cancelBrokerBtn) {
            cancelBrokerBtn.addEventListener('click', () => {
                this.dashboard.closeModal('brokerModal');
            });
        }

        // Form validation
        const brokerForm = document.getElementById('brokerForm');
        if (brokerForm) {
            brokerForm.addEventListener('input', this.debounce(() => {
                this.validateBrokerForm();
            }, 300));
        }
    }

    async loadBrokers() {
        try {
            // Simulate loading brokers from API
            this.brokers = [{
                    id: 1,
                    name: 'John Doe',
                    phone: '+254700123456',
                    email: 'john.doe@eastleighturfgrass.com',
                    role: 'senior_broker',
                    location: 'Nairobi',
                    active: true,
                    joinDate: '2023-01-15',
                    totalOrders: 45,
                    totalRevenue: 2500000,
                    commission: 5.5
                },
                {
                    id: 2,
                    name: 'Jane Smith',
                    phone: '+254711234567',
                    email: 'jane.smith@eastleighturfgrass.com',
                    role: 'broker',
                    location: 'Mombasa',
                    active: true,
                    joinDate: '2023-03-20',
                    totalOrders: 32,
                    totalRevenue: 1800000,
                    commission: 5.0
                },
                {
                    id: 3,
                    name: 'Mike Johnson',
                    phone: '+254722345678',
                    email: 'mike.johnson@eastleighturfgrass.com',
                    role: 'manager',
                    location: 'Kisumu',
                    active: false,
                    joinDate: '2022-11-10',
                    totalOrders: 28,
                    totalRevenue: 1600000,
                    commission: 6.0
                }
            ];

            this.renderBrokers();
            this.dashboard.showToast('success', 'Brokers Loaded', `${this.brokers.length} brokers loaded successfully`);

        } catch (error) {
            console.error('Failed to load brokers:', error);
            this.dashboard.showToast('error', 'Load Error', 'Failed to load brokers');
        }
    }

    renderBrokers() {
        const container = document.getElementById('brokersGrid');
        if (!container) return;

        if (this.brokers.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>No Brokers Found</h3>
                    <p>Add your first broker to start managing your sales team.</p>
                    <button class="btn-primary" onclick="window.adminDashboard.showModal('brokerModal')">
                        <i class="fas fa-plus"></i>
                        Add First Broker
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.brokers.map(broker => this.createBrokerCard(broker)).join('');
    }

    createBrokerCard(broker) {
        const statusClass = broker.active ? 'active' : 'inactive';
        const statusText = broker.active ? 'Active' : 'Inactive';
        const roleDisplay = this.getRoleDisplay(broker.role);

        return `
            <div class="broker-card" data-broker-id="${broker.id}">
                <div class="broker-header">
                    <div class="broker-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="broker-title">
                        <h3>${broker.name}</h3>
                        <span class="broker-role">${roleDisplay}</span>
                        <span class="broker-status ${statusClass}">${statusText}</span>
                    </div>
                    <div class="broker-actions">
                        <button class="action-btn edit-btn" onclick="window.adminDashboard.managers.brokers.editBroker(${broker.id})" aria-label="Edit broker">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="window.adminDashboard.managers.brokers.deleteBroker(${broker.id})" aria-label="Delete broker">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="broker-content">
                    <div class="broker-info">
                        <div class="info-row">
                            <span class="label">Phone:</span>
                            <span class="value">${broker.phone}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Email:</span>
                            <span class="value">${broker.email}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Location:</span>
                            <span class="value">${broker.location}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Join Date:</span>
                            <span class="value">${this.formatDate(broker.joinDate)}</span>
                        </div>
                    </div>
                    
                    <div class="broker-stats">
                        <div class="stat-item">
                            <span class="stat-number">${broker.totalOrders}</span>
                            <span class="stat-label">Total Orders</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">KES ${broker.totalRevenue?.toLocaleString() || '0'}</span>
                            <span class="stat-label">Total Revenue</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${broker.commission}%</span>
                            <span class="stat-label">Commission</span>
                        </div>
                    </div>
                    
                    <div class="broker-performance">
                        <div class="performance-bar">
                            <div class="performance-fill" style="width: ${this.calculatePerformancePercentage(broker)}%"></div>
                        </div>
                        <span class="performance-text">Performance: ${this.calculatePerformancePercentage(broker)}%</span>
                    </div>
                </div>
            </div>
        `;
    }

    getRoleDisplay(role) {
        const roles = {
            'broker': 'Broker',
            'senior_broker': 'Senior Broker',
            'manager': 'Manager'
        };
        return roles[role] || role;
    }

    calculatePerformancePercentage(broker) {
        // Simple performance calculation based on orders and revenue
        // In a real app, this would be more sophisticated
        const avgOrders = 35; // Average orders per broker
        const avgRevenue = 2000000; // Average revenue per broker

        const orderScore = Math.min((broker.totalOrders / avgOrders) * 50, 50);
        const revenueScore = Math.min((broker.totalRevenue / avgRevenue) * 50, 50);

        return Math.round(orderScore + revenueScore);
    }

    showAddBrokerModal() {
        const modal = document.getElementById('brokerModal');
        const title = document.getElementById('brokerModalTitle');
        const form = document.getElementById('brokerForm');

        if (modal && title && form) {
            title.textContent = 'Add New Broker';
            form.reset();
            this.dashboard.showModal('brokerModal');
        }
    }

    editBroker(brokerId) {
        const broker = this.brokers.find(b => b.id === brokerId);
        if (!broker) return;

        const modal = document.getElementById('brokerModal');
        const title = document.getElementById('brokerModalTitle');
        const form = document.getElementById('brokerForm');

        if (modal && title && form) {
            title.textContent = 'Edit Broker';
            this.populateBrokerForm(broker);
            this.dashboard.showModal('brokerModal');
        }
    }

    populateBrokerForm(broker) {
        const form = document.getElementById('brokerForm');
        if (!form) return;

        // Populate form fields
        form.querySelector('#brokerName').value = broker.name;
        form.querySelector('#brokerPhone').value = broker.phone;
        form.querySelector('#brokerEmail').value = broker.email || '';
        form.querySelector('#brokerRole').value = broker.role;
        form.querySelector('#brokerLocation').value = broker.location || '';
        form.querySelector('#brokerActive').checked = broker.active;

        // Clear password fields for editing
        form.querySelector('#brokerPassword').value = '';
        form.querySelector('#brokerConfirmPassword').value = '';
    }

    async saveBroker() {
        try {
            const form = document.getElementById('brokerForm');
            if (!form) return;

            const formData = new FormData(form);
            const brokerData = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                role: formData.get('role'),
                location: formData.get('location'),
                active: formData.get('active') === 'on',
                password: formData.get('password'),
                confirmPassword: formData.get('confirmPassword')
            };

            // Validate form
            if (!this.validateBrokerData(brokerData)) {
                return;
            }

            // Simulate API call
            const isEdit = document.getElementById('brokerModalTitle').textContent.includes('Edit');

            if (isEdit) {
                // Update existing broker
                const brokerId = this.getEditingBrokerId();
                await this.updateBroker(brokerId, brokerData);
            } else {
                // Create new broker
                await this.createBroker(brokerData);
            }

            // Close modal and reload
            this.dashboard.closeModal('brokerModal');
            await this.loadBrokers();

        } catch (error) {
            console.error('Failed to save broker:', error);
            this.dashboard.showToast('error', 'Save Error', 'Failed to save broker');
        }
    }

    async createBroker(brokerData) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newBroker = {
            id: Date.now(),
            name: brokerData.name,
            phone: brokerData.phone,
            email: brokerData.email,
            role: brokerData.role,
            location: brokerData.location,
            active: brokerData.active,
            joinDate: new Date().toISOString().split('T')[0],
            totalOrders: 0,
            totalRevenue: 0,
            commission: this.getDefaultCommission(brokerData.role)
        };

        this.brokers.push(newBroker);
        this.dashboard.showToast('success', 'Broker Created', 'New broker created successfully');
    }

    async updateBroker(brokerId, brokerData) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const index = this.brokers.findIndex(b => b.id === brokerId);
        if (index !== -1) {
            this.brokers[index] = {
                ...this.brokers[index],
                name: brokerData.name,
                phone: brokerData.phone,
                email: brokerData.email,
                role: brokerData.role,
                location: brokerData.location,
                active: brokerData.active
            };
        }

        this.dashboard.showToast('success', 'Broker Updated', 'Broker updated successfully');
    }

    async deleteBroker(brokerId) {
        if (!confirm('Are you sure you want to delete this broker? This action cannot be undone.')) {
            return;
        }

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            this.brokers = this.brokers.filter(b => b.id !== brokerId);
            this.renderBrokers();

            this.dashboard.showToast('success', 'Broker Deleted', 'Broker deleted successfully');

        } catch (error) {
            console.error('Failed to delete broker:', error);
            this.dashboard.showToast('error', 'Delete Error', 'Failed to delete broker');
        }
    }

    validateBrokerData(data) {
        if (!data.name || data.name.trim() === '') {
            this.dashboard.showToast('error', 'Validation Error', 'Broker name is required');
            return false;
        }

        if (!data.phone || data.phone.trim() === '') {
            this.dashboard.showToast('error', 'Validation Error', 'Phone number is required');
            return false;
        }

        // Basic phone validation for Kenya
        const phoneRegex = /^(\+254|0)[17]\d{8}$/;
        if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
            this.dashboard.showToast('error', 'Validation Error', 'Please enter a valid Kenyan phone number');
            return false;
        }

        if (data.email && !this.isValidEmail(data.email)) {
            this.dashboard.showToast('error', 'Validation Error', 'Please enter a valid email address');
            return false;
        }

        // Check if it's a new broker (password required)
        const isEdit = document.getElementById('brokerModalTitle').textContent.includes('Edit');
        if (!isEdit) {
            if (!data.password || data.password.length < 6) {
                this.dashboard.showToast('error', 'Validation Error', 'Password must be at least 6 characters');
                return false;
            }

            if (data.password !== data.confirmPassword) {
                this.dashboard.showToast('error', 'Validation Error', 'Passwords do not match');
                return false;
            }
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    getDefaultCommission(role) {
        const commissions = {
            'broker': 5.0,
            'senior_broker': 5.5,
            'manager': 6.0
        };
        return commissions[role] || 5.0;
    }

    validateBrokerForm() {
        const form = document.getElementById('brokerForm');
        if (!form) return;

        const submitBtn = document.getElementById('saveBrokerBtn');
        const formData = new FormData(form);

        const isEdit = document.getElementById('brokerModalTitle').textContent.includes('Edit');

        let isValid = formData.get('name') &&
            formData.get('phone') &&
            formData.get('role');

        // For new brokers, password is required
        if (!isEdit) {
            isValid = isValid &&
                formData.get('password') &&
                formData.get('password').length >= 6 &&
                formData.get('password') === formData.get('confirmPassword');
        }

        submitBtn.disabled = !isValid;
    }

    getEditingBrokerId() {
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
    BrokerManager
};