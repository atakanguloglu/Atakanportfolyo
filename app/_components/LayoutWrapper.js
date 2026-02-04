"use client";

import { usePathname } from "next/navigation";
import Header from "@/app/_components/Header";
import Footer from "@/app/_components/Footer";
import ScrollToTop from "@/app/_components/ScrollToTop";
import CookieConsentBar from "@/app/_components/CookieConsentBar";
import TrackVisit from "@/app/_components/TrackVisit";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <ScrollToTop />
      <CookieConsentBar />
      <TrackVisit />
    </div>
  );
}
