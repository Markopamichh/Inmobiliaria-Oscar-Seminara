"use client";

import { useState } from "react";

interface PropiedadGaleriaProps {
  imagenes: string[];
  titulo: string;
}

export function PropiedadGaleria({ imagenes, titulo }: PropiedadGaleriaProps) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (imagenes.length === 0) {
    return (
      <div className="w-full aspect-video bg-stone-100 rounded-2xl flex items-center justify-center text-stone-300">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <path
            d="M8 40L24 24l8 8 12-16 12 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="4"
            y="4"
            width="56"
            height="56"
            rx="6"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="22" cy="20" r="4" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  return (
    <>
      {/* Main image */}
      <div className="flex flex-col gap-2">
        <div
          className="relative aspect-video rounded-2xl overflow-hidden bg-stone-100 cursor-zoom-in"
          onClick={() => setLightbox(true)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imagenes[current]}
            alt={`${titulo} — imagen ${current + 1}`}
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
            {current + 1} / {imagenes.length}
          </span>
        </div>

        {/* Thumbnails */}
        {imagenes.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {imagenes.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  i === current
                    ? "border-accent"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`Miniatura ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white text-sm"
            onClick={() => setLightbox(false)}
          >
            Cerrar ✕
          </button>
          {imagenes.length > 1 && (
            <>
              <button
                className="absolute left-4 text-white/70 hover:text-white text-2xl px-4 py-8"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrent((c) => (c - 1 + imagenes.length) % imagenes.length);
                }}
              >
                ‹
              </button>
              <button
                className="absolute right-4 text-white/70 hover:text-white text-2xl px-4 py-8"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrent((c) => (c + 1) % imagenes.length);
                }}
              >
                ›
              </button>
            </>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imagenes[current]}
            alt={titulo}
            className="max-h-screen max-w-screen object-contain px-16"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
