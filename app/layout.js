// import "primereact/resources/themes/lara-light-indigo/theme.css"; // Choose your theme
// import "primereact/resources/primereact.min.css";
// import "primeicons/primeicons.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import LayoutWrapper from "@/app/_components/LayoutWrapper";

// Vercel script'leri sadece Vercel'de çalışır; IIS/kendi sunucuda 404 verir, koşullu render ediyoruz.
const isVercel = process.env.VERCEL === "1";

import { Work_Sans } from "next/font/google";

const worksans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
});

import "@/app/_styles/globals.css";

export const metadata = {
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  title: {
    template: "%s | Atakan Güloğlu",
    default: "Ana Sayfa | Atakan Güloğlu",
  },
  description:
    "Atakan Güloğlu kişisel portfolyo sitesi. Geliştirici ve tasarımcı projeleri.",
  keywords: [
    "Atakan Güloğlu",
    "portfolyo",
    "kişisel web sitesi",
    "geliştirici portfolyo",
    "Next.js",
    "web geliştirme",
  ],
  authors: [
    { name: "Atakan Güloğlu", url: "https://atakanguloglu.com.tr" },
  ],
  creator: "Atakan Güloğlu",
  publisher: "Atakan Güloğlu",
  metadataBase: new URL("https://atakanguloglu.com.tr"),

  openGraph: {
    title: "Ana Sayfa | Atakan Güloğlu",
    description:
      "Atakan Güloğlu kişisel portfolyo sitesi. Geliştirici ve tasarımcı projeleri.",
    url: "https://atakanguloglu.com.tr",
    siteName: "Atakan Güloğlu Portfolyo",
    images: [
      {
        url: "/og-image.jpg",
        width: 1920,
        height: 1005,
        alt: "Atakan Güloğlu Portfolyo Önizleme",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Ana Sayfa | Atakan Güloğlu",
    description: "Atakan Güloğlu çalışmalarım",
    creator: "@atakan_guloglu",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      maxVideoPreview: -1,
      maxImagePreview: "large",
      maxSnippet: -1,
    },
  },

  alternates: {
    types: {
      "application/rss+xml": "/feed",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={`${worksans.className} overflow-x-hidden`}>
        <LayoutWrapper>
          {children}
          {isVercel && (
            <>
              <Analytics />
              <SpeedInsights />
            </>
          )}
        </LayoutWrapper>
      </body>
    </html>
  );
}
