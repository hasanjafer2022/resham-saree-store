/* RESHAM — generates one static SEO page per product under /products/<sku>/ plus sitemap.xml.
   Re-run whenever js/products.js changes: node tools/generate-product-pages.mjs
   Pages are the product.html template pre-filled with product data and <base href="/"> so
   every relative reference (HTML and JS-assigned) resolves from the site root. */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";

const SITE = "https://resham-saree-store.pages.dev";
const BRAND = "RESHAM · Lucknow Silk";

/* load the browser catalog in Node */
const window = {};
new Function("window", readFileSync("js/products.js", "utf8"))(window);
const products = window.RESHAM_PRODUCTS;
if (!products || !products.length) throw new Error("catalog failed to load");

const FABRIC_NOTES = {
  "Lucknawi silk": "Pure mulberry silk on handlooms of Lucknow, silver-core zari borders.",
  "Banarasi katan": "Katan silk with kadhua zari brocade woven on Banaras pit-looms.",
  "Cotton silk": "Silk-cotton blend, crisp pleats, temple-thread border.",
  "Kora organza": "Featherweight kora silk with a hand-rolled gold edge.",
  "Chiffon": "Silk chiffon, falls close and moves like water.",
  "Raw silk": "Textured raw silk with a structured, lined bodice.",
  "Tissue silk": "Tissue silk with foil zari — light as a coin, bright as one.",
  "Paithani silk": "Paithani weave with a tapestry pallu.",
  "Bandhani silk": "Hand-tied bandhani on silk, dot by dot.",
  "Soft silk": "Lightweight soft silk with a woven gold zari border.",
  "Temple jewellery": "Gold-plated brass with kemp stones, nickel-free.",
  "Silver jewellery": "92.5 sterling silver with gold vermeil and pearl drops.",
  "Gold-plated": "Copper base with 1 micron gold plating.",
  "Gajra": "Fresh-look silk jasmine, hand-strung on cotton cord.",
};
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ---------- template ---------- */
const tpl = readFileSync("product.html", "utf8");
rmSync("products", { recursive: true, force: true });

