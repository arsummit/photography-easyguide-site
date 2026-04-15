"use client";

import { useEffect, useMemo, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const ALL_COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria",
  "Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan",
  "Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia",
  "Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo (DRC)","Congo (Republic)",
  "Costa Rica","Côte d'Ivoire","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic",
  "Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland",
  "France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea",
  "Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq",
  "Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait",
  "Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg",
  "Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico",
  "Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru",
  "Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman",
  "Pakistan","Palau","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar",
  "Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","São Tomé and Príncipe","Saudi Arabia",
  "Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa",
  "South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan",
  "Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan",
  "Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City",
  "Venezuela","Vietnam","Yemen","Zambia","Zimbabwe",
];

// Country-specific address field config
const COUNTRY_CONFIG = {
  "United States": {
    cityLabel: "City", postalLabel: "ZIP code", regionLabel: "State", postalFirst: false,
    regions: ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"],
  },
  "Canada": {
    cityLabel: "City", postalLabel: "Postal code", regionLabel: "Province", postalFirst: false,
    regions: ["Alberta","British Columbia","Manitoba","New Brunswick","Newfoundland and Labrador","Northwest Territories","Nova Scotia","Nunavut","Ontario","Prince Edward Island","Quebec","Saskatchewan","Yukon"],
  },
  "Australia": {
    cityLabel: "Suburb", postalLabel: "Postcode", regionLabel: "State/territory", postalFirst: false,
    regions: ["Australian Capital Territory","New South Wales","Northern Territory","Queensland","South Australia","Tasmania","Victoria","Western Australia"],
  },
  "United Arab Emirates": {
    cityLabel: "City", postalLabel: null, regionLabel: "Emirate", postalFirst: false,
    regions: ["Abu Dhabi","Ajman","Dubai","Fujairah","Ras Al Khaimah","Sharjah","Umm Al Quwain"],
  },
};

const DIAL_CODES = {
  "Afghanistan":"+93","Albania":"+355","Algeria":"+213","Andorra":"+376","Angola":"+244",
  "Argentina":"+54","Armenia":"+374","Australia":"+61","Austria":"+43","Azerbaijan":"+994",
  "Bahrain":"+973","Bangladesh":"+880","Belarus":"+375","Belgium":"+32","Belize":"+501",
  "Bolivia":"+591","Bosnia and Herzegovina":"+387","Botswana":"+267","Brazil":"+55",
  "Brunei":"+673","Bulgaria":"+359","Cambodia":"+855","Canada":"+1","Chile":"+56",
  "China":"+86","Colombia":"+57","Costa Rica":"+506","Croatia":"+385","Cuba":"+53",
  "Cyprus":"+357","Czech Republic":"+420","Denmark":"+45","Dominican Republic":"+1",
  "Ecuador":"+593","Egypt":"+20","El Salvador":"+503","Estonia":"+372","Ethiopia":"+251",
  "Fiji":"+679","Finland":"+358","France":"+33","Germany":"+49","Ghana":"+233",
  "Greece":"+30","Guatemala":"+502","Haiti":"+509","Honduras":"+504","Hungary":"+36",
  "Iceland":"+354","India":"+91","Indonesia":"+62","Iran":"+98","Iraq":"+964",
  "Ireland":"+353","Israel":"+972","Italy":"+39","Jamaica":"+1","Japan":"+81",
  "Jordan":"+962","Kazakhstan":"+7","Kenya":"+254","Kuwait":"+965","Latvia":"+371",
  "Lebanon":"+961","Liechtenstein":"+423","Lithuania":"+370","Luxembourg":"+352",
  "Malaysia":"+60","Malta":"+356","Mexico":"+52","Moldova":"+373","Monaco":"+377",
  "Morocco":"+212","Mozambique":"+258","Myanmar":"+95","Nepal":"+977",
  "Netherlands":"+31","New Zealand":"+64","Nicaragua":"+505","Nigeria":"+234",
  "Norway":"+47","Oman":"+968","Pakistan":"+92","Panama":"+507","Paraguay":"+595",
  "Peru":"+51","Philippines":"+63","Poland":"+48","Portugal":"+351","Qatar":"+974",
  "Romania":"+40","Russia":"+7","Rwanda":"+250","Saudi Arabia":"+966","Serbia":"+381",
  "Singapore":"+65","Slovakia":"+421","Slovenia":"+386","South Africa":"+27",
  "South Korea":"+82","Spain":"+34","Sri Lanka":"+94","Sweden":"+46",
  "Switzerland":"+41","Syria":"+963","Taiwan":"+886","Thailand":"+66","Tunisia":"+216",
  "Turkey":"+90","Ukraine":"+380","United Arab Emirates":"+971","United Kingdom":"+44",
  "United States":"+1","Uruguay":"+598","Uzbekistan":"+998","Venezuela":"+58",
  "Vietnam":"+84","Yemen":"+967","Zambia":"+260","Zimbabwe":"+263",
};

