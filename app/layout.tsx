import type { Metadata, Viewport } from "next";
import { Chakra_Petch, Inter, JetBrains_Mono } from "next/font/google";
import { profile } from "@/lib/data";
import { site, siteUrl } from "@/lib/site";
import "./globals.css";

const display = Chakra_Petch({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700"] });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: site.title,
    template: `%s — ${profile.name}`,
  },
  description: site.description,
  applicationName: site.shortName,
  keywords: site.keywords,
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  publisher: profile.name,
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: site.locale,
    firstName: profile.firstName,
    lastName: profile.lastName,
    username: "Menghong-Git",
    // The image itself comes from app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  // Stops iOS from turning random numbers (e.g. stats) into phone links
  formatDetection: { telephone: false, email: false, address: false },
  verification: {
    // Paste the code from Google Search Console → Settings → Ownership verification → HTML tag
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export const viewport: Viewport = {
  themeColor: site.themeColor,
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} is-loading`}>
      <body>{children}</body>
    </html>
  );
}
