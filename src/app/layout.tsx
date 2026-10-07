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
  metadataBase: new URL("https://britishmerchants.com"),
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://britishmerchants.com",
    siteName: "British Merchants Limited",
    title: "British Merchants Limited | Worldwide Commodity & Steel Trade",
    description:
      "British Merchants Limited delivers reliable commodity and steel solutions across Bangladesh and global markets. Specializing in Bulk Groceries, Agro, HMS 1&2, Strong Steel, Pure Sugar, Natural Spices, and Quality Fertilizers.",
    images: [
      {
        url: "https://britishmerchants.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "British Merchants Limited",
        type: "image/png",
      },
      {
        url: "https://britishmerchants.com/logo-square.png",
        width: 600,
        height: 600,
        alt: "British Merchants Limited Logo",
        type: "image/png",
      },
      {
        url: "https://britishmerchants.com/logo.png",
        width: 633,
        height: 275,
        alt: "British Merchants Limited Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "British Merchants Limited | Worldwide Commodity & Steel Trade",
    description:
      "British Merchants Limited delivers reliable commodity and steel solutions across Bangladesh and global markets.",
    images: ["https://britishmerchants.com/og-image.png"],
  },
  icons: {
    icon: "/assets/Logo.svg",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/assets/Logo.svg" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta property="og:image" content="https://britishmerchants.com/og-image.png" />
        <meta property="og:image:secure_url" content="https://britishmerchants.com/og-image.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image" content="https://britishmerchants.com/og-image.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