let count = 0;
for (const p of products) {
  const dir = "products/" + p.sku.toLowerCase();
  const canon = SITE + "/products/" + p.sku.toLowerCase() + "/";
  const desc = (p.desc + " " + (FABRIC_NOTES[p.fabric] || p.fabric + " from Lucknow") + " ₹" + p.price.toLocaleString("en-IN") + " · 7-day returns, COD across India, free shipping above ₹9,999.").slice(0, 300);
  const title = p.name + " · " + BRAND;
  const stars = "★★★★★".slice(0, Math.round(p.rating));

  let html = tpl;

  /* <base> right after charset so every relative URL (incl. JS-assigned) resolves from root */
  html = html.replace('<meta charset="UTF-8">', '<meta charset="UTF-8">\n<base href="/">');

  /* title + description */
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(desc)}">`);

  /* SEO block before </head> */
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: p.name,
        image: p.gallery.map((g) => SITE + "/" + g),
        description: p.desc,
        sku: p.sku,
        category: p.cat.join(" > "),
        brand: { "@type": "Brand", name: "RESHAM" },
        material: p.fabric,
        aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviews, bestRating: 5 },
        offers: {
          "@type": "Offer", url: canon, priceCurrency: "INR", price: p.price,
          availability: "https://schema.org/InStock", itemCondition: "https://schema.org/NewCondition",
          shippingDetails: { "@type": "OfferShippingDetails", shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "INR" }, shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" } },
          hasMerchantReturnPolicy: { "@type": "MerchantReturnPolicy", applicableCountry: "IN", returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow", merchantReturnDays: 7, returnMethod: "https://schema.org/ReturnByMail", returnFees: "https://schema.org/FreeReturn" },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
          { "@type": "ListItem", position: 2, name: p.cat[0], item: SITE + "/index.html#the-rack" },
          { "@type": "ListItem", position: 3, name: p.name, item: canon },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "What fabric is the " + p.name + " made of?", acceptedAnswer: { "@type": "Answer", text: FABRIC_NOTES[p.fabric] || p.fabric + ", crafted in India." } },
          { "@type": "Question", name: "What is the price of the " + p.name + "?", acceptedAnswer: { "@type": "Answer", text: "The " + p.name + " is priced at ₹" + p.price.toLocaleString("en-IN") + " (MRP ₹" + p.mrp.toLocaleString("en-IN") + "), inclusive of all taxes." } },
          { "@type": "Question", name: "What is the return policy?", acceptedAnswer: { "@type": "Answer", text: "7-day easy returns with free reverse pickup across India. Refunds are issued within 48 hours of inspection at our Lucknow studio." } },
          { "@type": "Question", name: "Is cash on delivery available?", acceptedAnswer: { "@type": "Answer", text: "Yes — cash on delivery is available across India at no extra charge. Orders above ₹9,999 ship free." } },
        ],
      },
    ],
  };
  const seoBlock = [
    `<link rel="canonical" href="${canon}">`,
    `<meta name="robots" content="index,follow">`,
    `<meta property="og:site_name" content="${BRAND}">`,
    `<meta property="og:type" content="product">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    `<meta property="og:url" content="${canon}">`,
    `<meta property="og:image" content="${SITE}/${p.img}">`,
    `<meta property="product:price:amount" content="${p.price}">`,
    `<meta property="product:price:currency" content="INR">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(desc)}">`,
    `<meta name="twitter:image" content="${SITE}/${p.img}">`,
    `<meta name="theme-color" content="#5c0e1a">`,
    `<link rel="manifest" href="/manifest.webmanifest">`,
    `<script type="application/ld+json">${JSON.stringify(ld)}</script>`,
  ].join("\n");
  html = html.replace("</head>", seoBlock + "\n</head>");

  /* prefill body so the page reads correctly even before JS (no-JS crawlers, AI engines) */
  html = html.replace('<img class="main" id="pdpMain" src="" alt="">', `<img class="main" id="pdpMain" src="${p.img}" alt="${esc(p.name)} — handwoven ${esc(p.fabric)}">`);
  html = html.replace('<h1 class="pdp-name" id="pdpName"></h1>', `<h1 class="pdp-name" id="pdpName">${esc(p.name)}</h1>`);
  html = html.replace('<p class="eyebrow" id="pdpCat" style="margin-bottom:12px"></p>', `<p class="eyebrow" id="pdpCat" style="margin-bottom:12px">${esc(p.cat.join(" · "))}</p>`);
  html = html.replace('<span class="stars" id="pdpStars"></span>', `<span class="stars" id="pdpStars">${stars}</span>`);
  html = html.replace('<b id="pdpRate"></b>', `<b id="pdpRate">${p.rating.toFixed(1)}</b>`);
  html = html.replace('<span id="pdpReviews"></span>', `<span id="pdpReviews">${p.reviews}</span>`);
  html = html.replace('<span class="pdp-price" id="pdpPrice"></span>', `<span class="pdp-price" id="pdpPrice">₹${p.price.toLocaleString("en-IN")}</span>`);
  html = html.replace('<s class="pdp-mrp" id="pdpMrp"></s>', `<s class="pdp-mrp" id="pdpMrp">₹${p.mrp.toLocaleString("en-IN")}</s>`);
  html = html.replace('<span class="pdp-off" id="pdpOff"></span>', `<span class="pdp-off" id="pdpOff">${Math.round((1 - p.price / p.mrp) * 100)}% off</span>`);
  html = html.replace('<p id="pdpDesc"></p>', `<p id="pdpDesc">${esc(p.desc)}</p>`);
  html = html.replace('<b id="colorName"></b>', `<b id="colorName">${esc(p.colors[0][0])}</b>`);
  html = html.replace('<b id="sizeName"></b>', `<b id="sizeName">${esc(p.sizes[0])}</b>`);

  mkdirSync(dir, { recursive: true });
  writeFileSync(dir + "/index.html", html);
  count++;
}
console.log("generated " + count + " product pages under /products/");

/* ---------- collection pages (/collections/<slug>/) ---------- */
/* reuse chrome's exact card markup so static pages render identically */
globalThis.document = { addEventListener() {} };
globalThis.ReshamStore = { wishHas: () => false };
const chromeWin = {};
new Function("window", readFileSync("js/chrome.js", "utf8"))(chromeWin);
const cardHTML = chromeWin.ReshamChrome.cardHTML;

