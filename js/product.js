/* RESHAM — product detail page */
(function () {
  "use strict";
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const S = window.ReshamStore, C = window.ReshamChrome, inr = S.inr;
  const toast = (h) => C.toast(h);

  const sku = new URLSearchParams(location.search).get("sku");
  const p = window.reshamBySku(sku);
  if (!p) { location.replace("index.html"); return; }

  document.title = p.name + " · RESHAM - Lucknow Silk";

  /* ---------- state ---------- */
  let color = p.colors[0].name;
  let size = p.sizes[0];
  let qty = 1;
  let gallery = p.gallery, gIdx = 0;

  /* ---------- crumbs ---------- */
  $("#crumbs").innerHTML =
    `<a href="index.html">Home</a><i>/</i><a href="index.html#the-rack">Shop</a><i>/</i>` +
    p.cat.map((c) => `<span>${c}</span>`).join("<i>/</i>") + `<i>/</i><b>${p.name}</b>`;

  /* ---------- basics ---------- */
  $("#pdpCat").textContent = p.cat.join(" · ");
  $("#pdpName").textContent = p.name;
  $("#pdpStars").textContent = "★★★★★".slice(0, Math.round(p.rating)) + "☆☆☆☆☆".slice(0, 5 - Math.round(p.rating));
  $("#pdpRate").textContent = p.rating.toFixed(1);
  $("#pdpReviews").textContent = p.reviews;
  $("#pdpPrice").textContent = inr(p.price);
  $("#pdpMrp").textContent = inr(p.mrp);
  $("#pdpOff").textContent = Math.round((1 - p.price / p.mrp) * 100) + "% off";
  $("#pdpDesc").textContent = p.desc;
  if (p.badge) { const b = $("#pdpBadge"); b.hidden = false; b.textContent = p.badge; }

  const detailList = [
    "Fabric — " + p.fabric,
  ];
  if (p.type === "saree") detailList.push("Saree length 6.3 m with 0.8 m running blouse piece", "Width 47 in (118 cm)", "Weave — handloom, minor irregularities are the signature of the hand", "Care — dry-clean only; store folded in muslin, refold along a new line every few months");
  if (p.type === "blouse") detailList.push("Lined bodice with concealed side hooks", "Margin for one size alteration (±1 in)", "Care — dry-clean only");
  if (p.type !== "saree" && p.type !== "blouse") detailList.push("Nickel-free, gold-plated finish", "Comes in a velvet keepsake pouch with polishing cloth", "Care — keep away from perfume and water; wipe after wear");
  $("#pdpDetails").innerHTML = detailList.map((d) => `<li>${d}</li>`).join("");

  $("#pdpSizeGuide").innerHTML = p.type === "blouse"
    ? `<ul><li>34 — bust 34 in, blouse length 14.5 in</li><li>36 — bust 36 in, blouse length 15 in</li><li>38 — bust 38 in, blouse length 15.5 in</li><li>40 — bust 40 in, blouse length 15.5 in</li><li>42 — bust 42 in, blouse length 16 in</li><li>Between sizes? Take the larger — we keep alteration margin.</li></ul>`
    : p.type === "saree"
      ? `<p>Sarees are free-size drape. Choose how you want the blouse: <b>Unstitched blouse piece</b> (0.8 m, stitch anywhere) or a ready-stitched blouse in sizes 34–42 attached to the drape.</p>`
      : `<p>One considerate size — adjustable dori or clasp. Bangles come in Indian sizes 2.4 / 2.6 / 2.8 (circumference in inches).</p>`;

  /* ---------- gallery + zoom ---------- */
  const frame = $("#pdpFrame"), main = $("#pdpMain"), lens = $("#pdpLens");
  function setMain(src, i) {
    gIdx = i;
    main.src = src;
    main.alt = p.name + " — view " + (i + 1);
    $$(".pdp-thumb").forEach((t, k) => t.classList.toggle("is-on", k === i));
  }
  $("#pdpThumbs").innerHTML = gallery.map((src, i) =>
    `<button class="pdp-thumb${i === 0 ? " is-on" : ""}" data-i="${i}" aria-label="View ${i + 1}"><img loading="lazy" src="${src}" alt=""></button>`
  ).join("");
  $$(".pdp-thumb").forEach((t) => t.addEventListener("click", () => setMain(gallery[+t.dataset.i], +t.dataset.i)));
  setMain(gallery[0], 0);

  const ZOOM = 2.4;
  frame.addEventListener("mousemove", (e) => {
    const r = frame.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    frame.classList.add("zooming");
    lens.style.left = x - 110 + "px";
    lens.style.top = y - 110 + "px";
    lens.style.backgroundImage = `url("${main.src}")`;
    lens.style.backgroundSize = r.width * ZOOM + "px " + r.height * ZOOM + "px";
    lens.style.backgroundPosition = `-${x * ZOOM - 110}px -${y * ZOOM - 110}px`;
  });
  frame.addEventListener("mouseleave", () => frame.classList.remove("zooming"));

  /* fullscreen lightbox */
  const box = $("#zoombox"), zimg = $("#zoomImg");
  let z = 2.2;
  function openZoom() { z = 2.2; zimg.src = main.src; zimg.style.transform = "scale(1)"; box.classList.add("is-on"); document.body.style.overflow = "hidden"; }
  function closeZoom() { box.classList.remove("is-on"); document.body.style.overflow = ""; }
  function applyZ() { zimg.style.transform = "scale(" + z + ")"; }
  frame.addEventListener("click", openZoom);
  zimg.addEventListener("click", closeZoom);
  $("#zoomClose").addEventListener("click", closeZoom);
  $("#zoomIn").addEventListener("click", (e) => { e.stopPropagation(); z = Math.min(5, z + 0.5); applyZ(); });
  $("#zoomOut").addEventListener("click", (e) => { e.stopPropagation(); z = Math.max(1, z - 0.5); applyZ(); });
  box.addEventListener("wheel", (e) => { e.preventDefault(); z = Math.max(1, Math.min(5, z + (e.deltaY < 0 ? 0.3 : -0.3))); applyZ(); }, { passive: false });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && box.classList.contains("is-on")) closeZoom(); });

  /* ---------- colour + size ---------- */
  const colorRow = $("#colorRow");
  colorRow.innerHTML = p.colors.map((c, i) =>
    `<button class="swatch${i === 0 ? " is-on" : ""}" data-i="${i}"><i style="background:${c.hex}"></i>${c.name}</button>`
  ).join("");
  function pickColor(btn) {
    color = p.colors[+btn.dataset.i].name;
    $("#colorName").textContent = color;
    $$(".swatch", colorRow).forEach((b) => b.classList.toggle("is-on", b === btn));
  }
  $("#colorName").textContent = color;
  $$(".swatch", colorRow).forEach((b) => b.addEventListener("click", () => pickColor(b)));

  const sizeRow = $("#sizeRow");
  const soldOut = size === "One Size" ? [] : p.type === "saree" && p.sizes.length > 4 ? ["40"] : p.type === "blouse" ? [] : [];
  sizeRow.innerHTML = p.sizes.map((s, i) =>
    `<button class="chip${i === 0 ? " is-on" : ""}${soldOut.includes(s) ? " size-soldout" : ""}" data-i="${i}" ${soldOut.includes(s) ? 'data-soldout="1"' : ""}>${s}</button>`
  ).join("");
  $("#sizeLabel").firstChild.textContent = (p.type === "saree" ? "Blouse — " : p.type === "blouse" ? "Size — " : "Size — ");
  $("#sizeName").textContent = size;
  $$(".chip", sizeRow).forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.soldout) { toast("That size just went — try the neighbouring one."); return; }
    size = p.sizes[+b.dataset.i];
    $("#sizeName").textContent = size;
    $$(".chip", sizeRow).forEach((x) => x.classList.toggle("is-on", x === b));
  }));

  /* ---------- qty ---------- */
  $("#qtyMinus").addEventListener("click", () => { qty = Math.max(1, qty - 1); $("#qtyVal").textContent = qty; });
  $("#qtyPlus").addEventListener("click", () => { qty = Math.min(9, qty + 1); $("#qtyVal").textContent = qty; });

  /* ---------- add / wishlist / buy ---------- */
  function lineItem() {
    return { sku: p.sku, name: p.name, price: p.price, mrp: p.mrp, img: p.img, fabric: p.fabric, color, size, cat: p.cat[0], qty };
  }
  $("#addToBag").addEventListener("click", function () {
    S.add(lineItem(), qty);
    this.textContent = "Added to bag ✓";
    setTimeout(() => (this.textContent = "Add to bag"), 1600);
    toast(`<b>${p.name}</b> — ${size}, folded into your bag.`);
  });
  $("#goCheckout").addEventListener("click", () => S.add(lineItem(), qty));

  const wishBtn = $("#pdWish"), wishText = $("#pdWishText");
  function paintWish() {
    const on = S.wishHas(p.sku);
    wishBtn.classList.toggle("is-on", on);
    wishText.textContent = on ? "Saved to wishlist" : "Add to wishlist";
  }
  wishBtn.addEventListener("click", () => {
    const on = S.wishToggle({ sku: p.sku, name: p.name, price: p.price, img: p.img, cat: p.cat[0] });
    toast(on ? `<b>${p.name}</b> saved to your wishlist.` : `<b>${p.name}</b> removed from your wishlist.`);
    paintWish();
  });
  paintWish();

  /* ---------- pincode ---------- */
  $("#pinCheck").addEventListener("click", () => {
    const v = $("#pinInput").value.trim();
    const note = $("#pinNote");
    if (!/^\d{6}$/.test(v)) { note.className = "pin-note"; note.textContent = "A 6-digit pincode, please."; return; }
    const d = new Date(); d.setDate(d.getDate() + 3 + (parseInt(v[5], 10) % 3));
    const day = d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
    note.className = "pin-note ok";
    note.textContent = `Delivery by ${day} · COD available · Free reverse pickup`;
  });
  $("#pinInput").addEventListener("keydown", (e) => { if (e.key === "Enter") $("#pinCheck").click(); });

  /* ---------- related ---------- */
  const grid = $("#relatedGrid");
  grid.innerHTML = window.reshamRelated(p, 8).map(C.cardHTML).join("");
  C.bindCards(grid);
})();
