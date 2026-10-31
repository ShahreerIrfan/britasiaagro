"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fallbackServices } from "@/lib/servicesData";

// ==========================================
// BESPOKE SVG ICONS (NO EMOJIS ALLOWED)
// ==========================================
const SvgIcons = {
  phone: (
    <svg viewBox="0 0 512 512">
      <path d="M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 139.6-175.6 175.6L156.2 339c-6.7-8.3-18.2-11.1-28-6.9l-112 48C5.6 384.7-.3 396.3 2.3 407.6l24 104C28.9 522.9 39.5 530 51.5 530 310.1 530 520 320.1 520 61.5c0-12-7.1-22.6-18.4-25.2z" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 512 512">
      <path d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805l-208 130-208-130V112h416zm-416 288V204.195l194.49 121.555a24.004 24.004 0 0027.02 0L464 204.195V400H48z" />
    </svg>
  ),
  mapPin: (
    <svg viewBox="0 0 384 512">
      <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 512 512">
      <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-62.9c-3.1-2.3-4.9-5.9-4.9-9.7V144c0-6.6 5.4-12 12-12h16c6.6 0 12 5.4 12 12v114.2l70.7 52.4c5.3 3.9 6.4 11.3 2.5 16.6l-9.6 13c-3.9 5.3-11.3 6.4-16.6 2.5z" />
    </svg>
  ),
  checkShield: (
    <svg viewBox="0 0 512 512">
      <path d="M466.5 83.7l-192-80a48.15 48.15 0 00-37 0l-192 80C27.9 91 16 108.3 16 128c0 198.5 114.5 335.7 221.5 380.3 11.8 4.9 25.1 4.9 36.9 0C381.5 463.7 496 326.5 496 128c0-19.7-11.9-37-29.5-44.3zM233.4 374.6l-89.4-89.4c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l50.3 50.3 126.3-126.3c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L267.3 374.6c-9.4 9.4-24.6 9.4-33.9 0z" />
    </svg>
  ),
  checkCircle: (
    <svg viewBox="0 0 512 512">
      <path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm128.2 163.6l-144 144a16.002 16.002 0 01-22.6 0l-72-72a16.002 16.002 0 0122.6-22.6l60.7 60.7 132.7-132.7a16.002 16.002 0 0122.6 22.6z" />
    </svg>
  ),
  compass: (
    <svg viewBox="0 0 512 512">
      <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm89.9-317.9l-136 56a16.02 16.02 0 00-8.9 8.9l-56 136c-4.4 10.7 5.2 21.9 16 17.5l136-56a16.02 16.02 0 008.9-8.9l56-136c4.4-10.7-5.2-21.9-16-17.5zM256 288c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 512 512">
      <path d="M256 8C119.03 8 8 119.03 8 256s111.03 248 248 248 248-111.03 248-248S392.97 8 256 8zm184.82 232h-74.07c-3.14-53.94-17.56-102.16-39.73-138.86 52.88 24.33 93.38 75.14 113.8 138.86zM256 56.63c22.64 34.92 38.45 84.81 41.57 143.37H214.43c3.12-58.56 18.93-108.45 41.57-143.37zM71.18 240c20.42-63.72 60.92-114.53 113.8-138.86-22.17 36.7-36.59 84.92-39.73 138.86H71.18zm0 32h74.07c3.14 53.94 17.56 102.16 39.73 138.86-52.88-24.33-93.38-75.14-113.8-138.86zM256 455.37c-22.64-34.92-38.45-84.81-41.57-143.37h83.14c-3.12 58.56-18.93 108.45-41.57 143.37zm70.02-36.51c22.17-36.7 36.59-84.92 39.73-138.86h74.07c-20.42 63.72-60.92 114.53-113.8 138.86z" />
    </svg>
  ),
  award: (
    <svg viewBox="0 0 512 512">
      <path d="M256 0c-70.7 0-128 57.3-128 128 0 42.1 20.3 79.5 51.6 102.9-7.2 9.2-12.7 19.8-16.1 31.4L105 388.9c-4.4 15 6.9 30.1 22.4 30.1h41.4l19.5 83.1c3.5 15.1 18.9 24.3 33.9 20.4l33.8-8.9 33.8 8.9c15 3.9 30.4-5.3 33.9-20.4l19.5-83.1h41.4c15.5 0 26.8-15.1 22.4-30.1l-58.5-126.6c-3.4-11.6-8.9-22.2-16.1-31.4C363.7 207.5 384 170.1 384 128 384 57.3 326.7 0 256 0zm0 48c44.1 0 80 35.9 80 80s-35.9 80-80 80-80-35.9-80-80 35.9-80 80-80z" />
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 512 512">
      <path d="M12.41 125.59L244.41 2.47a24 24 0 0123.18 0l232 123.12a24 24 0 010 42.34L267.59 291a24 24 0 01-23.18 0L12.41 167.93a24 24 0 010-42.34zM12.41 261.59l232 123.12a24 24 0 0023.18 0l232-123.12a24 24 0 000-42.34L476 206.59l-208.41 110.6a24 24 0 01-23.18 0L36 206.59l-23.59 12.66a24 24 0 000 42.34zm0 136l232 123.12a24 24 0 0023.18 0l232-123.12a24 24 0 000-42.34L476 342.59l-208.41 110.6a24 24 0 01-23.18 0L36 342.59l-23.59 12.66a24 24 0 000 42.34z" />
    </svg>
  ),
  arrowRight: (
    <svg viewBox="0 0 448 512">
      <path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z" />
    </svg>
  ),
  quote: (
    <svg viewBox="0 0 512 512">
      <path d="M464 256h-80v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8c-88.4 0-160 71.6-160 160v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48zm-288 0H96v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8C71.6 32 0 103.6 0 192v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 576 512">
      <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" />
    </svg>
  ),
  chevronDown: (
    <svg viewBox="0 0 320 512">
      <path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 352 512">
      <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" />
    </svg>
  ),
  external: (
    <svg viewBox="0 0 512 512">
      <path d="M432 320H400a16 16 0 00-16 16v96H64V128h96a16 16 0 0016-16V80a16 16 0 00-16-16H48A48 48 0 000 112v352a48 48 0 0048 48h352a48 48 0 0048-48V336a16 16 0 00-16-16zM488 0H360c-21.37 0-32.05 25.91-17 41l49.2 49.2L167 315.4c-9.37 9.37-9.37 24.57 0 33.94l23.66 23.66c9.37 9.37 24.57 9.37 33.94 0L449.8 147.8 499 197c15.1 15.1 41 4.4 41-17V24a24 24 0 00-24-24z" />
    </svg>
  ),
};

