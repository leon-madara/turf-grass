import"./modulepreload-polyfill-B5Qt9EMX.js";document.addEventListener("DOMContentLoaded",function(){F(),K(),V()});function F(){x(),M(),N()}function x(){const s=document.querySelectorAll(".nav-tab"),t=document.querySelectorAll(".tab-content");s.forEach(o=>{o.addEventListener("click",()=>{const c=o.getAttribute("data-tab");s.forEach(u=>u.classList.remove("active")),t.forEach(u=>u.classList.remove("active")),o.classList.add("active"),document.getElementById(`${c}-content`).classList.add("active")})})}function M(){const s=document.getElementById("addItemBtn");s&&s.addEventListener("click",U);const t=document.getElementById("submitOrderBtn");t&&t.addEventListener("click",j);const o=document.getElementById("addPreorderBtn");o&&o.addEventListener("click",A);const c=document.getElementById("submitPreordersBtn");c&&c.addEventListener("click",H);const u=document.getElementById("addInquiryBtn");u&&u.addEventListener("click",W);const l=document.getElementById("submitInquiriesBtn");l&&l.addEventListener("click",z);const m=document.getElementById("logoutBtn");m&&m.addEventListener("click",T)}function N(){const s=localStorage.getItem("authState");if(s)try{const t=JSON.parse(s);t.loggedIn&&t.user&&O(t.user)}catch(t){console.error("Error parsing auth state:",t)}q()}function q(){const s=document.getElementById("cartCount");if(!s)return;let t=0;window.OrdersModule&&(t+=window.OrdersModule.getItemCount()),window.PreordersModule&&(t+=window.PreordersModule.getItemCount()),window.InquiryModule&&(t+=window.InquiryModule.getItemCount()),s.textContent=t,t>0?s.style.display="block":s.style.display="none"}function O(s){const t=document.getElementById("broker-name"),o=document.getElementById("broker-email");t&&(t.value=s.username||"Broker User"),o&&(o.value=s.email||"broker@eastleighturf.com")}function U(){window.OrdersModule&&window.OrdersModule.addItem()}function j(){window.OrdersModule&&window.OrdersModule.submitOrder()}function A(){window.PreordersModule&&window.PreordersModule.addPreorder()}function H(){window.PreordersModule&&window.PreordersModule.submitPreorders()}function W(){window.InquiryModule&&window.InquiryModule.addInquiry()}function z(){window.InquiryModule&&window.InquiryModule.submitInquiries()}function T(){localStorage.removeItem("authState"),D("Logging out...","success"),setTimeout(()=>{window.location.href="/index.html"},1500)}function D(s,t="success"){const o=document.getElementById("toast"),c=o.querySelector(".toast-message"),u=o.querySelector(".toast-icon i");c.textContent=s,t==="success"?(u.className="fas fa-check-circle",o.className="toast success"):t==="error"?(u.className="fas fa-exclamation-circle",o.className="toast error"):t==="info"&&(u.className="fas fa-info-circle",o.className="toast info"),o.classList.remove("hidden"),setTimeout(()=>{S()},4e3)}function S(){document.getElementById("toast").classList.add("hidden")}function K(){setTimeout(()=>{D(`Login Successful
Welcome to your broker dashboard.`,"success")},500)}function V(){["orders","preorders","inquiry","profile"].forEach(t=>{const o=document.createElement("script");o.src=`js/modules/${t}.js`,o.defer=!0,document.head.appendChild(o)})}window.BrokerDashboard={showToast:D,hideToast:S,handleLogout:T,updateCartCount:q};document.addEventListener("click",function(s){s.target.classList.contains("toast-close")&&S()});class R{constructor(){this.elements={orderTotalSpan:document.getElementById("orderTotal"),amountToPayInput:document.getElementById("amount-to-pay-input"),creditBalanceSpan:document.getElementById("credit-balance")},this.isFormatting=!1,this.initialize()}initialize(){if(!this.areElementsValid()){console.warn("Payment summary elements not found");return}this.setupEventListeners(),this.updateCreditBalance()}areElementsValid(){const{orderTotalSpan:t,amountToPayInput:o,creditBalanceSpan:c}=this.elements;return!!(t&&o&&c)}setupEventListeners(){const{amountToPayInput:t}=this.elements;t&&(t.addEventListener("input",o=>{this.handleInputFormatting(o)}),t.addEventListener("keydown",o=>{this.handleKeyDown(o)}),t.addEventListener("blur",()=>{this.handleInputBlur()}))}handleInputFormatting(t){if(this.isFormatting)return;const o=t.target,c=o.selectionStart||0,u=o.value,l=this.countDigitsBeforePosition(u,c);let m=u.replace(/[^\d.]/g,"");const f=m.indexOf(".");f!==-1&&(m=m.substring(0,f+1)+m.substring(f+1).replace(/\./g,""));const h=this.formatNumberWithCommas(m);this.isFormatting=!0,o.value=h,this.isFormatting=!1;const p=this.getPositionAfterDigits(h,l);setTimeout(()=>{o.setSelectionRange(p,p)},0),this.updateCreditBalance()}countDigitsBeforePosition(t,o){let c=0;for(let u=0;u<Math.min(o,t.length);u++)/\d/.test(t[u])&&c++;return c}getPositionAfterDigits(t,o){let c=0,u=0;for(let l=0;l<t.length;l++){if(/\d/.test(t[l])&&(c++,c===o)){u=l+1;break}c<o&&(u=l+1)}return Math.min(u,t.length)}formatNumberWithCommas(t){if(!t)return"";const o=t.split(".");return o[0]=o[0].replace(/\B(?=(\d{3})+(?!\d))/g,","),o.join(".")}handleKeyDown(t){t.key==="Enter"&&(t.preventDefault(),this.updateCreditBalance(),t.target.blur())}handleInputBlur(){this.updateCreditBalance(),this.ensureProperDecimalFormatting()}ensureProperDecimalFormatting(){const{amountToPayInput:t}=this.elements;if(!t)return;const o=t.value,c=this.parseFormattedNumber(o);if(c>0){const u=this.formatCurrency(c);t.value=u}}parseFormattedNumber(t){return t&&parseFloat(t.replace(/,/g,""))||0}formatCurrency(t){return t.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}updateCreditBalance(){const{orderTotalSpan:t,amountToPayInput:o,creditBalanceSpan:c}=this.elements;if(!t||!o||!c){console.warn("Cannot update credit balance: missing elements");return}const u=this.parseFormattedNumber(t.textContent||""),l=this.parseFormattedNumber(o.value),m=Math.max(0,u-l);c.textContent=this.formatCurrency(m)}}function k(){window.paymentSummaryHandler=new R}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",k):k();(()=>{let s=[],t=[],o=1;async function c(){await u(),p()}async function u(){try{s=await(await fetch("/turf-grass/data/products.json")).json(),console.log("Products loaded:",s.length,"products")}catch(n){console.error("Failed to load products:",n),E("Failed to load products","error")}}function l(){const n={id:o++,productId:"",product:null,quantity:1,unitPrice:0,total:0};t.push(n),p(),E("Item added to order","success"),window.BrokerDashboard&&window.BrokerDashboard.updateCartCount&&window.BrokerDashboard.updateCartCount()}function m(n){t=t.filter(e=>e.id!==n),p(),E("Item removed from order","success"),window.BrokerDashboard&&window.BrokerDashboard.updateCartCount&&window.BrokerDashboard.updateCartCount()}function f(n,e,i){const r=t.find(a=>a.id===n);if(r){{const a=s.find(d=>d.id===i);r.productId=i,r.product=a,r.unitPrice=a?a.price:0,r.total=r.unitPrice*r.quantity}p()}}function h(){return t.reduce((n,e)=>n+e.total,0)}function p(){const n=document.getElementById("orderTableBody"),e=document.getElementById("emptyOrderState"),i=document.getElementById("orderTotal"),r=document.getElementById("submitOrderBtn");if(!n||!e||!i||!r)return;t.length===0?(n.innerHTML="",e.style.display="block",r.disabled=!0):(e.style.display="none",r.disabled=!1,n.innerHTML=t.map(d=>w(d)).join(""),t.forEach(d=>{const b=document.getElementById(`product-${d.id}`),y=document.getElementById(`quantity-${d.id}`),I=document.getElementById(`delete-${d.id}`);b&&b.addEventListener("change",B=>{f(d.id,"productId",B.target.value)}),y&&(y.addEventListener("input",B=>{const P=B.target.value,g=t.find(C=>C.id===d.id);if(g){g.quantity=parseFloat(P)||0,g.total=g.unitPrice*g.quantity;const C=y.closest("tr").querySelector(".order-field strong");C&&(C.textContent=g.total.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}));const L=document.getElementById("orderTotal");if(L){const $=h();L.textContent=$.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}}}),y.addEventListener("blur",()=>p()),y.addEventListener("keydown",B=>{B.key==="Enter"&&(B.preventDefault(),p())})),I&&I.addEventListener("click",()=>{m(d.id)})}));const a=h();i.textContent=a.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}),window.paymentSummaryHandler&&window.paymentSummaryHandler.updateCreditBalance&&window.paymentSummaryHandler.updateCreditBalance()}function w(n){const e=s.map(i=>`<option value="${i.id}" ${n.productId===i.id?"selected":""}>
                ${i.name} (${i.thickness})
            </option>`).join("");return`
            <tr>
                <td>
                  <div class="order-field">
                    <label for="product-${n.id}">Product Name</label>
                    <select class="table-select" id="product-${n.id}">
                        <option value="">Select a product</option>
                        ${e}
                    </select>
                  </div>
                </td>
                <td>
                  <div class="order-field">
                    <label for="quantity-${n.id}">Quantity (m²)</label>
                    <input type="number" inputmode="decimal" class="table-input" id="quantity-${n.id}" 
                           value="${n.quantity}" min="0.1" step="0.1" placeholder="0">
                  </div>
                </td>
                <td>
                  <div class="order-field">
                    <label>Unit Price (KES)</label>
                    <input type="text" class="table-input" readonly 
                           value="${n.unitPrice.toLocaleString("en-US")}">
                  </div>
                </td>
                <td>
                  <div class="order-field">
                    <label>Total (KES)</label>
                    <strong>${n.total.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
                  </div>
                </td>
                <td>
                  <div class="order-field">
                    <label>Action</label>
                    <button class="delete-btn" id="delete-${n.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                  </div>
                </td>
            </tr>
        `}function E(n,e="success"){const i=document.getElementById("toast"),r=i.querySelector(".toast-message");i&&r&&(i.className=`toast ${e}`,r.textContent=n,i.classList.remove("hidden"),setTimeout(()=>{i.classList.add("hidden")},3e3))}function v(){const n=document.getElementById("addItemBtn");n&&n.addEventListener("click",l)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",async()=>{await c(),v()}):(async()=>(await c(),v()))()})();(()=>{let s=[],t=[],o=1;function c(){u(),p()}async function u(){try{s=await(await fetch("../public/data/products.json")).json()}catch(n){console.error("Failed to load products:",n),showToast("Failed to load products","error")}}function l(){const n={id:o++,productId:"",product:null,quantity:1,unitPrice:0,total:0,expectedDate:"",specialNotes:""};t.push(n),p(),showToast("Preorder item added","success"),window.BrokerDashboard&&window.BrokerDashboard.updateCartCount&&window.BrokerDashboard.updateCartCount()}function m(n){t=t.filter(e=>e.id!==n),p(),showToast("Preorder item removed","success"),window.BrokerDashboard&&window.BrokerDashboard.updateCartCount&&window.BrokerDashboard.updateCartCount()}function f(n,e,i){const r=t.find(a=>a.id===n);if(r){if(e==="productId"){const a=s.find(d=>d.id===i);r.productId=i,r.product=a,r.unitPrice=a?a.price:0,r.total=r.unitPrice*r.quantity}else e==="quantity"?(r.quantity=parseFloat(i)||0,r.total=r.unitPrice*r.quantity):e==="expectedDate"?r.expectedDate=i:e==="specialNotes"&&(r.specialNotes=i);p()}}function h(){return t.reduce((n,e)=>n+e.total,0)}function p(){const n=document.getElementById("preorderTableBody"),e=document.getElementById("emptyPreorderState"),i=document.getElementById("preorderTotal"),r=document.getElementById("submitPreordersBtn");if(!n||!e||!i||!r)return;t.length===0?(n.innerHTML="",e.style.display="block",r.disabled=!0):(e.style.display="none",r.disabled=!1,n.innerHTML=t.map(d=>w(d)).join(""),t.forEach(d=>{const b=document.getElementById(`preorder-product-${d.id}`),y=document.getElementById(`preorder-quantity-${d.id}`),I=document.getElementById(`preorder-date-${d.id}`),B=document.getElementById(`preorder-notes-${d.id}`),P=document.getElementById(`delete-preorder-${d.id}`);b&&b.addEventListener("change",g=>{f(d.id,"productId",g.target.value)}),y&&y.addEventListener("input",g=>{f(d.id,"quantity",g.target.value)}),I&&I.addEventListener("change",g=>{f(d.id,"expectedDate",g.target.value)}),B&&B.addEventListener("input",g=>{f(d.id,"specialNotes",g.target.value)}),P&&P.addEventListener("click",()=>{m(d.id)})}));const a=h();i.textContent=a.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}function w(n){const e=s.map(i=>`<option value="${i.id}" ${n.productId===i.id?"selected":""}>
                ${i.name} (${i.thickness})
            </option>`).join("");return`
            <tr>
                <td>
                    <select class="table-select" id="preorder-product-${n.id}">
                        <option value="">Select a product</option>
                        ${e}
                    </select>
                </td>
                <td>
                    <input type="number" class="table-input" id="preorder-quantity-${n.id}" 
                           value="${n.quantity}" min="0.1" step="0.1" placeholder="0">
                </td>
                <td>
                    <input type="text" class="table-input" readonly 
                           value="${n.unitPrice.toLocaleString("en-US")}">
                </td>
                <td>
                    <input type="date" class="table-input" id="preorder-date-${n.id}" 
                           value="${n.expectedDate}" placeholder="Expected date">
                </td>
                <td>
                    <input type="text" class="table-input" id="preorder-notes-${n.id}" 
                           value="${n.specialNotes}" placeholder="Special notes">
                </td>
                <td>
                    <strong>${n.total.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
                </td>
                <td>
                    <button class="delete-btn" id="delete-preorder-${n.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `}function E(){if(t.length===0){showToast("No preorder items to submit","error");return}if(t.filter(e=>!e.productId||e.quantity<=0).length>0){showToast("Please complete all preorder items before submitting","error");return}try{const e={brokerName:"Broker User",brokerEmail:"broker@eastleighturf.com",items:t.map(r=>({product:r.product,quantity:r.quantity,unitPrice:r.unitPrice,total:r.total})),expectedDate:t[0]?.expectedDate||"Not specified",specialNotes:t[0]?.specialNotes||"None",total:h()};window.WhatsAppService.sendPreorderForm(e)?(showToast("Preorders submitted successfully! WhatsApp will open with your preorder details.","success"),t=[],o=1,p(),window.BrokerDashboard&&window.BrokerDashboard.updateCartCount&&window.BrokerDashboard.updateCartCount()):showToast("Failed to send preorders. Please try again.","error")}catch(e){console.error("Preorder submission error:",e),showToast("An error occurred while submitting the preorders.","error")}}function v(){return t.length}window.PreordersModule={init:c,addPreorder:l,removePreorder:m,updatePreorder:f,submitPreorders:E,getItemCount:v},document.readyState==="loading"?document.addEventListener("DOMContentLoaded",c):c()})();(()=>{let s=[],t=[],o=1;function c(){u(),w()}async function u(){try{s=await(await fetch("../public/data/products.json")).json()}catch(e){console.error("Failed to load products:",e),showToast("Failed to load products","error")}}function l(){const e={id:o++,productId:"",product:null,originalPrice:0,bargainPrice:0,difference:0};t.push(e),w(),showToast("Inquiry added","success"),window.BrokerDashboard&&window.BrokerDashboard.updateCartCount&&window.BrokerDashboard.updateCartCount()}function m(e){t=t.filter(i=>i.id!==e),w(),showToast("Inquiry removed","success"),window.BrokerDashboard&&window.BrokerDashboard.updateCartCount&&window.BrokerDashboard.updateCartCount()}function f(e,i,r){const a=t.find(d=>d.id===e);if(a){if(i==="productId"){const d=s.find(b=>b.id===r);a.productId=r,a.product=d,a.originalPrice=d?d.price:0,a.difference=a.bargainPrice-a.originalPrice}else i==="bargainPrice"&&(a.bargainPrice=parseFloat(r)||0,a.difference=a.bargainPrice-a.originalPrice);w()}}function h(e){return e<0?"negative":e>0?"positive":"neutral"}function p(e){const i=Math.abs(e);return`${e<0?"-":e>0?"+":""}KES ${i.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`}function w(){const e=document.getElementById("inquiryTableBody"),i=document.getElementById("emptyInquiryState"),r=document.getElementById("submitInquiriesBtn");!e||!i||!r||(t.length===0?(e.innerHTML="",i.style.display="block",r.disabled=!0):(i.style.display="none",r.disabled=!1,e.innerHTML=t.map(a=>E(a)).join(""),t.forEach(a=>{const d=document.getElementById(`inquiry-product-${a.id}`),b=document.getElementById(`bargain-${a.id}`),y=document.getElementById(`delete-inquiry-${a.id}`);d&&d.addEventListener("change",I=>{f(a.id,"productId",I.target.value)}),b&&b.addEventListener("input",I=>{f(a.id,"bargainPrice",I.target.value)}),y&&y.addEventListener("click",()=>{m(a.id)})})))}function E(e){const i=s.map(d=>`<option value="${d.id}" ${e.productId===d.id?"selected":""}>
                ${d.name} (${d.thickness})
            </option>`).join(""),r=h(e.difference),a=p(e.difference);return`
            <tr>
                <td>
                    <select class="table-select" id="inquiry-product-${e.id}">
                        <option value="">Select a product</option>
                        ${i}
                    </select>
                </td>
                <td>
                    <input type="text" class="table-input" readonly 
                           value="${e.originalPrice.toLocaleString("en-US")}">
                </td>
                <td>
                    <input type="number" class="table-input" id="bargain-${e.id}" 
                           value="${e.bargainPrice}" min="0" step="0.01" placeholder="0">
                </td>
                <td>
                    <span class="price-difference ${r}">${a}</span>
                </td>
                <td>
                    <button class="delete-btn" id="delete-inquiry-${e.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `}function v(){if(t.length===0){showToast("No inquiries to submit","error");return}if(t.filter(i=>!i.productId||i.bargainPrice<=0).length>0){showToast("Please complete all inquiries before submitting","error");return}try{const i={brokerName:"Broker User",brokerEmail:"broker@eastleighturf.com",items:t.map(a=>({product:a.product,originalPrice:a.originalPrice,bargainPrice:a.bargainPrice})),totalOriginal:t.reduce((a,d)=>a+d.originalPrice,0),totalBargain:t.reduce((a,d)=>a+d.bargainPrice,0)};window.WhatsAppService.sendInquiryForm(i)?(showToast("Inquiries submitted successfully! WhatsApp will open with your inquiry details.","success"),t=[],o=1,w(),window.BrokerDashboard&&window.BrokerDashboard.updateCartCount&&window.BrokerDashboard.updateCartCount()):showToast("Failed to send inquiries. Please try again.","error")}catch(i){console.error("Inquiry submission error:",i),showToast("An error occurred while submitting the inquiries.","error")}}function n(){return t.length}window.InquiryModule={init:c,addInquiry:l,removeInquiry:m,updateInquiry:f,submitInquiries:v,getItemCount:n},document.readyState==="loading"?document.addEventListener("DOMContentLoaded",c):c()})();
