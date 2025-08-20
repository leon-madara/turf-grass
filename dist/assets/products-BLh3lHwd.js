import"./modulepreload-polyfill-B5Qt9EMX.js";import"./floating-header-DM-pzQnK.js";const v=(()=>{let t=[],c=0,r=[];function a(){return[...t]}function o(e){const i=Date.now();t.push({id:i,...e}),s()}function d(e){t=t.filter(i=>i.id!==e),s()}function u(){t=[],c=0,s()}function p(e){e==="SAVE10"?c=.1:c=0,s()}function n(){const e=t.reduce((i,h)=>i+h.total,0);return e-e*c}function s(){r.forEach(e=>{try{e({items:a(),total:n(),discount:c})}catch(i){console.error("Cart subscriber error:",i)}}),window.renderCartUI&&window.renderCartUI(a(),n(),c)}function l(e){return r.push(e),()=>{const i=r.indexOf(e);i>-1&&r.splice(i,1)}}return{getItems:a,add:o,remove:d,clear:u,applyDiscount:p,getTotal:n,subscribe:l}})();function m(t,c){const r=s=>Number.isFinite(s)?s.toLocaleString():"0",a=document.createElement("div");a.className="product-card",a.setAttribute("data-product-id",t.id),a.innerHTML=`
    <div class="product-image">
      <img src="${t.image}" alt="${t.name}" />
      <div class="product-badges">
        <div class="product-badge">${t.thickness}</div>
        <div class="product-badge price">
          KES <span class="price-amount">${r(t.price)}</span>/m²
        </div>
      </div>
    </div>

    <div class="product-content">
      <h3 class="product-title">${t.name}</h3>

      <div class="product-section">
        <h4>Best for</h4>
        <div class="use-cases">
          ${t.useCases.map(s=>`<span class="use-case">${s}</span>`).join("")}
        </div>
      </div>

      <div class="product-section">
        <h4>Key Features:</h4>
        <ul class="features-list">
          ${t.features.map(s=>`<li>${s}</li>`).join("")}
        </ul>
      </div>

      <div class="calculator-section">
        <div class="dimension-inputs">
          <div class="input-group">
            <label>Width (m)</label>
            <input type="number" class="width-input" placeholder="0" min="0" step="0.1" />
          </div>
          <div class="input-group">
            <label>Height (m)</label>
            <input type="number" class="height-input" placeholder="0" min="0" step="0.1" />
          </div>
        </div>

        <button class="calculate-btn">
          <i class="fas fa-calculator"></i>
          Calculate
        </button>

        <div class="calculation-result" style="display:none;">
          <div class="result-row">
            <span class="area-label">Area:</span><span class="area-value">0 m²</span>
          </div>
          <div class="result-row">
            <span class="unit-price-label">Unit Price:</span><span class="unit-price">KES 0/m²</span>
          </div>
          <div class="result-row">
            <span class="total-label">Total:</span><span class="total-price">KES 0</span>
          </div>
        </div>

        <button class="add-to-cart-btn" disabled>
          <i class="fas fa-shopping-cart"></i>
          Add to Cart
        </button>
      </div>
    </div>
  `;const o=a.querySelector(".width-input"),d=a.querySelector(".height-input"),u=a.querySelector(".calculate-btn"),p=a.querySelector(".calculation-result"),n=a.querySelector(".add-to-cart-btn");return u.addEventListener("click",()=>{const s=parseFloat(o.value)||0,l=parseFloat(d.value)||0;if(s>0&&l>0){const e=s*l,i=e*t.price;a.querySelector(".area-value").textContent=`${e.toFixed(2)} m²`,a.querySelector(".unit-price").textContent=`KES ${r(t.price)}/m²`,a.querySelector(".total-price").textContent=`KES ${r(i)}`,p.style.display="block",n.disabled=!1,n.dataset.width=String(s),n.dataset.height=String(l),n.dataset.area=String(e),n.dataset.total=String(i)}}),n.addEventListener("click",()=>{if(typeof c=="function"){const s=parseFloat(n.dataset.width||"0"),l=parseFloat(n.dataset.height||"0"),e=parseFloat(n.dataset.area||"0"),i=parseFloat(n.dataset.total||"0"),h={id:t.id,name:t.name,image:t.image,price:t.price,length:l,width:s,area:e,total:i,quantity:1};c(h)}}),a}document.addEventListener("DOMContentLoaded",async()=>{const t=document.getElementById("productsGrid");if(t)try{(await(await fetch("/turf-grass/data/products.json",{cache:"no-cache"})).json()).forEach(a=>{const o=m(a,d=>{v.add(d)});t.appendChild(o)})}catch(c){console.error("Error loading products:",c)}});
