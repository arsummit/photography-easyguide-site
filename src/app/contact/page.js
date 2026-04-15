import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = { title: "Contact — Photography Easy Guide" };

export default function Contact() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-white px-6 py-16 text-[#222]">
        <div className="mx-auto max-w-[720px]">
          <h1 className="text-[32px] font-extrabold text-[#111]">Contact Us</h1>
          <p className="mt-2 text-[14px] text-[#888]">We typically respond within 1–2 business days.</p>

          <div className="mt-10 rounded-[16px] border border-[#f0e6da] bg-[#fff8f3] px-8 py-8">
            <p className="text-[17px] leading-[1.8] text-[#444]">
              Have a question about your order, need help accessing your downloads, or have feedback?
              We&apos;d love to hear from you.
            </p>
            <div className="mt-6">
              <p className="text-[15px] font-semibold text-[#111]">Email</p>
              <a href="mailto:photography@easyguide.store" className="mt-1 inline-block text-[17px] text-[#111] underline">
                photography@easyguide.store
              </a>
            </div>
            <div className="mt-6">
              <p className="text-[15px] font-semibold text-[#111]">Response Time</p>
              <p className="mt-1 text-[16px] text-[#555]">Monday – Friday, within 1–2 business days</p>
            </div>
          </div>

          <p className="mt-8 text-[15px] leading-[1.8] text-[#888]">
            For download issues, please include your order email address so we can look up your purchase quickly.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
