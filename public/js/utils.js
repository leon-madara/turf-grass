// utils.js — Common utility functions

/**
 * Load an HTML partial into a target element
 * @param {string} selector - CSS selector for the target container
 * @param {string} url - Path to the partial HTML file
 * @param {object} options - Optional settings
 * @param {string} options.position - Where to insert the HTML (default: 'innerHTML')
 * @returns {Promise<void>}
 */
const loadHTML = (selector, url, options = {}) => {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load ${url}: ${response.statusText}`);
                return response.text();
            })
            .then(html => {
                const target = document.querySelector(selector);
                if (!target) {
                    console.warn(`loadHTML: target selector '${selector}' not found.`);
                    return reject(new Error(`Target selector '${selector}' not found`));
                }
                const { position = 'innerHTML' } = options;
                if (position === 'innerHTML') {
                    target.innerHTML = html;
                } else {
                    target.insertAdjacentHTML(position, html);
                }
                resolve(); // Resolve the promise on success
            })
            .catch(err => {
                console.error(err);
                reject(err); // Reject the promise on error
            });
    });
};

// Expose globally
window.loadHTML = loadHTML;