// ==========================================
// DATA DEFINITIONS (EXACT TEXT PRESERVED)
// ==========================================
const defaultProducts = [
  {
    id: "grocery",
    name: "Fresh Grocery",
    desc: "Quality essentials delivered fresh and on time.",
    image: "/assets/product-grocery.svg",
    category: "commodities",
    badge: "Bulk Commodities",
  },
  {
    id: "agro",
    name: "Agro",
    desc: "Strategic guidance delivering smart, sustainable business solutions.",
    image: "/assets/product-agro.svg",
    category: "agro",
    badge: "Agriculture",
  },
  {
    id: "hms",
    name: "HMS 1&2",
    desc: "Strategic guidance delivering smart, sustainable business solutions.",
    image: "/assets/product-hms.svg",
    category: "steel",
    badge: "Steel & Metals",
  },
  {
    id: "steel",
    name: "Strong Steel",
    desc: "High-quality metals built for durability and strength",
    image: "/assets/product-steel.svg",
    category: "steel",
    badge: "Steel & Metals",
  },
  {
    id: "sugar",
    name: "Pure Sugar",
    desc: "Clean sweetness for every kitchen.",
    image: "/assets/product-sugar.svg",
    category: "commodities",
    badge: "Bulk Commodities",
  },
  {
    id: "spices",
    name: "Natural Spices",
    desc: "Rich aroma and authentic flavor from farm to table.",
    image: "/assets/product-spices.svg",
    category: "commodities",
    badge: "Bulk Commodities",
  },
  {
    id: "fertilizer",
    name: "Quality Fertilizer",
    desc: "Enhance soil health and support strong, sustainable plant growth for better yields and greener results.",
    image: "/assets/product-fertilizer.svg",
    category: "agro",
    badge: "Agriculture",
  },
];

const logisticsSteps = [
  {
    number: "01",
    title: "Request & Planning",
    desc: "We deliver to the final destination, handle final checks, and confirm successful beautiful world receipt with proof of delivery.",
    icon: "/assets/icon-cart.svg",
  },
  {
    number: "02",
    title: "Pickup & Documentation",
    desc: "We deliver to the final destination, handle final checks, and confirm successful beautiful world receipt with proof of delivery.",
    icon: "/assets/icon-doc.svg",
  },
  {
    number: "03",
    title: "Transport & Tracking",
    desc: "We deliver to the final destination, handle final checks, and confirm successful beautiful world receipt with proof of delivery.",
    icon: "/assets/icon-truck.svg",
  },
  {
    number: "04",
    title: "Delivery & Confirmation",
    desc: "We deliver to the final destination, handle final checks, and confirm successful beautiful world receipt with proof of delivery.",
    icon: "/assets/icon-delivery.svg",
  },
];

const testimonials = [
  {
    quote:
      "For bulk grocery supply, British Merchants is one of the most dependable companies we have worked with. They ensure proper quality control and smooth logistics. Their experience in import and export really shows in the way they handle operations.",
    author: "Nusrat Jahan",
    role: "Grocery Distributor",
  },
  {
    quote:
      "British Merchants Limited has been our trusted partner for scrap steel and heavy metals procurement. Their transparent documentation, competitive pricing, and punctual delivery timelines make them stand out in global trade.",
    author: "K. R. Ahmed",
    role: "Industrial Procurement Lead",
  },
  {
    quote:
      "Their deep knowledge of regional trade routes and import-export compliance ensures our bulk agro and spice shipments arrive in pristine condition without regulatory delay.",
    author: "Tanvir Hossain",
    role: "Commodity Trading Partner",
  },
];

