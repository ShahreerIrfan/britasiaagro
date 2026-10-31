"use client";

import React, { useState } from "react";
import Link from "next/link";
import "./service-detail.css";
import { ServiceItem, getServicePipelineSteps } from "@/lib/servicesData";

// ==========================================
// BESPOKE SVG ICONS (NO EMOJIS ALLOWED)
// ==========================================
const DetailIcons = {
  arrowLeft: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  arrowRight: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  breed: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12A10 10 0 0 1 12 2z" />
      <path d="M8 12s1.5-2 4-2 4 2 4 2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  ),
  farming: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
      <path d="M9 9v1" />
      <path d="M9 13v1" />
      <path d="M9 17v1" />
    </svg>
  ),
  processing: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  packaging: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  certifications: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  logistics: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  check: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  phone: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  mail: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
};

export default function ServiceDetailClient({ service }: { service: ServiceItem }) {
  const pipelineSteps = getServicePipelineSteps(service);

  // Inquiry Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    commodity: service.name,
    volume: "500 Metric Tons",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const scrollToInquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    const elem = document.getElementById("inquiry-form-card");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit inquiry");
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while submitting inquiry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sd-page-wrapper">
      {/* 1. TOP NAVBAR */}
      <header className="sd-navbar">
        <div className="sd-navbar-inner">
          <Link href="/" className="sd-nav-brand" aria-label="British Merchants Home">
            <img
              src="/assets/Logo.svg"
              alt="British Merchants Connecting The Dots..."
              className="sd-brand-logo"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/logo.png";
              }}
            />
          </Link>

          <div className="sd-nav-actions">
            <Link href="/#products" className="sd-btn-back">
              {DetailIcons.arrowLeft}
              <span>All Services</span>
            </Link>
            <a href="#inquiry-form-card" onClick={scrollToInquiry} className="sd-btn-inquiry-nav">
              <span>Quick Quote</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. BREADCRUMB BAR */}
      <nav className="sd-breadcrumb-bar" aria-label="Breadcrumb">
        <div className="sd-breadcrumb-inner">
          <Link href="/" className="sd-breadcrumb-link">Home</Link>
          <span className="sd-breadcrumb-separator">/</span>
          <Link href="/#products" className="sd-breadcrumb-link">Services</Link>
          <span className="sd-breadcrumb-separator">/</span>
          <span className="sd-breadcrumb-current">{service.name}</span>
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <section className="sd-hero-section">
        <div className="sd-hero-container">
          <div className="sd-hero-left">
            <div className="sd-badge-row">
              <span className="sd-category-badge">{service.badge || "Corporate Division"}</span>
              <span className="sd-cert-pill">★ HACCP &amp; ISO 22000</span>
              <span className="sd-cert-pill">★ 100% Halal Assurance</span>
            </div>

            <h1 className="sd-hero-title">{service.name}</h1>
            <p className="sd-hero-desc">{service.desc}</p>

            <div className="sd-hero-cta-row">
              <a href="#inquiry-form-card" onClick={scrollToInquiry} className="sd-btn-primary">
                <span>Inquire This Commodity</span>
                {DetailIcons.arrowRight}
              </a>
              <Link href="/#products" className="sd-btn-secondary">
                <span>Explore Other Verticals</span>
              </Link>
            </div>
          </div>

          <div className="sd-hero-right">
            <div className="sd-hero-image-card">
              <img
                src={service.image}
                alt={service.name}
                className="sd-hero-img"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/assets/product-agro.svg";
                }}
              />
              <div className="sd-hero-image-badge">
                <div>
                  <span className="sd-status-dot"></span>
                  <span>Active Commercial Export Line</span>
                </div>
                <span>RJSC: C-207932/2026</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 5-STEP COMMERCIAL LIFECYCLE PIPELINE (IMAGE-01 MATCH) */}
      {pipelineSteps && pipelineSteps.length === 5 && (
        <section className="sd-pipeline-section">
          <div className="sd-pipeline-container">
            <div className="sd-pipeline-header">
              <span className="sd-pipeline-tag">Commercial Lifecycle Pipeline</span>
              <h2 className="sd-pipeline-title">From Ethical Production to Global Culinary Excellence</h2>
              <p className="sd-pipeline-subtitle">
                Complete institutional supply chain governance ensuring certified Halal standards, cryogenic cold-chain integrity, and direct maritime export logistics.
              </p>
            </div>

            {/* Row 1: Top 3 Cards (Steps 1, 2, 3) */}
            <div className="sd-pipeline-grid-top">
              {pipelineSteps.slice(0, 3).map((step) => (
                <div key={step.stepNumber} className="sd-step-card">
                  <div className="sd-step-tag">
                    <span>{step.stepTag}</span>
                  </div>
                  <div className="sd-step-img-box">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="sd-step-img"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = service.image;
                      }}
                    />
                  </div>
                  <div className="sd-step-content">
                    <h3 className="sd-step-title">{step.title}</h3>
                    {step.desc && <p className="sd-step-desc">{step.desc}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2: Bottom 2 Cards Centered (Steps 4, 5) */}
            <div className="sd-pipeline-grid-bottom">
              {pipelineSteps.slice(3, 5).map((step) => (
                <div key={step.stepNumber} className="sd-step-card">
                  <div className="sd-step-tag">
                    <span>{step.stepTag}</span>
                  </div>
                  <div className="sd-step-img-box">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="sd-step-img"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = service.image;
                      }}
                    />
                  </div>
                  <div className="sd-step-content">
                    <h3 className="sd-step-title">{step.title}</h3>
                    {step.desc && <p className="sd-step-desc">{step.desc}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. MAIN CONTENT & INQUIRY FORM */}
      <main className="sd-main-section">
        {/* Left Column: Specifications / Core Attributes */}
        <div className="sd-specs-col">
          <div className="sd-section-header">
            <span className="sd-section-tag">DIVISIONAL CAPABILITIES &amp; STANDARDS</span>
            <h2 className="sd-section-title">Technical Specifications &amp; Governance</h2>
            <p className="sd-section-subtitle">
              Comprehensive operational overview aligned with British Merchants Corporate Agro Profile.
            </p>
          </div>

          {/* The 6 Core Attributes Grid */}
          <div className="sd-attributes-grid">
            {/* Attribute 1: Breed / Species */}
            <div className="sd-attribute-card">
              <div className="sd-attr-icon-box">{DetailIcons.breed}</div>
              <div className="sd-attr-content">
                <span className="sd-attr-label">Breed / Species / Variety</span>
                <p className="sd-attr-value">
                  {service.breed || "Selected high-yield genetics calibrated for superior performance and food safety."}
                </p>
              </div>
            </div>

            {/* Attribute 2: Farming & Rearing Method */}
            <div className="sd-attribute-card">
              <div className="sd-attr-icon-box">{DetailIcons.farming}</div>
              <div className="sd-attr-content">
                <span className="sd-attr-label">Farming &amp; Husbandry Method</span>
                <p className="sd-attr-value">
                  {service.farmingMethod || "Controlled biosecure husbandry, precision animal nutrition, and continuous veterinary supervision."}
                </p>
              </div>
            </div>

            {/* Attribute 3: Processing & Cold-Chain Technology */}
            <div className="sd-attribute-card">
              <div className="sd-attr-icon-box">{DetailIcons.processing}</div>
              <div className="sd-attr-content">
                <span className="sd-attr-label">Processing &amp; Cold-Chain Technology</span>
                <p className="sd-attr-value">
                  {service.processingMethod || "Sanitary stainless-steel processing, certified Halal butchering, and -40°C cryogenic blast freezing."}
                </p>
              </div>
            </div>

            {/* Attribute 4: Cuts & Packaging Formats */}
            <div className="sd-attribute-card">
              <div className="sd-attr-icon-box">{DetailIcons.packaging}</div>
              <div className="sd-attr-content">
                <span className="sd-attr-label">Available Cuts &amp; Packaging Formats</span>
                <p className="sd-attr-value">
                  {service.packaging || "Export-grade vacuum skin packaging (VSP), modified atmosphere trays, and heavy-duty 5-ply master cartons."}
                </p>
              </div>
            </div>

            {/* Attribute 5: Certifications & Standards */}
            <div className="sd-attribute-card">
              <div className="sd-attr-icon-box">{DetailIcons.certifications}</div>
              <div className="sd-attr-content">
                <span className="sd-attr-label">Certifications &amp; Food Safety Standards</span>
                <p className="sd-attr-value">
                  {service.certifications || "100% Halal Assurance, HACCP, ISO 22000 Food Safety, and official DLS Veterinary Health Clearance."}
                </p>
              </div>
            </div>

            {/* Attribute 6: Export Logistics & Shipping */}
            <div className="sd-attribute-card">
              <div className="sd-attr-icon-box">{DetailIcons.logistics}</div>
              <div className="sd-attr-content">
                <span className="sd-attr-label">Export Logistics &amp; Shipping Mode</span>
                <p className="sd-attr-value">
                  {service.logistics || "40ft High-Cube Super Reefer ocean transit (-20°C to -40°C) and express chilled air-freight to UK, Europe, and GCC."}
                </p>
              </div>
            </div>
          </div>

          {/* Corporate Trust & Assurance Highlights */}
          <div className="sd-trust-banner">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0b1120" }}>
              The British Merchants Export Guarantee
            </h3>
            <p style={{ fontSize: "0.86rem", color: "#64748b", marginTop: "4px" }}>
              Every commercial contract is backed by rigorous institutional governance and quality assurance:
            </p>
            <div className="sd-trust-grid">
              <div className="sd-trust-item">
                <span className="sd-trust-icon">{DetailIcons.check}</span>
                <span>100% Farm-to-Fork Batch Traceability</span>
              </div>
              <div className="sd-trust-item">
                <span className="sd-trust-icon">{DetailIcons.check}</span>
                <span>Confirmed Irrevocable Letters of Credit (L/C)</span>
              </div>
              <div className="sd-trust-item">
                <span className="sd-trust-icon">{DetailIcons.check}</span>
                <span>Independent SGS / Bureau Veritas Pre-Shipment Audit</span>
              </div>
              <div className="sd-trust-item">
                <span className="sd-trust-icon">{DetailIcons.check}</span>
                <span>Direct Tier-1 Carrier Ocean Line Contracts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Direct Trade Inquiry Form */}
        <div className="sd-form-col">
          <div className="sd-form-sticky-card" id="inquiry-form-card">
            <div className="sd-form-header">
              <h3 className="sd-form-title">Trade Inquiry &amp; Quotation</h3>
              <p className="sd-form-subtitle">
                Submit your volume requirements for <strong>{service.name}</strong>. Our international commercial desk responds within 24 hours.
              </p>
            </div>

            {submitted ? (
              <div className="sd-success-banner">
                <div className="sd-success-icon-box">{DetailIcons.check}</div>
                <h4 className="sd-success-title">Inquiry Submitted Successfully</h4>
                <p className="sd-success-desc">
                  Thank you for your interest in <strong>{service.name}</strong>. A dedicated trade officer has received your specification and will follow up with proforma pricing.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="sd-btn-secondary"
                  style={{ marginTop: "12px", width: "100%", justifyContent: "center" }}
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="sd-inquiry-form">
                {errorMsg && (
                  <div className="sd-error-banner">
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Selected Commodity (Readonly) */}
                <div className="sd-form-group">
                  <label className="sd-form-label">
                    <span>Selected Commodity / Service</span>
                  </label>
                  <input
                    type="text"
                    name="commodity"
                    value={formData.commodity}
                    readOnly
                    className="sd-input-text sd-input-readonly"
                  />
                </div>

                {/* Contact Name */}
                <div className="sd-form-group">
                  <label className="sd-form-label">
                    <span>Buyer / Contact Name</span>
                    <span className="sd-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Johnathan Davis"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="sd-input-text"
                  />
                </div>

                {/* Corporate Email */}
                <div className="sd-form-group">
                  <label className="sd-form-label">
                    <span>Corporate Email</span>
                    <span className="sd-required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="e.g. j.davis@globalfoods.co.uk"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="sd-input-text"
                  />
                </div>

                {/* Phone / WhatsApp */}
                <div className="sd-form-group">
                  <label className="sd-form-label">
                    <span>Phone / WhatsApp</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="e.g. +44 20 7946 0912"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="sd-input-text"
                  />
                </div>

                {/* Company Name */}
                <div className="sd-form-group">
                  <label className="sd-form-label">
                    <span>Company / Importer Name</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    placeholder="e.g. Anglo-European Wholesale Ltd."
                    value={formData.company}
                    onChange={handleInputChange}
                    className="sd-input-text"
                  />
                </div>

                {/* Target Volume */}
                <div className="sd-form-group">
                  <label className="sd-form-label">
                    <span>Target Volume / Containers</span>
                  </label>
                  <select
                    name="volume"
                    value={formData.volume}
                    onChange={handleInputChange}
                    className="sd-input-select"
                  >
                    <option value="1x 40ft High-Cube Container">1x 40ft High-Cube Container (~25 MT)</option>
                    <option value="2-5x 40ft Containers">2–5x 40ft Containers (50–125 MT)</option>
                    <option value="10+ Containers (Annual Contract)">10+ Containers (Annual Supply Contract)</option>
                    <option value="Air-Freight Chilled Trial (2-5 MT)">Air-Freight Chilled Trial (2–5 MT)</option>
                    <option value="500 Metric Tons">500 Metric Tons</option>
                    <option value="1,000+ Metric Tons Bulk">1,000+ Metric Tons Bulk</option>
                  </select>
                </div>

                {/* Message / Delivery Requirements */}
                <div className="sd-form-group">
                  <label className="sd-form-label">
                    <span>Destination Port &amp; Cut Specifications</span>
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Specify target destination port (e.g. Felixstowe, Rotterdam, Jebel Ali), packaging requirements, or delivery schedule..."
                    value={formData.message}
                    onChange={handleInputChange}
                    className="sd-textarea"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="sd-btn-submit"
                >
                  {loading ? (
                    <span>Submitting Inquiry...</span>
                  ) : (
                    <>
                      <span>Submit Trade Inquiry</span>
                      {DetailIcons.arrowRight}
                    </>
                  )}
                </button>

                <p className="sd-form-privacy-note">
                  🔒 Strictly Confidential &amp; Protected by British Merchants Commercial Trade Governance.
                </p>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* 5. FOOTER */}
      <footer className="sd-footer">
        <div className="sd-footer-inner">
          <div className="sd-footer-top">
            <div>
              <h4 style={{ color: "#ffffff", fontWeight: 700, fontSize: "1.05rem" }}>
                British Merchants Limited
              </h4>
              <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: "2px" }}>
                Corporate Agro &amp; Commodity Trade Infrastructure • RJSC: C-207932/2026
              </p>
            </div>

            <div className="sd-footer-contacts">
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {DetailIcons.phone}
                +880 29835226
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {DetailIcons.mail}
                export@britishmerchants.com
              </span>
            </div>
          </div>

          <p className="sd-footer-copy">
            &copy; {new Date().getFullYear()} British Merchants Limited. All rights reserved. Registered Office: Mohakhali DOHS, Dhaka, Bangladesh.
          </p>
        </div>
      </footer>
    </div>
  );
}

