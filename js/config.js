/* RESHAM — site configuration
   ------------------------------------------------------------------
   PAYMENT GATEWAY: paste your hosted payment-page link below
   (Razorpay Payment Pages / Cashfree / Stripe / Instamojo etc.).
   Checkout will redirect there with ?amount= and ?order= parameters
   once set. Until then, the built-in demo gateway (no real charge)
   is used.
   ------------------------------------------------------------------ */
window.RESHAM_CONFIG = {
  paymentGatewayUrl: "",
  demoCoupons: { RESHAM10: { type: "pct", value: 10, min: 0 }, FIRSTDRAPE: { type: "flat", value: 1500, min: 20000 } },
  shipping: { freeAbove: 9999, fee: 199 },
  support: {
    email: "care@digigrowsolutions.in",
    phone: "+91 522 400 1234",
    whatsapp: "+91 90000 12345",
    address: "RESHAM · 14, Hazratganj, Lucknow, Uttar Pradesh 226001",
  },
};
