import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "British Merchants Limited | Worldwide Commodity & Steel Trade",
  description:
    "British Merchants Limited delivers reliable commodity and steel solutions across Bangladesh and global markets. Specializing in Bulk Groceries, Agro, HMS 1&2, Strong Steel, Pure Sugar, Natural Spices, and Quality Fertilizers.",
  keywords: [
    "British Merchants Limited",
    "Commodity Trade Bangladesh",
    "Steel Metals Import Export",
    "HMS 1&2 scrap",
    "Fresh Grocery",
    "Pure Sugar",
    "Natural Spices",
    "Quality Fertilizer",
    "Mohakhali DOHS Dhaka",
  ],
  authors: [{ name: "British Merchants Limited" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/assets/logo.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
