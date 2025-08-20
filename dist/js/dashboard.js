/**
 * Broker Dashboard Payment Summary Logic
 * Handles order total calculations and input formatting with improved user experience
 */

/**
 * Payment Summary Handler Class
 * Manages all payment calculation and input formatting functionality
 */
class PaymentSummaryHandler {
    constructor() {
        // Store references to DOM elements
        this.elements = {
            orderTotalSpan: document.getElementById('orderTotal'),
            amountToPayInput: document.getElementById('amount-to-pay-input'),
            creditBalanceSpan: document.getElementById('credit-balance')
        };

        // Flag to prevent recursive formatting
        this.isFormatting = false;

        // Initialize the handler
        this.initialize();
    }

    /**
     * Initialize event listeners and setup
     */
    initialize() {
        if (!this.areElementsValid()) {
            console.warn('Payment summary elements not found');
            return;
        }

        this.setupEventListeners();
        this.updateCreditBalance(); // Initial calculation
    }

    /**
     * Validate that all required elements exist
     * @returns {boolean} True if all elements are present
     */
    areElementsValid() {
        const {
            orderTotalSpan,
            amountToPayInput,
            creditBalanceSpan
        } = this.elements;
        return !!(orderTotalSpan && amountToPayInput && creditBalanceSpan);
    }

    /**
     * Setup all event listeners for the payment input
     */
    setupEventListeners() {
        const {
            amountToPayInput
        } = this.elements;

        if (!amountToPayInput) return;

        // Handle input formatting while typing
        amountToPayInput.addEventListener('input', (event) => {
            this.handleInputFormatting(event);
        });

        // Handle Enter key press
        amountToPayInput.addEventListener('keydown', (event) => {
            this.handleKeyDown(event);
        });

        // Handle when user leaves the input field
        amountToPayInput.addEventListener('blur', () => {
            this.handleInputBlur();
        });
    }

    /**
     * Handle input formatting without interfering with typing
     * @param {Event} event - The input event
     */
    handleInputFormatting(event) {
        // Prevent recursive calls during formatting
        if (this.isFormatting) return;

        const input = event.target;
        const cursorPosition = input.selectionStart || 0;
        const oldValue = input.value;

        // Count digits before cursor position in the old value
        const digitsBeforeCursor = this.countDigitsBeforePosition(oldValue, cursorPosition);

        // Remove all non-numeric characters except decimal point
        let cleanValue = oldValue.replace(/[^\d.]/g, '');

        // Ensure only one decimal point
        const decimalIndex = cleanValue.indexOf('.');
        if (decimalIndex !== -1) {
            cleanValue = cleanValue.substring(0, decimalIndex + 1) +
                cleanValue.substring(decimalIndex + 1).replace(/\./g, '');
        }

        // Format with commas if there's a valid number
        const formattedValue = this.formatNumberWithCommas(cleanValue);

        // Update the input value
        this.isFormatting = true;
        input.value = formattedValue;
        this.isFormatting = false;

        // Calculate new cursor position based on digit count
        const newCursorPosition = this.getPositionAfterDigits(formattedValue, digitsBeforeCursor);

        // Set cursor position after a brief delay to ensure it works
        setTimeout(() => {
            input.setSelectionRange(newCursorPosition, newCursorPosition);
        }, 0);

        // Update credit balance in real-time
        this.updateCreditBalance();
    }

    /**
     * Count the number of digits before a given position in a string
     * @param {string} value - The string to analyze
     * @param {number} position - The position to count digits before
     * @returns {number} Number of digits before the position
     */
    countDigitsBeforePosition(value, position) {
        let digitCount = 0;
        for (let i = 0; i < Math.min(position, value.length); i++) {
            if (/\d/.test(value[i])) {
                digitCount++;
            }
        }
        return digitCount;
    }

    /**
     * Get the cursor position after a specific number of digits in a formatted string
     * @param {string} formattedValue - The formatted string
     * @param {number} digitCount - Number of digits after which to place cursor
     * @returns {number} The cursor position
     */
    getPositionAfterDigits(formattedValue, digitCount) {
        let digitsFound = 0;
        let position = 0;

        for (let i = 0; i < formattedValue.length; i++) {
            if (/\d/.test(formattedValue[i])) {
                digitsFound++;
                if (digitsFound === digitCount) {
                    position = i + 1;
                    break;
                }
            }
            // If we haven't found enough digits yet, keep moving
            if (digitsFound < digitCount) {
                position = i + 1;
            }
        }

        return Math.min(position, formattedValue.length);
    }

    /**
     * Format a number string with commas for thousands separator
     * @param {string} value - The number string to format
     * @returns {string} Formatted number with commas
     */
    formatNumberWithCommas(value) {
        if (!value) return '';

        // Split by decimal point
        const parts = value.split('.');

        // Add commas to the integer part
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        // Rejoin with decimal point if it exists
        return parts.join('.');
    }

    /**
     * Handle keydown events (specifically Enter key)
     * @param {KeyboardEvent} event - The keyboard event
     */
    handleKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission if in a form
            this.updateCreditBalance();

            // Optionally blur the input to show final formatting
            event.target.blur();
        }
    }

    /**
     * Handle when input loses focus
     */
    handleInputBlur() {
        this.updateCreditBalance();
        this.ensureProperDecimalFormatting();
    }

    /**
     * Ensure proper decimal formatting when input loses focus
     */
    ensureProperDecimalFormatting() {
        const {
            amountToPayInput
        } = this.elements;
        if (!amountToPayInput) return;

        const value = amountToPayInput.value;
        const numericValue = this.parseFormattedNumber(value);

        if (numericValue > 0) {
            // Format with exactly 2 decimal places
            const formattedValue = this.formatCurrency(numericValue);
            amountToPayInput.value = formattedValue;
        }
    }

    /**
     * Parse a formatted number string to float
     * @param {string} value - The formatted number string
     * @returns {number} The parsed number
     */
    parseFormattedNumber(value) {
        if (!value) return 0;
        return parseFloat(value.replace(/,/g, '')) || 0;
    }

    /**
     * Format a number as currency with commas and 2 decimal places
     * @param {number} value - The number to format
     * @returns {string} Formatted currency string
     */
    formatCurrency(value) {
        return value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    /**
     * Update the credit balance based on order total and amount to pay
     */
    updateCreditBalance() {
        const {
            orderTotalSpan,
            amountToPayInput,
            creditBalanceSpan
        } = this.elements;

        if (!orderTotalSpan || !amountToPayInput || !creditBalanceSpan) {
            console.warn('Cannot update credit balance: missing elements');
            return;
        }

        // Get order total (remove commas, parse as float)
        const orderTotal = this.parseFormattedNumber(orderTotalSpan.textContent || '');

        // Get input value (remove commas, parse as float)
        const amountToPay = this.parseFormattedNumber(amountToPayInput.value);

        // Calculate credit (cannot be negative)
        const credit = Math.max(0, orderTotal - amountToPay);

        // Update credit balance display
        creditBalanceSpan.textContent = this.formatCurrency(credit);
    }
}

/**
 * Initialize the Payment Summary Handler when DOM is fully loaded
 * This ensures all elements are available before trying to access them
 */
function initializePaymentSummary() {
    // Create new instance of the payment handler
    window.paymentSummaryHandler = new PaymentSummaryHandler();
}

// Multiple ways to ensure DOM is loaded before initialization
if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded event
    document.addEventListener('DOMContentLoaded', initializePaymentSummary);
} else {
    // DOM is already loaded, initialize immediately
    initializePaymentSummary();
}