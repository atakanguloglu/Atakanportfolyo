"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

function imageSrc(image) {
  if (!image) return "";
  if (image.startsWith("http") || image.startsWith("/")) return image;
  return `/clients/${image}`;
}

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const fetchClients = () => {
    fetch("/api/clients?t=" + Date.now(), {
      credentials: "include",
      cache: "no-store",
      headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setClients(data.slice(0, 6)))
      .catch(() => setClients([]));
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const onVisible = () => fetchClients();
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  useEffect(() => {
    if (clients.length === 0) return;
    const t = setInterval(() => {
      setActiveIndex((i) => (i + 1) % clients.length);
    }, 3500);
    return () => clearInterval(t);
  }, [clients.length]);

  if (clients.length === 0) return null;

  const n = clients.length;
  const getClient = (offset) => clients[(activeIndex + offset + n) % n];

  /* Slot sayısı = müşteri sayısı (3 müşteri varsa 3 logo, 5 varsa 5); tekrarlanmasın */
  const mobileSlots = Math.min(3, n);
  const desktopSlots = Math.min(5, n);
  const mobileOffsets = Array.from({ length: mobileSlots }, (_, i) => i - Math.floor(mobileSlots / 2));
  const desktopOffsets = Array.from({ length: desktopSlots }, (_, i) => i - Math.floor(desktopSlots / 2));

  return (
    <div className="w-full overflow-hidden px-2 sm:px-6 py-8">
      {/* Mobil: en fazla 3 slot, müşteri sayısı kadar */}
      <div className="flex md:hidden items-center justify-center gap-2 w-full">
        {mobileOffsets.map((offset) => {
          const client = getClient(offset);
          const isCenter = offset === 0;
          return (
            <div
              key={`m-${client.id}-${offset}`}
              className={`flex-1 min-w-0 flex items-center justify-center h-[100px] transition-all duration-500 ${
                isCenter ? "scale-100 opacity-100" : "scale-90 opacity-80"
              }`}
            >
              <div className={`relative w-full h-full ${isCenter ? "" : "grayscale"}`}>
                <Image
                  src={imageSrc(client.image)}
                  alt={client.name}
                  fill
                  className="object-contain"
                  sizes="120px"
                />
              </div>
            </div>
          );
        })}
      </div>
      {/* Masaüstü: en fazla 5 slot, müşteri sayısı kadar */}
      <div className="hidden md:flex items-end justify-center gap-6 md:gap-10 lg:gap-14 xl:gap-20 w-full max-w-[1600px] mx-auto flex-nowrap">
        {desktopOffsets.map((offset) => {
          const client = getClient(offset);
          const isCenter = offset === 0;
          return (
            <div
              key={`d-${client.id}-${offset}`}
              className={`flex items-center justify-center transition-all duration-500 ease-out flex-shrink-0 ${
                isCenter
                  ? "h-[200px] lg:h-[220px] w-[240px] lg:w-[280px] opacity-100 scale-100"
                  : "h-[100px] lg:h-[120px] w-[130px] lg:w-[150px] opacity-70 scale-95"
              }`}
            >
              <div
                className={`relative w-full h-full ${isCenter ? "" : "grayscale opacity-90"} hover:opacity-100 hover:grayscale-0 transition`}
              >
                <Image
                  src={imageSrc(client.image)}
                  alt={client.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 240px, 280px"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
