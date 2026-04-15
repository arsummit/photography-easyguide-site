import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = { title: "Terms of Service — Photography Easy Guide" };

export default function TermsOfService() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-white px-6 py-16 text-[#222]">
        <div className="mx-auto max-w-[720px]">
          <h1 className="text-[32px] font-extrabold text-[#111]">Terms of Service</h1>
          <p className="mt-2 text-[14px] text-[#888]">Last updated: April 2026</p>

          <p className="mt-8 text-[16px] leading-[1.8] text-[#444]">
            By accessing or purchasing from <strong>photography.easyguide.store</strong>, you agree to
            these Terms of Service. Please read them carefully.
          </p>

          <h2 className="mt-10 text-[20px] font-bold text-[#111]">1. Digital Products</h2>
          <p className="mt-3 text-[16px] leading-[1.8] text-[#444]">
            All products sold on this site are digital downloads (PDF files and guides). Upon
            successful payment, you will receive a download link via email. You are purchasing a
            personal, non-transferable license to use the materials.
          </p>

          <h2 className="mt-8 text-[20px] font-bold text-[#111]">2. License &amp; Permitted Use</h2>
          <p className="mt-3 text-[16px] leading-[1.8] text-[#444]">
            You may use purchased materials for personal, non-commercial purposes only. You may <strong>not</strong>:
          </p>
          <ul className="mt-3 list-disc pl-6 text-[16px] leading-[1.8] text-[#444]">
            <li>Resell, redistribute, or share the files with others.</li>
            <li>Claim the content as your own or remove any branding.</li>
            <li>Use the materials for commercial purposes without written permission.</li>
          </ul>

          <h2 className="mt-8 text-[20px] font-bold text-[#111]">3. Payment &amp; Pricing</h2>
          <p className="mt-3 text-[16px] leading-[1.8] text-[#444]">
            All prices are in USD. Payments are processed securely by Stripe. We reserve the right
            to change pricing at any time without notice.
          </p>

          <h2 className="mt-8 text-[20px] font-bold text-[#111]">4. Refunds</h2>
          <p className="mt-3 text-[16px] leading-[1.8] text-[#444]">
            Please refer to our{" "}
            <a href="/refund-policy" className="text-[#111] underline">Refund Policy</a>{" "}
            for details on eligibility and how to request a refund.
          </p>

          <h2 className="mt-8 text-[20px] font-bold text-[#111]">5. Disclaimer</h2>
          <p className="mt-3 text-[16px] leading-[1.8] text-[#444]">
            Our digital products are provided "as is." We make no warranties, express or implied,
            regarding accuracy or fitness for a particular purpose. Results may vary.
          </p>

          <h2 className="mt-8 text-[20px] font-bold text-[#111]">6. Limitation of Liability</h2>
          <p className="mt-3 text-[16px] leading-[1.8] text-[#444]">
            To the fullest extent permitted by law, Photography Easy Guide shall not be liable for any
            indirect, incidental, or consequential damages arising from the use of our products.
          </p>

          <h2 className="mt-8 text-[20px] font-bold text-[#111]">7. Contact</h2>
          <p className="mt-3 text-[16px] leading-[1.8] text-[#444]">
            For questions about these terms, email us at{" "}
            <a href="mailto:photography@easyguide.store" className="text-[#111] underline">photography@easyguide.store</a>.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