const COUNTRY_CODES = {
  "Afghanistan": "AF",
  "Albania": "AL",
  "Algeria": "DZ",
  "Andorra": "AD",
  "Angola": "AO",
  "Antigua and Barbuda": "AG",
  "Argentina": "AR",
  "Armenia": "AM",
  "Australia": "AU",
  "Austria": "AT",
  "Azerbaijan": "AZ",
  "Bahamas": "BS",
  "Bahrain": "BH",
  "Bangladesh": "BD",
  "Barbados": "BB",
  "Belarus": "BY",
  "Belgium": "BE",
  "Belize": "BZ",
  "Benin": "BJ",
  "Bhutan": "BT",
  "Bolivia": "BO",
  "Bosnia and Herzegovina": "BA",
  "Botswana": "BW",
  "Brazil": "BR",
  "Brunei": "BN",
  "Bulgaria": "BG",
  "Burkina Faso": "BF",
  "Burundi": "BI",
  "Cabo Verde": "CV",
  "Cambodia": "KH",
  "Cameroon": "CM",
  "Canada": "CA",
  "Central African Republic": "CF",
  "Chad": "TD",
  "Chile": "CL",
  "China": "CN",
  "Colombia": "CO",
  "Comoros": "KM",
  "Congo (DRC)": "CD",
  "Congo (Republic)": "CG",
  "Costa Rica": "CR",
  "Côte d'Ivoire": "CI",
  "Croatia": "HR",
  "Cuba": "CU",
  "Cyprus": "CY",
  "Czech Republic": "CZ",
  "Denmark": "DK",
  "Djibouti": "DJ",
  "Dominica": "DM",
  "Dominican Republic": "DO",
  "Ecuador": "EC",
  "Egypt": "EG",
  "El Salvador": "SV",
  "Equatorial Guinea": "GQ",
  "Eritrea": "ER",
  "Estonia": "EE",
  "Eswatini": "SZ",
  "Ethiopia": "ET",
  "Fiji": "FJ",
  "Finland": "FI",
  "France": "FR",
  "Gabon": "GA",
  "Gambia": "GM",
  "Georgia": "GE",
  "Germany": "DE",
  "Ghana": "GH",
  "Greece": "GR",
  "Grenada": "GD",
  "Guatemala": "GT",
  "Guinea": "GN",
  "Guinea-Bissau": "GW",
  "Guyana": "GY",
  "Haiti": "HT",
  "Honduras": "HN",
  "Hungary": "HU",
  "Iceland": "IS",
  "India": "IN",
  "Indonesia": "ID",
  "Iran": "IR",
  "Iraq": "IQ",
  "Ireland": "IE",
  "Israel": "IL",
  "Italy": "IT",
  "Jamaica": "JM",
  "Japan": "JP",
  "Jordan": "JO",
  "Kazakhstan": "KZ",
  "Kenya": "KE",
  "Kiribati": "KI",
  "Kuwait": "KW",
  "Kyrgyzstan": "KG",
  "Laos": "LA",
  "Latvia": "LV",
  "Lebanon": "LB",
  "Lesotho": "LS",
  "Liberia": "LR",
  "Libya": "LY",
  "Liechtenstein": "LI",
  "Lithuania": "LT",
  "Luxembourg": "LU",
  "Madagascar": "MG",
  "Malawi": "MW",
  "Malaysia": "MY",
  "Maldives": "MV",
  "Mali": "ML",
  "Malta": "MT",
  "Marshall Islands": "MH",
  "Mauritania": "MR",
  "Mauritius": "MU",
  "Mexico": "MX",
  "Micronesia": "FM",
  "Moldova": "MD",
  "Monaco": "MC",
  "Mongolia": "MN",
  "Montenegro": "ME",
  "Morocco": "MA",
  "Mozambique": "MZ",
  "Myanmar": "MM",
  "Namibia": "NA",
  "Nauru": "NR",
  "Nepal": "NP",
  "Netherlands": "NL",
  "New Zealand": "NZ",
  "Nicaragua": "NI",
  "Niger": "NE",
  "Nigeria": "NG",
  "North Korea": "KP",
  "North Macedonia": "MK",
  "Norway": "NO",
  "Oman": "OM",
  "Pakistan": "PK",
  "Palau": "PW",
  "Panama": "PA",
  "Papua New Guinea": "PG",
  "Paraguay": "PY",
  "Peru": "PE",
  "Philippines": "PH",
  "Poland": "PL",
  "Portugal": "PT",
  "Qatar": "QA",
  "Romania": "RO",
  "Russia": "RU",
  "Rwanda": "RW",
  "Saint Kitts and Nevis": "KN",
  "Saint Lucia": "LC",
  "Saint Vincent and the Grenadines": "VC",
  "Samoa": "WS",
  "San Marino": "SM",
  "São Tomé and Príncipe": "ST",
  "Saudi Arabia": "SA",
  "Senegal": "SN",
  "Serbia": "RS",
  "Seychelles": "SC",
  "Sierra Leone": "SL",
  "Singapore": "SG",
  "Slovakia": "SK",
  "Slovenia": "SI",
  "Solomon Islands": "SB",
  "Somalia": "SO",
  "South Africa": "ZA",
  "South Korea": "KR",
  "South Sudan": "SS",
  "Spain": "ES",
  "Sri Lanka": "LK",
  "Sudan": "SD",
  "Suriname": "SR",
  "Sweden": "SE",
  "Switzerland": "CH",
  "Syria": "SY",
  "Taiwan": "TW",
  "Tajikistan": "TJ",
  "Tanzania": "TZ",
  "Thailand": "TH",
  "Timor-Leste": "TL",
  "Togo": "TG",
  "Tonga": "TO",
  "Trinidad and Tobago": "TT",
  "Tunisia": "TN",
  "Turkey": "TR",
  "Turkmenistan": "TM",
  "Tuvalu": "TV",
  "Uganda": "UG",
  "Ukraine": "UA",
  "United Arab Emirates": "AE",
  "United Kingdom": "GB",
  "United States": "US",
  "Uruguay": "UY",
  "Uzbekistan": "UZ",
  "Vanuatu": "VU",
  "Vatican City": "VA",
  "Venezuela": "VE",
  "Vietnam": "VN",
  "Yemen": "YE",
  "Zambia": "ZM",
  "Zimbabwe": "ZW",
};

