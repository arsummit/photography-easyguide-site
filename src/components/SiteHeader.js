"use client";

import { useEffect, useState } from "react";
import { Search, ShoppingBag } from "lucide-react";

export default function SiteHeader() {
  const [timeLeft, setTimeLeft] = useState({ days: "00", hours: "00", minutes: "00", seconds: "00" });

  useEffect(() => {
    const storageKey = "photography_guide_offer_deadline";
    const durationMs = 60 * 60 * 1000;
    const now = Date.now();
    let deadline = localStorage.getItem(storageKey);
    if (!deadline || Number(deadline) <= now) {
      deadline = String(now + durationMs);
      localStorage.setItem(storageKey, deadline);
    }

    const update = () => {
      const diff = Number(deadline) - Date.now();
      if (diff <= 0) { setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" }); return; }
      setTimeLeft({
        days: String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, "0"),
        hours: String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, "0"),
        minutes: String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0"),
        seconds: String(Math.floor((diff / 1000) % 60)).padStart(2, "0"),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Announcement / countdown bar */}
      <section className="bg-black px-[12px] py-[10px] text-center text-white">
        <p className="text-[16px] font-bold leading-[1.3] md:text-[17px]">
          FREE Today – Anniversary Sale Ends In:
        </p>
        <div className="mt-[4px] flex items-start justify-center gap-[4px]">
          {[
            { value: timeLeft.days, label: "Days" },
            { value: timeLeft.hours, label: "Hrs" },
            { value: timeLeft.minutes, label: "Mins" },
            { value: timeLeft.seconds, label: "Secs" },
          ].flatMap((item, index, arr) => {
            const part = (
              <div key={item.label} className="min-w-[36px] text-center">
                <div className="text-[20px] font-bold leading-none md:text-[18px]">{item.value}</div>
                <div className="mt-[2px] text-[9px] font-normal tracking-wide">{item.label}</div>
              </div>
            );
            if (index < arr.length - 1) {
              return [part, <span key={`sep-${index}`} className="mt-[1px] text-[14px] font-bold leading-none">:</span>];
            }
            return [part];
          })}
        </div>
      </section>

      {/* Header */}
      <header className="border-b border-[#e6e6e6] bg-white">
        <div className="relative mx-auto flex h-[120px] md:h-[130px] max-w-[1350px] items-center justify-between px-[16px] md:px-[24px]">
          <div className="flex items-center gap-[14px] md:gap-[24px] text-[13px] md:text-[14px] font-medium text-[#2b2b2b]">
            <a
              href="/#shop"
              className="rounded-[6px] bg-[#111] px-[12px] md:px-[16px] py-[6px] md:py-[7px] text-[12px] md:text-[13px] font-semibold tracking-[0.1px] text-white transition-all duration-200 hover:bg-[#333]"
            >
              Shop Now
            </a>
            <a href="/contact" className="hover:text-black">Contact</a>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <a href="/">
              <img src="/images/logo.png" alt="Photography Easy Guide" className="h-[70px] md:h-[90px] w-auto object-contain" />
            </a>
          </div>

          <div className="flex items-center gap-[14px] md:gap-[18px] text-[#222]">
            <a href="/#shop" aria-label="Search" className="hover:opacity-70">
              <Search size={19} strokeWidth={1.7} />
            </a>
            <a href="/" aria-label="Cart" className="hover:opacity-70">
              <ShoppingBag size={19} strokeWidth={1.7} />
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
