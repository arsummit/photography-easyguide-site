import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = { title: "Refund Policy — Photography Easy Guide" };

export default function RefundPolicy() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-white px-6 py-16 text-[#222]">
        <div className="mx-auto max-w-[720px]">
          <h1 className="text-[32px] font-extrabold text-[#111]">Refund Policy</h1>
          <p className="mt-2 text-[14px] text-[#888]">Last updated: April 2026</p>

          <p className="mt-8 text-[16px] leading-[1.8] text-[#444]">
            Thank you for purchasing from <strong>Photography Easy Guide</strong>. Because our products are
            digital downloads delivered immediately upon purchase, we generally do not offer refunds.
            However, we are committed to your satisfaction and will work with you on a case-by-case basis.
          </p>

          <h2 className="mt-10 text-[20px] font-bold text-[#111]">Digital Products</h2>
          <p className="mt-3 text-[16px] leading-[1.8] text-[#444]">
            All products sold on this site are digital (PDF guides and downloadable files). Due to
            the nature of digital goods, <strong>all sales are final</strong> once the download
            links have been delivered to your email.
          </p>

          <h2 className="mt-8 text-[20px] font-bold text-[#111]">Exceptions</h2>
          <p className="mt-3 text-[16px] leading-[1.8] text-[#444]">We will issue a full refund in the following situations:</p>
          <ul className="mt-3 list-disc pl-6 text-[16px] leading-[1.8] text-[#444]">
            <li>You were charged but did not receive a download link within 24 hours.</li>
            <li>You were charged more than once for the same order.</li>
            <li>The product file is corrupted or inaccessible and we are unable to fix it.</li>
          </ul>

          <h2 className="mt-8 text-[20px] font-bold text-[#111]">How to Request a Refund</h2>
          <p className="mt-3 text-[16px] leading-[1.8] text-[#444]">
            Email us at{" "}
            <a href="mailto:photography@easyguide.store" className="text-[#eda3ac] underline">photography@easyguide.store</a>{" "}
            within <strong>7 days</strong> of your purchase. Please include your order email and a
            brief description of the issue. We will respond within 2 business days.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
