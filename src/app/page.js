"use client";

import Image from "next/image";
import { Search, ShoppingBag, X, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "@/lib/metaPixel";

export default function Home() {
  const topReviews = [
    {
      name: "Emily R.",
      text: "These notes gave me the structure I needed to actually improve my shots. I've gone from auto mode to fully manual with confidence.",
      image: "/images/R1.jpg",
    },
    {
      name: "Robert N.",
      text: "I keep this printed in my camera bag. Every time I go out, I pick a technique to focus on, and I can see real progress in my photos.",
      image: "/images/R2.jpg",
    },
    {
      name: "Larissa B.",
      text: "The section on golden hour photography completely changed my results. I used to struggle with light, now I know exactly when and how to shoot.",
      image: "/images/R3.jpg",
    },
  ];

  const addons = [
    ["Black and White Photography Tips", "$0.99", "$14.99"],
    ["Candid Moments Photography Techniques", "$0.99", "$14.99"],
    ["Food Photography Masterclass", "$0.99", "$14.99"],
    ["Golden Hour Photography Guide", "$0.99", "$14.99"],
    ["Landscape Photography Insights", "$0.99", "$14.99"],
    ["Macro Photography Techniques", "$0.99", "$14.99"],
    ["Minimalist Photography Techniques", "$0.99", "$14.99"],
    ["Motion Blur Photography Challenge", "$0.99", "$14.99"],
    ["Night Photography Techniques", "$0.99", "$14.99"],
    ["Portrait Photography Guide", "$0.99", "$14.99"],
    ["Reflections and Mirror Photography", "$0.99", "$14.99"],
    ["Self-Portrait Mastery Notes", "$0.99", "$14.99"],
    ["Shadow Play Photography Guide", "$0.99", "$14.99"],
    ["Splash of Color Photography Tips", "$0.99", "$14.99"],
    ["Street Photography Guide", "$0.99", "$14.99"],
  ];

  const benefits = [
    "Over 100 printable pages covering composition, lighting, manual settings & more",
    "Built to sharpen your skills and boost creative confidence – at any level",
    "Includes ISO, aperture, shutter speed, white balance, framing techniques and more",
    "Clear, beginner-friendly guidance – no photography degree needed",
    "Designed for practice sessions, personal projects, and visual journaling",
    "Pairs well with editing, portfolio building or creative challenges",
    "Inclusive, approachable language – shoot your way, at your pace",
    "Compatible with GoodNotes, iPad, Notability or as a printed field guide",
  ];

  const testimonialCards = [
    {
      title: "So helpful for my progress!",
      body: "I've never felt this consistent with practicing techniques or actually reviewing my shots. These notes made photography feel both structured and creative.",
      name: "Janine H.",
      image: "/images/T1.jpg",
    },
    {
      title: "Great for staying on track!",
      body: "I used to get stuck trying to learn everything at once. Now I actually improve each week and know what to work on next.",
      name: "Frederike M.",
      image: "/images/T2.jpg",
    },
    {
      title: "Perfect gift!",
      body: "Got this for my brother and he's using it every weekend. It's practical, motivating, and helped him enjoy photography again.",
      name: "Michael H.",
      image: "/images/T3.jpg",
    },
  ];

  const stats = [
    ["98%", "Felt more organized and consistent with their photography goals after using these notes."],
    ["94%", "Said that learning photography felt easier."],
    ["97%", "Rated our bundle 4.9/5."],
  ];

  const quickLinks = [
    { label: "Digital Delivery Policy", href: "/digital-delivery-policy" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
  ];

  const mainProduct = {
    id: "main-product",
    name: "1.000+ Free Photography Easy Guide",
    price: 0.0,
    compareAtPrice: 99.99,
    image: "/images/main.gif",
  };

  const iconMap = {
    "Black and White Photography Tips": "/images/icons/1.png",
    "Candid Moments Photography Techniques": "/images/icons/2.png",
    "Food Photography Masterclass": "/images/icons/3.png",
    "Golden Hour Photography Guide": "/images/icons/4.png",
    "Landscape Photography Insights": "/images/icons/5.png",
    "Macro Photography Techniques": "/images/icons/6.png",
    "Minimalist Photography Techniques": "/images/icons/7.png",
    "Motion Blur Photography Challenge": "/images/icons/8.png",
    "Night Photography Techniques": "/images/icons/9.png",
    "Portrait Photography Guide": "/images/icons/10.png",
    "Reflections and Mirror Photography": "/images/icons/11.png",
    "Self-Portrait Mastery Notes": "/images/icons/12.png",
    "Shadow Play Photography Guide": "/images/icons/13.png",
    "Splash of Color Photography Tips": "/images/icons/14.png",
    "Street Photography Guide": "/images/icons/15.png",
  };

  const addonProducts = addons.map(([title, sale, compare], index) => ({
    id: `addon-${index + 1}`,
    name: title,
    price: Number(sale.replace("$", "")),
    compareAtPrice: Number(compare.replace("$", "")),
    image: iconMap[title],
  }));

  const itemsPerPage = 5;
  const upsellPages = [];
  for (let i = 0; i < addons.length; i += itemsPerPage) {
    upsellPages.push(addons.slice(i, i + itemsPerPage));
  }

  const comparisonRows = [
    "Informative",
    "Beginner-Friendly",
    "Well-Organized",
    "Step-by-Step Guidance",
    "Instant Digital Access",
  ];

  const addToCartRef = useRef(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const [activeReview, setActiveReview] = useState(0);
  const [rowIndices, setRowIndices] = useState([0, 0, 0, 0, 0]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: "", text: "" });
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState(
    () => Object.fromEntries(addonProducts.map((p) => [p.id, true]))
  );
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const initialSelection = {};
    addonProducts.forEach((product) => {
      initialSelection[product.id] = true;
    });
    setSelectedAddons(initialSelection);
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem("photography-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        setCart([]);
      }
    }
  }, []);

  useEffect(() => {
    const selectedItems = addonProducts
      .filter((product) => selectedAddons[product.id])
      .map((product) => ({
        ...product,
        quantity: 1,
      }));

    const fullCart = [
      {
        ...mainProduct,
        quantity: 1,
      },
      ...selectedItems,
    ];

    setCart(fullCart);
    localStorage.setItem("photography-cart", JSON.stringify(fullCart));
  }, [selectedAddons]);

  useEffect(() => {
    const storageKey = "photography_guide_offer_deadline";
    const durationMs = 60 * 60 * 1000;
    const now = Date.now();
    let deadline = localStorage.getItem(storageKey);

    if (!deadline || Number(deadline) <= now) {
      deadline = String(now + durationMs);
      localStorage.setItem(storageKey, deadline);
    }

    const updateTimer = () => {
      const current = Date.now();
      const diff = Number(deadline) - current;

      if (diff <= 0) {
        setTimeLeft({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isCartOpen]);

  useEffect(() => {
    const el = addToCartRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);


  // Fire ViewContent once on page load
  useEffect(() => {
    trackEvent("ViewContent", {
      content_ids: ["main-product"],
      content_type: "product",
      content_name: "1,000+ Free Photography Easy Guide",
      currency: "USD",
      value: 0,
    });
  }, []);

  const handleMainAddToCart = () => {
    trackEvent("AddToCart", {
      content_ids: cart.map((item) => item.id),
      content_type: "product",
      value: subtotal,
      currency: "USD",
      num_items: cartCount,
    });
    setIsCartOpen(true);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    trackEvent("InitiateCheckout", {
      content_ids: cart.map((item) => item.id),
      content_type: "product",
      value: subtotal,
      currency: "USD",
      num_items: cartCount,
    });
    localStorage.setItem("photography-cart", JSON.stringify(cart));
    setIsCartOpen(false);
    window.location.href = "/checkout";
  };

  const toggleAddon = (productId) => {
    setSelectedAddons((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const removeFromCart = (id) => {
    if (id === "main-product") return;
    setSelectedAddons((prev) => {
      const next = { ...prev };
      next[id] = false;
      return next;
    });
  };

  const increaseQuantity = () => {};
  const decreaseQuantity = () => {};

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const subtotal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  );

  const totalSavings = useMemo(
    () =>
      cart.reduce((total, item) => {
        const compareAtPrice = item.compareAtPrice || item.price;
        return total + (compareAtPrice - item.price) * item.quantity;
      }, 0),
    [cart]
  );

  return (
    <>
      <main className="min-h-screen bg-white pb-[50px] text-[#121212]">
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
                  <div className="text-[20px] font-bold leading-none md:text-[18px]">
                    {item.value}
                  </div>
                  <div className="mt-[2px] text-[9px] font-normal tracking-wide">
                    {item.label}
                  </div>
                </div>
              );
              if (index < arr.length - 1) {
                return [
                  part,
                  <span key={`sep-${index}`} className="mt-[1px] text-[14px] font-bold leading-none">
                    :
                  </span>,
                ];
              }
              return [part];
            })}
          </div>
        </section>

        {/* Search bar (shown when open) */}
        {searchOpen && (
          <div className="border-b border-[#e6e6e6] bg-white px-4 py-3">
            <div className="relative mx-auto max-w-[600px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full rounded-[8px] border border-[#d9d9d9] py-2 pl-9 pr-10 text-[15px] outline-none focus:border-[#111]"
              />
              <button
                type="button"
                onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#111]"
              >
                <X size={16} />
              </button>

              {/* Search results dropdown */}
              {searchQuery.trim() !== "" && (() => {
                const q = searchQuery.toLowerCase();
                const results = [mainProduct, ...addonProducts].filter((p) =>
                  p.name.toLowerCase().includes(q)
                );
                return (
                  <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[320px] overflow-y-auto rounded-[8px] border border-[#e4e4e4] bg-white shadow-lg">
                    {results.length === 0 ? (
                      <p className="px-4 py-4 text-[14px] text-[#888]">No products found.</p>
                    ) : results.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#fff8f3] border-b border-[#f0f0f0] last:border-0"
                      >
                        <img src={p.image} alt={p.name} className="h-[40px] w-[40px] rounded-[6px] object-contain border border-[#eee]" />
                        <div>
                          <p className="text-[14px] font-medium text-[#111]">{p.name}</p>
                          <p className="text-[13px] text-[#111] font-semibold">${p.price.toFixed(2)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        <header className="border-b border-[#e6e6e6] bg-[#ffffff]">
          {/* Mobile menu drawer */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-[150]" onClick={() => setMobileMenuOpen(false)}>
              <div className="absolute left-0 top-0 h-full w-[260px] bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-[#f0f0f0] px-5 py-5">
                  <span className="text-[16px] font-bold text-[#111]">Menu</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-[#888] hover:text-[#333]">
                    <X size={22} />
                  </button>
                </div>
                <nav className="flex flex-col px-5 py-4 gap-1">
                  <a href="#shop" onClick={() => setMobileMenuOpen(false)} className="rounded-[8px] bg-[#111] px-4 py-3 text-[15px] font-semibold text-white text-center">
                    Shop Now
                  </a>
                  <a href="/contact" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-[15px] font-medium text-[#2b2b2b] hover:text-black">
                    Contact
                  </a>
                </nav>
              </div>
            </div>
          )}

          <div className="relative mx-auto flex h-[120px] md:h-[130px] max-w-[1350px] items-center justify-between px-[16px] md:px-[24px]">
            {/* Desktop left nav */}
            <div className="hidden md:flex items-center gap-[24px] text-[14px] font-medium text-[#2b2b2b]">
              <a href="#shop" className="rounded-[6px] bg-[#111] px-[16px] py-[7px] text-[15px] font-semibold text-white transition-all duration-200 hover:bg-[#333]">
                Shop Now
              </a>
              <a href="/contact" className="hover:text-black">Contact</a>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="flex md:hidden items-center justify-center text-[#222] hover:opacity-70"
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <img
                src="/images/logo.png"
                alt="Photography Easy Guide"
                className="h-[100px] md:h-[140px] w-auto object-contain"
              />
            </div>

            <div className="flex items-center gap-[14px] md:gap-[18px] text-[#222]">
              <button
                type="button"
                aria-label="Search"
                className="hover:opacity-70"
                onClick={() => { setSearchOpen((v) => !v); setSearchQuery(""); }}
              >
                <Search size={23} strokeWidth={1.7} />
              </button>
              <button
                type="button"
                aria-label="Cart"
                className="relative hover:opacity-70"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag size={23} strokeWidth={1.7} />
                {cartCount > 0 && (
                  <span className="absolute -right-[10px] -top-[9px] flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#111] px-[5px] text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        <section
          id="shop"
          className="mx-auto max-w-[1320px] lg:px-[24px] lg:pt-[30px] pb-[6px]"
        >
          <div className="grid items-start gap-[16px] lg:gap-[60px] lg:grid-cols-[minmax(0,690px)_1fr]">
            <div className="w-full">
              <div className="aspect-square overflow-hidden lg:rounded-[12px] lg:border lg:border-[#e5e5e5] bg-white">
                <Image
                  src="/images/main.gif"
                  alt="1.000+ Free Photography Easy Guide"
                  width={800}
                  height={800}
                  className="h-full w-full object-cover"
                  priority
                  unoptimized
                />
              </div>
            </div>

            <div className="w-full px-[16px] lg:px-0">
              <h1 className="text-[28px] font-bold leading-[1.15] tracking-[0.06rem] text-[#121212] md:text-[40px]">
                1.000+ Free Photography Easy Guide
              </h1>

              <div className="mt-[4px] flex items-center gap-[6px] text-[14px] text-[#6b7280]">
                <div className="text-[15px] tracking-[0.05em] text-[#f5b301]">
                  ★★★★★
                </div>
                <span>(10,725)</span>
              </div>

              <div className="mt-[8px] flex items-center gap-[8px]">
                <span className="text-[24px] font-extrabold text-[#111]">
                  $0.00
                </span>
                <span className="text-[16px] font-extrabold text-[#8a8a8a] line-through">
                  $99.99
                </span>
                <span className="rounded bg-[#111] px-[8px] py-[3px] text-[11px] font-semibold text-white">
                  SAVE 100%
                </span>
              </div>

              <ul className="mt-[10px] space-y-[5px] text-[16px] text-[#444]">
                <li>🔮 1000+ Beautifully Designed Pages</li>
                <li>📥 Start right away – No Shipping Needed</li>
                <li>💫 For All Levels – From Beginner To Advanced</li>
                <li className="font-semibold text-black">
                  ✨ Free Today – Anniversary Sale!
                </li>
              </ul>

              <button
                ref={addToCartRef}
                onClick={handleMainAddToCart}
                className="mt-[12px] w-full rounded-[6px] bg-[#111] py-[14px] text-[15px] font-bold text-white transition hover:bg-[#333]"
              >
                ADD TO CART
              </button>

              <div className="mt-[14px] rounded-[12px] bg-[#f3f4f6] px-[16px] py-[16px] transition-all duration-500">
                <div className="flex gap-3">
                  <img
                    src={topReviews[activeReview].image}
                    alt={topReviews[activeReview].name}
                    className="h-[44px] w-[44px] shrink-0 rounded-full object-cover border border-[#e5e5e5]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] leading-[1.5] tracking-[0.01em] text-[#333]">
                      {topReviews[activeReview].text}
                    </p>
                    <div className="mt-[10px] border-t border-[#dddddd]" />
                    <p className="mt-[7px] text-[12px] text-[#7a7a7a]">
                      {topReviews[activeReview].name}{" "}
                      <span className="text-[#efb81e]">★★★★★</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-[10px] flex justify-center gap-[10px]">
                {topReviews.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveReview(index)}
                    className={`h-[8px] w-[8px] rounded-full transition ${
                      activeReview === index ? "bg-black" : "bg-[#cccccc]"
                    }`}
                    aria-label={`Show review ${index + 1}`}
                  />
                ))}
              </div>

              <div className="mt-6 overflow-hidden">
                {[0, 1, 2, 3, 4].map((rowNum) => {
                  const pageIndex = rowIndices[rowNum];
                  const addonIndex = rowNum + pageIndex * itemsPerPage;
                  const [title, sale, compare] = addons[addonIndex];
                  const product = addonProducts.find((item) => item.name === title);
                  const isSelected = selectedAddons[product?.id] || false;

                  return (
                    <div key={rowNum}>
                      <div key={`${rowNum}-${pageIndex}`} className="animate-slide-in">
                        <div className="flex items-center justify-between gap-3 py-[10px]">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center overflow-hidden">
                              <img
                                src={product.image}
                                alt={title}
                                className="h-full w-full object-contain"
                              />
                            </div>

                            <div className="text-[16px] font-bold leading-[1.2] text-[#121212]">
                              {title}
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-3">
                            <div className="text-right leading-none">
                              <div className="text-[16px] font-bold text-[#111]">
                                {sale}
                              </div>
                              <div className="mt-[3px] text-[13px] text-[#111] line-through">
                                {compare}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => toggleAddon(product.id)}
                              className={`flex h-[26px] w-[46px] shrink-0 items-center rounded-full px-[3px] transition-colors duration-200 ${
                                isSelected ? "bg-[#111]" : "bg-[#d5d5d5]"
                              }`}
                              aria-label={`Toggle ${title}`}
                            >
                              <div
                                className={`h-[20px] w-[20px] rounded-full bg-white shadow-sm transition-all duration-200 ${
                                  isSelected ? "ml-auto" : "ml-0"
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center gap-[10px]">
                        {upsellPages.map((_, dotIndex) => (
                          <button
                            key={dotIndex}
                            type="button"
                            onClick={() => setRowIndices((prev) => {
                              const next = [...prev];
                              next[rowNum] = dotIndex;
                              return next;
                            })}
                            className={`h-[8px] w-[8px] rounded-full transition ${
                              pageIndex === dotIndex ? "bg-[#121212]" : "bg-[#cccccc]"
                            }`}
                            aria-label={`Show item ${dotIndex + 1} in row ${rowNum + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* As Seen On */}
        <section className="relative overflow-hidden bg-[#000] mt-8">
          <div className="pt-2 pb-3 text-center">
            <h2 className="text-[36px] font-extrabold tracking-[0.08em] text-white">
              As Seen On:
            </h2>
          </div>

          <div className="overflow-hidden pb-2">
            <div className="animate-marquee flex w-max items-center">
              {[...Array(4)].map((_, setIdx) => (
                <div key={setIdx} className="flex items-center gap-[100px] pr-[100px]">
                  <img src="/images/Harvard.png" alt="Harvard Business Review" className="h-[48px] w-auto object-contain" />
                  <img src="/images/TLN.png" alt="The Learning Network" className="h-[48px] w-auto object-contain" />
                  <img src="/images/Wired.png" alt="Wired" className="h-[48px] w-auto object-contain" />
                </div>
              ))}
            </div>
          </div>

          {/* Wave bottom */}
          <div className="pointer-events-none">
            <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full block" style={{height: "60px"}}>
              <path d="M0,0 L0,40 Q360,80 720,40 Q1080,0 1440,40 L1440,80 L0,80 Z" fill="#ffffff"/>
            </svg>
          </div>
        </section>

        <section className="bg-white py-6 md:py-16">
          <div className="mx-auto max-w-[1320px] px-[16px] md:px-[24px] pt-[8px] md:pt-[30px] pb-[6px]">
            <div className="mx-auto max-w-[1320px] text-center">
              <h2 className="text-[30px] md:text-[36px] font-extrabold leading-[1.2] tracking-[0.06rem] text-[#121212]">
                Why is it free?
              </h2>

              <p className="mx-auto mt-6 text-[14px] md:text-[15px] leading-[1.6] text-[#555] md:whitespace-nowrap">
                During our{" "}
                <span className="font-extrabold text-[#222]">Anniversary Sale</span>, we're giving away{" "}
                <span className="font-extrabold text-[#222]">100 Notes for FREE!</span> We just ask that you
                cover the processing fee. Help us spread the word!
              </p>
            </div>

            <div className="mt-6 md:mt-16 grid items-center gap-[20px] md:gap-[60px] lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <div className="w-full aspect-square overflow-hidden rounded-[14px]">
                  <img
                    src="/images/C1.gif"
                    alt="Photography guides preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div>
                <h3 className="max-w-[760px] text-[28px] md:text-[36px] font-extrabold leading-[1.2] tracking-[0.06rem] text-[#121212]">
                  Photography Notes – Master Your Camera, Frame with Intention
                </h3>

                <ul className="mt-4 md:mt-8 space-y-3 md:space-y-5 text-[14px] md:text-[15px] leading-[1.6] text-[#555]">
                  {benefits.map((item) => (
                    <li key={item}>✓ {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white pt-8 pb-4 md:pt-12 md:pb-6">
          <div className="mx-auto max-w-[1320px] px-[24px]">
            <div className="grid items-center gap-[20px] md:gap-[60px] lg:grid-cols-[0.95fr_1.05fr]">
              <div className="order-2 lg:order-1">
                <h2 className="max-w-[760px] text-[28px] md:text-[36px] font-extrabold leading-[1.2] tracking-[0.06rem] text-[#121212]">
                  Stay Focused on Your Creative Growth
                </h2>

                <p className="mt-4 md:mt-8 max-w-[680px] text-[14px] md:text-[15px] leading-[1.6] text-[#555]">
                  No more scattered tips or confusing tutorials. These photography notes help you practice with intention, so you can grow with clarity, stay inspired, and truly master your camera — one shot at a time.
                </p>
              </div>

              <div className="order-1 lg:order-2">
                <div className="w-full aspect-square overflow-hidden rounded-[14px]">
                  <img
                    src="/images/C2.jpg"
                    alt="Everything you need to shoot"
                    className="h-auto md:h-[760px] w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white pt-8 pb-4 md:pt-12 md:pb-6">
          <div className="mx-auto max-w-[1320px] px-[24px]">
            <div className="grid items-center gap-[20px] md:gap-[60px] lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <div className="w-full aspect-square overflow-hidden rounded-[14px]">
                  <img
                    src="/images/C3.gif"
                    alt="Your ultimate photography companion"
                    className="h-auto md:h-[760px] w-full object-cover"
                  />
                </div>
              </div>

              <div>
                <h2 className="max-w-[760px] text-[28px] md:text-[36px] font-extrabold leading-[1.2] tracking-[0.06rem] text-[#121212]">
                  Skyrocket Your Visual Awareness
                </h2>

                <p className="mt-4 md:mt-8 max-w-[700px] text-[14px] md:text-[15px] leading-[1.6] text-[#555]">
                  Photography Notes give you a clear, empowering path to improve — no more random YouTube dives or guesswork. Unlock creative confidence, technical skills, and a deeper connection with your unique style on every page.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white pt-4 pb-8 md:pt-8 md:pb-16">
          <div className="mx-auto max-w-[1320px] px-[24px]">
            <div className="text-center">
              <h2 className="text-[30px] md:text-[36px] font-extrabold leading-[1.2] tracking-[0.06rem] text-[#111]">
                Join Thousands of Photography Lovers!
              </h2>

              <div className="mt-6 flex items-center justify-center gap-3 text-[#444]">
                <span className="text-[16px] md:text-[18px] font-medium">Excellent</span>
                <span className="text-[22px] md:text-[24px] font-bold text-black">
                  4.9 / 5
                </span>

                <div className="flex gap-[3px]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className="flex h-[22px] w-[22px] items-center justify-center bg-[#12b981] text-[13px] text-white md:h-[24px] md:w-[24px]"
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile carousel */}
            <div className="mt-6 lg:hidden">
              <div className="rounded-[24px] bg-[#f3f4f6] px-8 pb-7 pt-7 text-center">
                <div className="flex justify-center gap-[3px]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="flex h-[22px] w-[22px] items-center justify-center bg-[#12b981] text-[13px] text-white">★</span>
                  ))}
                </div>
                <h3 className="mx-auto mt-6 max-w-[430px] text-[18px] font-bold leading-[1.3] text-[#111]">
                  {testimonialCards[activeTestimonial].title}
                </h3>
                <p className="mx-auto mt-6 max-w-[470px] text-[14px] leading-[1.6] text-[#555]">
                  {testimonialCards[activeTestimonial].body}
                </p>
                <div className="mt-6 border-t border-[#d7d7d7]" />
                <div className="mt-4 flex items-center justify-center gap-3">
                  <img src={testimonialCards[activeTestimonial].image} alt={testimonialCards[activeTestimonial].name} className="h-[40px] w-[40px] rounded-full object-cover" />
                  <span className="text-[13px] font-semibold italic text-[#333]">{testimonialCards[activeTestimonial].name}</span>
                </div>
              </div>
              {/* Arrows + dots */}
              <div className="mt-5 flex items-center justify-center gap-4">
                <button onClick={() => setActiveTestimonial((p) => (p - 1 + testimonialCards.length) % testimonialCards.length)} className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-[#ddd] text-[#555] hover:bg-[#f5f5f5]">‹</button>
                <div className="flex gap-[6px]">
                  {testimonialCards.map((_, i) => (
                    <button key={i} onClick={() => setActiveTestimonial(i)} className={`h-[8px] w-[8px] rounded-full transition ${activeTestimonial === i ? "bg-[#111]" : "bg-[#ccc]"}`} />
                  ))}
                </div>
                <button onClick={() => setActiveTestimonial((p) => (p + 1) % testimonialCards.length)} className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-[#ddd] text-[#555] hover:bg-[#f5f5f5]">›</button>
              </div>
            </div>

            {/* Desktop grid */}
            <div className="mt-12 hidden lg:grid gap-8 lg:grid-cols-3">
              {testimonialCards.map((item) => (
                <div key={item.name} className="rounded-[24px] bg-[#f3f4f6] px-8 pb-7 pt-7 text-center">
                  <div className="flex justify-center gap-[3px]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="flex h-[22px] w-[22px] items-center justify-center bg-[#12b981] text-[13px] text-white">★</span>
                    ))}
                  </div>
                  <h3 className="mx-auto mt-6 max-w-[430px] text-[18px] md:text-[20px] font-bold leading-[1.3] text-[#111]">{item.title}</h3>
                  <p className="mx-auto mt-6 max-w-[470px] text-[14px] leading-[1.6] text-[#555]">{item.body}</p>
                  <div className="mt-6 border-t border-[#d7d7d7]" />
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <img src={item.image} alt={item.name} className="h-[40px] w-[40px] rounded-full object-cover" />
                    <span className="text-[13px] font-semibold italic text-[#333]">{item.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-[24px] md:py-[40px]">
          <div className="mx-auto max-w-[1320px] px-[24px]">
            <div className="grid items-center gap-[40px] lg:gap-[220px] lg:grid-cols-[0.9fr_1.1fr]">
              <div className="flex items-center justify-center lg:justify-start lg:pl-[20px]">
                <h2 className="max-w-[750px] text-center lg:text-center text-[30px] md:text-[36px] font-extrabold leading-[1.12] tracking-[0.06rem] text-[#111]">
                  Loved by 3,000+<br className="hidden md:block" />
                  Photography Fans
                </h2>
              </div>

              <div>
                {stats.map(([value, text], index) => (
                  <div
                    key={value}
                    className={`flex items-center gap-[20px] py-[12px] ${
                      index === 0 ? "border-t border-[#e6e6e6]" : "border-t border-[#e6e6e6]"
                    }`}
                  >
                    <div className="relative shrink-0 h-[74px] w-[74px]">
                      {(() => {
                        const pct = parseInt(value);
                        const r = 32;
                        const circ = 2 * Math.PI * r;
                        const visualPct = pct * 0.96;
                        const dash = (visualPct / 100) * circ;
                        return (
                          <svg width="74" height="74" viewBox="0 0 74 74">
                            <circle cx="37" cy="37" r={r} fill="none" stroke="#f0e0d0" strokeWidth="8" />
                            <circle
                              cx="37" cy="37" r={r} fill="none"
                              stroke="#111" strokeWidth="8"
                              strokeDasharray={`${dash} ${circ}`}
                              strokeLinecap="round"
                              transform="rotate(-90 37 37)"
                            />
                          </svg>
                        );
                      })()}
                      <span className="absolute inset-0 flex items-center justify-center text-[18px] font-extrabold text-[#111]">
                        {value}
                      </span>
                    </div>

                    <p className="text-[15px] md:text-[15px] leading-[1.45] text-[#000]">
                      {text}
                    </p>
                  </div>
                ))}

                <div className="border-t border-[#e6e6e6] pt-[12px]">
                  <p className="text-[13px] leading-[1.45] text-[#000]">
                    Results are from customer surveys conducted 3–6 months after purchase.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-[24px] md:py-[70px]">
          <div className="mx-auto max-w-[1320px] px-[24px]">
            <div className="grid items-center gap-[20px] lg:gap-[58px] lg:grid-cols-[0.9fr_1.1fr]">
              <div className="flex items-center justify-center lg:justify-start lg:pl-[20px]">
                <h2 className="max-w-[520px] text-center lg:text-center text-[30px] md:text-[36px] font-extrabold leading-[1.12] tracking-[0.06rem] text-[#111]">
                  What Makes Our Notes Special?
                </h2>
              </div>

              <div className="flex justify-end pr-0 lg:pr-[40px]">
                <div className="w-full max-w-[500px]">
                  {/* Header row — outside the card */}
                  <div className="grid grid-cols-[1fr_80px_80px] sm:grid-cols-[1fr_95px_95px] items-center pb-4">
                    <div />

                    {/* LOGO */}
                    <div className="flex items-center justify-center">
                      <img
                        src="/images/logo.png"
                        alt="Photography Easy Guide"
                        className="h-[80px] w-auto object-contain"
                      />
                    </div>

                    {/* OTHERS */}
                    <div className="flex items-center justify-center text-[18px] font-bold text-[#111]">
                      Others
                    </div>
                  </div>

                  {/* Table card */}
                  <div className="overflow-hidden rounded-[20px] border border-[#e8e8e8] bg-white shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
                    {comparisonRows.map((row, index) => (
                      <div
                        key={row}
                        className={`grid grid-cols-[1fr_80px_80px] sm:grid-cols-[1fr_95px_95px] ${
                          index !== 0 ? "border-t border-gray-300/50" : ""
                        }`}
                      >
                        <div className="flex min-h-[60px] items-center justify-center bg-[#111] px-[12px] text-center text-[14px] md:text-[20px] font-semibold leading-[1.3] text-white">
                          {row}
                        </div>

                        <div className="flex items-center justify-center border-l border-[#e8e8e8]">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#62b112" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>

                        <div className="flex items-center justify-center border-l border-[#e8e8e8]">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-8 md:py-16">
          <div className="mx-auto max-w-[1320px] px-[24px]">
            {/* Header row */}
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-[2px]">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#f5a623" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-[15px] text-[#666]">10,725 Reviews</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
              <button onClick={() => { setReviewModalOpen(true); setReviewSubmitted(false); }} className="rounded border border-[#ccc] px-4 py-2 text-[14px] text-[#111] bg-white hover:bg-[#f9f9f9] transition">
                Write a review
              </button>
            </div>

            {/* Review cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
              {[
                {
                  name: "Naomi L.",
                  text: "I love how simple and practical everything is explained. It feels like having a patient teacher right beside you.",
                  image: "/images/L1.jpg",
                },
                {
                  name: "Katie R.",
                  text: "This guide made photography feel so much less overwhelming. The step by step instructions are clear, practical, and perfect for beginners who want real results.",
                  image: "/images/L2.jpg",
                },
                {
                  name: "David R.",
                  text: "The step by step breakdowns made tricky techniques feel completely doable. I gained so much confidence after just a few shoots.",
                  image: "/images/L3.jpg",
                },
                {
                  name: "Grace H.",
                  text: "Great for picking up a quick reference while I'm mid-shoot.",
                  image: "/images/L4.jpg",
                },
                {
                  name: "Sophie M.",
                  text: "I've tried many photography guides before but this one is on another level. Everything is laid out so clearly and beautifully.",
                  image: "/images/L5.jpg",
                },
                {
                  name: "Daniel P.",
                  text: "Incredible value! I use it every single time I grab my camera. It's become my go-to reference.",
                  image: "/images/L6.jpg",
                },
                {
                  name: "Diana K.",
                  text: "Such a well put together resource. I feel so much more confident tackling new projects now.",
                  image: "/images/L7.jpg",
                },
                {
                  name: "Laura B.",
                  text: "Perfect for beginners and experienced photographers alike. I keep coming back to it for every new shoot.",
                  image: "/images/L8.jpg",
                },
                {
                  name: "Kevin H.",
                  text: "This is exactly what I needed to push my photography skills further. So well organized and easy to follow.",
                  image: "/images/L9.jpg",
                },
                {
                  name: "Chloe F.",
                  text: "Absolutely love the variety of guides included. There's something useful for every skill level.",
                  image: "/images/L10.jpg",
                },
              ].map((review, i) => (
                <div key={i} className="bg-white">
                  <div className="relative w-full aspect-square overflow-hidden">
                    <Image
                      src={review.image}
                      alt={review.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[14px] font-semibold text-[#111]">{review.name}</span>
                    <span className="flex items-center gap-[3px] rounded-full bg-[#e8f4ea] px-2 py-[2px] text-[11px] text-[#3a7d44]">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="#3a7d44" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17l-5-5"/>
                        <path d="M20 6L9 17l-5-5" stroke="#3a7d44" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      </svg>
                      Verified
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-[2px]">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} width="13" height="13" viewBox="0 0 24 24" fill="#f5a623" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="mt-2 text-[13px] leading-[1.5] text-[#555]">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer id="contact" className="bg-[#111] py-16">
          <div className="mx-auto max-w-[1320px] px-[24px]">
            <div className="grid gap-14 md:grid-cols-[auto_1fr_1fr_1fr] md:gap-24">

              {/* Logo column */}
              <div className="flex items-start">
                <img
                  src="/images/logo.png"
                  alt="Photography Easy Guide"
                  className="h-[80px] w-auto object-contain brightness-0 invert"
                />
              </div>

              {/* Contact Info */}
              <div>
                <h2 className="text-[20px] font-extrabold tracking-[0.04em] text-white">Contact Info</h2>
                <p className="mt-5 flex items-start gap-3 text-[15px] leading-[1.8] tracking-[0.02em] text-white">
                  <span>📧</span> photography@easyguide.store
                </p>
                <p className="mt-5 flex items-start gap-3 text-[15px] leading-[1.8] tracking-[0.02em] text-white">
                  <span className="mt-[2px]">🌐</span>
                  <span>All products are digital downloads, delivered instantly via email</span>
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h2 className="text-[20px] font-extrabold tracking-[0.04em] text-white">Quick links</h2>
                <ul className="mt-6 space-y-4 text-[15px] tracking-[0.02em]">
                  {quickLinks.map((item) => (
                    <li key={item.label}>
                      <a href={item.href} className="text-white no-underline hover:underline">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Subscribe */}
              <div>
                <h2 className="text-[20px] font-extrabold tracking-[0.04em] text-white">Subscribe to our emails</h2>
                <p className="mt-6 text-[15px] leading-[1.8] tracking-[0.02em] text-white">
                  Join our email list for exclusive offers and the latest news.
                </p>
                <div className="mt-6 flex flex-col gap-4">
                  <input
                    className="w-full rounded-[6px] border border-white bg-transparent px-4 py-3 text-[16px] text-white placeholder-white/70 outline-none"
                    placeholder="Email"
                  />
                  <button className="w-full rounded-[6px] bg-white py-3 text-[16px] font-bold text-[#111]">
                    Sign up
                  </button>
                </div>
              </div>

            </div>

            {/* Payment icons + copyright */}
            <div className="mt-12 border-t border-white/20 pt-8 text-center">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {[
                  "/images/payments/amex.svg",
                  "/images/payments/applepay.svg",
                  "/images/payments/googlepay.svg",
                  "/images/payments/maestro.svg",
                  "/images/payments/mastercard.svg",
                  "/images/payments/paypal.svg",
                  "/images/payments/shop.svg",
                  "/images/payments/unionpay.svg",
                  "/images/payments/visa.svg",
                ].map((src, i) => (
                  <img key={i} src={src} alt="payment" className="h-[28px] w-auto object-contain" />
                ))}
              </div>
              <p className="mt-4 text-[12px] text-white/70">
                © 2026, Photography Easy Guide
              </p>
            </div>
          </div>
        </footer>
      </main>

      {isCartOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/45"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 flex h-screen w-full max-w-[min(430px,100vw)] flex-col bg-white shadow-[-8px_0_30px_rgba(0,0,0,0.18)] transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#f3f3f3] px-6 py-5">
          <h2 className="text-[24px] font-extrabold text-[#111]">
            Cart • {cartCount} item{cartCount === 1 ? "" : "s"}
          </h2>

          <button
            onClick={() => setIsCartOpen(false)}
            className="text-[#222] hover:opacity-70"
            aria-label="Close cart"
          >
            <X size={30} strokeWidth={1.6} />
          </button>
        </div>

        <div className="bg-black px-6 py-3 text-center text-[14px] font-bold text-white">
          Cart reserved for 04:54
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag size={42} strokeWidth={1.6} className="text-[#c7c7c7]" />
              <p className="mt-4 text-[18px] font-bold text-[#222]">Your cart is empty</p>
              <p className="mt-2 text-[14px] text-[#666]">
                Add an item and it will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {cart.map((item) => {
                const savings =
                  ((item.compareAtPrice || item.price) - item.price) * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 border-b border-[#f3f3f3] px-2 py-5"
                  >
                    <div className="relative flex h-[80px] w-[80px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] border border-[#dddddd] bg-white">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain p-2"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-[15px] font-extrabold leading-[1.2] text-[#111]">
                          {item.name}
                        </h3>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="shrink-0 text-[#666] hover:text-black"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={18} strokeWidth={1.8} />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-4">
                        <div className="flex items-center rounded-[8px] border border-[#d8d8d8]">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="px-3 py-2 text-[18px] text-[#333]"
                          >
                            −
                          </button>
                          <span className="min-w-[34px] text-center text-[15px] font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQuantity(item.id)}
                            className="px-3 py-2 text-[18px] text-[#333]"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {item.compareAtPrice > item.price && (
                              <span className="text-[13px] text-[#111] line-through">
                                ${(item.compareAtPrice * item.quantity).toFixed(2)}
                              </span>
                            )}
                            <span className="text-[15px] font-extrabold text-[#111]">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                          {savings > 0 && (
                            <div className="text-[14px] font-bold text-[#111111]">
                              (You save ${savings.toFixed(2)})
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-[#f3f3f3] px-5 py-5">
          <div className="flex items-center justify-between text-[16px] font-bold text-[#111]">
            <span>Savings</span>
            <span>-${totalSavings.toFixed(2)}</span>
          </div>

          <div className="mt-2 flex items-center justify-between text-[22px] font-extrabold text-[#111]">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="mt-5 w-full rounded-[10px] bg-[#111] py-4 text-[16px] font-extrabold text-white transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Check out
          </button>

          <div className="mt-4 flex flex-col items-center gap-2">
            <div className="flex items-center justify-center gap-2">
              {[
                "/images/payments/amex.svg",
                "/images/payments/applepay.svg",
                "/images/payments/googlepay.svg",
                "/images/payments/maestro.svg",
                "/images/payments/mastercard.svg",
                "/images/payments/paypal.svg",
                "/images/payments/shop.svg",
              ].map((src, i) => (
                <img key={i} src={src} alt="payment" className="h-[28px] w-auto object-contain" />
              ))}
            </div>
            <div className="flex items-center justify-center gap-2">
              {[
                "/images/payments/unionpay.svg",
                "/images/payments/visa.svg",
              ].map((src, i) => (
                <img key={i} src={src} alt="payment" className="h-[28px] w-auto object-contain" />
              ))}
            </div>
          </div>
        </div>
      </aside>

      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#e5e5e5] bg-white px-4 py-3 shadow-[0_-6px_30px_rgba(0,0,0,0.12)]">
          <div className="mx-auto flex max-w-[1320px] items-center gap-3">

            {/* IMAGE */}
            <div className="flex h-[54px] w-[54px] shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-[#e5e5e5] bg-white">
              <img
                src="/images/main.gif"
                alt="1.000+ Free Photography Easy Guide"
                className="h-full w-full object-contain"
              />
            </div>

            {/* TEXT */}
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-extrabold leading-tight text-[#111]">
                1.000+ Free Photography Easy Guide
              </p>
              <div className="mt-[3px] flex items-center gap-[6px]">
                <span className="text-[16px] font-extrabold text-[#111]">$0.00</span>
                <span className="text-[13px] font-extrabold text-[#000000] line-through">$99.99</span>
              </div>
            </div>

            {/* BUTTON */}
            <button
              onClick={handleMainAddToCart}
              className="shrink-0 rounded-[8px] bg-[#111] px-6 py-[13px] text-[15px] font-extrabold text-white shadow-md transition hover:bg-[#333]"
            >
              Add to cart
            </button>

          </div>
        </div>
      )}

      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={() => setReviewModalOpen(false)}>
          <div className="w-full max-w-[420px] rounded-[16px] bg-white p-8 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-[22px] font-bold text-[#111]">Write a Review</h2>
              <button onClick={() => setReviewModalOpen(false)} className="text-[#888] hover:text-[#111]"><X size={22} /></button>
            </div>

            {reviewSubmitted ? (
              <p className="mt-6 text-center text-[16px] text-[#444]">Thank you for your review! 🎉</p>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setReviewSubmitted(true); }} className="mt-6 space-y-4">
                <div>
                  <label className="block text-[14px] font-semibold text-[#111] mb-1">Your Name</label>
                  <input
                    required
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full rounded-[8px] border border-[#ddd] px-4 py-3 text-[14px] outline-none focus:border-[#111]"
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-semibold text-[#111] mb-1">Rating</label>
                  <select
                    required
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm((p) => ({ ...p, rating: e.target.value }))}
                    className="w-full rounded-[8px] border border-[#ddd] px-4 py-3 text-[14px] outline-none focus:border-[#111]"
                  >
                    <option value="">Select</option>
                    <option value="5">★★★★★ — 5 Stars</option>
                    <option value="4">★★★★☆ — 4 Stars</option>
                    <option value="3">★★★☆☆ — 3 Stars</option>
                    <option value="2">★★☆☆☆ — 2 Stars</option>
                    <option value="1">★☆☆☆☆ — 1 Star</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[14px] font-semibold text-[#111] mb-1">Review</label>
                  <textarea
                    required
                    rows={4}
                    value={reviewForm.text}
                    onChange={(e) => setReviewForm((p) => ({ ...p, text: e.target.value }))}
                    className="w-full rounded-[8px] border border-[#ddd] px-4 py-3 text-[14px] outline-none focus:border-[#111] resize-none"
                  />
                </div>
                <button type="submit" className="w-full rounded-[8px] bg-[#111] py-3 text-[15px] font-bold text-white hover:bg-[#333] transition">
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
