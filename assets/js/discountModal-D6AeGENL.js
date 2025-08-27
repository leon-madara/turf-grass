import{C as o}from"./cartState-Dk7kX525.js";class n{constructor(){this.modal=null,this.isOpen=!1,this.currentPromotion=null,this.init()}async init(){await this.createModal(),this.bindEvents()}async createModal(){try{const t=await fetch("/Eastleigh-Turf-Grass-Clean/partials/discount-modal.html");if(!t.ok)throw new Error("Failed to load discount modal template");const s=await t.text();document.body.insertAdjacentHTML("beforeend",s),this.modal=document.getElementById("discountModal")}catch(t){console.error("Error loading discount modal:",t)}}bindEvents(){document.addEventListener("click",t=>{this.modal&&((t.target.id==="closeDiscountModal"||t.target.closest(".modal-overlay")||t.target.id==="cancelDiscountBtn")&&this.close(),t.target.id==="applyDiscountBtn"&&this.applyDiscount())}),document.addEventListener("keydown",t=>{t.key==="Escape"&&this.isOpen&&this.close()})}open(){if(!this.modal)return;const t=o.getBestPromotion();if(!t){this.showNoDiscountMessage();return}this.currentPromotion=t,this.updateContent(),this.modal.classList.add("active"),this.isOpen=!0,document.body.style.overflow="hidden"}close(){this.modal&&(this.modal.classList.remove("active"),this.isOpen=!1,document.body.style.overflow="",this.currentPromotion=null)}updateContent(){if(!this.currentPromotion||!this.modal)return;const t=this.modal.querySelector("#discountContent"),s=o.getSubtotal(),e=this.currentPromotion.potentialSavings;t.innerHTML=`
            <div class="discount-offer">
                <div class="discount-badge">
                    <span class="discount-percentage">${this.currentPromotion.value}%</span>
                    <span class="discount-label">OFF</span>
                </div>
                
                <h3>${this.currentPromotion.name}</h3>
                <p class="discount-description">${this.currentPromotion.description}</p>
                
                <div class="discount-details">
                    <div class="detail-row">
                        <span>Your Order:</span>
                        <span class="amount">KES ${s.toLocaleString()}</span>
                    </div>
                    <div class="detail-row">
                        <span>You'll Save:</span>
                        <span class="savings">KES ${e.toLocaleString()}</span>
                    </div>
                    <div class="detail-row total">
                        <span>Final Total:</span>
                        <span class="final-amount">KES ${(s-e).toLocaleString()}</span>
                    </div>
                </div>
                
                <div class="discount-terms">
                    <small>Minimum order: KES ${this.currentPromotion.minOrder.toLocaleString()}</small>
                    <small>Valid until: ${new Date(this.currentPromotion.validTo).toLocaleDateString()}</small>
                </div>
            </div>
        `}showNoDiscountMessage(){if(!this.modal)return;const t=this.modal.querySelector("#discountContent");t.innerHTML=`
            <div class="no-discount">
                <div class="no-discount-icon">🎯</div>
                <h3>No Discount Available</h3>
                <p>Currently, no promotional discounts are available for your order.</p>
                <p>Try adding more items to your cart or check back later for special offers!</p>
            </div>
        `,this.modal.classList.add("active"),this.isOpen=!0,document.body.style.overflow="hidden"}applyDiscount(){if(!this.currentPromotion)return;const t=o.applyPromotion(this.currentPromotion.id);t.valid?(this.showSuccessMessage(t.message),setTimeout(()=>{this.close()},2e3)):this.showErrorMessage(t.message)}showSuccessMessage(t){const s=this.modal.querySelector("#discountContent");s.innerHTML=`
            <div class="success-message">
                <div class="success-icon">✅</div>
                <h3>Discount Applied!</h3>
                <p>${t}</p>
            </div>
        `}showErrorMessage(t){const s=this.modal.querySelector("#discountContent");s.innerHTML=`
            <div class="error-message">
                <div class="error-icon">❌</div>
                <h3>Unable to Apply Discount</h3>
                <p>${t}</p>
                <button class="btn-primary" onclick="this.parentElement.parentElement.parentElement.querySelector('#applyDiscountBtn').click()">
                    Try Again
                </button>
            </div>
        `}}const r=new n;export{r as discountModal};