const COLLECTIONS = [
  { slug: "silk-sarees", title: "Silk Sarees", tag: "Silk Sarees", desc: "Handwoven silks from the Lucknow rack — temple borders, peacock pallus and quiet everyday golds. Every saree ships with its 0.8 m blouse piece." },
  { slug: "zari-brocade", title: "Zari & Brocade", tag: "Zari & Brocade", desc: "Silver-core zari woven into temple borders and kadhua brocade — the sarees people borrow and never return." },
  { slug: "checked-sarees", title: "Checked Sarees", tag: "Checked Sarees", desc: "Checked silks with a steady hand — palace checks, kattam grids and cocoa plains for days that want structure." },
  { slug: "half-sarees", title: "Half Sarees", tag: "Half Sarees", desc: "The davani tradition — half sarees that move between college corridors and temple corridors without changing a fold." },
  { slug: "blouses", title: "Blouses", type: "blouse", desc: "Ready-stitched raw-silk blouses, half-sleeve and full-sleeve, with concealed hooks and alteration margin. Sizes 34–42." },
  { slug: "jewellery", title: "Temple Jewellery", tag: "Jewellery", desc: "Temple jewellery for the whole story — chokers, jhumkas, ottiyanam, bangles and gajra, gold-plated and stone-set by hand." },
  { slug: "bridal", title: "Bridal Collection", tag: "Bridal", desc: "Heirloom silks for the muhurtham and every vow after — deep sindoors, bandhani, temple emeralds and Paithani pallus." },
];

