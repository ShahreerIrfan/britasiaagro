"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
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

  const fillCredentials = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError("");
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
          maxWidth: "440px",
          background: "#ffffff",
          borderRadius: "20px",
          padding: "40px 32px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "inline-block", marginBottom: "16px" }}>
            <img
              src="/assets/Logo.svg"
              alt="British Merchants Limited"
              style={{ height: "48px", width: "auto" }}
            />
          </div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: "6px",
            }}
          >
            Management Portal
          </h1>
          <p style={{ fontSize: "13.5px", color: "#64748b" }}>
            Sign in with your Super Admin or Viewer account
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              padding: "12px 14px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 600,
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
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
              placeholder="e.g. admin@britishmerchants.com"
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
              padding: "14px",
              borderRadius: "10px",
              border: "none",
              fontWeight: 700,
              fontSize: "14.5px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              marginTop: "6px",
              boxShadow: "0 4px 12px rgba(200, 30, 38, 0.3)",
              transition: "background 0.2s ease",
            }}
          >
            {loading ? "Authenticating..." : "Sign In to Dashboard"}
          </button>
        </form>

        {/* 1-Click Demo Login Shortcuts */}
        <div
          style={{
            marginTop: "28px",
            paddingTop: "20px",
            borderTop: "1px solid #f1f5f9",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            Quick 1-Click Credentials
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={() => fillCredentials("admin@britishmerchants.com", "AdminPassword2026!")}
              style={{
                flex: 1,
                padding: "9px 8px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#c81e26",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              👑 Super Admin
            </button>
            <button
              type="button"
              onClick={() => fillCredentials("viewer@britishmerchants.com", "ViewerPassword2026!")}
              style={{
                flex: 1,
                padding: "9px 8px",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#16a34a",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              👁️ Viewer Role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
