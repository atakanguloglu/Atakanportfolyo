"use client";
import React, { useState, useEffect } from "react";
import { Carousel } from "primereact/carousel";

export default function Testimonial() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const responsiveOptions = [
    { breakpoint: "1400px", numVisible: 2, numScroll: 1 },
    { breakpoint: "1199px", numVisible: 3, numScroll: 1 },
    { breakpoint: "767px", numVisible: 2, numScroll: 1 },
    { breakpoint: "575px", numVisible: 1, numScroll: 1 },
  ];

  useEffect(() => {
    fetch("/api/testimonials", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setTestimonials(Array.isArray(data) ? data : []))
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }, []);

  const testimonialTemplate = (item) => (
    <div className="w-3/5 mx-auto text-center p-8 bg-gray-50 rounded-2xl border border-gray-100">
      <div className="text-gray-800 text-lg font-medium leading-relaxed">
        {item.text}
      </div>
      <div className="text-gray-900 text-xl font-semibold mt-6">
        {item.user_name}
      </div>
      <div className="text-gray-600 font-medium mt-2 mb-4">
        {[item.user_post, item.user_company].filter(Boolean).join(", ")}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="w-3/5 mx-auto text-center p-8 bg-gray-50 rounded-2xl border border-gray-100 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-full mb-4" />
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-6" />
        <div className="h-5 bg-gray-200 rounded w-32 mx-auto" />
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        Henüz referans eklenmemiş. Admin panelinden referans ekleyebilirsiniz.
      </p>
    );
  }

  return (
    <div className="card bg-transparent border-0 shadow-none">
      <Carousel
        value={testimonials}
        numVisible={1}
        numScroll={1}
        responsiveOptions={responsiveOptions}
        itemTemplate={testimonialTemplate}
        showNavigators={false}
      />
    </div>
  );
}