function shellPage({ title, desc, canon, h1, eyebrow, lead, body, ld }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<base href="/">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="author" content="Digigrow Solution — digigrowsolutions.in">
<meta name="description" content="${esc(desc)}">
<title>${esc(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400;1,9..144,600&family=Anton&display=swap" rel="stylesheet">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27%3E%3Crect width=%2724%27 height=%2724%27 rx=%2712%27 fill=%27%235c0e1a%27/%3E%3Ctext x=%2712%27 y=%2717%27 font-size=%2713%27 text-anchor=%27middle%27 fill=%27%23f0c76a%27 font-family=%27serif%27 font-weight=%27bold%27%3ER%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/pages.css">
<link rel="canonical" href="${canon}">
<meta name="robots" content="index,follow">
<meta property="og:site_name" content="${BRAND}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canon}">
<meta property="og:image" content="${SITE}/assets/og-cover.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${SITE}/assets/og-cover.jpg">
<meta name="theme-color" content="#5c0e1a">
<link rel="manifest" href="/manifest.webmanifest">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body data-page="collection">

<header class="nav-wrap" id="pageNav"></header>

<main class="page">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><i>/</i><a href="collections/">Collections</a><i>/</i><b>${esc(h1)}</b></nav>
  <p class="eyebrow">${esc(eyebrow)}</p>
  <h1 class="page-title">${esc(h1)}</h1>
  <p class="coll-lead">${esc(lead)}</p>
${body}
</main>

<footer class="footer" id="pageFooter"></footer>
<div class="subticker" aria-hidden="true"><div id="subTickerTrack"></div></div>
<div class="subtoast" id="subtoast" role="status" aria-live="polite"></div>

<script src="js/config.js"></script>
<script src="js/products.js"></script>
<script src="js/store.js"></script>
<script src="js/chrome.js"></script>
<script>
document.addEventListener("DOMContentLoaded", function () {
  var g = document.getElementById("catGrid");
  if (g && window.ReshamChrome) window.ReshamChrome.bindCards(g);
});
</script>
</body>
</html>
`;
}

const crumbLD = (name, canon) => ({
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
    { "@type": "ListItem", position: 2, name: "Collections", item: SITE + "/collections/" },
    { "@type": "ListItem", position: 3, name, item: canon },
  ],
});

let collCount = 0;
for (const col of COLLECTIONS) {
  const canon = SITE + "/collections/" + col.slug + "/";
  const items = products.filter((p) => (col.tag ? p.cat.includes(col.tag) : p.type === col.type));
  if (!items.length) { console.log("skip empty collection", col.slug); continue; }
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", name: col.title + " · " + BRAND, description: col.desc, url: canon, isPartOf: { "@type": "WebSite", name: BRAND, url: SITE + "/" } },
      crumbLD(col.title, canon),
      { "@type": "ItemList", name: col.title, numberOfItems: items.length, itemListElement: items.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: SITE + "/products/" + p.sku.toLowerCase() + "/", name: p.name })) },
    ],
  };
  const xlinks = COLLECTIONS.filter((c) => c.slug !== col.slug)
    .map((c) => `<a href="collections/${c.slug}/">${esc(c.title)}</a>`).join("");
  const body = `  <div class="shop-grid" id="catGrid" style="margin-top:34px">
${items.map((p) => cardHTML(p).trim().split("\n").map((l) => "    " + l).join("\n")).join("\n")}
  </div>
  <div class="xlinks"><b>Keep exploring</b>${xlinks}</div>`;
  mkdirSync("collections/" + col.slug, { recursive: true });
  writeFileSync("collections/" + col.slug + "/index.html",
    shellPage({ title: col.title + " · " + BRAND, desc: col.desc + " Shop " + items.length + " pieces at RESHAM · Lucknow Silk — free shipping above ₹9,999, 7-day returns, COD across India.", canon, h1: col.title, eyebrow: "RESHAM collection · " + items.length + " pieces", lead: col.desc, body, ld }));
  collCount++;
}

/* collections hub */
{
  const canon = SITE + "/collections/";
  const cards = COLLECTIONS.map((col) => {
    const items = products.filter((p) => (col.tag ? p.cat.includes(col.tag) : p.type === col.type));
    if (!items.length) return "";
    return `    <a class="coll-card" href="collections/${col.slug}/">
      <img loading="lazy" src="${items[0].img}" alt="${esc(col.title)} — ${esc(items[0].name)}">
      <span class="cc-body"><h2>${esc(col.title)}</h2><p>${esc(col.desc)}</p><span class="cc-count">${items.length} piece${items.length === 1 ? "" : "s"}</span></span>
    </a>`;
  }).filter(Boolean).join("\n");
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", name: "Collections · " + BRAND, description: "Shop RESHAM by collection — silk sarees, zari brocade, checked silks, half sarees, blouses, temple jewellery and the bridal edit.", url: canon, isPartOf: { "@type": "WebSite", name: BRAND, url: SITE + "/" } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
        { "@type": "ListItem", position: 2, name: "Collections", item: canon },
      ] },
    ],
  };
  const body = `  <div class="coll-grid">
${cards}
  </div>`;
  mkdirSync("collections", { recursive: true });
  writeFileSync("collections/index.html",
    shellPage({ title: "All Collections · " + BRAND, desc: "Shop RESHAM by collection — silk sarees, zari brocade, checked silks, half sarees, blouses, temple jewellery and the bridal edit. Handwoven in Lucknow, shipped across India.", canon, h1: "Collections", eyebrow: "RESHAM · shop by collection", lead: "Seven ways into the rack — pick the mood, the weave or the occasion, and every piece inside links to its own page.", body, ld }));
  collCount++;
}
console.log("generated " + collCount + " collection pages under /collections/");

/* ---------- sitemap.xml ---------- */
const today = new Date().toISOString().slice(0, 10);
const staticUrls = [
  ["", "1.0", "daily"],
  ["/collections/", "0.9", "weekly"],
  ...COLLECTIONS.filter((c) => products.some((p) => (c.tag ? p.cat.includes(c.tag) : p.type === c.type)))
    .map((c) => ["/collections/" + c.slug + "/", "0.7", "weekly"]),
  ["/contact", "0.6", "monthly"],
  ["/privacy", "0.3", "yearly"],
  ["/terms", "0.3", "yearly"],
  ["/refund", "0.5", "monthly"],
  ["/shipping", "0.5", "monthly"],
];
const urls = staticUrls.map(([path, pr, freq]) =>
  `  <url><loc>${SITE}${path || "/"}</loc><lastmod>${today}</lastmod><changefreq>${freq}</changefreq><priority>${pr}</priority></url>`
);
for (const p of products) {
  urls.push(`  <url><loc>${SITE}/products/${p.sku.toLowerCase()}/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`);
}
writeFileSync("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);
console.log("sitemap.xml — " + urls.length + " URLs");
