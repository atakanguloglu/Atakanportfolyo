"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const CONSENT_KEY = "cookie_consent";

export default function TrackVisit() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined" || !pathname) return;
    if (localStorage.getItem(CONSENT_KEY) !== "accepted") return;
    const referer = document.referrer || "";
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, referer: referer.slice(0, 500) }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
