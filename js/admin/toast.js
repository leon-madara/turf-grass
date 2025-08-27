// Toast Notification System
class ToastSystem {
    constructor() {
        this.container = null;
        this.toasts = [];
        this.init();
    }

    init() {
        this.createContainer();
    }

    createContainer() {
        this.container = document.getElementById('toastContainer');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toastContainer';
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    }

    show(type, title, message, duration = 5000) {
        const toast = this.createToast(type, title, message);
        this.container.appendChild(toast);
        this.toasts.push(toast);

        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
            toast.style.opacity = '1';
        }, 10);

        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                this.remove(toast);
            }, duration);
        }

        return toast;
    }

    createToast(type, title, message) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                ${this.getIconForType(type)}
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add close functionality
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.remove(toast);
        });

        return toast;
    }

    getIconForType(type) {
        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-exclamation-circle"></i>',
            warning: '<i class="fas fa-exclamation-triangle"></i>',
            info: '<i class="fas fa-info-circle"></i>'
        };
        return icons[type] || icons.info;
    }

    remove(toast) {
        if (!toast || !toast.parentNode) return;

        // Animate out
        toast.style.transform = 'translateX(100%)';
        toast.style.opacity = '0';

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            this.toasts = this.toasts.filter(t => t !== toast);
        }, 300);
    }

    clear() {
        this.toasts.forEach(toast => {
            this.remove(toast);
        });
    }

    // Convenience methods
    success(title, message, duration) {
        return this.show('success', title, message, duration);
    }

    error(title, message, duration) {
        return this.show('error', title, message, duration);
    }

    warning(title, message, duration) {
        return this.show('warning', title, message, duration);
    }

    info(title, message, duration) {
        return this.show('info', title, message, duration);
    }
}

export {
    ToastSystem
};