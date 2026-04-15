import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = { title: "Privacy Policy — Photography Easy Guide" };

export default function PrivacyPolicy() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-white px-6 py-16 text-[#222]">
        <div className="mx-auto max-w-[720px]">
          <h1 className="text-[32px] font-extrabold text-[#111]">Privacy Policy</h1>
          <p className="mt-2 text-[14px] text-[#888]">Last updated: April 2026</p>

          <p className="mt-8 text-[16px] leading-[1.8] text-[#444]">
            This Privacy Policy describes how <strong>Photography Easy Guide</strong> ("we", "us", or "our")
            collects, uses, and protects your personal information when you visit{" "}
            <strong>photography.easyguide.store</strong>.
          </p>

          <h2 className="mt-10 text-[20px] font-bold text-[#111]">Information We Collect</h2>
          <ul className="mt-3 list-disc pl-6 text-[16px] leading-[1.8] text-[#444]">
            <li><strong>Email address</strong> — collected at checkout to deliver your download links and send order confirmations.</li>
            <li><strong>Payment information</strong> — processed securely by Stripe. We never store your card details on our servers.</li>
            <li><strong>Usage data</strong> — anonymous analytics (page views, referral source) may be collected to improve our site.</li>
          </ul>

          <h2 className="mt-8 text-[20px] font-bold text-[#111]">How We Use Your Information</h2>
          <ul className="mt-3 list-disc pl-6 text-[16px] leading-[1.8] text-[#444]">
            <li>To fulfill your order and deliver your digital products.</li>
            <li>To send order confirmation and download link emails.</li>
            <li>To send promotional emails if you opted in (you can unsubscribe at any time).</li>
            <li>To improve our website and customer experience.</li>
          </ul>

          <h2 className="mt-8 text-[20px] font-bold text-[#111]">Third-Party Services</h2>
          <ul className="mt-3 list-disc pl-6 text-[16px] leading-[1.8] text-[#444]">
            <li><strong>Stripe</strong> — payment processing</li>
            <li><strong>Resend</strong> — transactional email delivery</li>
            <li><strong>Vercel</strong> — website hosting</li>
          </ul>

          <h2 className="mt-8 text-[20px] font-bold text-[#111]">Data Retention</h2>
          <p className="mt-3 text-[16px] leading-[1.8] text-[#444]">
            We retain your email address for as long as necessary to fulfill your order and comply
            with legal obligations. You may request deletion of your data at any time by contacting us.
          </p>

          <h2 className="mt-8 text-[20px] font-bold text-[#111]">Your Rights</h2>
          <p className="mt-3 text-[16px] leading-[1.8] text-[#444]">
            You have the right to access, correct, or delete your personal information. Email us at{" "}
            <a href="mailto:photography@easyguide.store" className="text-[#eda3ac] underline">photography@easyguide.store</a>.
          </p>

          <h2 className="mt-8 text-[20px] font-bold text-[#111]">Contact</h2>
          <p className="mt-3 text-[16px] leading-[1.8] text-[#444]">
            Questions about this policy? Contact us at{" "}
            <a href="mailto:photography@easyguide.store" className="text-[#eda3ac] underline">photography@easyguide.store</a>.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