// EU + countries with postal code before city, no region
const POSTAL_CITY_COUNTRIES = new Set([
  "Austria","Belgium","Bulgaria","Croatia","Cyprus","Czech Republic","Denmark","Estonia","Finland",
  "France","Germany","Greece","Hungary","Iceland","Ireland","Italy","Latvia","Liechtenstein",
  "Lithuania","Luxembourg","Malta","Netherlands","Norway","Poland","Portugal","Romania",
  "Slovakia","Slovenia","Spain","Sweden","Switzerland","United Kingdom",
]);

function getCountryConfig(country) {
  if (COUNTRY_CONFIG[country]) return COUNTRY_CONFIG[country];
  if (POSTAL_CITY_COUNTRIES.has(country)) return { cityLabel: "City", postalLabel: "Postal code", regionLabel: null, postalFirst: true };
  return { cityLabel: "City", postalLabel: "Postal code", regionLabel: null, postalFirst: false };
}

const cardStyle = {
  base: {
    fontSize: "16px",
    color: "#111111",
    fontFamily: "inherit",
    "::placeholder": { color: "#aaaaaa" },
  },
  invalid: { color: "#e12d2d" },
};

// ── Inner form (needs to be inside <Elements>) ────────────────────────────────
function PaymentForm({ email, onEmailChange, subtotal, processingFee, onProcessingFeeChange, cart, clientSecret, onOpenPolicyModal }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const showEmailError = (emailTouched || !!fieldErrors.email) && email.trim() === "";

  const [country, setCountry] = useState("United States");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [region, setRegion] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  const validatePostal = (code, ctry) => {
    const c = code.trim();
    if (!c) return false;
    if (ctry === "United States") return /^\d{5}(-\d{4})?$/.test(c);
    if (ctry === "Canada") return /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(c);
    if (ctry === "Australia") return /^\d{4}$/.test(c);
    if (ctry === "United Kingdom") return /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s*\d[A-Za-z]{2}$/.test(c);
    return c.length >= 3;
  };

  const upsells = [
    {
      title: "Drawing Easy Guide Premium (Instant Processing + Priority Support + 5 Free Gifts)",
      oldPrice: "$99.99 USD",
      price: "$4.99",
      savings: "$95.00 Savings",
      button: "Upgrade",
      image: "/images/checkout/premium.jpeg",
    },
    {
      title: "Mystery Box ($199 Worth Of Products)",
      oldPrice: "$199.99 USD",
      price: "$9.99",
      savings: "$190.00 Savings",
      button: "Add",
      image: "/images/checkout/mysterybox.webp",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    // Validate all required fields at once
    const cfg = getCountryConfig(country);
    const errors = {};
    if (!email.trim()) errors.email = "Enter an email or phone number";
    if (!lastName.trim()) errors.lastName = "Enter a last name";
    if (!address.trim()) errors.address = "Enter an address";
    if (!city.trim()) errors.city = `Enter a ${cfg.cityLabel.toLowerCase()}`;
    if (cfg.regionLabel && !region) errors.region = "Select a state / province";
    if (cfg.postalLabel && !validatePostal(postalCode, country)) {
      errors.postalCode = `Enter a valid ZIP / postal code for ${country}`;
    }
    if (Object.keys(errors).length > 0) {
      setEmailTouched(true);
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setLoading(true);
    setErrorMsg("");

    // Re-create PaymentIntent with email so webhook receives it
    let finalClientSecret = clientSecret;
    try {
      const res = await fetch("/api/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: cart, email: email.trim(), processingFee }),
      });
      const data = await res.json();
      if (data.clientSecret) finalClientSecret = data.clientSecret;
    } catch {}

    if (!finalClientSecret) {
      setErrorMsg("Payment setup is not ready yet. Please try again.");
      setLoading(false);
      return;
    }
    
    const countryCode = COUNTRY_CODES[country];

    if (!countryCode) {
      setErrorMsg(`Unsupported country selected: ${country}`);
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);
    const { error, paymentIntent } = await stripe.confirmCardPayment(finalClientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: nameOnCard.trim() || `${firstName} ${lastName}`.trim() || undefined,
          email: email.trim(),
          address: {
            line1: address || undefined,
            line2: apartment || undefined,
            city: city || undefined,
            state: region || undefined,
            postal_code: postalCode || undefined,
            country: countryCode,
          },
        },
      },
      receipt_email: email,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      window.location.href = `${window.location.origin}/success?payment_intent=${paymentIntent.id}`;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Reservation banner */}
      <div className="rounded-[12px] border border-[#edc68f] bg-[#f7eddc] px-5 py-5">
        <div className="flex gap-4">
          <div className="pt-[2px] text-[19px] text-[#9a742c]">⚠️</div>
          <div>
            <h2 className="text-[16px] font-semibold leading-[1.45] text-[#2a241d]">
              Your order is reserved for 10 Minutes!
            </h2>
            <p className="mt-2 text-[15px] leading-[1.6] text-[#3b342b]">
              During our Anniversary Sale, your selected products are selling fast, so
              we&apos;ve reserved your order for you
            </p>
          </div>
        </div>
      </div>

      {/* Upsells */}
      <h3 className="mt-7 text-[18px] font-medium text-[#232323]">
        Anniversary Sale Specials :)
      </h3>
      <div className="mt-5 space-y-5">
        {upsells.map((item) => (
          <div key={item.title} className="flex items-start gap-4">
            <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-[#e4e4e4] bg-white">
              <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[16px] font-semibold leading-[1.35] text-[#1f1f1f]">{item.title}</p>
              <div className="mt-1 text-[15px]">
                <span className="text-[#8d8d8d] line-through">{item.oldPrice}</span>
                <span className="ml-1 text-[#5f5f5f]">{item.price}</span>
              </div>
              <div className="mt-2 text-[15px] font-semibold text-[#538154]">{item.savings}</div>
            </div>
            <button type="button" className="rounded-[10px] bg-[#e8919c] px-7 py-[13px] text-[16px] font-semibold text-black transition hover:opacity-95">
              {item.button}
            </button>
          </div>
        ))}
      </div>

      {/* Express checkout */}
      <div className="mt-7 text-center text-[14px] text-[#767676]">Express checkout</div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <button type="button" className="flex h-[52px] items-center justify-center rounded-[8px] bg-[#5b31f4] transition hover:opacity-95">
          <img src="/images/checkout/shop.svg" alt="Shop Pay" className="h-[28px] w-auto object-contain" />
        </button>
        <button type="button" className="flex h-[52px] items-center justify-center rounded-[8px] bg-[#f7c43a] transition hover:opacity-95">
          <img src="/images/checkout/paypal.png" alt="PayPal" className="h-[40px] w-auto object-contain" />
        </button>
        <button type="button" className="flex h-[52px] items-center justify-center rounded-[8px] bg-black transition hover:opacity-95">
          <img src="/images/checkout/gpay2.png" alt="Google Pay" className="h-[35px] w-auto object-contain" />
        </button>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-[#dddddd]" />
        <span className="text-[13px] font-medium uppercase tracking-[0.03em] text-[#777777]">OR</span>
        <div className="h-px flex-1 bg-[#dddddd]" />
      </div>

      {/* Email */}
      <div className="mt-8">
        <h2 className="text-[18px] font-semibold text-[#111111]">Email or Phone</h2>
      </div>
      <input
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        onBlur={() => setEmailTouched(true)}
        placeholder="Email or mobile phone number"
        className={`mt-4 h-[52px] w-full rounded-[10px] bg-white px-4 text-[16px] outline-none ${
          showEmailError ? "border border-[#e12d2d] ring-1 ring-[#e12d2d]" : "border border-[#d9d9d9]"
        }`}
      />
      {showEmailError && <p className="mt-2 text-[14px] text-[#e12d2d]">Enter an email or phone number</p>}

      <label className="mt-5 flex items-start gap-3">
        <input type="checkbox" className="mt-[3px] h-[20px] w-[20px] rounded border-[#cccccc]" />
        <span className="text-[15px] leading-[1.5] text-[#222222]">
          I opt in to receive email marketing from Drawing Easy Guide about promotions and new offers.
        </span>
      </label>

      {/* Address */}
      <h2 className="mt-12 text-[18px] font-semibold text-[#111111]">Digital Processing Address</h2>
      <div className="mt-4 grid gap-4">
        <div className="relative rounded-[10px] border border-[#d9d9d9] bg-white px-4 pt-[8px] pb-[6px]">
          <label className="block text-[11px] font-medium text-[#777777]">Country/Region</label>
          <select
            value={country}
            onChange={(e) => { setCountry(e.target.value); setRegion(""); }}
            className="w-full bg-transparent text-[16px] font-medium text-[#111111] outline-none appearance-none pr-6"
          >
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="United Arab Emirates">United Arab Emirates</option>
            <option disabled>---</option>
            {ALL_COUNTRIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#777]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name (optional)" className="h-[52px] rounded-[10px] border border-[#d9d9d9] bg-white px-4 text-[16px] outline-none" />
          <div>
            <input
              value={lastName}
              onChange={(e) => { setLastName(e.target.value); if (e.target.value.trim()) setFieldErrors((p) => ({ ...p, lastName: undefined })); }}
              placeholder="Last name"
              className={`h-[52px] w-full rounded-[10px] bg-white px-4 text-[16px] outline-none ${fieldErrors.lastName ? "border border-[#e12d2d] ring-1 ring-[#e12d2d]" : "border border-[#d9d9d9]"}`}
            />
            {fieldErrors.lastName && <p className="mt-1 text-[13px] text-[#e12d2d]">{fieldErrors.lastName}</p>}
          </div>
        </div>
        <div>
          <div className="relative">
            <input
              value={address}
              onChange={(e) => { setAddress(e.target.value); if (e.target.value.trim()) setFieldErrors((p) => ({ ...p, address: undefined })); }}
              placeholder="Address"
              className={`h-[52px] w-full rounded-[10px] bg-white px-4 pr-12 text-[16px] outline-none ${fieldErrors.address ? "border border-[#e12d2d] ring-1 ring-[#e12d2d]" : "border border-[#d9d9d9]"}`}
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#aaaaaa]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </span>
          </div>
          {fieldErrors.address && <p className="mt-1 text-[13px] text-[#e12d2d]">{fieldErrors.address}</p>}
        </div>
        <input value={apartment} onChange={(e) => setApartment(e.target.value)} placeholder="Apartment, suite, etc. (optional)" className="h-[52px] rounded-[10px] border border-[#d9d9d9] bg-white px-4 text-[16px] outline-none" />
        {(() => {
          const cfg = getCountryConfig(country);
          const cityInput = (
            <div key="city">
              <input
                value={city}
                onChange={(e) => { setCity(e.target.value); if (e.target.value.trim()) setFieldErrors((p) => ({ ...p, city: undefined })); }}
                placeholder={cfg.cityLabel}
                className={`h-[52px] w-full rounded-[10px] bg-white px-4 text-[16px] outline-none ${fieldErrors.city ? "border border-[#e12d2d] ring-1 ring-[#e12d2d]" : "border border-[#d9d9d9]"}`}
              />
              {fieldErrors.city && <p className="mt-1 text-[13px] text-[#e12d2d]">{fieldErrors.city}</p>}
            </div>
          );
          const postalInput = cfg.postalLabel ? (
            <div key="postal">
              <input
                value={postalCode}
                onChange={(e) => {
                  setPostalCode(e.target.value);
                  onProcessingFeeChange(e.target.value.trim() !== "" ? 7 : 0);
                  if (validatePostal(e.target.value, country)) setFieldErrors((p) => ({ ...p, postalCode: undefined }));
                }}
                placeholder={cfg.postalLabel}
                className={`h-[52px] w-full rounded-[10px] bg-white px-4 text-[16px] outline-none ${fieldErrors.postalCode ? "border border-[#e12d2d] ring-1 ring-[#e12d2d]" : "border border-[#d9d9d9]"}`}
              />
              {fieldErrors.postalCode && <p className="mt-1 text-[13px] text-[#e12d2d]">{fieldErrors.postalCode}</p>}
            </div>
          ) : null;
          const regionSelect = cfg.regionLabel ? (
            <div key="region">
              <select
                value={region}
                onChange={(e) => { setRegion(e.target.value); if (e.target.value) setFieldErrors((p) => ({ ...p, region: undefined })); }}
                className={`h-[52px] w-full rounded-[10px] bg-white px-4 text-[16px] outline-none ${fieldErrors.region ? "border border-[#e12d2d] ring-1 ring-[#e12d2d]" : "border border-[#d9d9d9]"}`}
                style={{ color: region === "" ? "#aaaaaa" : "#111111" }}
              >
                <option value="" style={{ color: "#aaaaaa" }}>{cfg.regionLabel}</option>
                {cfg.regions.map((r) => <option key={r} style={{ color: "#111111" }}>{r}</option>)}
              </select>
              {fieldErrors.region && <p className="mt-1 text-[13px] text-[#e12d2d]">{fieldErrors.region}</p>}
            </div>
          ) : null;

          // Build the columns: city | region | postal (or permutations)
          const cols = cfg.postalFirst
            ? [postalInput, cityInput].filter(Boolean)
            : cfg.regionLabel
              ? [cityInput, regionSelect, postalInput].filter(Boolean)
              : [postalInput, cityInput].filter(Boolean);

          return (
            <div className={`grid gap-4 ${cols.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
              {cols}
            </div>
          );
        })()}
      </div>

      {/* Digital Processing Fee */}
      <h2 className="mt-8 text-[18px] font-semibold text-[#111111]">Digital Processing Fee</h2>
      <div className="mt-4">
        {processingFee > 0 ? (
          <div className="flex items-center justify-between rounded-[10px] bg-[#fff8f3] border border-[#f0e6da] px-5 py-4">
            <span className="text-[15px] text-[#444]">Free Drawing Easy Guide + Guides — Processing Fee</span>
            <span className="text-[15px] font-semibold text-[#111]">${processingFee.toFixed(2)}</span>
          </div>
        ) : (
          <div className="rounded-[10px] bg-[#f1f1f1] px-6 py-5 text-center text-[16px] text-[#7a7a7a]">
            Digital Processing Fee Will Be Applied Once Address Is Entered
          </div>
        )}
      </div>

      {/* Stripe Payment Element (replaces fake card inputs) */}
      <h2 className="mt-10 text-[18px] font-semibold text-[#111111]">Secure Checkout</h2>
      <p className="mt-2 text-[15px] leading-[1.55] text-[#6b6b6b]">
        All transactions are secure and encrypted. Your order includes 24/7 access to our award-winning customer service.
      </p>

      <div className="mt-5 overflow-hidden rounded-[12px] border border-[#ef9a5f] bg-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#ef9a5f] bg-[#f8ede7] px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e8919c] text-[10px] text-black">●</span>
            <span className="text-[16px] font-medium text-[#1d1d1d]">Credit card</span>
          </div>
          <div className="flex items-center gap-2">
            {["visa", "maestro", "mastercard", "amex", "unionpay"].map((c) => (
              <img key={c} src={`/images/payments/${c}.svg`} alt={c} className="h-[18px] w-auto object-contain" />
            ))}
          </div>
        </div>

        {/* Card fields */}
        <div className="space-y-3 bg-[#f7f7f7] p-5">
          {/* Card number */}
          <div className="flex h-[52px] items-center justify-between rounded-[10px] border border-[#d9d9d9] bg-white px-4">
            <CardNumberElement
              className="flex-1"
              options={{ style: cardStyle, placeholder: "Card number", showIcon: false, disableLink: true }}
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>

          {/* Expiry + CVC */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex h-[52px] items-center rounded-[10px] border border-[#d9d9d9] bg-white px-4">
              <CardExpiryElement
                className="flex-1"
                options={{ style: cardStyle }}
              />
            </div>
            <div className="flex h-[52px] items-center justify-between rounded-[10px] border border-[#d9d9d9] bg-white px-4">
              <CardCvcElement
                className="flex-1"
                options={{ style: cardStyle }}
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
          </div>

          {/* Name on card */}
          <input
            value={nameOnCard}
            onChange={(e) => setNameOnCard(e.target.value)}
            placeholder="Name on card"
            className="h-[52px] w-full rounded-[10px] border border-[#d9d9d9] bg-white px-4 text-[16px] outline-none"
          />

        </div>
      </div>

      {errorMsg && (
        <p className="mt-4 rounded-[8px] bg-red-50 px-4 py-3 text-[14px] text-red-600">{errorMsg}</p>
      )}

      {/* Save info */}
      <div className="mt-10">
        <p className="text-[16px] font-semibold text-[#111111]">Save my information for a faster checkout</p>
        <div className="mt-4 flex items-center gap-3 rounded-[10px] border border-[#d9d9d9] bg-white px-4 py-[16px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#aaaaaa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
          <span className="shrink-0 text-[16px] text-[#333333]">{DIAL_CODES[country] || "+1"}</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Mobile phone (optional)"
            className="flex-1 border-none p-0 text-[16px] text-[#777777] placeholder-[#aaaaaa] outline-none"
          />
        </div>
        <p className="mt-3 text-[14px] leading-[1.55] text-[#6b6b6b]">
          By providing your phone number, you agree to create a Shop account subject to Shop&apos;s{" "}
          <a href="/terms-of-service" className="underline">Terms</a> and{" "}
          <a href="/privacy-policy" className="underline">Privacy Policy</a>.
        </p>
      </div>

      {/* Desktop pay button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="mt-10 hidden h-[54px] w-full rounded-[10px] bg-[#e8919c] text-[17px] font-semibold text-black transition hover:opacity-95 disabled:opacity-60 md:flex md:items-center md:justify-center"
      >
        {loading ? "Processing…" : `Pay $${(subtotal + processingFee).toFixed(2)}`}
      </button>

      {/* Desktop policy links */}
      <div className="mt-12 hidden border-t border-[#dddddd] pt-5 text-[14px] text-[#e58a43] md:block">
        <div className="flex flex-wrap gap-x-4 gap-y-2 underline">
          <a href="/refund-policy">Refund policy</a>
          <a href="/digital-delivery-policy">Digital Processing Policy</a>
          <a href="/privacy-policy">Privacy policy</a>
          <a href="/terms-of-service">Terms of service</a>
          <a href="/contact">Contact</a>
        </div>
      </div>

      {/* Mobile-only bottom section */}
      <div className="mt-8 lg:hidden">

        {showSummary ? (
          /* ── Expanded order summary ── */
          <div className="rounded-[14px] border border-[#e0e0e0] bg-white overflow-hidden">
            {/* Header */}
            <button
              type="button"
              onClick={() => setShowSummary(false)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span className="text-[16px] font-semibold text-[#111111]">Order summary</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
            </button>

            {/* Items */}
            <div className="max-h-[380px] space-y-4 overflow-y-auto border-t border-[#eeeeee] px-5 py-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-visible rounded-[12px] border border-[#dddddd] bg-white">
                    <img src={item.image} alt={item.name} className="h-full w-full rounded-[12px] object-contain p-2" />
                    <span className="absolute -right-[6px] -top-[6px] flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-[#222222] px-1 text-[11px] font-bold text-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] leading-[1.35] text-[#222222]">{item.name}</p>
                  </div>
                  <div className="text-[15px] font-medium text-[#222222]">
                    {item.price === 0 ? "FREE" : `$${(item.price * item.quantity).toFixed(2)}`}
                  </div>
                </div>
              ))}
            </div>

            {/* Discount code */}
            <div className="flex items-center gap-3 border-t border-[#eeeeee] px-5 py-4">
              <input placeholder="Discount code" className="h-[46px] w-full rounded-[10px] border border-[#d7d7d7] bg-[#f9f9f9] px-4 text-[15px] outline-none" />
              <button type="button" className="h-[46px] shrink-0 rounded-[10px] border border-[#d7d7d7] bg-[#efefef] px-5 text-[15px] font-medium text-[#666666]">Apply</button>
            </div>

            {/* Totals */}
            <div className="space-y-3 border-t border-[#eeeeee] px-5 py-4">
              <div className="flex items-center justify-between text-[15px] text-[#222222]">
                <span>Subtotal · {cart.reduce((t, i) => t + i.quantity, 0)} items</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-[15px] text-[#222222]">
                <span className="flex shrink-0 items-center gap-1">
                  Digital Processing Fee
                  <button type="button" onClick={() => onOpenPolicyModal(true)} className="text-[#888]" aria-label="Digital Processing Policy">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  </button>
                </span>
                {processingFee > 0
                  ? <span>${processingFee.toFixed(2)}</span>
                  : <span className="text-right text-[13px] text-[#999999]">Enter Digital Processing Address</span>
                }
              </div>
              <div className="flex items-center justify-between border-t border-[#eeeeee] pt-3">
                <span className="text-[17px] font-bold text-[#111111]">Total</span>
                <div className="flex items-baseline gap-[5px]">
                  <span className="text-[13px] text-[#777777]">USD</span>
                  <span className="text-[20px] font-bold text-[#111111]">${(subtotal + processingFee).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ── Collapsed: Add discount + Total row ── */
          <>
            <button
              type="button"
              onClick={() => setShowSummary(true)}
              className="flex items-center gap-2 rounded-[10px] border border-[#d9d9d9] bg-white px-5 py-[11px] text-[15px] font-medium text-[#333333]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
              Add discount
            </button>

            <button
              type="button"
              onClick={() => setShowSummary(true)}
              className="mt-4 flex w-full items-center justify-between rounded-[14px] bg-white px-4 py-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-[#e4e4e4] bg-[#f7f7f7]">
                  {cart[0] && <img src={cart[0].image} alt="" className="h-full w-full object-contain p-1" />}
                </div>
                <div className="text-left">
                  <p className="text-[17px] font-bold text-[#111111]">Total</p>
                  <p className="text-[13px] text-[#777777]">{cart.reduce((t, i) => t + i.quantity, 0)} items</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[13px] text-[#777777]">USD</span>
                <span className="text-[18px] font-bold text-[#111111]">${(subtotal + processingFee).toFixed(2)}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </button>
          </>
        )}

        {/* Mobile complete purchase button */}
        <button
          type="submit"
          disabled={!stripe || loading}
          className="mt-4 h-[56px] w-full rounded-[10px] bg-[#e8919c] text-[17px] font-semibold text-black transition hover:opacity-95 disabled:opacity-60"
        >
          {loading ? "Processing…" : "Complete Purchase"}
        </button>

        {/* Mobile policy links */}
        <div className="mt-8 border-t border-[#dddddd] pt-5 text-[14px] text-[#e58a43]">
          <div className="flex flex-wrap gap-x-4 gap-y-2 underline">
            <a href="/refund-policy">Refund policy</a>
            <a href="/digital-delivery-policy">Digital Processing Policy</a>
            <a href="/privacy-policy">Privacy policy</a>
            <a href="/terms-of-service">Terms of service</a>

            <a href="/contact">Contact</a>
          </div>
        </div>
      </div>
    </form>
  );
}

// ── Digital Processing Policy Modal ──────────────────────────────────────────
function ProcessingPolicyModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div className="relative w-full max-w-[460px] rounded-[16px] bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#eeeeee] px-6 py-5">
          <h2 className="text-[18px] font-bold text-[#111111]">Digital Processing Policy</h2>
          <button onClick={onClose} className="text-[#888] hover:text-[#333]">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        {/* Scrollable body */}
        <div className="max-h-[65vh] overflow-y-auto px-6 py-5 text-[15px] leading-[1.7] text-[#333333] space-y-4">
          <div>
            <p className="font-semibold text-[#111]">Digital Processing Policy</p>
            <p className="mt-2">Thank you for your purchase. All of our products are delivered digitally, ensuring fast and convenient access. Please review the information below to understand how your order is processed and delivered.</p>
          </div>
          <div>
            <p className="font-semibold text-[#111]">Order Processing</p>
            <p className="mt-2">Once your order has been placed and payment has been confirmed, our system will begin processing your digital product for delivery. All products are delivered electronically to the email address provided at checkout. Processing and delivery is typically completed within minutes of your purchase.</p>
          </div>
          <div>
            <p className="font-semibold text-[#111]">Delivery Timeframe</p>
            <p className="mt-2">Digital products are delivered to your email inbox within a maximum of 30 minutes from the time of purchase. In most cases, delivery occurs much sooner. Please note that delivery times may vary slightly depending on email provider processing speeds.</p>
          </div>
          <div>
            <p className="font-semibold text-[#111]">How to Access Your Digital Products</p>
            <p className="mt-2">To ensure a smooth experience, please follow the steps below to access your purchase:</p>
            <ol className="mt-2 list-decimal pl-5 space-y-2">
              <li><strong>Check your inbox</strong> — Within 30 minutes of completing your purchase, a delivery email will be sent to the email address you provided at checkout.</li>
              <li><strong>Check your spam or junk folder</strong> — If you do not see the email in your inbox, please check your spam or junk folder, as automated emails can sometimes be filtered.</li>
              <li><strong>Download your files</strong> — Click the download link in the email to access your digital products instantly.</li>
            </ol>
          </div>
          <div>
            <p className="font-semibold text-[#111]">Processing Fee</p>
            <p className="mt-2">A small digital processing fee is applied to cover the costs associated with securely delivering your digital products. This fee ensures that your files are processed, packaged, and sent to you quickly and reliably.</p>
          </div>
          <div>
            <p className="font-semibold text-[#111]">Contact Us</p>
            <p className="mt-2">If you have any questions about your order or our digital processing policy, please don&apos;t hesitate to contact our support team at <a href="mailto:drawing@easyguide.store" className="text-[#e8919c] underline">drawing@easyguide.store</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main checkout page ────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [email, setEmail] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [processingFee, setProcessingFee] = useState(0);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("drawing-cart");
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch { setCart([]); }
    }
  }, []);

  // Create PaymentIntent once cart is loaded
  useEffect(() => {
    if (cart.length === 0) return;
    fetch("/api/payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItems: cart }),
    })
      .then((r) => r.json())
      .then((data) => { if (data.clientSecret) setClientSecret(data.clientSecret); })
      .catch(() => {});
  }, [cart]);

  const subtotal = useMemo(() => cart.reduce((t, i) => t + i.price * i.quantity, 0), [cart]);
  const totalSavings = useMemo(() => cart.reduce((t, i) => t + ((i.compareAtPrice || i.price) - i.price) * i.quantity, 0), [cart]);
  const totalItems = useMemo(() => cart.reduce((t, i) => t + i.quantity, 0), [cart]);

  const appearance = { theme: "stripe", variables: { colorPrimary: "#e8919c", borderRadius: "10px" } };
  const options = { appearance };

  return (
    <>
    {policyModalOpen && <ProcessingPolicyModal onClose={() => setPolicyModalOpen(false)} />}
    <main className="min-h-screen bg-[#f5f5f5] text-[#111111]">
      <header className="border-b border-[#e6e6e6] bg-[#ffffff]">
        <div className="relative mx-auto flex h-[120px] md:h-[130px] max-w-[1350px] items-center justify-center px-[16px] md:px-[24px]">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <img src="/images/logo.png" alt="Drawing Easy Guide" className="h-[100px] md:h-[140px] w-auto object-contain" />
          </div>
          <div className="absolute right-[16px] md:right-[24px] flex items-center">
            <button type="button" aria-label="Cart" className="relative text-[#222] hover:opacity-70" onClick={() => window.location.href = "/"}>
              <ShoppingBag size={23} strokeWidth={1.7} />
              {cart.length > 0 && (
                <span className="absolute -right-[10px] -top-[9px] flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#eda3ac] px-[5px] text-[10px] font-bold text-white">
                  {cart.reduce((t, i) => t + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-[1440px] lg:grid-cols-[1fr_0.88fr] lg:items-start">
        {/* Left: form */}
        <div className="bg-[#fafafa] px-6 py-10 lg:px-16">
          <div className="mx-auto max-w-[520px]">
            {cart.length === 0 ? (
              <div className="flex h-[200px] items-center justify-center text-[#888]">Your cart is empty.</div>
            ) : (
              <Elements stripe={stripePromise} options={options}>
                <PaymentForm
                  email={email}
                  onEmailChange={setEmail}
                  subtotal={subtotal}
                  processingFee={processingFee}
                  onProcessingFeeChange={setProcessingFee}
                  cart={cart}
                  clientSecret={clientSecret}
                  onOpenPolicyModal={setPolicyModalOpen}
                />
              </Elements>
            )}
          </div>
        </div>

        {/* Right: order summary — sticky while left scrolls (desktop only) */}
        <aside className="checkout-aside border-l border-[#dedede] bg-[#f3f3f3] px-8 py-10 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
          <div className="mx-auto max-w-[395px]">
            <div className="max-h-[360px] space-y-5 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] border border-[#dddddd] bg-white">
                    <img src={item.image} alt={item.name} className="h-full w-full object-contain p-2" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[16px] leading-[1.35] text-[#222222]">{item.name}</p>
                  </div>
                  <div className="text-[16px] font-medium text-[#222222]">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <input placeholder="Discount code" className="h-[52px] w-full rounded-[10px] border border-[#d7d7d7] bg-white px-4 text-[16px] outline-none" />
              <button type="button" className="h-[52px] rounded-[10px] border border-[#d7d7d7] bg-[#efefef] px-5 text-[16px] font-medium text-[#666666]">Apply</button>
            </div>

            <div className="mt-8 space-y-3 border-t border-[#d9d9d9] pt-6">
              <div className="flex items-center justify-between text-[16px] text-[#222222]">
                <span>Subtotal · {totalItems} items</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-[16px] text-[#222222]">
                <span className="flex shrink-0 items-center gap-1">
                  Digital Processing Fee
                  <button type="button" onClick={() => setPolicyModalOpen(true)} className="text-[#888] hover:text-[#555]" aria-label="Digital Processing Policy">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  </button>
                </span>
                {processingFee > 0
                  ? <span>${processingFee.toFixed(2)}</span>
                  : <span className="text-right text-[14px] text-[#999999]">Enter Digital Processing Address</span>
                }
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[18px] font-semibold text-[#111111]">Total</span>
                <div className="flex items-baseline gap-[6px]">
                  <span className="text-[14px] text-[#777777]">USD</span>
                  <span className="text-[22px] font-semibold text-[#111111]">${(subtotal + processingFee).toFixed(2)}</span>
                </div>
              </div>
              <div className="pt-1 text-[15px] font-semibold text-[#548155]">
                Savings: ${totalSavings.toFixed(2)}
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
    </>
  );
}
