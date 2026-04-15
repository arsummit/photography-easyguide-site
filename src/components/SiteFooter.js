export default function SiteFooter() {
  const quickLinks = [
    { label: "Digital Delivery Policy", href: "/digital-delivery-policy" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
  ];

  const payments = [
    "/images/payments/amex.svg",
    "/images/payments/applepay.svg",
    "/images/payments/googlepay.svg",
    "/images/payments/maestro.svg",
    "/images/payments/mastercard.svg",
    "/images/payments/paypal.svg",
    "/images/payments/shop.svg",
    "/images/payments/unionpay.svg",
    "/images/payments/visa.svg",
  ];

  return (
    <footer className="bg-[#111] py-16">
      <div className="mx-auto max-w-[1320px] px-[24px]">
        <div className="grid gap-10 md:grid-cols-[auto_1fr_1fr_1fr] md:gap-16">

          <div className="flex items-start">
            <img src="/images/logo.png" alt="Photography Easy Guide" className="h-[80px] w-auto object-contain brightness-0 invert" />
          </div>

          <div>
            <h2 className="text-[20px] font-extrabold text-white">Contact Info</h2>
            <p className="mt-5 flex items-center gap-2 text-[15px] text-white">
              <span>📧</span> photography@easyguide.store
            </p>
            <p className="mt-4 flex items-start gap-2 text-[14px] leading-[1.6] text-white">
              <span className="mt-[2px]">🌐</span>
              <span>All products are digital downloads, delivered instantly via email</span>
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-extrabold text-white">Quick links</h2>
            <ul className="mt-5 space-y-3 text-[14px]">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-white no-underline hover:underline">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[20px] font-extrabold text-white">Subscribe to our emails</h2>
            <p className="mt-5 text-[14px] leading-[1.6] text-white">
              Join our email list for exclusive offers and the latest news.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <input
                className="w-full rounded-[6px] border border-white bg-transparent px-4 py-3 text-[14px] text-white placeholder-white/70 outline-none"
                placeholder="Email"
              />
              <button className="w-full rounded-[6px] bg-white py-3 text-[14px] font-bold text-[#111]">Sign up</button>
            </div>
          </div>

        </div>

        <div className="mt-12 border-t border-white/20 pt-8 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {payments.map((src, i) => (
              <img key={i} src={src} alt="payment" className="h-[28px] w-auto object-contain" />
            ))}
          </div>
          <p className="mt-4 text-[12px] text-white/70">© 2026, Photography Easy Guide</p>
        </div>
      </div>
    </footer>
  );
}
