/* RESHAM — product catalogue (single source of truth for all pages) */
(function () {
  "use strict";

  const SIZE_SETS = {
    saree: ["Unstitched blouse piece", "34", "36", "38", "40", "42"],
    blouse: ["34", "36", "38", "40", "42"],
    one: ["One Size"],
    bangle: ["2.4", "2.6", "2.8"],
  };

  const FABRIC_NOTES = {
    "Lucknawi silk": "Pure mulberry silk on handlooms of Lucknow, silver-core zari borders, 6.3 m with 0.8 m blouse piece.",
    "Banarasi katan": "Katan silk with kadhua zari brocade woven on Banaras pit-looms, 5.9 m with blouse piece.",
    "Cotton silk": "Silk-cotton blend that breathes with the weather, crisp pleats, temple-thread border.",
    "Kora organza": "Featherweight kora silk with a hand-rolled gold edge, wears like morning air.",
    "Chiffon": "Silk chiffon, 5.5 m, falls close and moves like water.",
    "Raw silk": "Textured raw silk, structured yoke, lined bodice, concealed side hooks.",
    "Tissue silk": "Tissue silk with foil zari, light as a coin, bright as one.",
    "Paithani silk": "Paithani weave with tapestry pallu, two extra weft shuttles per row.",
    "Bandhani silk": "Hand-tied bandhani on silk, dot by dot, over three weeks of work.",
    "Soft silk": "Lightweight soft silk with woven gold zari border, pleats that stay sharp.",
    "Temple jewellery": "Gold-plated brass with kemp stones, closed-back setting, nickel-free alloy.",
    "Silver jewellery": "92.5 sterling silver with gold vermeil and pearl drops.",
    "Gold-plated": "Copper-base, 1 micron gold plating, lacquer sealed against tarnish.",
    "Gajra": "Fresh-look silk jasmine, hand-strung on cotton cord, keeps for years.",
  };

  const GALLERY_XTRA = {
    pink: ["assets/tex-temple.jpg", "assets/drape-pink.jpg"],
    red: ["assets/tex-temple.jpg", "assets/drape-temple.jpg", "assets/drape-film.jpg"],
    gold: ["assets/tex-gold.jpg", "assets/drape-court.jpg"],
    green: ["assets/tex-peacock.jpg", "assets/drape-temple.jpg"],
    blue: ["assets/tex-peacock.jpg", "assets/drape-court.jpg"],
    purple: ["assets/tex-maroon.jpg", "assets/drape-maroon.jpg"],
    maroon: ["assets/tex-maroon.jpg", "assets/drape-maroon.jpg"],
    black: ["assets/tex-gold.jpg", "assets/drape-film.jpg"],
    ivory: ["assets/tex-ivory.jpg", "assets/drape-court.jpg"],
    mustard: ["assets/tex-checks.jpg", "assets/reel-lanes.jpg"],
    coral: ["assets/tex-checks.jpg", "assets/drape-pink.jpg"],
    jewellery: ["assets/tex-gold.jpg", "assets/drape-temple.jpg"],
  };

  /* sku, name, price, mrp, cat, type, fabric, tone(gallery key), colors, img, desc, rating, reviews, badge? */
  const P = [
    /* ---- silk sarees (the rack) ---- */
    { sku: "RSW-SWARNA", name: "Swarna Lucknawi Silk", price: 16800, mrp: 21900, cat: ["Silk Sarees", "Zari & Brocade"], type: "saree", fabric: "Lucknawi silk", tone: "gold", colors: [["Sunbeam Gold", "#e3ac00"], ["Ivory", "#f2e8d5"]], img: "assets/rack-gold.webp", desc: "A gold that behaves like lamplight — quiet on the loom, loud in a room.", rating: 4.6, reviews: 184 },
    { sku: "RSW-RANI", name: "Resham Rani Pink Temple Border", price: 28400, mrp: 35900, cat: ["Silk Sarees", "Zari & Brocade"], type: "saree", fabric: "Lucknawi silk", tone: "pink", colors: [["Rani Pink", "#d81b60"], ["Ivory", "#f2e8d5"]], img: "assets/rack-pink.webp", desc: "Rani pink with a temple-border pallu; our most gifted saree three seasons running.", rating: 4.9, reviews: 342, badge: "Bestseller" },
    { sku: "RSW-KOORAI", name: "Koorai Madras Checks", price: 18600, mrp: 23400, cat: ["Checked Sarees"], type: "saree", fabric: "Cotton silk", tone: "red", colors: [["Vermilion Check", "#c9202e"], ["Mustard Check", "#d99a1b"]], img: "assets/rack-check.webp", desc: "The checked saree of wedding mornings — crisp, breathing, never out of place.", rating: 4.5, reviews: 221 },
    { sku: "RSW-PEACOCK", name: "Peacock Pattu", price: 31200, mrp: 38900, cat: ["Silk Sarees"], type: "saree", fabric: "Soft silk", tone: "blue", colors: [["Peacock", "#0e7a72"], ["Midnight", "#1c2a4a"]], img: "assets/rack-peacock.webp", desc: "Peacock blue shot with green — the colour a lake keeps at noon.", rating: 4.7, reviews: 156 },
    { sku: "RSW-VAIRA", name: "Vaira Oosi Purple", price: 26400, mrp: 33900, cat: ["Silk Sarees", "Zari & Brocade"], type: "saree", fabric: "Lucknawi silk", tone: "purple", colors: [["Aubergine", "#4a2a5e"], ["Plum", "#7b3f6a"]], img: "assets/rack-purple.webp", desc: "Deep purple with a diamond-point zari border, named for the vaira oosi stitch of light.", rating: 4.6, reviews: 129 },
    { sku: "RSW-MANJAL", name: "Manjal Half Saree", price: 14200, mrp: 18900, cat: ["Half Sarees"], type: "saree", fabric: "Cotton silk", tone: "mustard", colors: [["Turmeric", "#d99a1b"], ["Ivory", "#f2e8d5"]], img: "assets/rack-mustard.webp", desc: "Turmeric and ivory, the first drape a girl borrows from her mother's trunk.", rating: 4.4, reviews: 98 },
    { sku: "RSW-PONNI", name: "Ponni Temple Border", price: 22300, mrp: 28900, cat: ["Silk Sarees"], type: "saree", fabric: "Soft silk", tone: "green", colors: [["Paddy Green", "#3d7a3f"], ["Deep Teal", "#0e5e5a"]], img: "assets/rack-gold.webp", hue: 155, desc: "Field-green silk with a running temple border, made for long verandas.", rating: 4.5, reviews: 112 },
    { sku: "RSW-MAYIL", name: "Mayil Paithani", price: 24900, mrp: 31900, cat: ["Silk Sarees"], type: "saree", fabric: "Paithani silk", tone: "blue", colors: [["Peacock", "#0e7a72"], ["Rani Pink", "#d81b60"]], img: "assets/rack-peacock.webp", hue: 190, desc: "Paithani pallu with mayil (peacock) tapestry, two shuttles walking every row.", rating: 4.8, reviews: 167, badge: "Heirloom" },
    { sku: "RSW-KUMKUM", name: "Kumkum Bridal Brocade", price: 52000, mrp: 64900, cat: ["Zari & Brocade"], type: "saree", fabric: "Lucknawi silk", tone: "pink", colors: [["Kumkum Pink", "#b71c4c"], ["Scarlet", "#a81824"]], img: "assets/rack-pink.webp", hue: -35, desc: "All-over brocade for the day the house fills with music; six weeks on the loom.", rating: 4.9, reviews: 87, badge: "Bridal" },
    { sku: "RSW-SINDOOR-PAITHANI", name: "Sindoor Paithani", price: 38700, mrp: 48900, cat: ["Silk Sarees"], type: "saree", fabric: "Paithani silk", tone: "purple", colors: [["Sindoor Purple", "#6a2440"], ["Peacock Pallu", "#0e7a72"]], img: "assets/rack-purple.webp", desc: "Paithani with a sindoor-purple body and a peacock pallu — ceremony-grade.", rating: 4.7, reviews: 73, badge: "Heirloom" },
    { sku: "RSW-COCOA", name: "Cocoa Chiffon Drape", price: 18600, mrp: 23400, cat: ["Checked Sarees"], type: "saree", fabric: "Chiffon", tone: "mustard", colors: [["Cocoa", "#5a4634"], ["Sand", "#c9b28f"]], img: "assets/rack-mustard.webp", hue: 45, desc: "Soft cocoa chiffon that drapes itself — the one you pack when you travel light.", rating: 4.3, reviews: 76 },

    /* ---- pick-a-silk cards ---- */
    { sku: "RSW-PALACE", name: "Palace Check Silk", price: 19900, mrp: 25600, cat: ["Checked Sarees"], type: "saree", fabric: "Cotton silk", tone: "red", colors: [["Vermilion", "#c9202e"], ["Rani Pink", "#d81b60"]], img: "assets/look-red.jpg", desc: "Palace-gate checks in a silk that presses flat and stays crisp all day.", rating: 4.5, reviews: 143 },
    { sku: "RSW-MURSHID", name: "Murshidabad Maroon Silk", price: 27200, mrp: 34900, cat: ["Silk Sarees"], type: "saree", fabric: "Lucknawi silk", tone: "maroon", colors: [["Deep Maroon", "#7a1424"], ["Wine", "#4e1220"]], img: "assets/look-purple.jpg", desc: "River-silk maroon from the old weaving quarter, thin as a whisper, strong as a vow.", rating: 4.7, reviews: 118 },
    { sku: "RSW-MONSOON", name: "Monsoon Silk", price: 22900, mrp: 29400, cat: ["Silk Sarees"], type: "saree", fabric: "Soft silk", tone: "blue", colors: [["Rain Blue", "#2e9bde"], ["Slate", "#46586a"]], img: "assets/look-ivory.jpg", desc: "The exact blue of the first rain on hot stone.", rating: 4.4, reviews: 95 },
    { sku: "RSW-SINDOOR", name: "Sindoor Silk", price: 26500, mrp: 33900, cat: ["Silk Sarees"], type: "saree", fabric: "Lucknawi silk", tone: "red", colors: [["Sindoor", "#e0491f"], ["Coral", "#e8734a"]], img: "assets/look-coral.jpg", desc: "First-light orange, worn to weddings before sunrise.", rating: 4.6, reviews: 134 },
    { sku: "RSW-MAGENTA", name: "Magenta Shot Silk", price: 29800, mrp: 37900, cat: ["Silk Sarees", "Zari & Brocade"], type: "saree", fabric: "Tissue silk", tone: "purple", colors: [["Magenta", "#a12568"], ["Violet Shot", "#7b3fd4"]], img: "assets/look-purple.jpg", desc: "Two colours warp and weft — magenta by day, violet when the lamps come on.", rating: 4.7, reviews: 108 },
    { sku: "RSW-BENARES", name: "Benares Gold", price: 41800, mrp: 52900, cat: ["Zari & Brocade"], type: "saree", fabric: "Banarasi katan", tone: "gold", colors: [["Lamp Gold", "#e3ac00"], ["Antique Zari", "#b98a1e"]], img: "assets/look-red.jpg", desc: "Katan silk washed in gold zari — an heirloom priced honestly, woven slowly.", rating: 4.9, reviews: 76, badge: "Heirloom" },

    /* ---- muse reels ---- */
    { sku: "RSW-MANJAL-KATTAM", name: "Manjal Kattam Cotton Silk", price: 18900, mrp: 24600, cat: ["Checked Sarees"], type: "saree", fabric: "Cotton silk", tone: "mustard", colors: [["Turmeric Check", "#d99a1b"]], img: "assets/reel-lanes.jpg", desc: "Turmeric-yellow checks that remember every street they have walked.", rating: 4.5, reviews: 152 },
    { sku: "RSW-KADAL", name: "Kadal Sunrise Kora Silk", price: 21400, mrp: 27900, cat: ["Silk Sarees"], type: "saree", fabric: "Kora organza", tone: "ivory", colors: [["Sea-breeze Gold", "#d9b26a"]], img: "assets/reel-marina.jpg", desc: "Sea-breeze yellow with a dawn-gold border, weightless as the hour.", rating: 4.6, reviews: 88 },
    { sku: "RSW-KAALI", name: "Kaali Banarasi Katan", price: 36400, mrp: 45900, cat: ["Silk Sarees", "Zari & Brocade"], type: "saree", fabric: "Banarasi katan", tone: "black", colors: [["Night Black", "#181214"], ["Charcoal Zari", "#3a3238"]], img: "assets/reel-studio.jpg", desc: "Night-black silk, a broad gold kadhua border, worn like armour.", rating: 4.8, reviews: 121, badge: "Bestseller" },
    { sku: "RSW-DEEPAM", name: "Deepam Pachai", price: 26800, mrp: 33900, cat: ["Silk Sarees"], type: "saree", fabric: "Soft silk", tone: "green", colors: [["Lamp Green", "#2e5e3a"]], img: "assets/reel-lamp.jpg", desc: "Lamp-green silk that holds a flame's warmth long after dusk.", rating: 4.6, reviews: 94 },
    { sku: "RSW-MULLAI", name: "Mullai Pachai", price: 19600, mrp: 25600, cat: ["Silk Sarees"], type: "saree", fabric: "Soft silk", tone: "green", colors: [["Jasmine Green", "#5e8a5a"], ["Pearl Edge", "#e8e0d0"]], img: "assets/reel-pachai.jpg", desc: "Jasmine green with a pearl-white edge, cool as a shaded court.", rating: 4.4, reviews: 83 },

    /* ---- bridal ---- */
    { sku: "RSW-SINDOOR-VOW", name: "Sindoor Pattu Vow", price: 48900, mrp: 59900, cat: ["Bridal"], type: "saree", fabric: "Lucknawi silk", tone: "red", colors: [["Sindoor Red", "#c9202e"], ["Bridal Crimson", "#a81824"]], img: "assets/bridal-1.jpg", desc: "The vows saree — crimson pattu with a pallu heavy enough to remember the day.", rating: 4.9, reviews: 64, badge: "Bridal" },
    { sku: "RSW-BANDHEJ", name: "Bandhej Sangeet Silk", price: 42500, mrp: 52900, cat: ["Bridal"], type: "saree", fabric: "Bandhani silk", tone: "pink", colors: [["Bandhani Pink", "#d81b60"], ["Marigold", "#e8a020"]], img: "assets/bridal-2.jpg", desc: "Hand-tied bandhani for the night of songs — dot by dot, three weeks of tying.", rating: 4.7, reviews: 52 },
    { sku: "RSW-ROSE-MUHURTHAM", name: "Rose Muhurtham", price: 51200, mrp: 63900, cat: ["Bridal"], type: "saree", fabric: "Lucknawi silk", tone: "pink", colors: [["Rose Blush", "#c76a8a"], ["Deep Rose", "#a84460"]], img: "assets/bridal-3.jpg", desc: "Muhurtham rose with a gold zari border — for the hour the priest marks on the calendar.", rating: 4.8, reviews: 47, badge: "Bridal" },
    { sku: "RSW-TEMPLE-EMERALD", name: "Temple Emerald Vow", price: 46800, mrp: 58900, cat: ["Bridal"], type: "saree", fabric: "Banarasi katan", tone: "green", colors: [["Emerald", "#1e5e44"], ["Forest", "#14382a"]], img: "assets/bridal-4.jpg", desc: "Emerald katan with temple-motif zari; pairs with gold the way vows pair with promises.", rating: 4.8, reviews: 55 },
    { sku: "RSW-KUMKUM-KALYANAM", name: "Kumkum Kalyanam", price: 55600, mrp: 68900, cat: ["Bridal", "Zari & Brocade"], type: "saree", fabric: "Lucknawi silk", tone: "red", colors: [["Kumkum Red", "#b71c4c"]], img: "assets/look-red.jpg", desc: "Our heaviest bridal brocade — worn once, kept for a generation.", rating: 4.9, reviews: 41, badge: "Heirloom" },

    /* ---- blouses ---- */
    { sku: "RSW-EMERALD-BLOUSE", name: "Emerald Zari Blouse", price: 5200, mrp: 6900, cat: ["Full-Sleeve Blouses"], type: "blouse", fabric: "Raw silk", tone: "green", colors: [["Emerald", "#1e5e44"], ["Bottle Green", "#14382a"]], img: "assets/rack-blouse-green.webp", desc: "Full-sleeve raw silk with zari cuffs; makes any plain saree look planned.", rating: 4.6, reviews: 208 },
    { sku: "RSW-SINDOOR-BLOUSE", name: "Sindoor Silk Blouse", price: 4800, mrp: 6400, cat: ["Half-Sleeve Blouses"], type: "blouse", fabric: "Raw silk", tone: "red", colors: [["Sindoor", "#e0491f"], ["Maroon", "#7a1424"]], img: "assets/rack-blouse-red.webp", desc: "The half-sleeve red every trunk should hold — deep back, gold piping.", rating: 4.5, reviews: 243 },
    { sku: "RSW-DUSTY-ROSE", name: "Dusty Rose Silk Blouse", price: 4850, mrp: 6400, cat: ["Half-Sleeve Blouses"], type: "blouse", fabric: "Raw silk", tone: "pink", colors: [["Dusty Rose", "#c48a9a"]], img: "assets/look-coral.jpg", desc: "Muted rose silk that lets the saree speak first.", rating: 4.4, reviews: 131 },
    { sku: "RSW-MIDNIGHT-BLOUSE", name: "Midnight Navy Blouse", price: 5200, mrp: 6900, cat: ["Half-Sleeve Blouses"], type: "blouse", fabric: "Raw silk", tone: "blue", colors: [["Midnight Navy", "#1c2a4a"]], img: "assets/look-purple.jpg", desc: "Navy against rani pink — the pairing stylists keep reaching for.", rating: 4.5, reviews: 117 },
    { sku: "RSW-CORAL-BLOUSE", name: "Coral Raw Silk Blouse", price: 4400, mrp: 5900, cat: ["Half-Sleeve Blouses"], type: "blouse", fabric: "Raw silk", tone: "coral", colors: [["Coral", "#e8734a"]], img: "assets/look-coral.jpg", desc: "Bright coral raw silk, princess-cut, sits like it was stitched on you.", rating: 4.3, reviews: 102 },
    { sku: "RSW-IVORY-BLOUSE", name: "Ivory Silk Blouse", price: 4100, mrp: 5500, cat: ["Full-Sleeve Blouses"], type: "blouse", fabric: "Raw silk", tone: "ivory", colors: [["Ivory", "#f2e8d5"], ["Oyster", "#d8ccb8"]], img: "assets/look-ivory.jpg", desc: "Clean ivory with pearl buttons — the quiet half of loud sarees.", rating: 4.4, reviews: 149 },
    { sku: "RSW-KADHUA-BLOUSE", name: "Kadhua Border Blouse", price: 5400, mrp: 7100, cat: ["Half-Sleeve Blouses"], type: "blouse", fabric: "Banarasi katan", tone: "red", colors: [["Maroon Zari", "#7a1424"]], img: "assets/look-red.jpg", desc: "Banarasi katan with a real kadhua border along the sleeve.", rating: 4.6, reviews: 88 },
    { sku: "RSW-TURMERIC-BLOUSE", name: "Turmeric Cotton Blouse", price: 3900, mrp: 5200, cat: ["Half-Sleeve Blouses"], type: "blouse", fabric: "Cotton silk", tone: "mustard", colors: [["Turmeric", "#d99a1b"]], img: "assets/look-coral.jpg", desc: "Cotton-silk in turmeric yellow; breathes through long ceremonies.", rating: 4.2, reviews: 96 },
    { sku: "RSW-DAWN-BLOUSE", name: "Dawn-Gold Blouse", price: 4100, mrp: 5500, cat: ["Half-Sleeve Blouses"], type: "blouse", fabric: "Raw silk", tone: "gold", colors: [["Dawn Gold", "#d9b26a"]], img: "assets/look-ivory.jpg", desc: "A gold so pale it reads ivory indoors and sunrise outside.", rating: 4.3, reviews: 74 },

    /* ---- jewellery & accessories ---- */
    { sku: "RSW-TEMPLE-CHOKER", name: "Pink Stone Temple Choker", price: 9450, mrp: 12900, cat: ["Jewellery"], type: "one", fabric: "Temple jewellery", tone: "jewellery", colors: [["Kemp Pink", "#c4485e"], ["Ruby Kemp", "#a81824"]], img: "assets/look-red.jpg", desc: "Temple-arch choker with kemp stones, adjustable silk dori.", rating: 4.7, reviews: 167 },
    { sku: "RSW-JHUMKA-PEARL", name: "Jhumkas with Pearl Drops", price: 3800, mrp: 5200, cat: ["Jewellery"], type: "one", fabric: "Silver jewellery", tone: "jewellery", colors: [["Gold Vermeil", "#d9b26a"]], img: "assets/look-purple.jpg", desc: "Silver-core jhumkas with fresh-water pearl drops; light enough for all-day wear.", rating: 4.6, reviews: 224 },
    { sku: "RSW-OTTIYANAM", name: "Elephant Motif Ottiyanam", price: 10650, mrp: 13900, cat: ["Jewellery"], type: "bangle", fabric: "Gold-plated", tone: "jewellery", colors: [["Temple Gold", "#d9b26a"]], img: "assets/look-teal.jpg", desc: "Waist belt with a marching elephant border — the classic kamarbandh.", rating: 4.5, reviews: 89 },
    { sku: "RSW-BANGLES", name: "Gold & Dusty Rose Bangles", price: 10300, mrp: 13900, cat: ["Jewellery"], type: "bangle", fabric: "Gold-plated", tone: "jewellery", colors: [["Gold + Rose", "#d9a08a"]], img: "assets/look-red.jpg", desc: "A six-piece stack in gold and dusty rose, sized by wrist not by luck.", rating: 4.4, reviews: 132 },
    { sku: "RSW-LAKSHMI-HARAM", name: "Temple Lakshmi Haram", price: 12800, mrp: 16900, cat: ["Jewellery"], type: "one", fabric: "Temple jewellery", tone: "jewellery", colors: [["Kemp Gold", "#d9b26a"]], img: "assets/look-red.jpg", desc: "Long haram with Lakshmi medallions, worn solo or under a choker.", rating: 4.8, reviews: 98 },
    { sku: "RSW-RUBY-JHUMKA", name: "Ruby Jhumkas", price: 4600, mrp: 6200, cat: ["Jewellery"], type: "one", fabric: "Temple jewellery", tone: "jewellery", colors: [["Ruby Kemp", "#a81824"]], img: "assets/look-red.jpg", desc: "Deep-red stone jhumkas that catch every lamp in the room.", rating: 4.5, reviews: 141 },
    { sku: "RSW-CORAL-CHOKER", name: "Coral and Pearl Choker", price: 8900, mrp: 11900, cat: ["Jewellery"], type: "one", fabric: "Silver jewellery", tone: "jewellery", colors: [["Coral", "#e8734a"], ["Pearl White", "#efe6d8"]], img: "assets/look-red.jpg", desc: "Coral beads strung with pearls — sits flat on the collarbone.", rating: 4.4, reviews: 106 },
    { sku: "RSW-WAIST-CORD", name: "Gold Waist Cord", price: 7400, mrp: 9900, cat: ["Jewellery"], type: "one", fabric: "Gold-plated", tone: "jewellery", colors: [["Antique Gold", "#b98a1e"]], img: "assets/look-ivory.jpg", desc: "Braided waist cord with a plain gold clasp; holds pleats without pinching.", rating: 4.3, reviews: 67 },
    { sku: "RSW-KUNDAN", name: "Kundan Pendant Set", price: 11500, mrp: 15400, cat: ["Jewellery"], type: "one", fabric: "Temple jewellery", tone: "jewellery", colors: [["Kundan White", "#e8e0d0"]], img: "assets/look-red.jpg", desc: "Uncut-look kundan pendant with matching studs, velvet pouch included.", rating: 4.6, reviews: 113 },
    { sku: "RSW-TEMPLE-SET", name: "Full Temple Bridal Set", price: 21400, mrp: 27900, cat: ["Jewellery", "Bridal"], type: "one", fabric: "Temple jewellery", tone: "jewellery", colors: [["Kemp Gold", "#d9b26a"]], img: "assets/look-ivory.jpg", desc: "Choker, long haram, jhumkas and maang tikka — the whole muhurtham set.", rating: 4.9, reviews: 58, badge: "Bridal" },
    { sku: "RSW-VENI", name: "Jasmine Veni", price: 1200, mrp: 1800, cat: ["Jewellery"], type: "one", fabric: "Gajra", tone: "ivory", colors: [["Jasmine White", "#efe6d8"]], img: "assets/look-ivory.jpg", desc: "Silk jasmine veni for the braid — keeps its scent-memory for years.", rating: 4.2, reviews: 189 },
    { sku: "RSW-TEMPLE-JHUMKA", name: "Temple Jhumkas", price: 4200, mrp: 5600, cat: ["Jewellery"], type: "one", fabric: "Gold-plated", tone: "jewellery", colors: [["Antique Gold", "#b98a1e"]], img: "assets/look-red.jpg", desc: "Small temple-dome jhumkas — the everyday pair that goes with everything.", rating: 4.5, reviews: 198 },
    { sku: "RSW-PEARL-DROPS", name: "Pearl Drops", price: 3600, mrp: 4900, cat: ["Jewellery"], type: "one", fabric: "Silver jewellery", tone: "jewellery", colors: [["Pearl White", "#efe6d8"]], img: "assets/look-purple.jpg", desc: "Single-pearl drops on gold vermeil hooks; barely-there, always right.", rating: 4.4, reviews: 156 },
    { sku: "RSW-GOLD-CHOKER", name: "Gold Temple Choker", price: 11200, mrp: 14900, cat: ["Jewellery"], type: "one", fabric: "Temple jewellery", tone: "jewellery", colors: [["Temple Gold", "#d9b26a"]], img: "assets/look-coral.jpg", desc: "Broad gold choker with repoussé work — the groom's-family favourite.", rating: 4.7, reviews: 84 },
  ];

  const CLOTH = (p) => [
    p.type === "saree" ? (FABRIC_NOTES[p.fabric] || "") + " Width 47\"; dry-clean only; store folded in muslin, refold along a new line every few months." : "",
    p.type === "blouse" ? FABRIC_NOTES[p.fabric] + " Lined bodice, concealed side hooks, margin for one size alteration (±1\"). Dry-clean only." : "",
    p.type !== "saree" && p.type !== "blouse" ? FABRIC_NOTES[p.fabric] + " comes in a velvet keepsake pouch with a soft polishing cloth." : "",
  ].filter(Boolean)[0] || "Handcrafted in Lucknow.";

  function gallery(p) {
    const extra = GALLERY_XTRA[p.tone] || GALLERY_XTRA[p.type === "blouse" ? "coral" : p.type === "saree" ? "gold" : "jewellery"];
    return [p.img].concat(extra).slice(0, 4);
  }

  const products = P.map((p) => ({
    ...p,
    sizes: SIZE_SETS[p.type],
    colors: p.colors.map((c) => (Array.isArray(c) ? { name: c[0], hex: c[1] } : { name: c, hex: "#d9b26a" })),
    gallery: gallery(p),
    cloth: CLOTH(p),
    href: "products/" + p.sku.toLowerCase() + "/",
  }));

  const bySku = (sku) => products.find((p) => p.sku === sku);
  const byName = (name) => {
    if (!name) return undefined;
    const q = String(name).toLowerCase();
    const exact = products.find((p) => p.name.toLowerCase() === q);
    if (exact) return exact;
    const partial = products.filter((p) => p.name.toLowerCase().includes(q) || q.includes(p.name.toLowerCase()));
    if (partial.length) return partial.sort((a, b) => a.name.length - b.name.length)[0];
    return products.find((p) => p.name.toLowerCase().startsWith(q.split(/[\s,]+/)[0]));
  };
  const related = (p, n = 4) => {
    const same = products.filter((x) => x.sku !== p.sku && x.cat.some((c) => p.cat.includes(c)));
    const rest = products.filter((x) => x.sku !== p.sku && !same.includes(x));
    return same.concat(rest).slice(0, n);
  };

  window.RESHAM_PRODUCTS = products;
  window.reshamBySku = bySku;
  window.reshamByName = byName;
  window.reshamRelated = related;
})();
