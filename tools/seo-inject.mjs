/* RESHAM — injects canonical/OG/Twitter/theme-color/manifest + JSON-LD into root pages.
   Idempotent: re-running replaces the previous <!--SEO-BLOCK-->. Usage: node tools/seo-inject.mjs */
import { readFileSync, writeFileSync } from "node:fs";

const SITE = "https://resham-saree-store.pages.dev";
const OG_IMG = SITE + "/assets/og-cover.jpg";
const BRAND = "RESHAM · Lucknow Silk";

const STORE_LD = {
  "@type": "OnlineStore",
  name: BRAND,
  url: SITE + "/",
  image: OG_IMG,
  description: "Handwoven silk sarees, blouses and temple jewellery from Lucknow — Lucknawi silk, Banarasi katan, organza and bridal wear, shipped across India.",
  priceRange: "₹1,200 – ₹1,20,000",
  currenciesAccepted: "INR",
  paymentAccepted: "UPI, Credit Card, Debit Card, Net Banking, Cash on Delivery",
  areaServed: { "@type": "Country", name: "India" },
  address: { "@type": "PostalAddress", streetAddress: "14, Hazratganj", addressLocality: "Lucknow", addressRegion: "Uttar Pradesh", postalCode: "226001", addressCountry: "IN" },
  contactPoint: { "@type": "ContactPoint", telephone: "+91-522-400-1234", email: "care@digigrowsolutions.in", contactType: "customer service", availableLanguage: ["en", "hi"] },
};

const ORG_LD = {
  "@type": "Organization",
  name: "RESHAM · Lucknow Silk",
  url: SITE + "/",
  logo: OG_IMG,
  description: "RESHAM is a Lucknow-based silk saree house built as a demonstration storefront by Digigrow Solution.",
};

const WEBPAGE = (name, desc, path) => ({
  "@type": "WebPage",
  name,
  description: desc,
  url: SITE + path,
  isPartOf: { "@type": "WebSite", name: BRAND, url: SITE + "/" },
});

const FAQ_REFUND = [
  ["How many days do I get to return a saree?", "You have 7 days from the date of delivery. Write to care@digigrowsolutions.in with your order number and we arrange a free reverse pickup."],
  ["When will my money come back?", "Refunds are issued within 48 hours of the piece passing inspection at our Lucknow studio. Banks post UPI refunds the same day; card refunds take 5–7 working days to reflect."],
  ["Is return shipping charged?", "Never. Reverse pickup is free on every order across India."],
  ["Can I exchange instead of taking a refund?", "Yes — an exchange ships as soon as the original piece is picked up, subject to stock, and any price difference is settled at parity."],
];
const FAQ_SHIPPING = [
  ["How long does delivery take?", "Dispatch happens within 24–48 hours of order confirmation. Metro cities receive orders in 2–3 days; the rest of India in 3–7 days."],
  ["When is shipping free?", "Every order above ₹9,999 ships free across India. Below that a flat ₹199 applies — jewellery-only orders included."],
  ["Do you offer cash on delivery?", "Yes, COD is available on all pin-codes we serve, at no extra charge."],
  ["How do I track my parcel?", "A tracking link reaches your email and phone the moment the parcel leaves the Lucknow studio."],
];
const faqLD = (pairs) => ({
  "@type": "FAQPage",
  mainEntity: pairs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});

