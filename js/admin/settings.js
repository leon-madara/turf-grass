// Settings Manager Module
class SettingsManager {
    constructor(dashboard) {
        this.dashboard = dashboard;
        this.settings = {};
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // General settings form
        const generalSettingsForm = document.getElementById('generalSettingsForm');
        if (generalSettingsForm) {
            generalSettingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveGeneralSettings();
            });
        }

        // Security settings form
        const securitySettingsForm = document.getElementById('securitySettingsForm');
        if (securitySettingsForm) {
            securitySettingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveSecuritySettings();
            });
        }
    }

    async loadSettings() {
        try {
            // Simulate loading settings from API
            this.settings = {
                general: {
                    companyName: 'Eastleigh Turf Grass',
                    whatsappNumber: '+254743375997',
                    currency: 'KES',
                    timezone: 'Africa/Nairobi',
                    language: 'en'
                },
                security: {
                    sessionTimeout: 30,
                    maxLoginAttempts: 5,
                    twoFactorAuth: false,
                    passwordPolicy: {
                        minLength: 8,
                        requireUppercase: true,
                        requireLowercase: true,
                        requireNumbers: true,
                        requireSpecialChars: false
                    }
                },
                notifications: {
                    emailNotifications: true,
                    smsNotifications: false,
                    orderNotifications: true,
                    systemNotifications: true
                },
                integrations: {
                    whatsappEnabled: true,
                    emailEnabled: true,
                    smsEnabled: false
                }
            };

            this.populateSettingsForms();
            this.dashboard.showToast('success', 'Settings Loaded', 'System settings loaded successfully');

        } catch (error) {
            console.error('Failed to load settings:', error);
            this.dashboard.showToast('error', 'Load Error', 'Failed to load system settings');
        }
    }

    populateSettingsForms() {
        // Populate general settings
        const generalSettings = this.settings.general;
        if (generalSettings) {
            const companyNameInput = document.getElementById('companyName');
            const whatsappNumberInput = document.getElementById('whatsappNumber');
            const currencySelect = document.getElementById('currency');

            if (companyNameInput) companyNameInput.value = generalSettings.companyName;
            if (whatsappNumberInput) whatsappNumberInput.value = generalSettings.whatsappNumber;
            if (currencySelect) currencySelect.value = generalSettings.currency;
        }

        // Populate security settings
        const securitySettings = this.settings.security;
        if (securitySettings) {
            const sessionTimeoutInput = document.getElementById('sessionTimeout');
            const maxLoginAttemptsInput = document.getElementById('maxLoginAttempts');
            const twoFactorAuthCheckbox = document.getElementById('twoFactorAuth');

            if (sessionTimeoutInput) sessionTimeoutInput.value = securitySettings.sessionTimeout;
            if (maxLoginAttemptsInput) maxLoginAttemptsInput.value = securitySettings.maxLoginAttempts;
            if (twoFactorAuthCheckbox) twoFactorAuthCheckbox.checked = securitySettings.twoFactorAuth;
        }
    }

    async saveGeneralSettings() {
        try {
            const form = document.getElementById('generalSettingsForm');
            if (!form) return;

            const formData = new FormData(form);
            const settingsData = {
                companyName: formData.get('companyName'),
                whatsappNumber: formData.get('whatsappNumber'),
                currency: formData.get('currency')
            };

            // Validate form
            if (!this.validateGeneralSettings(settingsData)) {
                return;
            }

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update settings
            this.settings.general = {
                ...this.settings.general,
                ...settingsData
            };

            this.dashboard.showToast('success', 'Settings Saved', 'General settings updated successfully');

        } catch (error) {
            console.error('Failed to save general settings:', error);
            this.dashboard.showToast('error', 'Save Error', 'Failed to save general settings');
        }
    }

    async saveSecuritySettings() {
        try {
            const form = document.getElementById('securitySettingsForm');
            if (!form) return;

            const formData = new FormData(form);
            const settingsData = {
                sessionTimeout: parseInt(formData.get('sessionTimeout')),
                maxLoginAttempts: parseInt(formData.get('maxLoginAttempts')),
                twoFactorAuth: formData.get('twoFactorAuth') === 'on'
            };

            // Validate form
            if (!this.validateSecuritySettings(settingsData)) {
                return;
            }

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update settings
            this.settings.security = {
                ...this.settings.security,
                ...settingsData
            };

            this.dashboard.showToast('success', 'Settings Saved', 'Security settings updated successfully');

        } catch (error) {
            console.error('Failed to save security settings:', error);
            this.dashboard.showToast('error', 'Save Error', 'Failed to save security settings');
        }
    }

    validateGeneralSettings(data) {
        if (!data.companyName || data.companyName.trim() === '') {
            this.dashboard.showToast('error', 'Validation Error', 'Company name is required');
            return false;
        }

        if (!data.whatsappNumber || data.whatsappNumber.trim() === '') {
            this.dashboard.showToast('error', 'Validation Error', 'WhatsApp number is required');
            return false;
        }

        // Basic phone validation for Kenya
        const phoneRegex = /^(\+254|0)[17]\d{8}$/;
        if (!phoneRegex.test(data.whatsappNumber.replace(/\s/g, ''))) {
            this.dashboard.showToast('error', 'Validation Error', 'Please enter a valid Kenyan phone number');
            return false;
        }

        return true;
    }

    validateSecuritySettings(data) {
        if (!data.sessionTimeout || data.sessionTimeout < 5 || data.sessionTimeout > 120) {
            this.dashboard.showToast('error', 'Validation Error', 'Session timeout must be between 5 and 120 minutes');
            return false;
        }

        if (!data.maxLoginAttempts || data.maxLoginAttempts < 3 || data.maxLoginAttempts > 10) {
            this.dashboard.showToast('error', 'Validation Error', 'Max login attempts must be between 3 and 10');
            return false;
        }

        return true;
    }

    // Backup and restore functionality
    async backupSettings() {
        try {
            const backupData = {
                settings: this.settings,
                backupDate: new Date().toISOString(),
                version: '1.0.0'
            };

            const blob = new Blob([JSON.stringify(backupData, null, 2)], {
                type: 'application/json'
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `settings_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            this.dashboard.showToast('success', 'Backup Created', 'Settings backup downloaded successfully');

        } catch (error) {
            console.error('Failed to create backup:', error);
            this.dashboard.showToast('error', 'Backup Error', 'Failed to create settings backup');
        }
    }

    async restoreSettings(backupFile) {
        try {
            const fileReader = new FileReader();

            fileReader.onload = async (e) => {
                try {
                    const backupData = JSON.parse(e.target.result);

                    // Validate backup data
                    if (!this.validateBackupData(backupData)) {
                        this.dashboard.showToast('error', 'Restore Error', 'Invalid backup file format');
                        return;
                    }

                    // Confirm restoration
                    if (!confirm('Are you sure you want to restore settings from backup? This will overwrite current settings.')) {
                        return;
                    }

                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    // Restore settings
                    this.settings = backupData.settings;
                    this.populateSettingsForms();

                    this.dashboard.showToast('success', 'Settings Restored', 'Settings restored from backup successfully');

                } catch (error) {
                    console.error('Failed to parse backup file:', error);
                    this.dashboard.showToast('error', 'Restore Error', 'Failed to parse backup file');
                }
            };

            fileReader.readAsText(backupFile);

        } catch (error) {
            console.error('Failed to restore settings:', error);
            this.dashboard.showToast('error', 'Restore Error', 'Failed to restore settings from backup');
        }
    }

    validateBackupData(data) {
        return data &&
            data.settings &&
            data.backupDate &&
            data.version &&
            data.settings.general &&
            data.settings.security;
    }

    // System information
    getSystemInfo() {
        return {
            version: '1.0.0',
            lastUpdate: new Date().toISOString(),
            uptime: this.getUptime(),
            databaseSize: this.getDatabaseSize(),
            activeUsers: this.getActiveUsers(),
            systemHealth: this.getSystemHealth()
        };
    }

    getUptime() {
        // Simulate uptime calculation
        const startTime = new Date('2024-01-01T00:00:00');
        const now = new Date();
        const diff = now - startTime;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return `${days}d ${hours}h ${minutes}m`;
    }

    getDatabaseSize() {
        // Simulate database size
        return '2.4 MB';
    }

    getActiveUsers() {
        // Simulate active users count
        return Math.floor(Math.random() * 10) + 1;
    }

    getSystemHealth() {
        // Simulate system health check
        const health = {
            status: 'healthy',
            cpu: Math.floor(Math.random() * 30) + 20,
            memory: Math.floor(Math.random() * 40) + 30,
            disk: Math.floor(Math.random() * 20) + 10
        };

        if (health.cpu > 80 || health.memory > 90 || health.disk > 90) {
            health.status = 'warning';
        }

        return health;
    }

    // Show system information modal
    showSystemInfo() {
        const systemInfo = this.getSystemInfo();

        const modalContent = `
            <div class="system-info">
                <h3>System Information</h3>
                
                <div class="info-section">
                    <h4>General</h4>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="label">Version:</span>
                            <span class="value">${systemInfo.version}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Last Update:</span>
                            <span class="value">${new Date(systemInfo.lastUpdate).toLocaleString()}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Uptime:</span>
                            <span class="value">${systemInfo.uptime}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Active Users:</span>
                            <span class="value">${systemInfo.activeUsers}</span>
                        </div>
                    </div>
                </div>
                
                <div class="info-section">
                    <h4>System Health</h4>
                    <div class="health-metrics">
                        <div class="health-item">
                            <span class="label">CPU Usage:</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${systemInfo.systemHealth.cpu}%"></div>
                            </div>
                            <span class="value">${systemInfo.systemHealth.cpu}%</span>
                        </div>
                        <div class="health-item">
                            <span class="label">Memory Usage:</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${systemInfo.systemHealth.memory}%"></div>
                            </div>
                            <span class="value">${systemInfo.systemHealth.memory}%</span>
                        </div>
                        <div class="health-item">
                            <span class="label">Disk Usage:</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${systemInfo.systemHealth.disk}%"></div>
                            </div>
                            <span class="value">${systemInfo.systemHealth.disk}%</span>
                        </div>
                    </div>
                    <div class="health-status">
                        <span class="status-badge ${systemInfo.systemHealth.status}">${systemInfo.systemHealth.status.toUpperCase()}</span>
                    </div>
                </div>
                
                <div class="info-section">
                    <h4>Database</h4>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="label">Size:</span>
                            <span class="value">${systemInfo.databaseSize}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.showModal('System Information', modalContent);
    }

    // Show backup/restore modal
    showBackupModal() {
        const modalContent = `
            <div class="backup-restore">
                <h3>Backup & Restore</h3>
                
                <div class="backup-section">
                    <h4>Create Backup</h4>
                    <p>Download a backup of all current system settings.</p>
                    <button class="btn-primary" onclick="window.adminDashboard.managers.settings.backupSettings()">
                        <i class="fas fa-download"></i>
                        Create Backup
                    </button>
                </div>
                
                <div class="restore-section">
                    <h4>Restore from Backup</h4>
                    <p>Upload a previously created backup file to restore settings.</p>
                    <input type="file" id="backupFile" accept=".json" style="display: none;">
                    <button class="btn-secondary" onclick="document.getElementById('backupFile').click()">
                        <i class="fas fa-upload"></i>
                        Choose File
                    </button>
                    <div id="selectedFile" class="selected-file" style="display: none;"></div>
                </div>
                
                <div class="warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p><strong>Warning:</strong> Restoring from backup will overwrite all current settings. Make sure to create a backup before proceeding.</p>
                </div>
            </div>
        `;

        this.showModal('Backup & Restore', modalContent, () => {
            // Handle file selection
            const fileInput = document.getElementById('backupFile');
            const selectedFileDiv = document.getElementById('selectedFile');

            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    selectedFileDiv.textContent = `Selected: ${file.name}`;
                    selectedFileDiv.style.display = 'block';

                    // Add restore button
                    const restoreBtn = document.createElement('button');
                    restoreBtn.className = 'btn-primary';
                    restoreBtn.innerHTML = '<i class="fas fa-undo"></i> Restore Settings';
                    restoreBtn.onclick = () => this.restoreSettings(file);
                    selectedFileDiv.appendChild(restoreBtn);
                }
            });
        });
    }

    showModal(title, content, onShow) {
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
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                </div>
            </div>
        `;

        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal-overlay active';
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);

        if (onShow) {
            onShow();
        }

        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                modalContainer.remove();
            }
        });
    }

    // Export settings
    exportSettings() {
        try {
            const exportData = {
                settings: this.settings,
                exportDate: new Date().toISOString(),
                version: '1.0.0'
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json'
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `settings_export_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            this.dashboard.showToast('success', 'Export Successful', 'Settings exported successfully');

        } catch (error) {
            console.error('Failed to export settings:', error);
            this.dashboard.showToast('error', 'Export Error', 'Failed to export settings');
        }
    }
}

export {
    SettingsManager
};