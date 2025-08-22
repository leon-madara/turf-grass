import {
    loadHTML
} from '../utils.js';

/**
 * Broker Login Modal Component
 * Handles authentication for broker users with green glass UI
 * Redirects to /broker/broker.html on successful login
 */
(() => {
    // Helper functions for DOM manipulation
    const $$ = (selector, context = document) =>
        Array.from(context.querySelectorAll(selector));

    const $ = (selector, context = document) =>
        context.querySelector(selector);

    // DOM element references
    let modal = null;
    let form = null;
    let userInput = null;
    let passInput = null;

    // Configuration constants
    const PARTIAL_PATH = '/partials/broker-login.html';
    const DEMO_USERNAME = 'BROKER';
    const DEMO_PASSWORD = '123';
    const DASHBOARD_URL = '/broker/broker.html';
    const LOADING_DELAY = 700; // Simulated network delay

    /**
     * Opens the broker login modal
     * Sets focus to username field and prevents body scrolling
     */
    function open() {
        if (!modal) {
            console.warn('Modal not initialized');
            return;
        }

        modal.hidden = false;
        document.body.style.overflow = 'hidden';

        // Small delay to ensure modal is fully rendered before focusing
        setTimeout(() => {
            if (userInput) userInput.focus();
        }, 40);
    }

    /**
     * Closes the broker login modal
     * Resets form, clears errors, and restores body scrolling
     */
    function close() {
        if (!modal) {
            console.warn('Modal not initialized');
            return;
        }

        modal.hidden = true;
        if (form) form.reset();
        clearErrors();
        document.body.style.overflow = '';
    }

    /**
     * Removes all error styling and messages from the form
     */
    function clearErrors() {
        if (!form) return;

        // Remove error classes from inputs
        $$('.bl-error', form).forEach(element => {
            element.classList.remove('bl-error');
        });

        // Remove error text elements
        $$('.bl-errtext', form).forEach(errorElement => {
            errorElement.remove();
        });
    }

    /**
     * Displays an error message for a specific input field
     * @param {HTMLInputElement} input - The input element that has the error
     * @param {string} message - The error message to display
     */
    function showError(input, message) {
        // Add error styling to the input
        input.classList.add('bl-error');

        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bl-errtext';
        errorDiv.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;

        // Insert error message after the input
        input.insertAdjacentElement('afterend', errorDiv);
    }

    /**
     * Validates the login form inputs
     * @returns {boolean} True if validation passes, false otherwise
     */
    function validateForm() {
        clearErrors();
        let isValid = true;

        // Validate username
        if (!userInput || !userInput.value.trim()) {
            if (userInput) showError(userInput, 'Username is required');
            isValid = false;
        }

        // Validate password
        if (!passInput || !passInput.value) {
            if (passInput) showError(passInput, 'Password is required');
            isValid = false;
        }

        return isValid;
    }

    /**
     * Sets the loading state of the submit button
     * @param {boolean} isLoading - Whether to show loading state
     */
    function setLoadingState(isLoading) {
        const submitButton = form && form.querySelector('button[type="submit"]');
        if (!submitButton) return;

        submitButton.disabled = isLoading;
        submitButton.classList.toggle('is-loading', isLoading);

        if (isLoading) {
            // Store original text and show loading message
            submitButton.dataset.originalLabel = submitButton.textContent || '';
            submitButton.textContent = 'Signing in…';
        } else {
            // Restore original text
            const originalLabel = submitButton.dataset.originalLabel;
            if (originalLabel) {
                submitButton.textContent = originalLabel;
                delete submitButton.dataset.originalLabel;
            }
        }
    }

    /**
     * Redirects to the broker dashboard after successful authentication
     */
    function redirectToDashboard() {
        try {
            // Update auth state if available
            const authState = window.AuthState;
            if (authState && authState.login) {
                authState.login({
                    role: 'broker',
                    name: (userInput && userInput.value.trim()) || ''
                });
            }

            // Redirect to dashboard
            window.location.href = DASHBOARD_URL;
        } catch (error) {
            console.error('Error during dashboard redirect:', error);
        }
    }

    /**
     * Handles form submission and authentication
     * @param {Event} event - The form submit event
     */
    function handleSubmit(event) {
        event.preventDefault();

        // Validate form inputs
        if (!validateForm()) {
            return;
        }

        // Get form values
        const username = (userInput && userInput.value.trim()) || '';
        const password = (passInput && passInput.value) || '';

        // Set loading state
        setLoadingState(true);

        // Simulate authentication API call
        // TODO: Replace with actual authentication API
        setTimeout(() => {
            if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
                // Successful authentication
                redirectToDashboard();
            } else {
                // Authentication failed
                setLoadingState(false);
                if (userInput) {
                    showError(userInput, 'Invalid credentials. Use demo username: BROKER');
                }
                if (passInput) {
                    showError(passInput, 'Invalid credentials. Use demo password: 123');
                }
                if (userInput) userInput.focus();
            }
        }, LOADING_DELAY);
    }

    /**
     * Handles keyboard events for modal interaction
     * @param {KeyboardEvent} event - The keyboard event
     */
    function handleKeydown(event) {
        // Close modal on Escape key
        if (event.key === 'Escape' && modal && !modal.hidden) {
            close();
        }
    }

    /**
     * Initializes event listeners and DOM references
     */
    function setupEventListeners() {
        // Get DOM references
        modal = $('#brokerLogin');
        if (!modal) {
            console.warn('Broker login modal not found in DOM');
            return;
        }

        form = $('#bl-form', modal);
        userInput = $('#bl-user', modal);
        passInput = $('#bl-pass', modal);

        // Verify all required elements are present
        if (!form || !userInput || !passInput) {
            console.error('Required form elements not found');
            return;
        }

        // Setup open button event listener
        const openButton = $('#dealerLoginBtn');
        if (openButton) {
            openButton.addEventListener('click', open);
        }

        // Setup close button event listeners
        $$('.bl-close, .bl-overlay', modal).forEach(element => {
            element.addEventListener('click', close);
        });

        // Setup form submission
        form.addEventListener('submit', handleSubmit);

        // Setup keyboard event listener
        document.addEventListener('keydown', handleKeydown);
    }

    /**
     * Loads the modal HTML partial and initializes the component
     * @returns {Promise<void>}
     */
    async function initialize() {
        try {
            // Load the HTML partial
            await loadHTML('body', PARTIAL_PATH, {
                position: 'beforeend'
            });

            // Small delay to ensure DOM is ready
            setTimeout(setupEventListeners, 10);

            console.log('Broker login modal initialized successfully');
        } catch (error) {
            console.error('Failed to load broker login modal:', error);
        }
    }

    // Initialize the component immediately
    initialize();

    // Expose public API for external control
    window.BrokerLogin = {
        open,
        close
    };
})();