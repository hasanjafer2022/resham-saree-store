/* RESHAM · Lucknow silk — interaction layer */
(function () {
  "use strict";
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const inr = (n) => "₹" + n.toLocaleString("en-IN");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============================ DATA ============================ */
  const LOOKS = [
    {
      id: "ivory", name: "Ivory Elephant", img: "assets/look-ivory.jpg",
      pieces: [
        { n: "Ivory Lucknawi Silk, Elephant Border", c: "Silk saree", p: 13500, img: "assets/look-ivory.jpg", x: 50, y: 62 },
        { n: "Dusty Rose Silk Blouse", c: "Blouse", p: 4850, img: "assets/look-coral.jpg", x: 47, y: 32 },
        { n: "Pink Stone Temple Choker", c: "Necklace", p: 9450, img: "assets/look-red.jpg", x: 50, y: 18 },
        { n: "Jhumkas with Pearl Drops", c: "Earrings", p: 3800, img: "assets/look-purple.jpg", x: 62, y: 14 },
        { n: "Elephant Motif Ottiyanam", c: "Waist belt", p: 10650, img: "assets/look-teal.jpg", x: 50, y: 47 },
        { n: "Gold & Dusty Rose Bangles", c: "Stack", p: 10300, img: "assets/look-red.jpg", x: 66, y: 40 },
      ],
    },
    {
      id: "coral", name: "Rani Rose Court", img: "assets/look-coral.jpg",
      pieces: [
        { n: "Rani Pink Lucknow Silk", c: "Silk saree", p: 24900, img: "assets/look-coral.jpg", x: 50, y: 60 },
        { n: "Midnight Navy Blouse", c: "Blouse", p: 5200, img: "assets/look-purple.jpg", x: 48, y: 32 },
        { n: "Temple Lakshmi Haram", c: "Necklace", p: 12800, img: "assets/look-red.jpg", x: 50, y: 18 },
        { n: "Ruby Jhumkas", c: "Earrings", p: 4600, img: "assets/look-red.jpg", x: 60, y: 14 },
      ],
    },
    {
      id: "teal", name: "Peacock Garden", img: "assets/look-teal.jpg",
      pieces: [
        { n: "Teal Checked Lucknawi Silk", c: "Silk saree", p: 22900, img: "assets/look-teal.jpg", x: 50, y: 60 },
        { n: "Coral Raw Silk Blouse", c: "Blouse", p: 4400, img: "assets/look-coral.jpg", x: 48, y: 32 },
        { n: "Coral and Pearl Choker", c: "Necklace", p: 8900, img: "assets/look-red.jpg", x: 50, y: 18 },
        { n: "Gold Waist Cord", c: "Oddiyanam", p: 7400, img: "assets/look-ivory.jpg", x: 50, y: 47 },
      ],
    },
    {
      id: "purple", name: "Dusk Banarasi", img: "assets/look-purple.jpg",
      pieces: [
        { n: "Aubergine Silk, Zari Border", c: "Silk saree", p: 29700, img: "assets/look-purple.jpg", x: 50, y: 60 },
        { n: "Ivory Silk Blouse", c: "Blouse", p: 4100, img: "assets/look-ivory.jpg", x: 48, y: 32 },
        { n: "Kundan Pendant Set", c: "Necklace", p: 11500, img: "assets/look-red.jpg", x: 50, y: 18 },
      ],
    },
    {
      id: "red", name: "Sindoor Bride", img: "assets/look-red.jpg",
      pieces: [
        { n: "Bridal Red Lucknawi Silk", c: "Silk saree", p: 48900, img: "assets/look-red.jpg", x: 50, y: 60 },
        { n: "Emerald Zari Blouse", c: "Blouse", p: 6800, img: "assets/look-teal.jpg", x: 48, y: 32 },
        { n: "Full Temple Bridal Set", c: "Jewellery", p: 21400, img: "assets/look-ivory.jpg", x: 50, y: 18 },
        { n: "Jasmine Veni", c: "Hair", p: 1200, img: "assets/look-ivory.jpg", x: 58, y: 10 },
      ],
    },
    {
      id: "lanes", name: "Old-City Lanes", img: "assets/reel-lanes.jpg",
      pieces: [
        { n: "Manjal Kattam Cotton Silk", c: "Silk saree", p: 18900, img: "assets/reel-lanes.jpg", x: 50, y: 58 },
        { n: "Turmeric Cotton Blouse", c: "Blouse", p: 3900, img: "assets/look-coral.jpg", x: 46, y: 33 },
        { n: "Temple Jhumkas", c: "Earrings", p: 4200, img: "assets/look-red.jpg", x: 61, y: 15 },
      ],
    },
    {
      id: "marina", name: "Marina Morning", img: "assets/reel-marina.jpg",
      pieces: [
        { n: "Kadal Sunrise Kora Silk", c: "Silk saree", p: 21400, img: "assets/reel-marina.jpg", x: 50, y: 60 },
        { n: "Dawn-Gold Blouse", c: "Blouse", p: 4100, img: "assets/look-ivory.jpg", x: 47, y: 33 },
        { n: "Pearl Drops", c: "Earrings", p: 3600, img: "assets/look-purple.jpg", x: 62, y: 15 },
      ],
    },
    {
      id: "studio", name: "Varanasi Red", img: "assets/reel-studio.jpg",
      pieces: [
        { n: "Kaali Banarasi Katan", c: "Silk saree", p: 36400, img: "assets/reel-studio.jpg", x: 50, y: 60 },
        { n: "Kadhua Border Blouse", c: "Blouse", p: 5400, img: "assets/look-red.jpg", x: 47, y: 33 },
        { n: "Gold Temple Choker", c: "Necklace", p: 11200, img: "assets/look-coral.jpg", x: 50, y: 17 },
      ],
    },
];

  const SILKS = [
    { name: "Koorai Check", mood: "Madras morning", price: 18600, bg: "#2e9e4f", img: "assets/look-teal.jpg", tilt: -5 },
    { name: "Palace Check", mood: "Vermilion hour", price: 19900, bg: "#e01d1d", img: "assets/look-red.jpg", tilt: 3 },
    { name: "Murshidabad Maroon", mood: "River silk", price: 27200, bg: "#7a1424", img: "assets/look-purple.jpg", tilt: -3 },
    { name: "Monsoon", mood: "Rain-washed", price: 22900, bg: "#2e9bde", img: "assets/look-ivory.jpg", tilt: 4 },
    { name: "Sindoor", mood: "First light", price: 26500, bg: "#f08c1a", img: "assets/look-coral.jpg", tilt: -4 },
    { name: "Magenta Shot Silk", mood: "Dusk bloom", price: 29800, bg: "#7b3fd4", img: "assets/look-purple.jpg", tilt: 5 },
    { name: "Benares Gold", mood: "Lamp light", price: 41800, bg: "#e3ac00", img: "assets/look-red.jpg", tilt: -3 },
  ];

  const RACK = [
    { name: "Swarna Lucknawi Silk", price: 16800, img: "assets/rack-gold.webp", cat: ["Silk Sarees", "Zari & Brocade"], hue: 0 },
    { name: "Resham Rani Pink Temple Border", price: 28400, img: "assets/rack-pink.webp", cat: ["Silk Sarees", "Zari & Brocade"], hue: 0 },
    { name: "Koorai Madras Checks", price: 18600, img: "assets/rack-check.webp", cat: ["Checked Sarees"], hue: 0 },
    { name: "Peacock Pattu", price: 31200, img: "assets/rack-peacock.webp", cat: ["Silk Sarees"], hue: 0 },
    { name: "Vaira Oosi Purple", price: 26400, img: "assets/rack-purple.webp", cat: ["Silk Sarees", "Zari & Brocade"], hue: 0 },
    { name: "Manjal Half Saree", price: 14200, img: "assets/rack-mustard.webp", cat: ["Half Sarees"], hue: 0 },
    { name: "Emerald Zari Blouse", price: 5200, img: "assets/rack-blouse-green.webp", cat: ["Full-Sleeve Blouses"], hue: 0 },
    { name: "Sindoor Silk Blouse", price: 4800, img: "assets/rack-blouse-red.webp", cat: ["Half-Sleeve Blouses"], hue: 0 },
    { name: "Ponni Temple Border", price: 22300, img: "assets/rack-gold.webp", cat: ["Silk Sarees"], hue: 155 },
    { name: "Mayil Paithani", price: 24900, img: "assets/rack-peacock.webp", cat: ["Silk Sarees"], hue: 190 },
    { name: "Kumkum Bridal Brocade", price: 52000, img: "assets/rack-pink.webp", cat: ["Zari & Brocade"], hue: -35 },
    { name: "Cocoa Chiffon Drape", price: 18600, img: "assets/rack-mustard.webp", cat: ["Checked Sarees"], hue: 45 },
  ];

  const GRID = [
    { num: "05", name: "Mayil Paithani", price: 24900, img: "assets/rack-peacock.webp" },
    { num: "06", name: "Kumkum Bridal Brocade", price: 52000, img: "assets/rack-pink.webp" },
    { num: "07", name: "Cocoa Chiffon Drape", price: 18600, img: "assets/rack-mustard.webp" },
    { num: "08", name: "Sindoor Paithani", price: 38700, img: "assets/rack-purple.webp" },
    { num: "09", name: "Swarna Lucknawi Silk", price: 16800, img: "assets/rack-gold.webp" },
    { num: "10", name: "Ponni Temple Border", price: 22300, img: "assets/rack-check.webp" },
  ];

  const REELS = [
    { id: "lanes", name: "Old-City Lanes", badge: "REEL 01", dur: "0:38", secs: 6, place: "Old-city lanes", img: "assets/reel-lanes.jpg", kicker: "Lucknow Cotton Silk", prod: "Manjal Kattam", desc: "Turmeric-yellow checks that remember every street they have walked.", price: 18900 },
    { id: "marina", name: "Marina Morning", badge: "REEL 02", dur: "0:31", secs: 6, place: "Marina, first light", img: "assets/reel-marina.jpg", kicker: "Kora Silk", prod: "Kadal Sunrise", desc: "Sea-breeze yellow with a dawn-gold border, weightless as the hour.", price: 21400 },
    { id: "studio", name: "Varanasi Red", badge: "REEL 03", dur: "0:24", secs: 6, place: "Studio, Varanasi red", img: "assets/reel-studio.jpg", kicker: "Banarasi Katan", prod: "Kaali Banarasi", desc: "Night-black silk, a broad gold kadhua border, worn like armour.", price: 36400 },
    { id: "lamp", name: "Lamp Room", badge: "REEL 04", dur: "0:27", secs: 6, place: "Lamp room, Lucknow", img: "assets/reel-lamp.jpg", kicker: "Lucknawi Silk", prod: "Deepam Pachai", desc: "Lamp-green silk that holds a flame's warmth long after dusk.", price: 26800 },
    { id: "pachai", name: "Pachai Pattu", badge: "REEL 05", dur: "0:33", secs: 6, place: "Jasmine court", img: "assets/reel-pachai.jpg", kicker: "Soft Silk", prod: "Mullai Pachai", desc: "Jasmine green with a pearl-white edge, cool as a shaded court.", price: 19600 },
  ];

  const BRIDAL = [
    { name: "Sindoor Pattu Vow", price: 48900, img: "assets/bridal-1.jpg" },
    { name: "Bandhej Sangeet Silk", price: 42500, img: "assets/bridal-2.jpg" },
    { name: "Rose Muhurtham", price: 51200, img: "assets/bridal-3.jpg" },
    { name: "Temple Emerald Vow", price: 46800, img: "assets/bridal-4.jpg" },
    { name: "Kumkum Kalyanam", price: 55600, img: "assets/look-red.jpg" },
  ];

  const WEAVE_SILKS = [
    { id: "ivory", name: "Muga Ivory Buta", price: 24600, tex: "assets/tex-ivory.jpg" },
    { id: "checks", name: "Koorai Madras Checks", price: 22600, tex: "assets/tex-checks.jpg" },
    { id: "temple", name: "Rani Pink Temple Border", price: 23700, tex: "assets/tex-temple.jpg" },
    { id: "gold", name: "Swarna Tissue", price: 28900, tex: "assets/tex-gold.jpg" },
    { id: "peacock", name: "Mayil Shot Silk", price: 26400, tex: "assets/tex-peacock.jpg" },
    { id: "maroon", name: "Vellai Maroon Stripe", price: 21200, tex: "assets/tex-maroon.jpg" },
  ];

  const TICKER = [
    ["Handwoven in Lucknow, one saree at a time", null],
    ["TRY THE LOOK", "Eight Lucknawi Silk looks, styled head to toe"],
    ["PURE ZARI", "Silver-core zari woven into every temple border"],
    ["THE RACK", "Browse the full rail of silks"],
    ["BRIDAL", "Heirloom bridal silks for the day that matters"],
    ["THE LOOMS", "Every thread an offering"],
  ];

  /* ============================ STATE ============================ */
  const bag = []; // {name, price, img, qty}
  const wishlist = new Set();

  /* ============================ TOAST ============================ */
  const toastEl = $("#toast");
  let toastT;
  function toast(html) {
    toastEl.innerHTML = html;
    toastEl.classList.add("is-on");
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove("is-on"), 3200);
  }

  /* ============================ BAG ============================ */
  const bagCountEl = $("#bagCount"), bagPill = $("#bagPill"), bagPillCount = $("#bagPillCount");
  function addToBag(item) {
    const found = bag.find((b) => b.name === item.name);
    if (found) found.qty += 1; else bag.push({ ...item, qty: 1 });
    syncBag();
  }
  function syncBag() {
    const count = bag.reduce((a, b) => a + b.qty, 0);
    bagCountEl.hidden = count === 0;
    bagCountEl.textContent = count;
    bagPill.hidden = count === 0;
    bagPillCount.textContent = count;
    renderDrawer();
  }
  function syncWish() {
    const el = $("#wishCount");
    el.hidden = wishlist.size === 0;
    el.textContent = wishlist.size;
  }

  let wishPop = null;
  function closeWishPop() { if (wishPop) { wishPop.remove(); wishPop = null; } }
  function openWishPop() {
    closeWishPop();
    const items = SILKS.filter((s) => wishlist.has(s.name));
    const el = document.createElement("div");
    el.className = "wish-pop";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", "Wishlist");
    el.innerHTML = `<p class="wish-pop-h">Wishlist &middot; ${items.length}</p>` + (items.length ? items.map((s) => `
      <div class="wish-row">
        <img src="${s.img}" alt=""><span>${s.name}<small>${inr(s.price)}</small></span>
        <button class="btn btn-dark wish-add" data-n="${s.name}">Add to bag</button>
        <button class="dl-x wish-x" data-n="${s.name}" aria-label="Remove ${s.name}">&#10005;</button>
      </div>`).join("") : '<p class="wish-empty">Nothing saved yet. Tap the heart on any silk.</p>');
    document.body.appendChild(el);
    wishPop = el;
    $$(".wish-add", el).forEach((b) => b.addEventListener("click", () => {
      const s = SILKS.find((x) => x.name === b.dataset.n);
      addToBag({ name: s.name + " Silk", price: s.price, img: s.img });
      toast(`<b>${s.name}</b> dropped into your bag.`);
    }));
    $$(".wish-x", el).forEach((b) => b.addEventListener("click", () => {
      wishlist.delete(b.dataset.n);
      syncWish();
      const heart = $(`.silk-heart[aria-label="Wishlist ${b.dataset.n}"]`);
      if (heart) heart.classList.remove("is-on");
      openWishPop();
    }));
  }
  $("#wishBtn").addEventListener("click", (e) => { e.stopPropagation(); wishPop ? closeWishPop() : openWishPop(); });
  document.addEventListener("click", (e) => { if (wishPop && !wishPop.contains(e.target) && !e.target.closest("#wishBtn")) closeWishPop(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && wishPop) closeWishPop(); });

  const drawer = $("#bagDrawer"), veil = $("#drawerVeil");
  let drawerLastFocus = null;
  function drawerKeys(e) {
    if (drawer.hidden) return;
    if (e.key === "Escape") { e.stopPropagation(); closeDrawer(); return; }
    if (e.key === "Tab") {
      const f = $$("button, a[href]", drawer).filter((x) => !x.disabled && x.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
  function openDrawer() { drawerLastFocus = document.activeElement; drawer.hidden = false; veil.hidden = false; $("#drawerClose").focus(); document.addEventListener("keydown", drawerKeys, true); }
  function closeDrawer() { drawer.hidden = true; veil.hidden = true; document.removeEventListener("keydown", drawerKeys, true); if (drawerLastFocus) drawerLastFocus.focus(); }
  $("#bagBtn").addEventListener("click", openDrawer);
  bagPill.addEventListener("click", openDrawer);
  $("#drawerClose").addEventListener("click", closeDrawer);
  veil.addEventListener("click", closeDrawer);

  function renderDrawer() {
    const list = $("#drawerList");
    if (!bag.length) {
      list.innerHTML = '<li class="drawer-empty">Your bag is empty. The rail is full, though.</li>';
    } else {
      list.innerHTML = bag.map((b, i) => `
        <li>
          <img src="${b.img}" alt="">
          <div class="dl-info"><strong>${b.name}</strong><small>Qty ${b.qty}</small></div>
          <span class="dl-price">${inr(b.price * b.qty)}</span>
          <button class="dl-x" data-i="${i}" aria-label="Remove ${b.name}">✕</button>
        </li>`).join("");
      $$(".dl-x", list).forEach((b) => b.addEventListener("click", () => { bag.splice(+b.dataset.i, 1); syncBag(); }));
    }
    $("#drawerTotal").textContent = inr(bag.reduce((a, b) => a + b.price * b.qty, 0));
  }

  /* ============================ TICKER ============================ */
  (function buildTicker() {
    const t = $("#tickerTrack");
    const seq = TICKER.map(([b, rest]) => `<span>${rest ? rest + " " : ""}</span><i>◆</i><b>${b}</b><i>◆</i>`).join("");
    t.innerHTML = seq + seq;
  })();

  /* ============================ HERO ============================ */
  (function hero() {
    const frames = $$(".hero-frame");
    const line = $("#heroLine"), sub = $("#heroSub");
    const states = [
      { line: 'Woven for the <em>Divine.</em>', sub: 'Six Moods. Timeless Drapes. <span>Made to move with you.</span>' },
      { line: 'Six Moods. <em>Timeless Drapes.</em>', sub: 'Handwoven in Lucknow, <span>one saree at a time.</span>' },
    ];
    let i = 0;
    if (reduced) return;
    setInterval(() => {
      i = (i + 1) % 2;
      frames.forEach((f, k) => f.classList.toggle("is-on", k === i));
      if (window.gsap) {
        gsap.fromTo([line, sub], { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: "power3.out" });
      }
      line.innerHTML = states[i].line;
      sub.innerHTML = states[i].sub;
    }, 6000);
  })();

  /* ============================ NAV SPY ============================ */
  (function navSpy() {
    const map = {};
    $$("#navLinks a").forEach((a) => (map[a.dataset.nav] = a));
    const sections = ["home", "try-the-look", "pick-a-silk", "the-rack", "the-muse", "bridal", "the-weave"];
    const obs = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting && map[e.target.id]) {
          Object.values(map).forEach((a) => a.classList.remove("is-active"));
          map[e.target.id].classList.add("is-active");
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
  })();

  /* ============================ TRY THE LOOK ============================ */
  (function tryTheLook() {
    const rail = $("#lookRail"), panelName = $("#lookName"), kicker = $("#lookKicker"),
      piecesEl = $("#lookPieces"), totalEl = $("#lookTotal");
    let active = null, activeLook = null;

    LOOKS.forEach((look, li) => {
      const card = document.createElement("button");
      card.className = "look-card";
      card.setAttribute("role", "option");
      card.setAttribute("aria-label", `Look ${li + 1}, ${look.name}`);
      card.innerHTML = `<img src="${look.img}" alt="${look.name} look"><span class="look-tag">Look 0${li + 1} · ${look.name}</span>`;
      card.addEventListener("click", () => select(card, look, li));
      rail.appendChild(card);
    });

    function select(card, look, li) {
      if (active === card) { // tap again to release
        card.classList.remove("is-active");
        rail.classList.remove("has-active");
        $$(".hotspot,.hotspot-tip", card).forEach((h) => h.remove());
        active = null; activeLook = null;
        return;
      }
      if (active) { active.classList.remove("is-active"); $$(".hotspot,.hotspot-tip", active).forEach((h) => h.remove()); }
      active = card; activeLook = look;
      card.classList.add("is-active");
      rail.classList.add("has-active");
      card.scrollIntoView({ behavior: reduced ? "auto" : "smooth", inline: "center", block: "nearest" });

      // hotspots
      look.pieces.forEach((p, pi) => {
        const h = document.createElement("button");
        h.className = "hotspot";
        h.style.left = p.x + "%";
        h.style.top = p.y + "%";
        h.textContent = pi + 1;
        h.setAttribute("aria-label", `${p.n}, ${inr(p.p)}`);
        const tip = document.createElement("span");
        tip.className = "hotspot-tip";
        tip.style.left = p.x + "%";
        tip.style.top = `calc(${p.y}% - 14px)`;
        tip.style.transform = "translate(-50%,-100%)";
        tip.innerHTML = `<strong>${p.n}</strong>${p.c} · <span>${inr(p.p)}</span>`;
        tip.style.translate = "0 -100%";
        h.addEventListener("mouseenter", () => { tip.classList.add("is-on"); markPiece(pi, true); });
        h.addEventListener("mouseleave", () => { tip.classList.remove("is-on"); markPiece(pi, false); });
        h.addEventListener("click", (e) => { e.stopPropagation(); tip.classList.toggle("is-on"); });
        card.appendChild(h); card.appendChild(tip);
      });

      // panel
      kicker.textContent = `Look 0${li + 1}`;
      panelName.textContent = look.name;
      piecesEl.innerHTML = look.pieces.map((p, pi) => `
        <li data-pi="${pi}">
          <span class="piece-dot">${pi + 1}</span>
          <span class="piece-thumb"><img src="${p.img}" alt=""></span>
          <span class="piece-info"><strong>${p.n}</strong><small>${p.c}</small></span>
          <span class="piece-price">${inr(p.p)}</span>
        </li>`).join("");
      $$("li", piecesEl).forEach((row) => {
        row.addEventListener("mouseenter", () => markPiece(+row.dataset.pi, true));
        row.addEventListener("mouseleave", () => markPiece(+row.dataset.pi, false));
      });
      totalEl.textContent = inr(look.pieces.reduce((a, p) => a + p.p, 0));
    }

    function markPiece(pi, on) {
      $$("li", piecesEl).forEach((row) => row.classList.toggle("is-on", on && +row.dataset.pi === pi));
      if (active) $$(".hotspot", active).forEach((h, hi) => h.classList.toggle("is-on", on && hi === pi));
    }

    $("#addLookBtn").addEventListener("click", () => {
      if (!activeLook) { toast("Tap a look first - the pieces will pin themselves."); return; }
      activeLook.pieces.forEach((p) => addToBag({ name: p.n, price: p.p, img: p.img }));
      toast(`<b>${activeLook.name}</b> - whole look, woven into your bag.`);
    });

    // preselect first look so the panel is never empty
    select(rail.children[0], LOOKS[0], 0);
    rail.classList.remove("has-active"); // but keep the rail calm until user picks
    if (active) { $$(".hotspot,.hotspot-tip", active).forEach((h) => h.remove()); active.classList.remove("is-active"); active = null; }
  })();

  /* ============================ PICK A SILK ============================ */
  (function pickASilk() {
    const deck = $("#silkDeck");
    SILKS.forEach((s, i) => {
      const card = document.createElement("article");
      card.className = "silk-card";
      card.style.background = s.bg;
      card.style.setProperty("--tilt", s.tilt + "deg");
      const nl=s.name.length; const fs=nl>14?30:nl>10?36:44;
      card.innerHTML = `
        <h3 class="silk-name" style="font-size:${fs}px">${s.name}</h3>
        <img src="${s.img}" alt="${s.name} saree on model">
        <p class="silk-price">${inr(s.price)}</p>
        <button class="silk-heart" aria-label="Wishlist ${s.name}">
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M12 20.5C7 16.5 3 13.3 3 9.3 3 6.4 5.2 4.5 7.6 4.5c1.7 0 3.3.9 4.4 2.4 1.1-1.5 2.7-2.4 4.4-2.4 2.4 0 4.6 1.9 4.6 4.8 0 4-4 7.2-9 11.2Z"/></svg>
        </button>
        <button class="silk-add" aria-label="Add ${s.name} to bag">+</button>`;
      card.querySelector(".silk-add").addEventListener("click", (e) => {
        e.stopPropagation();
        addToBag({ name: s.name + " Silk", price: s.price, img: s.img });
        toast(`<b>${s.name}</b> dropped into your bag.`);
        if (window.gsap && !reduced) gsap.fromTo(card, { scale: 0.94 }, { scale: 1, duration: 0.5, ease: "elastic.out(1,0.5)" });
      });
      const heart = card.querySelector(".silk-heart");
      heart.addEventListener("click", (e) => {
        e.stopPropagation();
        const on = heart.classList.toggle("is-on");
        on ? wishlist.add(s.name) : wishlist.delete(s.name);
        syncWish();
      });
      deck.appendChild(card);
    });
  })();

  /* ============================ THE RACK ============================ */
  (function theRack() {
    const rail = $("#rackRail"), nameEl = $("#rackName"), priceEl = $("#rackPrice"),
      sizesEl = $("#rackSizes"), filtersEl = $("#rackFilters"), totalEl = $("#rackTotal");
    const CATS = ["All pieces", "Silk Sarees", "Half Sarees", "Full-Sleeve Blouses", "Half-Sleeve Blouses", "Checked Sarees", "Zari & Brocade"];
    let items = RACK.slice(), idx = 1, cat = "All pieces";
    let viewFront = true;

    CATS.forEach((c) => {
      const n = c === "All pieces" ? RACK.length : RACK.filter((r) => r.cat.includes(c)).length;
      const b = document.createElement("button");
      b.className = "chip" + (c === cat ? " is-on" : "");
      b.setAttribute("role", "tab");
      b.innerHTML = `${c} <small>${String(n).padStart(2, "0")}</small>`;
      b.addEventListener("click", () => {
        cat = c;
        $$(".chip", filtersEl).forEach((x) => x.classList.toggle("is-on", x === b));
        items = cat === "All pieces" ? RACK.slice() : RACK.filter((r) => r.cat.includes(c));
        idx = Math.min(1, items.length - 1);
        render();
      });
      filtersEl.appendChild(b);
    });

    function render() {
      rail.innerHTML = "";
      items.forEach((r, i) => {
        const off = i - idx;
        const d = document.createElement("div");
        d.className = "rack-item";
        const abs = Math.abs(off);
        const x = off * 165;
        const scale = Math.max(1 - abs * 0.14, 0.55);
        const blur = Math.min(abs * 2.6, 9);
        const rot = off * 2.2;
        d.style.transform = `translateX(${x}px) translateY(${abs * 10}px) rotate(${rot}deg) scale(${scale})`;
        d.style.filter = `blur(${blur}px)${r.hue ? ` hue-rotate(${r.hue}deg)` : ""}`;
        d.style.opacity = abs > 4 ? 0 : 1 - abs * 0.12;
        d.style.zIndex = 100 - abs;
        d.innerHTML = `<img src="${r.img}" alt="${r.name}" ${abs > 2 ? 'loading="lazy"' : ""}>`;
        d.addEventListener("click", () => { idx = i; render(); });
        rail.appendChild(d);
      });
      if (!viewFront) { const f = rail.children[idx]; if (f && !f.style.transform.includes("scaleX(-1)")) f.style.transform += " scaleX(-1)"; }
      const cur = items[idx];
      if (cur) {
        nameEl.textContent = cur.name;
        priceEl.textContent = inr(cur.price) + ".00";
      }
      totalEl.textContent = items.length;
    }

    ["S", "M", "L", "XL"].forEach((s, i) => {
      const b = document.createElement("button");
      b.className = "chip" + (i === 1 ? " is-on" : "");
      b.textContent = s;
      b.addEventListener("click", () => { $$(".chip", sizesEl).forEach((x) => x.classList.toggle("is-on", x === b)); });
      sizesEl.appendChild(b);
    });

    $("#viewFront").addEventListener("click", () => setView(true));
    $("#viewBack").addEventListener("click", () => setView(false));
    function setView(front) {
      viewFront = front;
      $("#viewFront").classList.toggle("is-on", front);
      $("#viewBack").classList.toggle("is-on", !front);
      const focused = rail.children[idx];
      if (focused) {
        const t = focused.style.transform.replace(" scaleX(-1)", "");
        focused.style.transform = front ? t : t + " scaleX(-1)";
      }
    }

    $("#rackPrev").addEventListener("click", () => { idx = Math.max(0, idx - 1); render(); });
    $("#rackNext").addEventListener("click", () => { idx = Math.min(items.length - 1, idx + 1); render(); });

    $("#rackAdd").addEventListener("click", function () {
      if (!viewFront) { const f = rail.children[idx]; if (f && !f.style.transform.includes("scaleX(-1)")) f.style.transform += " scaleX(-1)"; }
      const cur = items[idx];
      if (!cur) return;
      addToBag({ name: cur.name, price: cur.price, img: cur.img });
      this.textContent = "Added to bag ✓";
      setTimeout(() => (this.textContent = "Add to bag"), 1600);
      toast(`<b>${cur.name}</b> - off the rail, into your bag.`);
    });
    $("#rackAvail").addEventListener("click", () => toast("In stock at the Lucknow flagship. Ships in 2 days."));

    // grid
    const grid = $("#rackGrid");
    GRID.forEach((g) => {
      const c = document.createElement("article");
      c.className = "grid-card";
      c.innerHTML = `<span class="grid-num">${g.num}</span><img src="${g.img}" alt="${g.name}" loading="lazy"><strong>${g.name}</strong><p class="grid-price">${inr(g.price)}</p><button class="btn btn-dark">Add to bag</button>`;
      c.querySelector(".btn").addEventListener("click", () => {
        addToBag({ name: g.name, price: g.price, img: g.img });
        toast(`<b>${g.name}</b> added to your bag.`);
      });
      grid.appendChild(c);
    });

    // marquee
    const words = ['Every thread an offering.', '+', '<b>Woven by hand. Worn in devotion.</b>', '+', 'Ten silks. Ten muses.', '+'];
    $("#rackMarqueeTrack").innerHTML = (words.map((w) => `<span>${w}</span>`).join('<i style="display:none"></i>') + "").repeat(4);

    render();
  })();

  /* ============================ THE MUSE + STORY ============================ */
  (function muse() {
    const railEl = $("#museRail");
    REELS.forEach((r, i) => {
      const c = document.createElement("button");
      c.className = "reel-card" + (i === 2 ? " is-centre" : "");
      c.style.setProperty("--tilt", ((i % 2 ? 1 : -1) * (2 + (i % 3))) + "deg");
      c.style.setProperty("--lift", (i === 2 ? "-14px" : "0"));
      c.setAttribute("aria-label", `Play ${r.name}`);
      c.innerHTML = `
        <img src="${r.img}" alt="${r.name}">
        <span class="reel-badge"><b>${r.badge}</b></span>
        <span class="reel-name">${r.name}</span>
        <span class="reel-play"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg></span>`;
      c.addEventListener("click", () => openStory(i));
      railEl.appendChild(c);
    });
  })();

  const story = $("#story");
  let storyIdx = 0, storyTimer = null, storyPaused = false;

  function openStory(i) {
    storyIdx = i;
    story.hidden = false;
    document.body.style.overflow = "hidden";
    renderStory();
  }
  function closeStory() {
    story.hidden = true;
    document.body.style.overflow = "";
    clearTimeout(storyTimer);
  }
  function renderStory() {
    const r = REELS[storyIdx];
    clearTimeout(storyTimer);
    story.classList.remove("is-paused");
    storyPaused = false;
    // media
    const media = $("#storyMedia");
    media.innerHTML = `<img src="${r.img}" alt="${r.name}">`;
    // bars
    const bars = $("#storyBars");
    bars.innerHTML = REELS.map((_, k) => `<i class="${k < storyIdx ? "done" : k === storyIdx ? "live" : ""}" style="--dur:${REELS[storyIdx].secs}s"><b></b></i>`).join("");
    // meta + card
    $("#storyPlace").textContent = r.place;
    $("#storyKicker").textContent = r.kicker;
    $("#storyName").textContent = r.prod;
    $("#storyDesc").textContent = r.desc;
    $("#storyPrice").textContent = inr(r.price);
    const card = $("#storyCard");
    card.style.animation = "none"; void card.offsetWidth; card.style.animation = "";
    // peeks
    const prev = REELS[(storyIdx - 1 + REELS.length) % REELS.length];
    const next = REELS[(storyIdx + 1) % REELS.length];
    $("#storyPeekPrev").innerHTML = `<img src="${prev.img}" alt=""><span>${prev.name}</span>`;
    $("#storyPeekNext").innerHTML = `<img src="${next.img}" alt=""><span>${next.name}</span>`;
    if (!reduced) storyTimer = setTimeout(() => stepStory(1), r.secs * 1000);
  }
  function stepStory(d) {
    storyIdx = (storyIdx + d + REELS.length) % REELS.length;
    renderStory();
  }
  $("#storyClose").addEventListener("click", closeStory);
  $("#storyTapNext").addEventListener("click", () => stepStory(1));
  $("#storyTapPrev").addEventListener("click", () => stepStory(-1));
  $("#storyPeekNext").addEventListener("click", () => stepStory(1));
  $("#storyPeekPrev").addEventListener("click", () => stepStory(-1));
  // hold to pause
  story.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button, a")) return;
    storyPaused = true;
    story.classList.add("is-paused");
    clearTimeout(storyTimer);
  });
  story.addEventListener("pointerup", () => {
    if (!storyPaused) return;
    storyPaused = false;
    story.classList.remove("is-paused");
    storyTimer = setTimeout(() => stepStory(1), 2500);
  });
  document.addEventListener("keydown", (e) => {
    if (story.hidden) return;
    if (e.key === "Escape") closeStory();
    if (e.key === "ArrowRight") stepStory(1);
    if (e.key === "ArrowLeft") stepStory(-1);
  });
  $("#storyAdd").addEventListener("click", () => {
    const r = REELS[storyIdx];
    addToBag({ name: r.prod, price: r.price, img: r.img });
    toast(`<b>${r.prod}</b> added to your bag.`);
  });
  $("#storyMore").addEventListener("click", (e) => { e.preventDefault(); closeStory(); document.getElementById("the-rack").scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); });

  /* ============================ BRIDAL FAN ============================ */
  (function bridal() {
    const fan = $("#bridalFan"), nameEl = $("#bridalName"), priceEl = $("#bridalPrice");
    let idx = 0;
    BRIDAL.forEach((b, i) => {
      const c = document.createElement("div");
      c.className = "bridal-card";
      c.innerHTML = `<img src="${b.img}" alt="${b.name}">`;
      c.addEventListener("click", () => { idx = i; render(); });
      fan.appendChild(c);
    });
    function render() {
      const n = BRIDAL.length;
      Array.from(fan.children).forEach((c, i) => {
        let off = i - idx;
        if (off > n / 2) off -= n;
        if (off < -n / 2) off += n;
        const abs = Math.abs(off);
        const angle = off * 22;           // fan spread
        const x = off * 150;
        const y = abs * 26;
        const z = -abs * 120;
        c.style.transform = `translate3d(${x}px,${y}px,${z}px) rotateY(${-angle}deg) rotateZ(${off * 4}deg)`;
        c.style.filter = abs === 0 ? "none" : `blur(${Math.min(abs * 1.6, 5)}px) brightness(${1 - abs * 0.12})`;
        c.style.opacity = abs > 3 ? 0 : 1;
        c.style.zIndex = 50 - abs;
      });
      nameEl.textContent = BRIDAL[idx].name;
      priceEl.textContent = inr(BRIDAL[idx].price);
    }
    $("#bridalPrev").addEventListener("click", () => { idx = (idx - 1 + BRIDAL.length) % BRIDAL.length; render(); });
    $("#bridalNext").addEventListener("click", () => { idx = (idx + 1) % BRIDAL.length; render(); });
    $("#bridalAdd").addEventListener("click", () => {
      const b = BRIDAL[idx];
      addToBag({ name: b.name, price: b.price, img: b.img });
      toast(`<b>${b.name}</b> - an heirloom, set aside for you.`);
    });
    // slow auto-rotate until interacted
    if (!reduced) {
      let auto = setInterval(() => { idx = (idx + 1) % BRIDAL.length; render(); }, 4200);
      ["bridalPrev", "bridalNext"].forEach((id) => $(`#${id}`).addEventListener("click", () => clearInterval(auto), { once: true }));
      fan.addEventListener("click", () => clearInterval(auto), { once: true });
    }
    render();
  })();

  /* ============================ THE WEAVE ============================ */
  (function weave() {
    const swatchRow = $("#weaveSwatches"), slotsEl = $$("#weaveSlots li"),
      label = $("#weaveLabel"), priceEl = $("#weavePrice"), mrpEl = $("#weaveMrp"),
      addBtn = $("#weaveAdd"), emptyEl = $("#weaveEmpty");
    const picked = []; // indices into WEAVE_SILKS
    const ROMAN = ["I", "II", "III"];

    WEAVE_SILKS.forEach((s, i) => {
      const b = document.createElement("button");
      b.className = "weave-swatch";
      b.dataset.num = "";
      b.setAttribute("aria-label", `Weave in ${s.name}, ${inr(s.price)}`);
      b.innerHTML = `<img src="${s.tex}" alt="">`;
      b.addEventListener("click", () => toggle(i));
      swatchRow.appendChild(b);
    });

    function toggle(i) {
      const at = picked.indexOf(i);
      if (at >= 0) picked.splice(at, 1);
      else {
        if (picked.length >= 3) { toast("Three threads is the whole weave. Remove one to change it."); return; }
        picked.push(i);
      }
      render();
    }

    function render() {
      // swatches
      $$(".weave-swatch", swatchRow).forEach((b, i) => {
        const at = picked.indexOf(i);
        b.classList.toggle("is-picked", at >= 0);
        b.dataset.num = at >= 0 ? ROMAN[at] : "";
        b.disabled = picked.length >= 3 && at < 0;
      });
      // slots
      slotsEl.forEach((li, k) => {
        const s = picked[k] != null ? WEAVE_SILKS[picked[k]] : null;
        li.classList.toggle("is-filled", !!s);
        li.innerHTML = s
          ? `<span class="weave-slot-num">${ROMAN[k]}</span><span class="weave-slot-name">${s.name}</span><button class="weave-slot-x" aria-label="Remove ${s.name}">✕</button>`
          : `<span class="weave-slot-num">${ROMAN[k]}</span><span class="weave-slot-name">A thread, waiting</span>`;
        const x = li.querySelector(".weave-slot-x");
        if (x) x.addEventListener("click", () => toggle(picked[k]));
      });
      // label + price
      label.textContent = picked.length === 0 ? "Woven as none" : picked.length < 3 ? `Woven as ${["none", "one", "two"][picked.length]}` : "Woven as one";
      const mrp = picked.reduce((a, i) => a + WEAVE_SILKS[i].price, 0);
      const full = picked.length === 3;
      const net = full ? Math.round(mrp * 0.9) : mrp;
      mrpEl.textContent = full ? inr(mrp) : "";
      priceEl.textContent = inr(net);
      addBtn.disabled = !full;
      emptyEl.classList.toggle("is-hidden", picked.length > 0);
      // tell the braid
      window.dispatchEvent(new CustomEvent("resham:weave", {
        detail: { textures: picked.map((i) => WEAVE_SILKS[i].tex) },
      }));
    }

    addBtn.addEventListener("click", () => {
      const mrp = picked.reduce((a, i) => a + WEAVE_SILKS[i].price, 0);
      const net = Math.round(mrp * 0.9);
      const names = picked.map((i) => WEAVE_SILKS[i].name).join(" + ");
      addToBag({ name: `The Weave (${names})`, price: net, img: WEAVE_SILKS[picked[0]].tex });
      toast(`<b>Woven into your bag.</b> You saved ${inr(mrp - net)}.`);
    });

    render();
  })();

  /* ============================ WEAVE THREAD LINES ============================ */
  (function threads() {
    if (reduced) return;
    const cv = $("#weaveThreads"), ctx = cv.getContext("2d");
    let w, h, t = 0;
    function size() {
      const r = cv.parentElement.getBoundingClientRect();
      w = cv.width = r.width * devicePixelRatio;
      h = cv.height = r.height * devicePixelRatio;
    }
    size();
    window.addEventListener("resize", size);
    const lines = Array.from({ length: 5 }, (_, i) => ({
      y: 0.12 + i * 0.19, amp: 20 + i * 14, speed: 0.25 + i * 0.08, hue: i % 2 ? "rgba(122,20,36,.20)" : "rgba(224,169,44,.22)",
    }));
    (function draw() {
      t += 0.008;
      ctx.clearRect(0, 0, w, h);
      lines.forEach((L, li) => {
        ctx.beginPath();
        ctx.strokeStyle = L.hue;
        ctx.lineWidth = devicePixelRatio * 1.1;
        for (let x = 0; x <= w; x += 8) {
          const y = h * L.y + Math.sin(x / w * 6 + t * L.speed * 6 + li) * L.amp * devicePixelRatio * Math.sin(t + li);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
      requestAnimationFrame(draw);
    })();
  })();

  /* ============================ NEWSLETTER ============================ */
  $("#newsForm").addEventListener("submit", (e) => {
    e.preventDefault();
    toast("Woven into the list. First letter arrives with the new season.");
    e.target.reset();
  });

  /* ============================ SCROLL MOTION ============================ */
  if (window.gsap && window.ScrollTrigger && !reduced) {
    gsap.registerPlugin(ScrollTrigger);
    $$(".section-head, .grid-card, .drape-still").forEach((el) => {
      gsap.fromTo(el, { y: 34, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });
    gsap.fromTo(".silk-card", { y: 70, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.9, stagger: 0.07, ease: "power3.out",
      scrollTrigger: { trigger: ".silk-deck", start: "top 85%" },
    });
    // muse rail gentle scroll-linked sway
    gsap.to(".reel-card", {
      rotate: 0, y: -6, stagger: 0.02, ease: "none",
      scrollTrigger: { trigger: ".muse-rail", start: "top 90%", end: "bottom 40%", scrub: 1 },
    });
  }
})();
