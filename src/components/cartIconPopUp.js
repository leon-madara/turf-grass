// STEP 1: Remove all conflicting event listeners
console.log('🔧 Fixing cart button conflicts...');

// Get the elements
const cartBtn = document.getElementById('cartIconBtn');
const popup = document.getElementById('cartIconPopUp');
const closeBtn = document.getElementById('cartPopUpCloseBtn');

if (cartBtn && popup) {
    console.log('Elements found, removing conflicts...');
    
    // STEP 2: Clone the button to remove ALL existing event listeners
    const cleanCartBtn = cartBtn.cloneNode(true);
    cartBtn.parentNode.replaceChild(cleanCartBtn, cartBtn);
    
    // STEP 3: Add single, clean event listener
    cleanCartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation(); // Prevent event bubbling
        
        console.log('✅ Single cart button clicked!');
        
        const isHidden = popup.classList.contains('hidden');
        console.log('Popup currently hidden:', isHidden);
        
        if (isHidden) {
            console.log('📂 Opening popup...');
            popup.classList.remove('hidden');
            popup.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        } else {
            console.log('📁 Closing popup...');
            popup.classList.add('hidden');
            popup.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // STEP 4: Clean close button listeners
    if (closeBtn) {
        const cleanCloseBtn = closeBtn.cloneNode(true);
        closeBtn.parentNode.replaceChild(cleanCloseBtn, closeBtn);
        
        cleanCloseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('❌ Close button clicked');
            
            popup.classList.add('hidden');
            popup.style.display = 'none';
            document.body.style.overflow = '';
        });
    }
    
    // STEP 5: Escape key handler
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !popup.classList.contains('hidden')) {
            console.log('⌨️ Escape key pressed');
            popup.classList.add('hidden');
            popup.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // STEP 6: Click outside to close
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            console.log('🖱️ Clicked outside popup');
            popup.classList.add('hidden');
            popup.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    console.log('✅ Cart button fixed - no more conflicts!');
    
} else {
    console.error('❌ Cart elements not found:', {
        cartBtn: !!cartBtn,
        popup: !!popup
    });
}