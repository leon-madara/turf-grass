import { loadHTML } from '../utils/utils.js';
import { Cart } from '../state/cartState.js';

/**
 * Mounts the cart panel to the specified selector
 * @param {string} mountSelector - CSS selector where to mount the cart panel
 */
export async function mountCartPanel(mountSelector = '#cartMount') {
  try {
    await loadHTML(mountSelector, 'public/partials/cart.html');
    wireCartUI();
  } catch (error) {
    console.error('Error mounting cart panel:', error);
  }
}

/**
 * Wires up the cart UI event listeners and subscriptions
 */
function wireCartUI() {
  // Helper function for selecting elements
  const $ = (sel) => document.querySelector(sel);

  const applyBtn = $('#applyDiscountBtn');
  const submitBtn = $('#submitOrderBtn');
  const itemsWrap = $('#cartItems');

  // Wire up discount application
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      Cart.applyDiscount?.();
    });
  }

  // Wire up order submission
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      Cart.submit?.();
    });
  }

  // Wire up item removal
  if (itemsWrap) {
    itemsWrap.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-remove]');
      if (!btn) return;
      
      const id = Number(btn.getAttribute('data-remove'));
      Cart.remove?.(id);
    });
  }

  // Keep UI in sync with cart state
  Cart.subscribe((state) => {
    updateCartUI(state);
  });
}

/**
 * Updates the cart UI based on the current state
 * @param {Object} state - Current cart state with items array
 */
function updateCartUI(state) {
  const itemsWrap = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  const countEl = document.getElementById('cartCount');

  // Update cart items display
  if (itemsWrap) {
    itemsWrap.innerHTML = state.items.map((item, idx) => `
      <div class="cart-item">
        <div class="cart-item-info">
          <strong>${item.product.name}</strong>
          <span>${item.area.toFixed(2)} m² @ KES ${item.product.price.toLocaleString()}/m²</span>
        </div>
        <div class="cart-item-actions">
          <span class="cart-item-total">KES ${item.total.toLocaleString()}</span>
          <button data-remove="${idx}" class="remove-btn">&times;</button>
        </div>
      </div>
    `).join('');
  }

  // Update total display
  if (totalEl) {
    const total = state.items.reduce((sum, item) => sum + item.total, 0);
    totalEl.textContent = `KES ${total.toLocaleString()}`;
  }

  // Update item count display
  if (countEl) {
    countEl.textContent = state.items.length.toString();
  }
}

