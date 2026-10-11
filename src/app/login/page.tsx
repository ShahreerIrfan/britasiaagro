"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "register">("signin");

  // Sign In state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register state
  const [name, setName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

      setSuccessMsg("Account created successfully! Redirecting to dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 900);
    } catch (err) {
      setError("An unexpected error occurred during registration.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0b1120 0%, #0f172a 100%)",
        padding: "24px",
        fontFamily: "var(--font-sans), sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "#ffffff",
          borderRadius: "20px",
          padding: "36px 32px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
        }}
      >
        {/* Header / Brand */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Link href="/" style={{ display: "inline-block", marginBottom: "14px" }}>
            <img
              src="/assets/Logo.svg"
              alt="British Merchants Limited"
              style={{ height: "46px", width: "auto" }}
            />
          </Link>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: "4px",
              letterSpacing: "-0.02em",
            }}
          >
            {mode === "signin" ? "Management Portal" : "Client Registration"}
          </h1>
          <p style={{ fontSize: "13.5px", color: "#64748b", margin: 0 }}>
            {mode === "signin"
              ? "Sign in with your Super Admin or Viewer account"
              : "Create a Customer / Viewer account for portal access"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "6px",
            background: "#f1f5f9",
            padding: "4px",
            borderRadius: "10px",
            marginBottom: "22px",
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
              padding: "9px 0",
              fontSize: "13px",
              fontWeight: 700,
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background: mode === "signin" ? "#ffffff" : "transparent",
              color: mode === "signin" ? "#0f172a" : "#64748b",
              boxShadow: mode === "signin" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError("");
              setSuccessMsg("");
            }}
            style={{
              padding: "9px 0",
              fontSize: "13px",
              fontWeight: 700,
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background: mode === "register" ? "#ffffff" : "transparent",
              color: mode === "register" ? "#0f172a" : "#64748b",
              boxShadow: mode === "register" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            Create Account
          </button>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              padding: "11px 14px",
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
              padding: "11px 14px",
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

        {/* Mode 1: Sign In */}
        {mode === "signin" && (
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#334155",
                  marginBottom: "6px",
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. name@company.com"
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#334155",
                  marginBottom: "6px",
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>

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
                fontSize: "14.5px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                marginTop: "4px",
                boxShadow: "0 4px 12px rgba(200, 30, 38, 0.3)",
                transition: "background 0.2s ease",
              }}
            >
              {loading ? "Authenticating..." : "Sign In to Dashboard"}
            </button>

            <div style={{ textAlign: "center", marginTop: "12px" }}>
              <span style={{ fontSize: "13px", color: "#64748b" }}>
                Don&apos;t have an account?{" "}
              </span>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                  setSuccessMsg("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#0f766e",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                  padding: 0,
                  textDecoration: "underline",
                }}
              >
                Create Customer / Viewer Account
              </button>
            </div>
          </form>
        )}

        {/* Mode 2: Register (Customer / Viewer Role) */}
        {mode === "register" && (
          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#334155",
                  marginBottom: "5px",
                }}
              >
                Full Name / Organization
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe / Global Traders Inc."
                required
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#334155",
                  marginBottom: "5px",
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="e.g. buyer@company.com"
                required
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "5px",
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Min 6 chars"
                  required
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "5px",
                  }}
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  required
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Role Notice */}
            <div
              style={{
                padding: "8px 12px",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
                color: "#166534",
              }}
            >
              <span>👤</span>
              <span>
                Account Role: <strong>Customer / Viewer</strong> (Trade Tracking &amp; Inquiries)
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: "#0f766e",
                color: "#ffffff",
                padding: "13px",
                borderRadius: "10px",
                border: "none",
                fontWeight: 700,
                fontSize: "14.5px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                marginTop: "4px",
                boxShadow: "0 4px 12px rgba(15, 118, 110, 0.3)",
                transition: "background 0.2s ease",
              }}
            >
              {loading ? "Creating Account..." : "Register Customer Account"}
            </button>

            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <span style={{ fontSize: "13px", color: "#64748b" }}>
                Already registered?{" "}
              </span>
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
                  color: "#c81e26",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                  padding: 0,
                  textDecoration: "underline",
                }}
              >
                Sign In to Portal
              </button>
            </div>
          </form>
        )}

        {/* Back to Home Link */}
        <div
          style={{
            marginTop: "24px",
            paddingTop: "16px",
            borderTop: "1px solid #f1f5f9",
            textAlign: "center",
          }}
        >
          <Link
            href="/"
            style={{
              fontSize: "12.5px",
              color: "#94a3b8",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            ← Return to British Merchants Website
          </Link>
        </div>
      </div>
    </div>
  );
}
