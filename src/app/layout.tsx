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
  metadataBase: new URL("https://britasiaagro.com"),
  title: "BritAsia Agro Limited | Worldwide Commodity & Agro Trade",
  description:
    "BritAsia Agro Limited delivers reliable agro, livestock, and commodity solutions across Bangladesh and global markets. Specializing in Commercial Cattle, Black Bengal Goats, Poultry, Dairy, Haor Waterfowl, Sustainable Aquaculture, and Quality Commodities.",
  keywords: [
    "BritAsia Agro Limited",
    "BritAsia Agro",
    "Agro Livestock Bangladesh",
    "Halal Meat Export",
    "Black Bengal Goat Export",
    "Freshwater Aquaculture Bangladesh",
    "Commodity Trade Bangladesh",
    "Mohakhali DOHS Dhaka",
  ],
  authors: [{ name: "BritAsia Agro Limited" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://britasiaagro.com",
    siteName: "BritAsia Agro Limited",
    title: "BritAsia Agro Limited | Worldwide Commodity & Agro Trade",
    description:
      "BritAsia Agro Limited delivers reliable agro, livestock, and commodity solutions across Bangladesh and global markets. Specializing in Commercial Cattle, Black Bengal Goats, Poultry, Dairy, Haor Waterfowl, Sustainable Aquaculture, and Quality Commodities.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BritAsia Agro Limited",
        type: "image/png",
      },
      {
        url: "/logo-square.png",
        width: 600,
        height: 600,
        alt: "BritAsia Agro Limited Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BritAsia Agro Limited | Worldwide Commodity & Agro Trade",
    description:
      "BritAsia Agro Limited delivers reliable agro, livestock, and commodity solutions across Bangladesh and global markets.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
