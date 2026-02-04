"use client";

import { useState, useEffect, useCallback } from "react";

function CardContent({ item, num }) {
  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <span className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" aria-hidden />
        <span className="text-gray-600 text-sm font-medium">
          {num}️⃣ {item.year}
        </span>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">{item.title}</h2>
      {item.subtitle && (
        <div className="text-gray-500 text-sm mb-3">{item.subtitle}</div>
      )}
      <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
    </>
  );
}

export default function TimelineWithModal({ timelineData }) {
  const [selected, setSelected] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (selected !== null) {
      setAnimateIn(false);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimateIn(true));
      });
      return () => cancelAnimationFrame(id);
    } else {
      setAnimateIn(false);
    }
  }, [selected]);

  const close = useCallback(() => setSelected(null), []);

  useEffect(() => {
    const onEscape = (e) => {
      if (e.key === "Escape") close();
    };
    if (selected !== null) {
      document.addEventListener("keydown", onEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onEscape);
      document.body.style.overflow = "";
    };
  }, [selected, close]);

  const item = selected !== null ? timelineData[selected] : null;
  const num = selected !== null ? selected + 1 : 0;

  return (
    <>
      <div className="max-w-6xl xl:max-w-7xl mx-auto relative">
        <div
          className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-px bg-primary-500 hidden sm:block"
          aria-hidden
        />

        <ul className="space-y-8 sm:space-y-12">
          {timelineData.map((entry, index) => {
            const isLeft = index % 2 === 0;
            const n = index + 1;
            const card = (
              <button
                type="button"
                onClick={() => setSelected(index)}
                className="w-full text-left bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:border-primary-500/50 hover:shadow-md transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <CardContent item={entry} num={n} />
              </button>
            );
            return (
              <li
                key={index}
                className="relative flex flex-row items-stretch gap-4 sm:gap-0"
              >
                <div
                  className={`flex-1 min-w-0 flex justify-end sm:pr-6 order-2 sm:order-1 ${!isLeft ? "hidden sm:flex" : ""}`}
                >
                  {isLeft ? <div className="w-full sm:min-w-0">{card}</div> : null}
                </div>
                <div className="flex-shrink-0 w-10 h-10 sm:mx-0 rounded-full bg-green-500 border-4 border-gray-50 flex items-center justify-center z-10 order-1 sm:order-2">
                  <span className="text-sm font-bold text-white leading-tight">{n}</span>
                </div>
                <div
                  className={`flex-1 min-w-0 flex justify-start sm:pl-6 order-2 sm:order-3 ${isLeft ? "hidden sm:flex" : ""}`}
                >
                  {!isLeft ? <div className="w-full sm:min-w-0">{card}</div> : null}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {selected !== null && item && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity duration-200 opacity-100"
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
          onClick={close}
        >
          <div
            id="modal-title"
            role="document"
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-left transition-all duration-200 ease-out ${
              animateIn ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <button
              type="button"
              onClick={close}
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Kapat"
            >
              <span className="text-2xl leading-none" aria-hidden>×</span>
            </button>
            <CardContent item={item} num={num} />
          </div>
        </div>
      )}
    </>
  );
}
