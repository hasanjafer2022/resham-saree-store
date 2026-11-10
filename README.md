# RESHAM — Lucknow Silk Saree Store

**by [Digigrow Solution](https://digigrowsolutions.in) · Lucknow**

A premium, fully interactive silk-saree e-commerce experience inspired by the
nawabi heritage of Lucknow: depth-of-field product rail, tilt cards, a real-time
3D fabric braid builder, story viewer and a working demo bag — built with vanilla
HTML/CSS/JS, GSAP and Three.js. No build step required.

🔗 **Live demo:** https://resham-saree-store.pages.dev

## Highlights

- Full storefront: home, product pages, cart, wishlist, checkout and order confirmation
- Product pages with image zoom (hover lens + fullscreen), colour/size variants, pincode delivery check, related products
- Persistent bag & wishlist (localStorage — survives page reloads across the whole site)
- Checkout with address form, demo payment gateway (UPI/card sheet), COD, and coupon codes (`RESHAM10`, `FIRSTDRAPE`)
- Payment-gateway integration point in `js/config.js` — paste a hosted gateway link to redirect real payments
- Privacy policy, terms, returns & refunds, shipping & delivery, contact pages
- Depth-of-field saree rack carousel (blur/focus rails, arrows + drag)
- Tilt/fan product cards (silk deck + bridal fan, quick-add with bag count)
- 3D fabric braid builder (Three.js): pick 3 silks, strands braid live, add to bag
- Story viewer (progress segments, auto-advance, pause on hold)
- Hotspots on the muse film, marquee/ticker, look selector, bag drawer
- Fully responsive (desktop + mobile), `prefers-reduced-motion` honored

## SEO · AEO · GEO

Production-ready discovery layer, no design impact:

- **Crawlable product pages** — one static page per product under `/products/<sku>/`
  (50 pages), each with unique title, meta description, canonical URL, Open Graph +
  Twitter cards and prefilled content that renders even before JavaScript runs.
- **Category landing pages** — `/collections/` hub plus seven collection pages
  (silk sarees, zari & brocade, checked sarees, half sarees, blouses, jewellery,
  bridal), each with statically prefilled product cards (crawlable internal links),
  `CollectionPage` + `ItemList` structured data, and cross-links between collections.
- **Shop mega-menu** — the nav pill has a Shop dropdown listing every collection with
  live product counts (tap-friendly on mobile); the footer Shop column links the
  same pages, so home → collection → product → related product links in a continuous
  crawlable loop.
- **Structured data (JSON-LD)** — `OnlineStore` + `WebSite` + `Organization` on home;
  `Product` + `Offer` (price, INR, shipping, 7-day return policy) + `AggregateRating`
  + `BreadcrumbList` + `FAQPage` on every product page; `ContactPage`,
  `FAQPage` and breadcrumb-aware `WebPage` on policy pages.
- **Robots & sitemap** — `robots.txt` (search + AI crawlers explicitly allowed, utility
  pages disallowed) and a generated `sitemap.xml` with all 56 indexable URLs.
- **AEO / GEO** — visible FAQ sections with matching `FAQPage` schema on the returns
  and shipping pages, `llms.txt` for answer/generative engines, and honest
  machine-readable policy summaries.
- **Production hardening** — custom `404.html` (Cloudflare Pages serves it for any
  missing route), security headers via `_headers` (nosniff, DENY framing, referrer
  policy, permissions policy), long-cache rules for assets, `manifest.webmanifest`
  and a 1200×630 social share image (`assets/og-cover.jpg`).

### Regenerating product pages & sitemap

The static pages and sitemap are derived from `js/products.js` (the single source of
truth). After editing the catalogue:

```bash
node tools/generate-product-pages.mjs   # rebuilds /products/<sku>/ + sitemap.xml
node tools/seo-inject.mjs               # re-applies head metadata to root pages (idempotent)
```

## Run locally

No build step. Serve the folder over HTTP (needed for the Three.js module):

```bash
python3 -m http.server 4000
# open http://localhost:4000
```

## Stack

Vanilla HTML/CSS/JS, GSAP 3 + ScrollTrigger, Three.js 0.160 (vendored in `/vendor` — works offline).
All imagery in `/assets` is original AI-generated artwork.

## Credits

- Designed, built and maintained by **Digigrow Solution** · [digigrowsolutions.in](https://digigrowsolutions.in)

---

© 2026 Digigrow Solution, Lucknow. RESHAM is a demo brand — cart is demo state only, no checkout backend.
