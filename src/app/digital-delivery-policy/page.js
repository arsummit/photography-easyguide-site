import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = { title: "Digital Delivery Policy — Photography Easy Guide" };

export default function DigitalDeliveryPolicy() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-white px-6 py-16 text-[#222]">
        <div className="mx-auto max-w-[720px]">
          <h1 className="text-[32px] font-extrabold text-[#111]">Digital Delivery Policy</h1>
          <p className="mt-2 text-[14px] text-[#888]">Last updated: April 2026</p>

          <p className="mt-8 text-[16px] leading-[1.8] text-[#444]">
            Thank you for your purchase from <strong>Photography Easy Guide</strong>. All of our products are
            delivered digitally, ensuring fast and convenient access. Please review the information
            below to understand how your order is processed and delivered.
          </p>

          <h2 className="mt-10 text-[20px] font-bold text-[#111]">Order Processing</h2>
          <p className="mt-3 text-[16px] leading-[1.8] text-[#444]">
            Once your payment has been confirmed, our system automatically processes your order and
            sends your download links to the email address you provided at checkout. This is handled
            instantly — no manual processing required.
          </p>

          <h2 className="mt-8 text-[20px] font-bold text-[#111]">Delivery Timeframe</h2>
          <p className="mt-3 text-[16px] leading-[1.8] text-[#444]">
            Your download email is typically delivered within <strong>a few minutes</strong> of your
            purchase. In rare cases it may take up to 30 minutes depending on your email provider.
            The email will come from <strong>photography@easyguide.store</strong>.
          </p>

          <h2 className="mt-8 text-[20px] font-bold text-[#111]">How to Access Your Products</h2>
          <p className="mt-3 text-[16px] leading-[1.8] text-[#444]">Follow these steps to access your purchase:</p>
          <ol className="mt-4 space-y-4 text-[16px] leading-[1.8] text-[#444]">
            <li>
              <strong>1. Check your inbox</strong> — Look for an email from{" "}
              <strong>photography@easyguide.store</strong> with the subject line{" "}
              <em>"Your Photography Easy Guide — Download Links Inside! 📷"</em>
            </li>
            <li>
              <strong>2. Check your spam or junk folder</strong> — Some email providers may filter
              automated delivery emails. Check spam, junk, and promotions folders.
            </li>
            <li>
              <strong>3. Click "Open Folder"</strong> — Open the delivery email and click the{" "}
              <strong>"Open Folder"</strong> link for each product. This will take you directly to
              your Google Drive folder.
            </li>
            <li>
              <strong>4. Download your files</strong> — Inside the Google Drive folder, view or
              download your photography guides as PDF files at any time. The links do not expire.
            </li>
          </ol>

          <h2 className="mt-8 text-[20px] font-bold text-[#111]">What You Receive</h2>
          <p className="mt-3 text-[16px] leading-[1.8] text-[#444]">
            All customers receive access to the following Google Drive folders:
          </p>
          <ul className="mt-3 list-disc pl-6 text-[16px] leading-[1.8] text-[#444]">
            <li><strong>Full Photography Guide (Upgraded to Colored)</strong> — the complete colored photography guides collection</li>
            <li><strong>All Extras and Upgrades</strong> — bonus materials, references, and gift content</li>
          </ul>

          <h2 className="mt-8 text-[20px] font-bold text-[#111]">Troubleshooting</h2>
          <p className="mt-3 text-[16px] leading-[1.8] text-[#444]">
            If you have not received your email within 30 minutes of purchase:
          </p>
          <ul className="mt-3 list-disc pl-6 text-[16px] leading-[1.8] text-[#444]">
            <li>Verify the email address used at checkout is correct.</li>
            <li>Check all folders including spam, junk, and promotions.</li>
            <li>
              Contact us at{" "}
              <a href="mailto:photography@easyguide.store" className="text-[#111] underline">photography@easyguide.store</a>{" "}
              with your order email and we will resend your links promptly.
            </li>
          </ul>

          <h2 className="mt-8 text-[20px] font-bold text-[#111]">Contact Us</h2>
          <p className="mt-3 text-[16px] leading-[1.8] text-[#444]">
            For any questions regarding your order or delivery, reach out at{" "}
            <a href="mailto:photography@easyguide.store" className="text-[#111] underline">photography@easyguide.store</a>.
            We respond within 1–2 business days.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
