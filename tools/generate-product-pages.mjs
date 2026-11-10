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

/* ---------- sitemap.xml ---------- */
const today = new Date().toISOString().slice(0, 10);
const staticUrls = [
  ["", "1.0", "daily"],
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
