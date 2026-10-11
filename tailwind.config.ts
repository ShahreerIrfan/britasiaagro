import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "dash-bg": "#F6F8FB",
        "dash-card-bg": "#FFFFFF",
        "dash-sidebar-bg": "#FFFFFF",
        "dash-sidebar-border": "#E8EDF4",
        "dash-text-main": "#0F172A",
        "dash-text-body": "#334155",
        "dash-text-muted": "#64748B",
        "dash-text-dim": "#94A3B8",
        "dash-primary": "#D7192D",
        "dash-primary-hover": "#BF1525",
        "dash-primary-light": "#FEE2E2",
        "dash-border": "#E8EDF4",
        "dash-border-subtle": "#F0F3F7",
        "dash-success": "#059669",
        "dash-success-bg": "#ECFDF5",
        "dash-warning": "#D97706",
        "dash-warning-bg": "#FFFBEB",
        "dash-danger": "#DC2626",
        "dash-danger-bg": "#FEF2F2",
        "primary-red": "#c81e26",
        "primary-red-hover": "#b0151c",
        "primary-red-dark": "#8c0d13",
        "primary-red-light": "#fef2f2",
        "primary-red-border": "#fecaca",
        "accent-gold": "#d97706",
        "accent-blue": "#0284c7",
        "navy-950": "#060911",
        "navy-900": "#0b1120",
        "navy-850": "#0f172a",
        "navy-800": "#1e293b",
        "navy-700": "#334155",
        "navy-600": "#475569",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        heading: ["var(--font-heading)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
