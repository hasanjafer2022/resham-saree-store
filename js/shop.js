/* RESHAM — cart / wishlist / checkout / success / contact pages */
(function () {
  "use strict";
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const S = window.ReshamStore, C = window.ReshamChrome;
  const inr = S.inr;
  const toast = (h) => C.toast(h);
  const CFG = window.RESHAM_CONFIG || {};
  const page = document.body.dataset.page;

  const COUPON_KEY = "resham.coupon.v1";
  const readCoupon = () => localStorage.getItem(COUPON_KEY) || "";
  const saveCoupon = (v) => { if (v) localStorage.setItem(COUPON_KEY, v); else localStorage.removeItem(COUPON_KEY); };

  /* ============================== CART ============================== */
  function initCart() {
    const list = $("#cartList"), layout = $("#cartLayout"), empty = $("#cartEmpty");
    let coupon = readCoupon();

    function render() {
      const items = S.items();
      if (!items.length) { layout.hidden = true; empty.hidden = false; return; }
      empty.hidden = true; layout.hidden = false;
      $("#cartCountLine").innerHTML = `<b>${items.length}</b> ${items.length === 1 ? "piece" : "pieces"} in the bag · every one folded and shipped from Lucknow.`;
      list.innerHTML = items.map((it) => {
        const cp = it.sku && window.reshamBySku ? window.reshamBySku(it.sku) : null;
        const href = cp ? cp.href : "product.html?sku=" + (it.sku || "");
        return `
        <article class="cart-row" data-key="${it.key}">
          <img src="${it.img}" alt="${it.name}">
          <div>
            <p class="ci-name"><a href="${href}">${it.name}</a></p>
            <p class="ci-meta">${it.fabric ? it.fabric + " · " : ""}${it.color ? it.color + " · " : ""}${it.size ? "Size " + it.size : ""}</p>
            <div class="qty" style="margin-top:10px;width:max-content">
              <button data-a="minus" aria-label="Decrease">−</button>
              <span>${it.qty}</span>
              <button data-a="plus" aria-label="Increase">+</button>
            </div>
          </div>
          <div class="ci-side">
            <span class="ci-price">${inr(it.price * it.qty)}</span>
            <span class="ci-mrp">${inr(it.mrp * it.qty)}</span>
            <button class="ci-x" data-a="remove">Remove</button>
          </div>
        </article>`;
      }).join("");

      $$("article", list).forEach((row) => {
        const key = row.dataset.key;
        const it = S.items().find((x) => x.key === key);
        row.querySelector('[data-a="minus"]').addEventListener("click", () => S.setQty(key, it.qty - 1));
        row.querySelector('[data-a="plus"]').addEventListener("click", () => S.setQty(key, it.qty + 1));
        row.querySelector('[data-a="remove"]').addEventListener("click", () => { S.remove(key); toast(`<b>${it.name}</b> left the bag.`); });
      });
      totals();
    }

    function totals() {
      const t = S.totals(coupon);
      $("#sumSub").textContent = inr(t.sub);
      $("#sumDiscountRow").hidden = !t.discount;
      $("#sumDiscount").textContent = "−" + inr(t.discount);
      $("#sumShip").textContent = t.shipping === 0 ? "Free" : inr(t.shipping);
      $("#sumTotal").textContent = inr(t.total);
      const cfg = CFG.shipping || {};
      $("#freeNote").textContent = t.shipping > 0 ? `Add ${inr((cfg.freeAbove || 9999) - (t.sub - t.discount))} more for free shipping.` : "Free shipping unlocked.";
      const mrpSum = S.items().reduce((a, it) => a + (it.mrp || it.price) * it.qty, 0);
      const saved = Math.max(0, mrpSum - t.sub) + t.discount;
      $("#sumSave").hidden = !saved;
      $("#sumSave").textContent = saved ? `You save ${inr(saved)} on this order` : "";
      const note = $("#couponNote");
      note.className = "coupon-note" + (t.discount ? " ok" : coupon && !t.discount ? " err" : "");
      note.textContent = t.couponNote || (t.discount ? "" : "Try RESHAM10 for 10% off.");
    }

    $("#couponApply").addEventListener("click", () => {
      coupon = $("#couponInput").value.trim().toUpperCase();
      coupon ? saveCoupon(coupon) : saveCoupon("");
      totals();
    });
    $("#couponInput").addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); $("#couponApply").click(); } });
    if (coupon) $("#couponInput").value = coupon;
    document.addEventListener("resham:cart", render);
    render();
  }

  /* ============================== WISHLIST ============================== */
  function initWishlist() {
    const grid = $("#wishGrid"), empty = $("#wishEmpty");
    function render() {
      const all = S.wishAll();
      if (!all.length) { grid.innerHTML = ""; empty.hidden = false; return; }
      empty.hidden = true;
      $("#wishCountLine").innerHTML = `<b>${all.length}</b> ${all.length === 1 ? "piece" : "pieces"} saved — hearts full, bag optional.`;
      grid.innerHTML = all.map((w) => {
        const p = w.sku && window.reshamBySku(w.sku);
        if (p) return C.cardHTML(p);
        // legacy/home-silk item without a catalog page
        return `
        <article class="prod-card" data-name="${w.name}">
          <a class="cardlink" href="index.html#pick-a-silk"><span class="pc-img"><img loading="lazy" src="${w.img}" alt="${w.name}"></span></a>
          <button class="pc-heart is-on" aria-label="Remove ${w.name} from wishlist">♥</button>
          <div class="pc-body"><p class="pc-name">${w.name}</p><p class="pc-price">${inr(w.price)}</p></div>
          <button class="pc-add">Add to bag</button>
        </article>`;
      }).join("");

      $$("article", grid).forEach((card) => {
        const sku = card.dataset.sku, name = card.dataset.name;
        card.querySelector(".pc-heart").addEventListener("click", () => {
          if (sku) S.wishRemove(sku); else S.wishRemove(name);
          toast("Removed from your wishlist.");
          render();
        });
        card.querySelector(".pc-add").addEventListener("click", (e) => {
          const btn = e.currentTarget;
          if (sku) {
            const p = window.reshamBySku(sku);
            S.add({ sku, name: p.name, price: p.price, mrp: p.mrp, img: p.img, fabric: p.fabric, color: p.colors[0].name, size: p.sizes[0] });
          } else {
            const w = S.wishAll().find((x) => x.name === name);
            S.add({ name: w.name, price: w.price, mrp: w.price, img: w.img });
          }
          btn.textContent = "Added ✓";
          setTimeout(() => (btn.textContent = "Add to bag"), 1500);
          toast("Folded into your bag.");
        });
      });
    }
    document.addEventListener("resham:wish", render);
    render();
  }

  /* ============================== CHECKOUT ============================== */
  function initCheckout() {
    const layout = $("#checkoutLayout"), empty = $("#checkoutEmpty");
    if (!S.count()) { layout.hidden = true; empty.hidden = false; return; }
    empty.hidden = true; layout.hidden = false;

    const coupon = readCoupon();
    const t = S.totals(coupon);
    $("#checkoutItems").innerHTML = S.items().map((it) => `
      <div class="order-line">
        <img src="${it.img}" alt="">
        <span><b>${it.name}</b><small>${it.color ? it.color + " · " : ""}${it.size ? it.size + " · " : ""}Qty ${it.qty}</small></span>
        <span style="font-weight:700">${inr(it.price * it.qty)}</span>
      </div>`).join("");
    $("#cSub").textContent = inr(t.sub);
    $("#cDiscountRow").hidden = !t.discount;
    $("#cDiscount").textContent = "−" + inr(t.discount);
    $("#cShip").textContent = t.shipping === 0 ? "Free" : inr(t.shipping);
    $("#cTotal").textContent = inr(t.total);

    const gatewayUrl = (CFG.paymentGatewayUrl || "").trim();
    const payNote = $("#payGatewayNote");
    if (gatewayUrl) payNote.textContent = "You will be redirected to our secure payment page.";
    else { payNote.textContent = "Redirects to our secure payment page once the gateway is connected."; $("#payGatewayRow").querySelector(".pay-tag").textContent = "Coming soon"; }

    const paySheet = $("#paySheet"), payVeil = $("#payVeil");
    $("#payVpa").textContent = CFG.upiVpa || "resham.lucknow@upi";

    function address() {
      const get = (id) => $(id).value.trim();
      const a = { name: get("#fName"), email: get("#fEmail"), phone: get("#fPhone"), addr: get("#fAddr"), city: get("#fCity"), state: $("#fState").value, pin: get("#fPin") };
      let ok = true;
      const mark = (id, good) => { $(id).closest(".field").classList.toggle("is-err", !good); if (!good) ok = false; };
      mark("#fName", a.name.length >= 2);
      mark("#fEmail", /^\S+@\S+\.\S+$/.test(a.email));
      mark("#fPhone", /^\d{10}$/.test(a.phone));
      mark("#fAddr", a.addr.length >= 6);
      mark("#fCity", a.city.length >= 2);
      mark("#fState", !!a.state);
      mark("#fPin", /^\d{6}$/.test(a.pin));
      return ok ? a : null;
    }

    function payMethod() {
      const r = $('input[name="pay"]:checked');
      return r ? r.value : "demo";
    }
    $$(".pay-option input").forEach((r) => r.addEventListener("change", () => {
      $$(".pay-option").forEach((o) => o.classList.toggle("is-on", o.contains(r)));
    }));

    function finishOrder(a, method) {
      const d = new Date();
      const id = "RS" + String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0") + "-" + String(1000 + Math.floor(Math.random() * 9000));
      S.saveOrder({
        id, date: d.toISOString(), pay: method,
        items: S.items(), totals: S.totals(readCoupon()),
        address: a,
        eta: new Date(d.getTime() + 4 * 86400000).toDateString(),
      });
      S.clear();
      location.href = "order-success.html";
    }

    $("#placeOrder").addEventListener("click", () => {
      const a = address();
      if (!a) { toast("A couple of fields need attention above."); return; }
      const m = payMethod();
      if (m === "cod") { finishOrder(a, "Cash on delivery"); return; }
      if (m === "gateway" && gatewayUrl) {
        const url = gatewayUrl + (gatewayUrl.includes("?") ? "&" : "?") + "amount=" + S.totals(readCoupon()).total + "&order=RESHAM";
        window.open(url, "_blank");
        finishOrder(a, "Online payment (gateway)");
        return;
      }
      $("#payAmt").textContent = inr(S.totals(readCoupon()).total);
      paySheet.classList.add("is-on"); payVeil.classList.add("is-on");
    });

    function closeSheet() { paySheet.classList.remove("is-on"); payVeil.classList.remove("is-on"); resetPayBtn(); }
    payVeil.addEventListener("click", closeSheet);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeSheet(); });

    const tabUpi = $("#tabUpi"), tabCard = $("#tabCard");
    tabUpi.addEventListener("click", () => { tabUpi.classList.add("is-on"); tabCard.classList.remove("is-on"); $("#paneUpi").hidden = false; $("#paneCard").hidden = true; });
    tabCard.addEventListener("click", () => { tabCard.classList.add("is-on"); tabUpi.classList.remove("is-on"); $("#paneCard").hidden = false; $("#paneUpi").hidden = true; });

    $("#cardNum").addEventListener("input", (e) => {
      const v = e.target.value.replace(/\D/g, "").slice(0, 16);
      e.target.value = v.replace(/(\d{4})(?=\d)/g, "$1 ");
    });
    $("#cardExp").addEventListener("input", (e) => {
      let v = e.target.value.replace(/\D/g, "").slice(0, 4);
      if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
      e.target.value = v;
    });
    $("#cardCvv").addEventListener("input", (e) => { e.target.value = e.target.value.replace(/\D/g, ""); });

    const payBtn = $("#payBtn");
    function resetPayBtn() { payBtn.disabled = false; payBtn.innerHTML = "Pay securely"; }
    payBtn.addEventListener("click", () => {
      const upi = !$("#paneUpi").hidden;
      if (upi && !/^\S+@(upi|ybl|okaxis|okhdfcbank|okicici|paytm|apl)$/.test($("#upiId").value.trim())) { toast("That UPI ID does not look right."); return; }
      if (!upi && $("#cardNum").value.replace(/\s/g, "").length < 16) { toast("A 16-digit test card number, please."); return; }
      payBtn.disabled = true;
      payBtn.innerHTML = '<span class="spin"></span>Processing…';
      setTimeout(() => {
        closeSheet();
        finishOrder({ name: $("#fName").value.trim(), email: $("#fEmail").value.trim(), phone: $("#fPhone").value.trim(), addr: $("#fAddr").value.trim(), city: $("#fCity").value.trim(), state: $("#fState").value, pin: $("#fPin").value.trim() }, "Demo gateway (test)");
      }, 1700);
    });
  }

  /* ============================== SUCCESS ============================== */
  function initSuccess() {
    const o = S.lastOrder();
    if (!o) { location.replace("index.html"); return; }
    $("#successWrap").hidden = false;
    const a = o.address || {};
    $("#orderBox").innerHTML = `
      <div class="oid"><span>Order <b>${o.id}</b></span><span>${new Date(o.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span><span>${o.pay}</span></div>
      ${o.items.map((it) => `
        <div class="order-line">
          <img src="${it.img}" alt="">
          <span><b>${it.name}</b><small>${it.color ? it.color + " · " : ""}${it.size ? it.size + " · " : ""}Qty ${it.qty}</small></span>
          <span style="font-weight:700">${inr(it.price * it.qty)}</span>
        </div>`).join("")}
      <div class="order-addr">
        Deliver to <b>${a.name}</b> · ${a.phone}<br>
        ${a.addr}, ${a.city}, ${a.state} — ${a.pin}<br>
        Expected by <b>${o.eta}</b> · Total paid <b>${inr(o.totals.total)}</b>
      </div>`;
  }

  /* ============================== CONTACT ============================== */
  function initContact() {
    const sup = CFG.support || {};
    const set = (id, txt) => { const el = $(id); if (el) el.textContent = txt; };
    set("#ctEmail", sup.email); set("#ctPhone", sup.phone); set("#ctWhats", sup.whatsapp); set("#ctAddr", sup.address);
    const form = $("#contactForm");
    if (form) form.addEventListener("submit", (e) => {
      e.preventDefault();
      toast("Received. Our studio replies within one working day.");
      form.reset();
    });
  }

  /* ============================== boot ============================== */
  document.addEventListener("DOMContentLoaded", () => {
    if (page === "cart") initCart();
    else if (page === "wishlist") initWishlist();
    else if (page === "checkout") initCheckout();
    else if (page === "success") initSuccess();
    else if (page === "contact") initContact();
  });
})();