const PAGES = {
  "index.html": {
    path: "/", ogType: "website",
    desc: "RESHAM · Lucknow Silk — handwoven silk sarees, blouses and temple jewellery from Lucknow. Free shipping above ₹9,999, 7-day returns, COD across India.",
    jsonld: [
      { ...ORG_LD }, { ...STORE_LD },
      { "@type": "WebSite", name: BRAND, url: SITE + "/", inLanguage: "en-IN", publisher: { "@type": "Organization", name: "Digigrow Solution", url: "https://digigrowsolutions.in" } },
    ],
  },
  "contact.html": {
    path: "/contact", ogType: "website",
    desc: "Talk to RESHAM · Lucknow Silk — studio address in Hazratganj, email, phone and a quick contact form. We reply within one working day.",
    jsonld: [{ ...WEBPAGE("Contact · RESHAM · Lucknow Silk", "Studio address, email, phone and contact form for RESHAM · Lucknow Silk.", "/contact"), "@type": "ContactPage" }, { ...STORE_LD }],
  },
  "privacy.html": {
    path: "/privacy", ogType: "website",
    desc: "Privacy Policy for RESHAM · Lucknow Silk — what we collect, why, and how your data is protected. No card data ever touches our servers.",
    jsonld: [WEBPAGE("Privacy Policy · RESHAM · Lucknow Silk", "Privacy policy of RESHAM · Lucknow Silk.", "/privacy")],
  },
  "terms.html": {
    path: "/terms", ogType: "website",
    desc: "Terms & Conditions for RESHAM · Lucknow Silk — orders, pricing, demonstration-store notice and the law that governs this storefront.",
    jsonld: [WEBPAGE("Terms & Conditions · RESHAM · Lucknow Silk", "Terms and conditions of RESHAM · Lucknow Silk.", "/terms")],
  },
  "refund.html": {
    path: "/refund", ogType: "website",
    desc: "Returns & Refunds policy for RESHAM · Lucknow Silk — 7-day returns, free reverse pickup, refund timelines in plain words.",
    jsonld: [WEBPAGE("Returns & Refunds · RESHAM · Lucknow Silk", "Return and refund policy of RESHAM · Lucknow Silk — 7-day window, free reverse pickup.", "/refund"), faqLD(FAQ_REFUND)],
  },
  "shipping.html": {
    path: "/shipping", ogType: "website",
    desc: "Shipping & Delivery for RESHAM · Lucknow Silk — dispatch in 24–48 hours, free above ₹9,999, COD across India, tracking on every parcel.",
    jsonld: [WEBPAGE("Shipping & Delivery · RESHAM · Lucknow Silk", "Shipping and delivery policy of RESHAM · Lucknow Silk.", "/shipping"), faqLD(FAQ_SHIPPING)],
  },
  // utility pages — crawlable site but kept out of search indexes
  "cart.html": { path: "/cart", noindex: true },
  "checkout.html": { path: "/checkout", noindex: true },
  "wishlist.html": { path: "/wishlist", noindex: true },
  "order-success.html": { path: "/order-success", noindex: true },
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
/* Cloudflare Pages serves root files extensionless (/privacy → privacy.html, 200);
   trailing-slash forms 308 — so canonicals pass through exactly. */
const url = (p) => SITE + p;

for (const [file, cfg] of Object.entries(PAGES)) {
  let html = readFileSync(file, "utf8");
  html = html.replace(/<!--SEO-BLOCK-->[\s\S]*?<!--\/SEO-BLOCK-->\n?/g, "");

  if (!/name="description"/.test(html) && cfg.desc) {
    html = html.replace(/<title>[^<]*<\/title>/, (m) => m + `\n<meta name="description" content="${esc(cfg.desc)}">`);
  }

  const lines = ["<!--SEO-BLOCK-->"];
  if (cfg.noindex) {
    lines.push(`<meta name="robots" content="noindex,follow">`);
  } else {
    lines.push(
      `<link rel="canonical" href="${url(cfg.path)}">`,
      `<meta name="robots" content="index,follow">`,
      `<meta property="og:site_name" content="${BRAND}">`,
      `<meta property="og:type" content="${cfg.ogType}">`,
      `<meta property="og:title" content="${esc(cfg.ogTitle || cfg.desc)}">`,
      `<meta property="og:description" content="${esc(cfg.desc)}">`,
      `<meta property="og:url" content="${url(cfg.path)}">`,
      `<meta property="og:image" content="${OG_IMG}">`,
      `<meta name="twitter:card" content="summary_large_image">`,
      `<meta name="twitter:title" content="${esc(cfg.ogTitle || cfg.desc)}">`,
      `<meta name="twitter:description" content="${esc(cfg.desc)}">`,
      `<meta name="twitter:image" content="${OG_IMG}">`
    );
  }
  lines.push(`<meta name="theme-color" content="#5c0e1a">`, `<link rel="manifest" href="/manifest.webmanifest">`);
  if (cfg.jsonld) lines.push(`<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": cfg.jsonld }, null, 1)}</script>`);
  lines.push(`<!--/SEO-BLOCK-->`);

  html = html.replace("</head>", lines.join("\n") + "\n</head>");
  writeFileSync(file, html);
  console.log("injected:", file, cfg.noindex ? "(noindex)" : "(canonical " + url(cfg.path) + ")");
}
console.log("done — " + Object.keys(PAGES).length + " root pages");
