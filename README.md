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

- Front-end code based on the open-source `nooram-replica` project by **NamelessMonsterr**.
- Concept inspired by the NOOLAM showcase ([alagappan567/noolam-saree-showcase](https://github.com/alagappan567/noolam-saree-showcase)).
- Rebranded for Lucknow, deployed and maintained by **Digigrow Solution** · digigrowsolutions.in

---

© 2026 Digigrow Solution, Lucknow. RESHAM is a demo brand — cart is demo state only, no checkout backend.