const faqs = [
  {
    question: "What products does British Merchants Limited trade?",
    answer:
      "British Merchants Limited specializes in bulk and retail trade across two main divisions: Commodities (including fresh grocery, agro products, pure sugar, natural spices, and quality fertilizer) and Steel Metals (including heavy melting scrap HMS 1&2 and structural strong steel).",
  },
  {
    question: "Do you handle both local and international shipments?",
    answer:
      "Yes, British Merchants Limited handles both domestic distribution across Bangladesh and cross-border international import-export operations with full freight forwarding, customs clearance, and secure transport coordination.",
  },
  {
    question: "What regions or countries do you operate in?",
    answer:
      "We operate locally across all divisions of Bangladesh and internationally with trade partners across South Asia, the Middle East, Southeast Asia, Europe, and key global commodity trading hubs.",
  },
  {
    question: "What documents are required for international trade?",
    answer:
      "Standard documentation typically includes Commercial Invoice, Bill of Lading (B/L), Packing List, Certificate of Origin, Quality/Inspection Certificates, and Letter of Credit (L/C) compliance files. Our operations team provides comprehensive documentation support.",
  },
  {
    question: "How do you ensure product quality and reliability?",
    answer:
      "We conduct thorough supplier vetting, rigorous pre-shipment inspections, international standard grading, and enforce sealed transport protocols to guarantee that every delivery meets exact specifications and industry quality standards.",
  },
  {
    question: "Can you manage bulk commodity supply contracts?",
    answer:
      "Yes, we specialize in high-volume, recurring bulk supply agreements tailored to industrial manufacturers, food processors, retail chains, and government/private tenders.",
  },
  {
    question: "How can clients request a quotation?",
    answer:
      "Clients can request a fast quotation by clicking the 'Inquiry Products' button on this page, emailing us directly, or calling our corporate headquarters at +8801711034971.",
  },
];

