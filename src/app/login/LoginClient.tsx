"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginClient() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          router.replace("/dashboard");
        }
      })
      .catch(() => {});
  }, [router]);

  // Sign In state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up state
  const [name, setName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed. Check your credentials.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (regPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (regPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: regEmail,
          password: regPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      setSuccessMsg("Account created! Redirecting to portal...");
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 800);
    } catch (err) {
      setError("An unexpected error occurred during registration.");
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      {/* ============================================================== */}
      {/* 1. BACKGROUND LAYER: Simulated Live Website Content (Blurred)   */}
      {/* ============================================================== */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          overflowY: "auto",
          background: "#f8fafc",
          filter: "blur(9px)",
          transform: "scale(1.03)",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {/* Header Preview */}
        <header
          style={{
            background: "#ffffff",
            borderBottom: "1px solid #e2e8f0",
            padding: "16px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <img src="/assets/Logo.svg" alt="" style={{ height: "42px" }} />
          <div style={{ display: "flex", gap: "24px", color: "#475569", fontWeight: 600 }}>
            <span>Home</span>
            <span>About Us</span>
            <span>Products &amp; Commodities</span>
            <span>Logistics &amp; Process</span>
            <span>Management</span>
            <span>Contact</span>
          </div>
          <div
            style={{
              padding: "10px 20px",
              background: "#c81e26",
              color: "#fff",
              borderRadius: "8px",
              fontWeight: 700,
            }}
          >
            Inquiry Products
          </div>
        </header>

        {/* Hero Section Preview */}
        <div
          style={{
            padding: "80px 40px",
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            color: "#fff",
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: "40px",
            minHeight: "480px",
          }}
        >
          <div>
            <div style={{ color: "#38bdf8", fontWeight: 700, letterSpacing: "1px", marginBottom: "16px" }}>
              GLOBAL AGRO &amp; COMMODITY TRADE
            </div>
            <h1 style={{ fontSize: "44px", fontWeight: 800, lineHeight: 1.2, margin: "0 0 20px 0" }}>
              Connecting Global Supply Chains with Proven Logistics
            </h1>
            <p style={{ color: "#cbd5e1", fontSize: "16px", maxWidth: "600px", lineHeight: 1.6 }}>
              Specializing in high-tonnage agricultural bulk, industrial scrap HMS 1&amp;2, sugar, and structured metals.
            </p>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.12)",
              padding: "24px",
            }}
          >
            <div style={{ height: "240px", borderRadius: "12px", background: "rgba(255,255,255,0.04)" }}></div>
          </div>
        </div>

        {/* Products Grid Preview */}
        <div style={{ padding: "60px 40px", background: "#f8fafc" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  height: "220px",
                  background: "#fff",
                  borderRadius: "14px",
                  border: "1px solid #e2e8f0",
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. FROSTED GLASS BACKDROP OVERLAY                              */}
      {/* ============================================================== */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10,
          background: "rgba(15, 23, 42, 0.45)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
        onClick={() => router.push("/")}
      >
        {/* ============================================================ */}
        {/* 3. POPUP MODAL CARD (Matches EezzyMart Reference)             */}
        {/* ============================================================ */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "440px",
            background: "#ffffff",
            borderRadius: "20px",
            padding: "36px 32px 32px 32px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
            boxSizing: "border-box",
            animation: "modalFadeIn 0.22s ease-out",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top-Right Close Button ✕ */}
          <button
            onClick={() => router.push("/")}
            aria-label="Close modal"
            style={{
              position: "absolute",
              top: "16px",
              right: "18px",
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              fontSize: "20px",
              fontWeight: 400,
              cursor: "pointer",
              padding: "4px 8px",
              lineHeight: 1,
              borderRadius: "50%",
              transition: "color 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#0f172a")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
          >
            ✕
          </button>

          {/* Centered Brand Logo */}
          <div style={{ textAlign: "center", marginBottom: "18px" }}>
            <img
              src="/assets/Logo.svg"
              alt="BritAsia Agro Limited"
              style={{ height: "46px", width: "auto", display: "inline-block" }}
            />
          </div>

          {/* Underline Tabs: Sign In / Sign Up */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "48px",
              borderBottom: "1px solid #e2e8f0",
              marginBottom: "24px",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError("");
                setSuccessMsg("");
              }}
              style={{
                background: "none",
                border: "none",
                fontSize: "15px",
                fontWeight: mode === "signin" ? 700 : 500,
                color: mode === "signin" ? "#0f172a" : "#64748b",
                paddingBottom: "10px",
                marginBottom: "-1px",
                cursor: "pointer",
                borderBottom: mode === "signin" ? "2.5px solid #c81e26" : "2.5px solid transparent",
                transition: "all 0.15s ease",
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError("");
                setSuccessMsg("");
              }}
              style={{
                background: "none",
                border: "none",
                fontSize: "15px",
                fontWeight: mode === "signup" ? 700 : 500,
                color: mode === "signup" ? "#0f172a" : "#64748b",
                paddingBottom: "10px",
                marginBottom: "-1px",
                cursor: "pointer",
                borderBottom: mode === "signup" ? "2.5px solid #c81e26" : "2.5px solid transparent",
                transition: "all 0.15s ease",
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                padding: "10px 14px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "18px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#16a34a",
                padding: "10px 14px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "18px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>✓</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* ================= MODE 1: SIGN IN ================= */}
          {mode === "signin" && (
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Email Input with Mail Icon */}
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                    fontSize: "16px",
                    lineHeight: 1,
                  }}
                >
                  ✉
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  style={{
                    width: "100%",
                    padding: "13px 14px 13px 40px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "border-color 0.15s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#c81e26")}
                  onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                />
              </div>

              {/* Password Input with Lock Icon and Eye Toggle */}
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                    fontSize: "15px",
                    lineHeight: 1,
                  }}
                >
                  🔒
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  style={{
                    width: "100%",
                    padding: "13px 42px 13px 40px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "border-color 0.15s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#c81e26")}
                  onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94a3b8",
                    fontSize: "15px",
                    padding: 0,
                  }}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "👁️" : "👁"}
                </button>
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "13px",
                  marginTop: "-2px",
                }}
              >
                <label
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#475569",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ accentColor: "#c81e26", cursor: "pointer" }}
                  />
                  <span>Remember me</span>
                </label>

                <a
                  href="tel:+8801711034971"
                  style={{
                    color: "#c81e26",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Forgot your password?
                </a>
              </div>

              {/* Red Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: "#c81e26",
                  color: "#ffffff",
                  padding: "13px",
                  borderRadius: "10px",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "15px",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.75 : 1,
                  boxShadow: "0 4px 14px rgba(200, 30, 38, 0.35)",
                  transition: "background 0.2s ease, transform 0.1s ease",
                  marginTop: "4px",
                }}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          )}

          {/* ================= MODE 2: SIGN UP ================= */}
          {mode === "signup" && (
            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Full Name */}
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                    fontSize: "15px",
                    lineHeight: 1,
                  }}
                >
                  👤
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name / Company Name"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 14px 12px 40px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>

              {/* Email */}
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                    fontSize: "16px",
                    lineHeight: 1,
                  }}
                >
                  ✉
                </span>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="buyer@company.com"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 14px 12px 40px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>

              {/* Password */}
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                    fontSize: "15px",
                    lineHeight: 1,
                  }}
                >
                  🔒
                </span>
                <input
                  type={showRegPassword ? "text" : "password"}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Password (min 6 chars)"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 42px 12px 40px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94a3b8",
                    fontSize: "15px",
                    padding: 0,
                  }}
                >
                  {showRegPassword ? "👁️" : "👁"}
                </button>
              </div>

              {/* Confirm Password */}
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                    fontSize: "15px",
                    lineHeight: 1,
                  }}
                >
                  ✓
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 14px 12px 40px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>

              {/* Customer / Viewer Role Note */}
              <div
                style={{
                  padding: "8px 12px",
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#166534",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>👤</span>
                <span>
                  Role: <strong>Customer / Viewer</strong> (Trade tracking &amp; RFQs)
                </span>
              </div>

              {/* Red Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: "#c81e26",
                  color: "#ffffff",
                  padding: "13px",
                  borderRadius: "10px",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "15px",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.75 : 1,
                  boxShadow: "0 4px 14px rgba(200, 30, 38, 0.35)",
                  transition: "background 0.2s ease",
                  marginTop: "2px",
                }}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>
          )}

          {/* Bottom helper */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Link
              href="/"
              style={{
                fontSize: "12.5px",
                color: "#94a3b8",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
