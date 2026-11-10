/* RESHAM — cart & wishlist store (localStorage, shared across all pages) */
(function () {
  "use strict";

  const CART_KEY = "resham.cart.v1";
  const WISH_KEY = "resham.wish.v1";
  const ORDER_KEY = "resham.lastOrder.v1";

  const read = (k, fb) => { try { return JSON.parse(localStorage.getItem(k)) || fb; } catch { return fb; } };
  const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } };
  const emit = (type, detail) => document.dispatchEvent(new CustomEvent(type, { detail }));
  const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

  /* ---------- cart ---------- */
  let cart = read(CART_KEY, []);

  const saveCart = () => { write(CART_KEY, cart); emit("resham:cart", { count: count(), cart }); };
  const keyOf = (it) => [it.sku || it.name, it.size || "", it.color || ""].join("|");

  function add(item, qty) {
    qty = qty || 1;
    const key = keyOf(item);
    const found = cart.find((c) => c.key === key);
    if (found) found.qty = Math.min(found.qty + qty, 9);
    else cart.push({ ...item, key, qty: Math.min(qty, 9) });
    saveCart();
    return cart.find((c) => c.key === key);
  }
  function setQty(key, qty) {
    const it = cart.find((c) => c.key === key);
    if (!it) return;
    it.qty = Math.max(1, Math.min(9, qty));
    saveCart();
  }
  function remove(key) { cart = cart.filter((c) => c.key !== key); saveCart(); }
  function clear() { cart = []; saveCart(); }
  function count() { return cart.reduce((a, c) => a + c.qty, 0); }
  function subtotal() { return cart.reduce((a, c) => a + c.price * c.qty, 0); }
  function items() { return cart.slice(); }

  /* ---------- wishlist ---------- */
  let wish = read(WISH_KEY, []); // [{sku?, name, price, img, cat?}]

  function wishHas(sku) { return wish.some((w) => (w.sku || w.name) === sku); }
  function wishToggle(entry) {
    const id = entry.sku || entry.name;
    const at = wish.findIndex((w) => (w.sku || w.name) === id);
    if (at >= 0) wish.splice(at, 1);
    else wish.push(entry);
    write(WISH_KEY, wish);
    emit("resham:wish", { count: wish.length });
    return at < 0; // true = now wishlisted
  }
  function wishRemove(id) {
    wish = wish.filter((w) => (w.sku || w.name) !== id);
    write(WISH_KEY, wish);
    emit("resham:wish", { count: wish.length });
  }
  function wishAll() { return wish.slice(); }
  function wishCount() { return wish.length; }

  /* ---------- orders (demo) ---------- */
  const saveOrder = (o) => write(ORDER_KEY, o);
  const lastOrder = () => read(ORDER_KEY, null);

  /* ---------- pricing ---------- */
  function totals(coupon) {
    const sub = subtotal();
    let discount = 0, couponNote = "";
    if (coupon) {
      const c = (window.RESHAM_CONFIG || {}).demoCoupons || {};
      const rule = c[coupon];
      if (rule && sub >= rule.min) {
        discount = rule.type === "pct" ? Math.round(sub * rule.value / 100) : rule.value;
        couponNote = coupon + " applied";
      } else if (rule) couponNote = coupon + " needs a subtotal above " + inr(rule.min);
      else couponNote = "That code is not one of ours";
    }
    const cfg = (window.RESHAM_CONFIG || {}).shipping || { freeAbove: 9999, fee: 199 };
    const shipping = sub === 0 ? 0 : sub - discount >= cfg.freeAbove ? 0 : cfg.fee;
    return { sub, discount, shipping, total: Math.max(0, sub - discount + shipping), couponNote };
  }

  /* ---------- badge sync on any page ---------- */
  function syncBadges() {
    const c = count(), w = wishCount();
    const map = [["#bagCount", c], ["#wishCount", w], ["#bagPillCount", c], ["#cartCount", c], ["#wishPageCount", w]];
    map.forEach(([sel, n]) => {
      const el = document.querySelector(sel);
      if (!el) return;
      el.hidden = n === 0;
      el.textContent = n;
    });
  }
  document.addEventListener("DOMContentLoaded", syncBadges);
  document.addEventListener("resham:cart", syncBadges);
  document.addEventListener("resham:wish", syncBadges);

  window.ReshamStore = {
    inr, add, setQty, remove, clear, count, subtotal, items,
    wishToggle, wishHas, wishRemove, wishAll, wishCount,
    totals, saveOrder, lastOrder,
  };
})();
