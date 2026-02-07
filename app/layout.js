// import "primereact/resources/themes/lara-light-indigo/theme.css"; // Choose your theme
// import "primereact/resources/primereact.min.css";
// import "primeicons/primeicons.css";
import { cookies } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import LayoutWrapper from "@/app/_components/LayoutWrapper";
import { ThemeProvider } from "@/app/_components/ThemeProvider";
import { I18nProvider } from "@/app/_components/I18nProvider";
import { getMessages, LOCALE_COOKIE, DEFAULT_LOCALE } from "@/app/lib/i18n";

// Vercel script'leri sadece Vercel'de çalışır; IIS/kendi sunucuda 404 verir, koşullu render ediyoruz.
const isVercel = process.env.VERCEL === "1";

const themeScript = `
(function() {
  var t = localStorage.getItem('theme');
  if (t === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
})();
`;

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

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const locale = cookieStore.get(LOCALE_COOKIE)?.value || DEFAULT_LOCALE;
  const messages = getMessages(locale);

  return (
    <html lang={locale === "en" ? "en" : "tr"} suppressHydrationWarning>
      <body className={`${worksans.className} overflow-x-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ThemeProvider>
          <I18nProvider locale={locale} messages={messages}>
            <LayoutWrapper>
              {children}
              {isVercel && (
                <>
                  <Analytics />
                  <SpeedInsights />
                </>
              )}
            </LayoutWrapper>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