// Modal logic for non-products pages
if (!document.body.classList.contains('products-page')) {
  (async function mountCartModal() {
    console.log('Starting cart modal initialization...');
    
    try {
      // Step 1: Load the modal HTML
      await loadHTML('#cartMount', 'public/partials/cart-modal.html');
      console.log('Cart modal HTML loaded successfully');
      
      // Step 2: Add a small delay to ensure DOM is ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Step 3: Get all required DOM elements
      const modal = document.getElementById('cartModal');
      const overlay = document.getElementById('cartModalOverlay');
      const closeBtn = document.getElementById('cartModalClose');
      const cartIcon = document.getElementById('cartIconBtn');
      const itemsWrap = document.getElementById('cartModalItems');
      const totalEl = document.getElementById('cartModalTotal');
      const countEl = document.getElementById('cartModalCount');

      // Step 4: Debug element availability
      console.log('DOM Elements found:');
      console.log('- modal:', !!modal);
      console.log('- overlay:', !!overlay);
      console.log('- closeBtn:', !!closeBtn);
      console.log('- cartIcon:', !!cartIcon);
      console.log('- itemsWrap:', !!itemsWrap);
      console.log('- totalEl:', !!totalEl);
      console.log('- countEl:', !!countEl);

      /**
       * Opens the cart modal
       */
      function openModal() {
        console.log('Opening cart modal...');
        if (modal && overlay) {
          modal.hidden = false;
          overlay.style.display = 'block';
          modal.focus();
          console.log('Cart modal opened successfully');
        } else {
          console.error('Cannot open modal - missing DOM elements');
        }
      }

      /**
       * Closes the cart modal
       */
      function closeModal() {
        console.log('Closing cart modal...');
        if (modal && overlay) {
          modal.hidden = true;
          overlay.style.display = 'none';
          console.log('Cart modal closed successfully');
        }
      }

      // Step 5: Wire up cart icon click with detailed debugging
      if (cartIcon) {
        console.log('Adding click listener to cart icon button');
        cartIcon.addEventListener('click', (e) => {
          e.preventDefault();
          console.log('Cart icon button clicked - event fired!');
          openModal();
        });
        
        // Additional debugging - check if element is visible and clickable
        const rect = cartIcon.getBoundingClientRect();
        const styles = window.getComputedStyle(cartIcon);
        console.log('Cart icon details:');
        console.log('- Position:', rect);
        console.log('- Display:', styles.display);
        console.log('- Visibility:', styles.visibility);
        console.log('- Pointer events:', styles.pointerEvents);
        console.log('- Z-index:', styles.zIndex);
        console.log('- Button text:', cartIcon.textContent?.trim());
        console.log('- Button HTML:', cartIcon.outerHTML);
      } else {
        console.error('Cart icon button not found! Check if element with id="cartIconBtn" exists in the DOM');
        
        // Alternative: try to find similar elements
        const possibleButtons = document.querySelectorAll('[id*="cart"], [class*="cart"], button');
        console.log('Possible cart-related elements found:', possibleButtons.length);
        possibleButtons.forEach((btn, index) => {
          console.log(`Element ${index}:`, {
            tagName: btn.tagName,
            id: btn.id,
            className: btn.className,
            textContent: btn.textContent?.trim()
          });
        });
        
        // Try event delegation as fallback
        console.log('Setting up event delegation as fallback...');
        document.addEventListener('click', (e) => {
          const target = e.target;
          
          // Check various possible selectors
          if (target.id === 'cartIconBtn' || 
              target.closest('#cartIconBtn') ||
              target.classList.contains('cart-icon') ||
              target.getAttribute('data-cart-toggle')) {
            e.preventDefault();
            console.log('Cart button clicked via event delegation!');
            openModal();
          }
        });
      }

      // Step 6: Wire up other modal controls
      if (closeBtn) {
        console.log('Adding close button listener');
        closeBtn.addEventListener('click', closeModal);
      }

      if (overlay) {
        console.log('Adding overlay click listener');
        overlay.addEventListener('click', closeModal);
      }

      // ESC key handler
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.hidden) {
          closeModal();
        }
      });

      /**
       * Renders the cart items in the modal
       * @param {Object} state - Current cart state with items array
       */
      function renderModalCart(state) {
        if (!itemsWrap) return;

        itemsWrap.innerHTML = state.items.map((item, idx) => `
          <div class="cart-modal-item">
            <div class="cart-modal-item-header">
              <div class="cart-modal-item-info">
                <div class="cart-modal-item-title">${item.product.name}</div>
                <div class="cart-modal-item-meta">${item.width}m × ${item.height}m = ${item.area.toFixed(2)} m²</div>
                <div class="cart-modal-item-price">KES ${item.total.toLocaleString()}</div>
              </div>
              <div class="cart-modal-item-actions">
                <button class="cart-modal-edit-btn" data-edit="${idx}" title="Edit">
                  <i class="fa fa-pen"></i>
                </button>
                <button class="cart-modal-remove-btn" data-remove="${idx}" title="Remove">
                  <i class="fa fa-trash"></i>
                </button>
              </div>
            </div>
            <div class="cart-modal-edit-section" id="editSection-${idx}" style="display:none;">
              <label>
                Width (m) 
                <input type="number" min="1" value="${item.width}" id="editWidth-${idx}">
              </label>
              <label>
                Height (m) 
                <input type="number" min="1" value="${item.height}" id="editHeight-${idx}">
              </label>
              <button class="update-btn" data-update="${idx}">Update</button>
            </div>
          </div>
        `).join('');

        // Update count and total
        if (countEl) {
          const itemCount = state.items.length;
          countEl.textContent = `(${itemCount} item${itemCount !== 1 ? 's' : ''})`;
        }

        if (totalEl) {
          const total = state.items.reduce((sum, item) => sum + item.total, 0);
          totalEl.textContent = `KES ${total.toLocaleString()}`;
        }
      }

      // Step 7: Wire up edit/remove/update actions
      if (itemsWrap) {
        itemsWrap.addEventListener('click', (e) => {
          const target = e.target;
          const editBtn = target.closest('[data-edit]');
          const removeBtn = target.closest('[data-remove]');
          const updateBtn = target.closest('[data-update]');

          if (editBtn) {
            const idx = editBtn.getAttribute('data-edit');
            const section = document.getElementById(`editSection-${idx}`);
            if (section) {
              section.style.display = section.style.display === 'none' ? 'flex' : 'none';
            }
          }

          if (removeBtn) {
            const idx = Number(removeBtn.getAttribute('data-remove'));
            Cart.remove?.(idx);
          }

          if (updateBtn) {
            const idx = Number(updateBtn.getAttribute('data-update'));
            const widthInput = document.getElementById(`editWidth-${idx}`);
            const heightInput = document.getElementById(`editHeight-${idx}`);
            
            if (widthInput && heightInput) {
              const width = parseFloat(widthInput.value);
              const height = parseFloat(heightInput.value);
              
              if (width > 0 && height > 0) {
                Cart.updateDimensions?.(idx, width, height);
                const section = document.getElementById(`editSection-${idx}`);
                if (section) {
                  section.style.display = 'none';
                }
              }
            }
          }
        });
      }

      // Step 8: Subscribe to cart state changes
      Cart.subscribe(renderModalCart);
      console.log('Cart modal initialization completed');

    } catch (error) {
      console.error('Error initializing cart modal:', error);
    }
  })();
}