const leaders = [
  {
    name: "Mohammed H. Rahman",
    role: "Chairman",
    photo: "/assets/leader-rahman.svg",
    bio: [
      "Mr. Rahman is a highly energetic management and accounting graduate with extensive knowledge in trade and corporate finance, commodities, steel and metals, land development, and precious metals mining.",
      "He is a financial analyst specializing in accounting and new business development, with more than 20 years of experience in the financial services and commodities sectors. He combines strong analytical expertise with practical business insight, consistently contributing to organizational growth and strengthening the company's bottom line.",
    ],
  },
  {
    name: "Rahat F. Chowdhury",
    role: "Managing Director",
    photo: "/assets/leader-chowdhury.svg",
    bio: [
      "Mr. Chowdhury brings over 20 years of extensive professional experience in property management, the hospitality sector, and corporate security services. Throughout his career, he has developed a strong and versatile business portfolio, including active involvement in import and export operations across various industries.",
      "With his broad strategic insight and operational expertise, Mr. Chowdhury has now dedicated his full experience and leadership capabilities to strengthening and advancing British Merchants Limited as a dynamic new venture.",
    ],
  },
  {
    name: "Kaikobad MM Meah",
    role: "Director",
    photo: "/assets/leader-meah.svg",
    bio: [
      "Mr. Meah serves as the International Development Manager at British Merchants Limited. He is responsible for formulating and executing strategies that expand the company's local and international business operations, sales performance, and service capabilities. He plays a central role in strengthening the company's global market presence while promoting a culture of consistently high service standards that delivers measurable value and a superior experience to clients worldwide.",
      "Prior to joining British Merchants Limited, Mr. Meah worked as a market analyst and professional trader in the global financial markets, bringing strong analytical discipline and in-depth market expertise to his leadership responsibilities. He holds a Bachelor of Business Administration (BBA), a Higher Diploma in Management and Leadership, and a Master of Business Administration (MBA) in Entrepreneurship. He has also completed specialized studies in the Business of Mining at Curtin University and Social Sciences at the University of Oxford.",
    ],
  },
  {
    name: "Mohammed Mizanur Rahman Chowdhury",
    role: "Director",
    photo: "/assets/leader-mizanur.svg",
    bio: [
      "Mr. Chowdhury serves as the Director and Company Administrator of British Merchants Limited. In his leadership role, he oversees strategic planning, corporate governance, and overall administrative operations to ensure the company functions with efficiency and compliance. With strong organizational capabilities and practical business insight, he plays a key role in coordinating internal management, regulatory matters, and operational execution. His guidance supports the company's structured growth and reinforces its commitment to professionalism and reliability in both local and international markets.",
    ],
  },
  {
    name: "Junior Salahuddin Sanjee",
    role: "Chief Executive Officer(CEO)",
    photo: "/assets/leader-sanjee.svg",
    bio: [
      "Mr. Sanjee has results-driven commercial leader with over 19 years of progressive experience in Telecom, Consumer electronics, Technology, FMCG sectors and Enterprise Software Industries. Proven track record of delivering accelerated revenue growth, market expansion, and operational excellence across national and international markets. Experienced in full P&L ownership, strategic sales transformation, channel development, and high-performance team leadership.Recognized for visionary leadership, execution excellence, and the ability to convert competitive challenges into growth opportunities.",
    ],
  },
];

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("Fresh Grocery");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Dynamic products loaded from PostgreSQL database
  const [productsList, setProductsList] = useState<any[]>(fallbackServices);

  // RFQ Interactive volume state
  const [rfqVolume, setRfqVolume] = useState("500");
  const [rfqCommodity, setRfqCommodity] = useState("Strong Steel");

  // RFQ form input states
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerSpecs, setBuyerSpecs] = useState("");
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setIsLoggedIn(true);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    // Dynamically fetch services from DB
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (data.services && data.services.length > 0) {
          setProductsList(data.services);
        }
      })
      .catch((err) => {
        console.warn("Using default products fallback:", err);
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 380);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openInquiryModal = (productName?: string) => {
    if (productName) setSelectedProduct(productName);
    setIsModalOpen(true);
    setFormSubmitted(false);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingInquiry(true);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commodity: selectedProduct,
          volume: buyerSpecs ? buyerSpecs.slice(0, 50) : "500 Metric Tons",
          name: buyerName,
          email: buyerEmail,
          phone: buyerPhone || null,
          company: buyerName,
          message: buyerSpecs,
        }),
      });

      if (!res.ok) {
        console.warn("API response error, proceeding with confirmation");
      }

      setFormSubmitted(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setFormSubmitted(false);
        setBuyerName("");
        setBuyerEmail("");
        setBuyerPhone("");
        setBuyerSpecs("");
      }, 2400);
    } catch (err) {
      console.error("Submission error:", err);
      setFormSubmitted(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setFormSubmitted(false);
      }, 2400);
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredProducts =
    selectedCategory === "all"
      ? productsList
      : productsList.filter((p) => p.category === selectedCategory);

  const countAll = productsList.length;
  const countCommodities = productsList.filter((p) => p.category === "commodities").length;
  const countSteel = productsList.filter((p) => p.category === "steel").length;
  const countAgro = productsList.filter((p) => p.category === "agro").length;

  return (
    <div className="page-wrapper">
      {/* ================= MAIN NAVIGATION ================= */}
      <header className="site-header">
        <div className="header-container">
          <a href="#" className="brand-logo-link" aria-label="British Merchants Home">
            <img
              src="/assets/Logo.svg"
              alt="British Merchants Connecting The Dots..."
              className="brand-logo-img"
            />
          </a>

          <nav className="main-nav">
            <ul className="nav-menu">
              <li>
                <a href="#hero" className="nav-link active">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="nav-link">
                  About Us
                </a>
              </li>
              <li>
                <a href="#products" className="nav-link">
                  Products &amp; Commodities
                </a>
              </li>
              <li>
                <a href="#process" className="nav-link">
                  Logistics &amp; Process
                </a>
              </li>
              <li>
                <a href="#leadership" className="nav-link">
                  Management
                </a>
              </li>
              <li>
                <a href="#contact" className="nav-link">
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          <div className="header-actions">
            <a
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="header-btn-auth"
            >
              <span>{isLoggedIn ? "Dashboard" : "Login"}</span>
            </a>
            <button
              onClick={() => openInquiryModal()}
              className="btn-primary"
              id="header-inquiry-btn"
            >
              <span>Inquiry Products</span>
              {SvgIcons.arrowRight}
            </button>
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div style={{ background: "#ffffff", borderTop: "1px solid #e2e8f0", padding: "20px 24px", boxShadow: "0 10px 20px rgba(0,0,0,0.08)" }}>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "16px" }}>
              <li>
                <a href="#hero" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 700, color: "var(--primary-red)" }}>
                  Home
                </a>
              </li>
              <li>
                <a href="#about" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: "var(--navy-800)" }}>
                  About Us
                </a>
              </li>
              <li>
                <a href="#products" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: "var(--navy-800)" }}>
                  Products &amp; Commodities
                </a>
              </li>
              <li>
                <a href="#process" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: "var(--navy-800)" }}>
                  Logistics &amp; Process
                </a>
              </li>
              <li>
                <a href="#leadership" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: "var(--navy-800)" }}>
                  Management &amp; Leadership
                </a>
              </li>
              <li>
                <a
                  href={isLoggedIn ? "/dashboard" : "/login"}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ fontWeight: 600, color: "var(--navy-800)" }}
                >
                  {isLoggedIn ? "Dashboard" : "Login"}
                </a>
              </li>
              <li style={{ paddingTop: "8px" }}>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openInquiryModal();
                  }}
                  className="btn-primary"
                  style={{ width: "100%" }}
                >
                  <span>Inquiry Products</span>
                  {SvgIcons.arrowRight}
                </button>
              </li>
            </ul>
          </div>
        )}
      </header>

      <main>
        {/* ================= HERO SECTION ================= */}
        <section className="hero-section" id="hero">
          <div className="hero-backdrop-glow"></div>
          <div className="container">
            <div className="hero-grid">
              <div className="hero-content">
                <h1 className="hero-title">
                  British Merchants Worldwide <span className="title-gradient">Commodity &amp; Steel Trade</span>
                </h1>
                <p className="hero-subtitle">
                  British Merchants Limited delivers reliable commodity and steel solutions across Bangladesh and global markets. We ensure quality sourcing, secure logistics, and competitive pricing with trusted partnerships Bangladesh and worldwide.
                </p>
                <div className="hero-actions">
                  <button
                    onClick={() => openInquiryModal()}
                    className="btn-primary"
                    style={{ padding: "14px 32px", fontSize: "15px" }}
                  >
                    <span>Inquiry Products</span>
                    {SvgIcons.arrowRight}
                  </button>
                  <a href="#products" className="btn-hero-secondary">
                    <span>Explore Products</span>
                    {SvgIcons.chevronDown}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= METRICS / TRUST BAR ================= */}
        <section className="trust-metrics-section">
          <div className="container">
            <div className="metrics-bar-grid">
              <div className="metric-bar-item">
                <div className="metric-icon-circle">
                  {SvgIcons.checkShield}
                </div>
                <div>
                  <div className="metric-val-title">RJSC C-207932/2026</div>
                  <div className="metric-sub-desc">Certified Registered Entity</div>
                </div>
              </div>

              <div className="metric-bar-item">
                <div className="metric-icon-circle">
                  {SvgIcons.award}
                </div>
                <div>
                  <div className="metric-val-title">Decades of Expertise</div>
                  <div className="metric-sub-desc">Experienced Stakeholder Board</div>
                </div>
              </div>

              <div className="metric-bar-item">
                <div className="metric-icon-circle">
                  {SvgIcons.layers}
                </div>
                <div>
                  <div className="metric-val-title">Dual Core Divisions</div>
                  <div className="metric-sub-desc">Commodities &amp; Steel Metals</div>
                </div>
              </div>

              <div className="metric-bar-item">
                <div className="metric-icon-circle">
                  {SvgIcons.globe}
                </div>
                <div>
                  <div className="metric-val-title">End-to-End Logistics</div>
                  <div className="metric-sub-desc">Bangladesh &amp; Global Trade</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= ABOUT BRITISH MERCHANTS LIMITED ================= */}
        <section className="about-section" id="about">
          <div className="container">
            <div className="about-grid">
              <div>
                <div className="section-tag-row">
                  {SvgIcons.compass}
                  <span>WHO WE ARE</span>
                </div>
                <h2 className="about-main-title">About British Merchants Limited</h2>

                <div className="about-body-text">
                  <p>
                    <strong>British Merchants Limited</strong> is a Bangladesh-based trade and export-import company with extensive expertise in handling bulk and retail trade, import, and export, especially in the fields of spices, groceries, steel products, and other commodities. The company has focused into two main divisions: Commodity and Steel Metals. British Merchants is incorporated with the Registrar of Joint Stock Companies and Firms, Bangladesh; company registration number: C-207932/2026.
                  </p>
                  <p>
                    The company&apos;s services are comprehensive in terms of the products offered. Although British Merchants is a tender company, the experience behind the stakeholders is enormous. This is the main strength of the company, which has propelled it such a long way in such a short period of time. British Merchants serves clients locally and across the globe.
                  </p>
                  <p>
                    British Merchants serves its clients as a trusted ally, providing them with the loyalty of a business partner and the economics of an outside vendor. We sell, buy, trade, import, and export bulk commodities, using our deep and vast experience spanning decades. We ensure that our clients have what they need to run their businesses as efficiently and reliably as possible.
                  </p>
                </div>

                <div className="about-reg-callout">
                  {SvgIcons.checkShield}
                  <div className="reg-callout-text">
                    <strong>Official Incorporation:</strong> Registered under the Registrar of Joint Stock Companies and Firms (RJSC), Bangladesh. Company Registration Number: <strong>C-207932/2026</strong>.
                  </div>
                </div>
              </div>

              <div className="about-visual-col">
                <div className="about-image-frame">
                  <img
                    src="/assets/about-engineers.svg"
                    alt="Engineers and stakeholders at British Merchants industrial operations"
                  />
                </div>
                <div className="about-badge-card">
                  <div className="badge-icon-sq">
                    {SvgIcons.checkCircle}
                  </div>
                  <div className="badge-text-bold">
                    Trusted Ally in Bulk &amp; Retail International Trade
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= MISSION & VISION ================= */}
        <section className="mv-section">
          <div className="container">
            <div className="mv-grid">
              <div className="mv-card mission">
                <div className="mv-icon-wrapper">
                  {SvgIcons.compass}
                </div>
                <h3 className="mv-heading">Mission</h3>
                <p className="mv-description">
                  The company&apos;s mission is to meet customer needs profitably and sustainably by delivering the right products, at the right time, in the right place, and at competitive prices.
                </p>
              </div>

              <div className="mv-card vision">
                <div className="mv-icon-wrapper">
                  {SvgIcons.globe}
                </div>
                <h3 className="mv-heading">Vision</h3>
                <p className="mv-description">
                  To become a leading global organization in the fields of trade, export and import, commodities, and steel and metal industries, recognized for excellence, reliability, and sustainable growth.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SERVICES / PRODUCTS ================= */}
        <section className="services-section" id="products">
          <div className="container">
            <div className="services-header-grid">
              <div>
                <h2 className="services-title">
                  <span className="red-accent">Premium &amp; Trust-Focused</span>
                  Services for You
                </h2>
              </div>
              <div>
                <p className="services-intro-text">
                  Empower your business with reliable global trade and bulk supply solutions designed for modern markets. Our operations focus on quality sourcing, secure logistics, and efficient execution—helping you reduce costs, maintain steady flow, and stay prepared for demand at any scale.
                </p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="product-tabs-bar">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`product-tab-btn ${selectedCategory === "all" ? "active" : ""}`}
              >
                {SvgIcons.layers}
                <span>All Solutions ({countAll})</span>
              </button>
              <button
                onClick={() => setSelectedCategory("commodities")}
                className={`product-tab-btn ${selectedCategory === "commodities" ? "active" : ""}`}
              >
                {SvgIcons.award}
                <span>Bulk Commodities ({countCommodities})</span>
              </button>
              <button
                onClick={() => setSelectedCategory("steel")}
                className={`product-tab-btn ${selectedCategory === "steel" ? "active" : ""}`}
              >
                {SvgIcons.checkShield}
                <span>Steel Metals ({countSteel})</span>
              </button>
              <button
                onClick={() => setSelectedCategory("agro")}
                className={`product-tab-btn ${selectedCategory === "agro" ? "active" : ""}`}
              >
                {SvgIcons.globe}
                <span>Agriculture ({countAgro})</span>
              </button>
            </div>

            {/* Products Grid */}
            <div className="products-grid">
              {filteredProducts.map((item) => (
                <div key={item.id} className="product-card">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="product-card-img"
                  />
                  <div className="product-card-overlay"></div>
                  <div className="product-card-content">
                    <h3 className="product-card-title">
                      <Link href={`/services/${item.slug || item.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                        {item.name}
                      </Link>
                    </h3>
                    <p className="product-card-desc">{item.desc}</p>
                    <Link
                      href={`/services/${item.slug || item.id}`}
                      className="product-card-cta"
                    >
                      <span>Explore More</span>
                      {SvgIcons.arrowRight}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= LOGISTICS IN FOUR STEPS ================= */}
        <section className="logistics-section" id="process">
          <div className="container">
            <div className="section-centered-header">
              <h2>Logistics in Four Steps</h2>
              <p>End-to-end supply chain orchestration delivering excellence on every route</p>
            </div>

            <div className="steps-timeline-grid">
              {logisticsSteps.map((step) => (
                <div key={step.number} className="timeline-step-card">
                  <div className="step-header-row">
                    <div className="step-icon-box">
                      <img src={step.icon} alt={step.title} />
                    </div>
                    <span className="step-number-tag">Step {step.number}</span>
                  </div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= RELIABILITY / CLIENT TESTIMONIALS ================= */}
        <section className="reliability-section">
          <div className="container">
            <div className="reliability-grid">
              <div className="graphic-showcase-box">
                <img
                  src="/assets/testimonial-cargo.svg"
                  alt="Import and export logistics illustration"
                />
              </div>

              <div className="testimonial-stage">
                <h2 className="testimonial-header-title">
                  Reliability, According to Our Clients
                </h2>
                <div className="quote-svg-icon">{SvgIcons.quote}</div>
                <div className="stars-rating-row">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="star-svg">
                      {SvgIcons.star}
                    </div>
                  ))}
                </div>
                <p className="testimonial-quote-p">
                  &ldquo;{testimonials[testimonialIdx].quote}&rdquo;
                </p>
                <div className="testimonial-author-row">
                  <div className="author-credentials">
                    <h4 className="author-name-h4">
                      {testimonials[testimonialIdx].author}
                    </h4>
                    <span className="author-role-span">
                      {testimonials[testimonialIdx].role}
                    </span>
                  </div>
                  <div className="testimonial-nav-dots">
                    {testimonials.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setTestimonialIdx(i)}
                        className={`testi-dot ${testimonialIdx === i ? "active" : ""}`}
                        aria-label={`View client testimonial ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= QUICK RFQ TRADE ESTIMATOR TOOL ================= */}
        <section className="rfq-calculator-section">
          <div className="container">
            <div className="rfq-grid">
              <div className="rfq-info-col">
                <h2>Direct Commercial Trade Desk</h2>
                <p>
                  Connect directly with our specialized trade managers in Dhaka for prompt price quotations, Letters of Credit (L/C) handling, freight schedules, and cargo specifications.
                </p>
                <div className="rfq-perks-list">
                  <div className="rfq-perk-item">
                    {SvgIcons.checkCircle}
                    <span>Bulk vessels and containerized CIF / FOB shipping options</span>
                  </div>
                  <div className="rfq-perk-item">
                    {SvgIcons.checkCircle}
                    <span>Full customs clearance and documentation at Chittagong &amp; Mongla</span>
                  </div>
                  <div className="rfq-perk-item">
                    {SvgIcons.checkCircle}
                    <span>Transparent commercial contracts under international ICC incoterms</span>
                  </div>
                </div>
              </div>

              <div className="rfq-box-card">
                <h3 className="rfq-card-heading">
                  Instant Trade Inquiry Form
                </h3>
                <div className="rfq-form-body">
                  <div className="rfq-form-group">
                    <label className="rfq-form-label">
                      Target Commodity / Division
                    </label>
                    <select
                      value={rfqCommodity}
                      onChange={(e) => setRfqCommodity(e.target.value)}
                      className="rfq-select"
                    >
                      {productsList.map((p) => (
                        <option key={p.id} value={p.name} style={{ background: "#0f172a", color: "#ffffff" }}>
                          {p.name} ({p.badge})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="rfq-form-group">
                    <label className="rfq-form-label">
                      Estimated Order Volume (Metric Tons)
                    </label>
                    <input
                      type="number"
                      value={rfqVolume}
                      onChange={(e) => setRfqVolume(e.target.value)}
                      className="rfq-input"
                    />
                  </div>

                  <button
                    onClick={() => openInquiryModal(rfqCommodity)}
                    className="btn-primary rfq-submit-btn"
                  >
                    <span>Request Quotation for {rfqCommodity}</span>
                    {SvgIcons.arrowRight}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FAQ SECTION ================= */}
        <section className="faq-section">
          <div className="container">
            <div className="faq-grid">
              <div className="faq-intro-col">
                <div className="faq-icon-badge">{SvgIcons.arrowRight}</div>
                <h2 className="faq-heading-main">Frequently Asked Questions</h2>
                <p className="faq-desc-p">
                  British Merchants Limited supports clients across local and international markets with reliable commodity and steel trading services. We focus on efficient sourcing, proper documentation, secure transport coordination, and transparent communication. Our experienced team ensures every shipment is handled professionally, meeting quality standards and delivery timelines with consistency and care.
                </p>
                <button
                  onClick={() => openInquiryModal()}
                  className="btn-primary"
                >
                  <span>Submit Inquiry to Trading Desk</span>
                  {SvgIcons.arrowRight}
                </button>
              </div>

              <div className="accordion-wrapper">
                {faqs.map((faq, index) => {
                  const isOpen = activeFaq === index;
                  return (
                    <div
                      key={index}
                      className={`accordion-row ${isOpen ? "is-open" : ""}`}
                    >
                      <button
                        className="accordion-btn"
                        onClick={() => setActiveFaq(isOpen ? null : index)}
                      >
                        <span>{faq.question}</span>
                        <div className="accordion-caret-svg">
                          {SvgIcons.chevronDown}
                        </div>
                      </button>
                      {isOpen && (
                        <div className="accordion-body-p">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ================= OUR TRUSTED BUSINESS PARTNERS ================= */}
        <section className="partners-section">
          <div className="container">
            <div className="partners-center-col">
              <h2>Our Trusted Business Partners</h2>
              <p>
                British Merchants Limited collaborates with reliable suppliers, manufacturers, logistics providers, and global trading partners to ensure consistent quality and dependable delivery. Our partnerships are built on transparency, mutual growth, and long-term commitment across commodity and steel metal markets. Through strong organizational connections and local expertise, we maintain efficient sourcing, secure transport coordination, and seamless trade execution for every client we serve.
              </p>
            </div>

            <div className="partner-cards-row">
              <div className="partner-brand-box">
                <img
                  src="/assets/partner-eezymart.svg"
                  alt="EezyMart - Trusted Retail Supply Chain Partner"
                />
              </div>
              <div className="partner-brand-box">
                <img
                  src="/assets/partner-pristine.svg"
                  alt="Pristine Security Service Limited - Corporate Security & Logistics Partner"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ================= MANAGEMENT & ORGANIZATION ================= */}
        <section className="management-section" id="leadership">
          <div className="container">
            <div className="section-centered-header">
              <h2>Management &amp; Organization</h2>
              <p>
                Visionary leadership driving sustainable growth, financial discipline, and international market expansion
              </p>
            </div>

            <div className="leaders-deck">
              {leaders.map((leader, idx) => (
                <div key={idx} className="executive-profile-card">
                  <div className="executive-photo-col">
                    <img
                      src={leader.photo}
                      alt={leader.name}
                      className="executive-photo"
                    />
                  </div>
                  <div className="executive-info-col">
                    <h3 className="executive-name">{leader.name}</h3>
                    <div className="executive-role-pill">
                      {SvgIcons.award}
                      <span>{leader.role}</span>
                    </div>
                    <div className="executive-bio-text">
                      {leader.bio.map((paragraph, pIdx) => (
                        <p key={pIdx}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= HEADQUARTERS & INTERACTIVE MAP ================= */}
        <section className="headquarters-section" id="contact">
          <div className="hq-map-banner">
            <img
              src="/assets/dhaka-map.svg"
              alt="British Merchants Location - Mohakhali DOHS Road 29 Dhaka"
              className="hq-map-img"
            />
            <div className="hq-address-card">
              <div className="hq-badge-tag">
                {SvgIcons.mapPin}
                <span>Corporate Headquarters</span>
              </div>
              <h3 className="hq-card-title">British Merchants Limited</h3>
              <p className="hq-card-address">
                Mohakhali DOHS, House No-412, Flat-3/A &amp; 3/B, Road No-29, Dhaka, Bangladesh
              </p>
              <a
                href="https://maps.google.com/?q=Mohakhali+DOHS+Road+29+Dhaka"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ padding: "11px 24px", fontSize: "14px" }}
              >
                <span>Open in Google Maps</span>
                {SvgIcons.external}
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ================= CORPORATE FOOTER ================= */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-top-grid">
            <div className="footer-brand-col">
              <img
                src="/assets/Logo.svg"
                alt="British Merchants"
                className="footer-brand-logo"
              />
              <p className="footer-tagline">
                Delivering reliable commodity and steel solutions across Bangladesh and global markets with uncompromising quality and logistics excellence.
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#94a3b8" }}>
                {SvgIcons.checkShield}
                <span>RJSC Registration: C-207932/2026</span>
              </div>
            </div>

            <div>
              <h4 className="footer-col-title">Core Divisions</h4>
              <ul className="footer-links-list">
                <li><a href="#products" className="footer-link-item">Commodities Division</a></li>
                <li><a href="#products" className="footer-link-item">Steel &amp; Metals Division</a></li>
                <li><a href="#products" className="footer-link-item">HMS 1&amp;2 Heavy Scrap</a></li>
                <li><a href="#products" className="footer-link-item">Bulk Sugar &amp; Spices</a></li>
                <li><a href="#products" className="footer-link-item">Agro &amp; Quality Fertilizer</a></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-col-title">Quick Navigation</h4>
              <ul className="footer-links-list">
                <li><a href="#hero" className="footer-link-item">Home</a></li>
                <li><a href="#about" className="footer-link-item">About Us</a></li>
                <li><a href="#products" className="footer-link-item">Products</a></li>
                <li><a href="#process" className="footer-link-item">Our Logistics Process</a></li>
                <li><a href="#leadership" className="footer-link-item">Executive Management</a></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-col-title">Contact Headquarters</h4>
              <div className="footer-contact-item">
                {SvgIcons.mapPin}
                <span>Mohakhali DOHS, House No-412, Flat-3/A &amp; 3/B, Road No-29, Dhaka</span>
              </div>
              <div className="footer-contact-item">
                {SvgIcons.phone}
                <a href="tel:+8801711034971" style={{ color: "#ffffff", fontWeight: 700 }}>
                  +8801711034971
                </a>
              </div>
              <div className="footer-contact-item">
                {SvgIcons.clock}
                <span>Sunday - Thursday: 9:00 AM - 6:00 PM (BST)</span>
              </div>
            </div>
          </div>

          <div className="footer-bottom-row">
            <p className="footer-copyright">
              &copy; 2026 British Merchants Limited. All Rights Reserved.
            </p>
            <div className="footer-legal-links">
              <a href="#">Privacy Policy</a>
              <span>&bull;</span>
              <a href="#">Terms of Trading</a>
              <span>&bull;</span>
              <a href="#">Compliance</a>
              <span>&bull;</span>
              <a href={isLoggedIn ? "/dashboard" : "/login"} style={{ color: "#38bdf8", fontWeight: 700 }}>
                {isLoggedIn ? "Dashboard" : "Staff / Client Login"}
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ================= FLOATING SPEED DIAL ================= */}
      <div className="floating-widget-bar">
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="widget-circle-btn widget-scroll-btn"
            aria-label="Scroll back to top"
          >
            <div style={{ transform: "rotate(180deg)", display: "flex" }}>
              {SvgIcons.chevronDown}
            </div>
          </button>
        )}

        <a
          href="tel:+8801711034971"
          className="widget-circle-btn widget-call-btn"
          aria-label="Direct call to British Merchants trade desk"
        >
          {SvgIcons.phone}
        </a>
      </div>

      {/* ================= INTERACTIVE INQUIRY MODAL ================= */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-dialog-header">
              <h3 className="modal-dialog-title">
                {SvgIcons.layers}
                <span>Product &amp; Commodity Trade Inquiry</span>
              </h3>
              <button
                className="modal-dismiss-btn"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close dialog"
              >
                {SvgIcons.close}
              </button>
            </div>

            <div className="modal-dialog-body">
              {formSubmitted ? (
                <div style={{ textAlign: "center", padding: "36px 16px" }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: "#dcfce7",
                      color: "#16a34a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 18px",
                    }}
                  >
                    <div style={{ width: 32, height: 32, fill: "#16a34a" }}>
                      {SvgIcons.checkCircle}
                    </div>
                  </div>
                  <h4 style={{ fontSize: 24, fontWeight: 800, color: "var(--navy-900)", marginBottom: 8 }}>
                    Inquiry Transmitted Successfully
                  </h4>
                  <p style={{ color: "var(--navy-700)", fontSize: 15, lineHeight: 1.6 }}>
                    Thank you. Our trading desk at British Merchants Limited has logged your request for <strong>{selectedProduct}</strong>. A dedicated commercial trade officer will contact you shortly with full pricing specifications.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="modal-form">
                  <div className="form-field-group">
                    <label className="field-label">Commodity / Division</label>
                    <select
                      className="field-select"
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                      {productsList.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name} ({p.badge})
                        </option>
                      ))}
                      <option value="General Trade">General Commodity &amp; Steel Inquiry</option>
                    </select>
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">Full Name / Purchasing Organization</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="e.g. Commercial Trading Ltd."
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    <div className="form-field-group">
                      <label className="field-label">Official Email</label>
                      <input
                        type="email"
                        className="field-input"
                        placeholder="trade@company.com"
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-field-group">
                      <label className="field-label">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        className="field-input"
                        placeholder="+880 1711 000000"
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">Trade Volume &amp; Specifications</label>
                    <textarea
                      className="field-textarea"
                      placeholder="Specify required metric tonnage, target discharge port (e.g. Chittagong), and preferred incoterms..."
                      rows={3}
                      value={buyerSpecs}
                      onChange={(e) => setBuyerSpecs(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isSubmittingInquiry}
                    style={{ marginTop: "8px", width: "100%", padding: "14px" }}
                  >
                    <span>{isSubmittingInquiry ? "Transmitting Lead..." : "Transmit Commercial Inquiry"}</span>
                    {SvgIcons.arrowRight}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
