"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/metaPixel";

const UPSELL_MINUTES = 10;

function SuccessContent() {
  const params = useSearchParams();
  const originalPiId = params.get("payment_intent");

  const [stage, setStage] = useState("upsell"); // upsell | downsell | done
  const [timeLeft, setTimeLeft] = useState(UPSELL_MINUTES * 60);
  const [charging, setCharging] = useState(false);
  const [chargeError, setChargeError] = useState("");

  // Fire Purchase for the original order on first load
  useEffect(() => {
    let cartValue = 0;
    let contentIds = ["main-product"];
    try {
      const saved = localStorage.getItem("photography-cart");
      if (saved) {
        const items = JSON.parse(saved);
        cartValue = items.reduce((t, i) => t + i.price * i.quantity, 0);
        contentIds = items.map((i) => i.id);
      }
    } catch {}
    trackEvent("Purchase", {
      value: cartValue,
      currency: "USD",
      content_ids: contentIds,
      content_type: "product",
      order_id: originalPiId || undefined,
    });
  }, []);

  useEffect(() => {
    if (stage === "done" || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, stage]);

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  const price = stage === "downsell" ? "4.99" : "7.99";
  const oldPrice = "$199.99";
  const savings = stage === "downsell" ? "$195.00" : "$192.00";

  const handleCompletePurchase = async () => {
    if (!originalPiId) { setStage("done"); return; }
    setCharging(true);
    setChargeError("");
    try {
      const res = await fetch("/api/upsell-charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalPaymentIntentId: originalPiId,
          amountCents: Math.round(parseFloat(price) * 100),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Charge failed");
      trackEvent("Purchase", {
        value: parseFloat(price),
        currency: "USD",
        content_ids: ["upsell-colored-bundle"],
        content_type: "product",
        order_id: data.paymentIntentId || undefined,
      });
      setStage("done");
    } catch (err) {
      setChargeError(err.message);
    } finally {
      setCharging(false);
    }
  };

  if (stage === "done") {
    return (
      <main className="min-h-screen bg-[#f5f5f5] px-6 py-12">
        {/* Header */}
        <div className="mx-auto mb-10 flex max-w-[640px] justify-center">
          <img src="/images/logo.png" alt="Photography Easy Guide" className="h-[48px] w-auto object-contain" />
        </div>

        <div className="mx-auto max-w-[640px] space-y-5">

          {/* Hero card */}
          <div className="rounded-[16px] bg-white px-8 py-10 text-center shadow-sm">
            <div className="text-[56px]">🎉</div>
            <h1 className="mt-4 text-[28px] font-extrabold text-[#111]">Order Confirmed!</h1>
            <p className="mt-3 text-[16px] leading-[1.7] text-[#555]">
              Thank you for your purchase! Your download links are on their way — check your inbox in the next few minutes.
            </p>
            <div className="mt-4 inline-block rounded-full bg-[#eaf6ef] px-4 py-1 text-[13px] font-semibold text-[#3a9e5f]">
              ✅ Payment successful
            </div>
          </div>

          {/* Next steps */}
          <div className="rounded-[16px] bg-white px-8 py-8 shadow-sm">
            <h2 className="text-[17px] font-bold text-[#111]">What happens next?</h2>
            <div className="mt-5 space-y-5">
              {[
                { step: "1", title: "Check your email", desc: "Your download links will arrive within a few minutes from photography@easyguide.store. Check your spam folder if you don't see it." },
                { step: "2", title: "Download your guides", desc: "Click the links in your email to access your Photography Guide folders on Google Drive. You can download them instantly." },
                { step: "3", title: "Start shooting!", desc: "Use your guides as a reference anytime — beginner techniques, exercises, references, and more are all inside." },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#111] text-[13px] font-bold text-white">
                    {step}
                  </div>
                  <div>
                    <p className="font-semibold text-[#111]">{title}</p>
                    <p className="mt-1 text-[14px] leading-[1.6] text-[#666]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="rounded-[16px] bg-white px-8 py-6 shadow-sm text-center">
            <p className="text-[14px] text-[#888]">
              Need help? We&apos;re here for you.{" "}
              <a href="mailto:photography@easyguide.store" className="font-medium text-[#111] underline">
                photography@easyguide.store
              </a>
            </p>
          </div>

          <div className="pb-6 text-center">
            <a href="/" className="inline-block rounded-[10px] bg-[#111] px-10 py-3 text-[15px] font-bold text-white transition hover:opacity-95">
              Back to Home
            </a>
          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#111]">

      {/* ── Top confirmation bar ── */}
      <div className="border-b border-[#e8e8e8] px-6 py-5 text-center">
        <p className="text-[18px] font-semibold text-[#222]">Photography Easy Guide</p>
        <div className="mt-2 flex items-center justify-center gap-2">
          <svg className="h-5 w-5 text-[#3a9e5f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
          </svg>
          <span className="text-[15px] text-[#444]">You&apos;ve paid for your order.</span>
        </div>
        <button onClick={() => setStage("done")} className="mt-1 text-[14px] text-[#3a7ec4] hover:underline">
          View order confirmation ›
        </button>
      </div>

      <div className="mx-auto max-w-[860px] px-5">

        {/* ── Headline + countdown ── */}
        <div className="py-8 text-center">
          {stage === "downsell" ? (
            <>
              <p className="text-[20px] font-bold text-[#111]">⚠️ Warning...</p>
              <h2 className="mt-2 text-[24px] font-extrabold leading-[1.3] text-[#111] sm:text-[28px]">
                The guide you just purchased does NOT include any colors or images!
              </h2>
            </>
          ) : (
            <>
              <p className="text-[20px] font-bold text-[#111]">⚠️ One Last Step...</p>
              <h2 className="mt-2 text-[24px] font-extrabold leading-[1.3] text-[#111] sm:text-[28px]">
                Do You Want To Upgrade To The Full Colored Photography Bundle?
              </h2>
            </>
          )}
          <p className="mt-3 text-[15px] text-[#444]">
            Exclusive offer expires in:{" "}
            <strong className="text-[#111]">{mm}:{ss}</strong>
          </p>
        </div>

        {/* ── Section 1: image left | details + CTA right ── */}
        <div className="grid gap-8 sm:grid-cols-2 sm:items-start">
          {/* Left: upsell gif */}
          <div className="w-full">
            <img
              src="/images/upsell.gif"
              alt="Upgrade to Full Colored Photography Bundle"
              className="w-full rounded-[12px] shadow-md object-cover"
            />
          </div>

          {/* Right: details */}
          <div>
            <h3 className="text-[22px] font-bold leading-[1.3] text-[#111]">
              Upgrade to Full Colored Beginner-Friendly Photography Bundle
            </h3>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-[16px]">
              <span className="text-[#888] line-through">{oldPrice}</span>
              <span className="text-[18px] font-bold text-[#111]">${price}</span>
              <span className="font-bold text-[#3a9e5f]">{savings}</span>
              <span className="font-bold text-[#3a9e5f]">Savings</span>
            </div>

            {stage === "downsell" ? (
              <div className="mt-5 space-y-4 text-[15px] leading-[1.6] text-[#333]">
                <p>🌟 We want you to <strong>come back</strong> — a great experience now means you&apos;re more likely to shop with us again.</p>
                <p>📚 We believe in <strong>visual learning</strong> — and we don&apos;t want anyone to miss out just because of the original price.</p>
                <p>🎉 This is a <strong>thank-you gift</strong> — for choosing us and trusting us with your photography journey!</p>
                <p className="font-bold text-[#3a9e5f]">✅ Try It Now! This is our last price drop offer!</p>
              </div>
            ) : (
              <>
                <h4 className="mt-5 text-[17px] font-bold text-[#111]">Thanks for buying our Photography Easy Guide! :)</h4>
                <div className="mt-3 space-y-2 text-[15px] leading-[1.6] text-[#333]">
                  <p>⚠️ <strong>Standard Photography Guides</strong> — (Text-based, harder to follow without visual guidance — perfect as a reference)</p>
                  <p>❤️ <strong>Full Colored Photography Bundle</strong> — Easy-to-follow, beginner-friendly, and visually engaging with step-by-step image guides!</p>
                </div>
                <div className="mt-5 text-[15px] text-[#111]">
                  <p className="font-bold">Upgrade Now &amp; Get:</p>
                  <ul className="mt-2 space-y-1">
                    <li>✅ Full Colored Step-by-Step Visual Guides</li>
                    <li>✅ Free Mystery &amp; Extra Gift Box</li>
                    <li>✅ Bonus Photography References &amp; Templates</li>
                  </ul>
                </div>
                <p className="mt-5 text-[15px] text-[#333]">
                  Don&apos;t Miss Out — <strong>Click Below &amp; Upgrade Now! ⬇</strong>
                </p>
              </>
            )}

            {/* Subtotal / Total */}
            <div className="mt-6 border-t border-[#e8e8e8] pt-5 space-y-2 text-[15px]">
              <div className="flex justify-between text-[#555]">
                <span>Subtotal</span>
                <span>${price}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-[16px] font-semibold text-[#111]">Total</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-[13px] text-[#888]">USD</span>
                  <span className="text-[22px] font-bold text-[#111]">${price}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCompletePurchase}
              disabled={charging}
              className="mt-5 w-full rounded-[10px] bg-[#e8919c] py-[14px] text-[17px] font-bold text-black transition hover:opacity-95 disabled:opacity-60"
            >
              {charging ? "Processing…" : `Complete Purchase • $${price}`}
            </button>
            <button
              onClick={() => { window.scrollTo(0, 0); stage === "upsell" ? setStage("downsell") : setStage("done"); }}
              className="mt-3 w-full rounded-[10px] border border-[#d9d9d9] py-[13px] text-[15px] text-[#555] transition hover:bg-[#f5f5f5]"
            >
              Decline this offer
            </button>
            {chargeError && <p className="mt-3 text-[13px] text-red-500 text-center">{chargeError}</p>}
          </div>
        </div>

        {/* ── Section 2: Anniversary Surprise ── */}
        <div className="mt-14 grid gap-6 grid-cols-1 sm:grid-cols-2 items-center">
          <div className="text-center">
            <h3 className="text-[20px] font-extrabold text-[#111]">🎁 Anniversary Surprise!</h3>
            <p className="mt-3 text-center text-[16px] leading-[1.7] text-[#444]">
              This Offer Includes a <strong>FREE Mystery Box</strong> filled with photography essentials worth over{" "}
              <strong>$250!</strong> + Colorful Notes + Multiple Extra Gifts! ✨
            </p>
          </div>
          <div className="text-center">
            <img
              src="/images/mysterybox.gif"
              alt="Mystery Box"
              className="w-full rounded-[12px] object-cover shadow-sm"
            />
            <p className="mt-3 text-[15px] text-[#333]">
              Over <strong>$250 Worth</strong> Of Photography Products For <strong>FREE</strong>
            </p>
          </div>
        </div>

        {/* ── Section 3: Free Extra Gifts + Upgrade benefits ── */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 items-center">
          <div className="rounded-[12px] border border-[#ddd] p-5 text-center">
            <p className="text-[18px] font-extrabold uppercase tracking-wide text-[#111]">FREE EXTRA GIFTS :)</p>
            <div className="mt-4">
              <img src="/images/gift.png" alt="Free Extra Gifts" className="w-full rounded-[8px] object-cover" />
            </div>
          </div>
          <div>
            <h3 className="text-[22px] font-extrabold leading-[1.35] text-[#111]">
              Upgrade From Black And White To Colorful Photography Easy Guide and get:
            </h3>
            <div className="mt-5 space-y-4 text-center text-[16px]">
              <div>
                <p className="font-bold text-[#111]">Free Mystery Box!</p>
                <p className="text-[#555]">(Worth over $99) FREE TODAY 🎁</p>
              </div>
              <div>
                <p className="font-bold text-[#111]">Free Extra Gifts!</p>
                <p className="text-[#555]">(Worth over $99) FREE TODAY 🎁</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom countdown + totals + CTA ── */}
        <div className="mt-12 border-t border-[#e8e8e8] pt-8 pb-16">
          <p className="text-center text-[16px] text-[#444]">
            Exclusive offer expires in:{" "}
            <strong className="text-[22px] text-[#111]">{mm}:{ss}</strong>
          </p>

          <div className="mt-8 space-y-3 text-[15px]">
            <div className="flex items-center justify-between">
              <span className="text-[#555]">Subtotal</span>
              <div className="flex items-center gap-3">
                <span className="text-[#888] line-through">{oldPrice}</span>
                <span className="font-semibold text-[#111]">${price}</span>
              </div>
            </div>
            <div className="flex justify-end">
              <span className="font-bold text-[#3a9e5f]">{savings} &nbsp;Savings</span>
            </div>
            <div className="flex items-baseline justify-between border-t border-[#e8e8e8] pt-4">
              <span className="text-[17px] font-semibold text-[#111]">Total</span>
              <div className="flex items-baseline gap-2">
                <span className="text-[13px] text-[#888]">USD</span>
                <span className="text-[26px] font-extrabold text-[#111]">${price}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCompletePurchase}
            disabled={charging}
            className="mt-6 w-full rounded-[10px] bg-[#e8919c] py-[15px] text-[17px] font-bold text-black transition hover:opacity-95 disabled:opacity-60"
          >
            {charging ? "Processing…" : `Complete Purchase • $${price}`}
          </button>
          <button
            onClick={() => stage === "upsell" ? setStage("downsell") : setStage("done")}
            className="mt-3 w-full rounded-[10px] border border-[#d9d9d9] py-[13px] text-[15px] text-[#555] transition hover:bg-[#f5f5f5]"
          >
            Decline this offer
          </button>
        </div>

      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
