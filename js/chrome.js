/* RESHAM — shared chrome for shop pages: footer, ticker, toast, product cards */
(function () {
  "use strict";

  const inr = (n) => (window.ReshamStore ? ReshamStore.inr(n) : "₹" + n.toLocaleString("en-IN"));

  /* ---------- footer ---------- */
  const FOOTER_HTML = `
  <div class="footer-top">
    <div class="footer-lede">
      <h2>Woven with <em>heritage.</em><br>Draped for <em>today.</em></h2>
      <p class="footer-copy">© 2026 RESHAM · A Digigrow Solution experience · digigrowsolutions.in</p>
    </div>
    <div class="footer-word" aria-hidden="true">RESHAM</div>
    <nav class="footer-col" aria-label="Shop">
      <h3>Shop</h3>
      <a href="index.html#the-rack">Silk sarees</a><a href="index.html#the-rack">Half sarees</a><a href="index.html#the-rack">Blouses</a><a href="index.html#bridal">Bridal collection</a>
    </nav>
    <nav class="footer-col" aria-label="Explore">
      <h3>Explore</h3>
      <a href="index.html">Our story</a><a href="index.html#feel-the-drape">Craftsmanship</a><a href="wishlist.html">Wishlist</a><a href="cart.html">Your bag</a>
    </nav>
    <nav class="footer-col" aria-label="Support">
      <h3>Support</h3>
      <a href="contact.html">Contact us</a><a href="shipping.html">Shipping &amp; delivery</a><a href="refund.html">Returns &amp; refunds</a>
    </nav>
    <nav class="footer-col" aria-label="Legal">
      <h3>Legal</h3>
      <a href="terms.html">Terms &amp; conditions</a><a href="privacy.html">Privacy policy</a>
    </nav>
    <div class="footer-news">
      <h3>Stay updated</h3>
      <p>New collections, private previews and styling notes, delivered thoughtfully.</p>
      <form id="newsForm" class="news-form">
        <label class="sr-only" for="newsEmail">Your email address</label>
        <input id="newsEmail" type="email" placeholder="Your email address" required>
        <button class="btn btn-light" type="submit">Weave it in</button>
      </form>
      <a class="back-top" href="#top">Back to top ↑</a>
    </div>
  </div>`;

  const TICKER_ITEMS = [
    ["Handwoven in Lucknow, one saree at a time", null],
    ["PURE ZARI", "Silver-core zari woven into every temple border"],
    ["7-DAY RETURNS", "Free reverse pickup across India"],
    ["COD AVAILABLE", "Cash on delivery, zero extra"],
    ["BRIDAL", "Heirloom silks for the day that matters"],
  ];

  /* ---------- nav ---------- */
  const LOTUS = '<svg class="brand-lotus" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 3c1.5 2.2 2 4.1 2 5.6 0 1.9-.9 3.4-2 3.4s-2-1.5-2-3.4c0-1.5.5-3.4 2-5.6Zm-7.4 3.4c2.4.8 4.1 1.9 5.2 3.1 1.3 1.4 1.7 3 1 3.7-.7.8-2.4.5-3.9-.7-1.3-1-2.4-2.6-2.5-6.1Zm14.8 0c-.1 3.5-1.2 5.1-2.5 6.1-1.5 1.2-3.2 1.5-3.9.7-.7-.8-.3-2.3 1-3.7 1.1-1.2 2.8-2.3 5.4-3.1ZM2.9 11.6c3 .1 5 .9 6.3 1.9 1.5 1.2 2.1 2.8 1.5 3.6-.6.9-2.4 1-4.2.2-1.9-.8-3.5-2.4-3.6-5.7Zm18.2 0c-.1 3.3-1.7 4.9-3.6 5.7-1.8.8-3.6.7-4.2-.2-.6-.8 0-2.4 1.5-3.6 1.3-1 3.3-1.8 6.3-1.9ZM12 14.5c1.6.5 2.9 1.4 3.7 2.5.9 1.2 1.1 2.5.5 3.1-.6.6-1.9.5-3.1-.4-.6-.4-1-1-1.1-1.5-.1.5-.5 1.1-1.1 1.5-1.2.9-2.5 1-3.1.4-.6-.6-.4-1.9.5-3.1.8-1.1 2.1-2 3.7-2.5Z"/></svg>';
  const HEART_NAV = '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M12 20.5C7 16.5 3 13.3 3 9.3 3 6.4 5.2 4.5 7.6 4.5c1.7 0 3.3.9 4.4 2.4 1.1-1.5 2.7-2.4 4.4-2.4 2.4 0 4.6 1.9 4.6 4.8 0 4-4 7.2-9 11.2Z"/></svg>';
  const BAG_NAV = '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M6 8h12l-1 12.5H7L6 8Z"/><path fill="none" stroke="currentColor" stroke-width="1.8" d="M9 10V6.5a3 3 0 0 1 6 0V10"/></svg>';
  const NAV_HTML = `
  <nav class="nav-pill" aria-label="Primary">
    <a class="brand" href="index.html" aria-label="RESHAM home">${LOTUS}<span class="brand-word">RESHAM<small>LUCKNOW SILK</small></span></a>
    <ul class="nav-links" id="navLinks">
      <li><a href="index.html">Home</a></li>
      <li><a href="index.html#the-rack">The Rack</a></li>
      <li><a href="index.html#bridal">Bridal</a></li>
      <li><a href="wishlist.html">Wishlist</a></li>
      <li><a href="cart.html">Bag</a></li>
    </ul>
    <div class="nav-actions">
      <a class="icon-btn" href="wishlist.html" aria-label="Wishlist">${HEART_NAV}<span class="badge" id="wishCount" hidden>0</span></a>
      <a class="icon-btn" href="cart.html" aria-label="Shopping bag">${BAG_NAV}<span class="badge" id="bagCount" hidden>0</span></a>
      <a class="visit-btn" href="index.html#the-rack">Visit the Store <span class="visit-avatar"><img src="assets/look-ivory.jpg" alt=""></span></a>
    </div>
  </nav>`;

  function initChrome() {
    const n = document.getElementById("pageNav");
    if (n && !n.dataset.done) { n.innerHTML = NAV_HTML; n.dataset.done = "1"; }
    const f = document.getElementById("pageFooter");
    if (f && !f.dataset.done) { f.innerHTML = FOOTER_HTML; f.dataset.done = "1"; }
    const t = document.getElementById("subTickerTrack");
    if (t) {
      const seq = TICKER_ITEMS.map(([b, rest]) => (rest ? rest + " " : "") + "<i>◆</i><b>" + b + "</b><i>◆</i>").join("");
      t.innerHTML = seq + seq;
    }
    const nf = document.getElementById("newsForm");
    if (nf) nf.addEventListener("submit", (e) => { e.preventDefault(); toast("Woven into the list. First letter arrives with the new season."); e.target.reset(); });
    $$(".back-top").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }));
    // badges render into the injected nav — re-sync now that it exists
    if (window.ReshamStore) {
      document.dispatchEvent(new CustomEvent("resham:cart"));
      document.dispatchEvent(new CustomEvent("resham:wish"));
    }
  }

  /* ---------- toast ---------- */
  let toastT;
  function toast(html) {
    const el = document.getElementById("subtoast");
    if (!el) return;
    el.innerHTML = html;
    el.classList.add("is-on");
    clearTimeout(toastT);
    toastT = setTimeout(() => el.classList.remove("is-on"), 3200);
  }

  /* ---------- product cards ---------- */
  const HEART_SVG = '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M12 20.5C7 16.5 3 13.3 3 9.3 3 6.4 5.2 4.5 7.6 4.5c1.7 0 3.3.9 4.4 2.4 1.1-1.5 2.7-2.4 4.4-2.4 2.4 0 4.6 1.9 4.6 4.8 0 4-4 7.2-9 11.2Z"/></svg>';

  function stars(p) {
    const full = Math.round(p.rating);
    return "★".repeat(full) + "☆".repeat(5 - full);
  }

  function cardHTML(p) {
    const off = Math.round((1 - p.price / p.mrp) * 100);
    return `
    <article class="prod-card" data-sku="${p.sku}">
      <a class="cardlink" href="${p.href}" aria-label="${p.name}">
        ${p.badge ? `<span class="pc-badge">${p.badge}</span>` : ""}
        <span class="pc-img"><img loading="lazy" src="${p.img}" alt="${p.name}"></span>
      </a>
      <button class="pc-heart${ReshamStore.wishHas(p.sku) ? " is-on" : ""}" aria-label="Wishlist ${p.name}">${HEART_SVG}</button>
      <div class="pc-body">
        <p class="pc-cat">${p.cat[0]}</p>
        <p class="pc-name"><a href="${p.href}">${p.name}</a></p>
        <p class="pc-rate">${stars(p)} <small>${p.rating} (${p.reviews})</small></p>
        <p class="pc-price">${inr(p.price)}<s>${inr(p.mrp)}</s><small style="color:#1e6e3a;font-weight:700;font-size:11.5px;margin-left:7px">${off}% off</small></p>
      </div>
      <button class="pc-add">Add to bag</button>
    </article>`;
  }

  function bindCards(root) {
    if (!root) return;
    $$(".prod-card", root).forEach((card) => {
      const p = window.reshamBySku(card.dataset.sku);
      if (!p) return;
      const heart = card.querySelector(".pc-heart");
      heart.addEventListener("click", () => {
        const on = ReshamStore.wishToggle({ sku: p.sku, name: p.name, price: p.price, img: p.img, cat: p.cat[0] });
        heart.classList.toggle("is-on", on);
        toast(on ? `<b>${p.name}</b> saved to your wishlist.` : `<b>${p.name}</b> removed from your wishlist.`);
      });
      const add = card.querySelector(".pc-add");
      add.addEventListener("click", () => {
        ReshamStore.add({ sku: p.sku, name: p.name, price: p.price, mrp: p.mrp, img: p.img, fabric: p.fabric, color: p.colors[0].name, size: p.sizes[0] });
        add.textContent = "Added ✓";
        setTimeout(() => (add.textContent = "Add to bag"), 1500);
        toast(`<b>${p.name}</b> folded into your bag.`);
      });
    });
  }

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.from((c || document).querySelectorAll(s)); }

  document.addEventListener("DOMContentLoaded", initChrome);

  window.ReshamChrome = { toast, cardHTML, bindCards, FOOTER_HTML, NAV_HTML };
})();
