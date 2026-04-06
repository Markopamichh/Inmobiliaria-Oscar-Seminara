"use client";

import { useEffect, useRef } from "react";

const diferenciadores = [
  {
    title: "+15 años de experiencia",
    description:
      "Conocemos el mercado inmobiliario de la zona como nadie. Esa experiencia te beneficia en cada decisión.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M16 4a12 12 0 100 24A12 12 0 0016 4z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M16 10v6l4 2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Asesoramiento personalizado",
    description:
      "No sos un número. Trabajamos en base a tus necesidades reales y te acompañamos en todo el proceso.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M16 16a6 6 0 100-12 6 6 0 000 12z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M4 28c0-6.627 5.373-12 12-12s12 5.373 12 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Red de contactos amplia",
    description:
      "Accedé a propiedades exclusivas que no están en portales. Nuestro network trabaja para vos.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="8" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="24" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="24" cy="24" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M11 16h5M19 10l-5 5M19 22l-5-5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Gestión integral",
    description:
      "Desde la búsqueda hasta la firma. Nos ocupamos del papeleo, el escribano y todo lo que necesites.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M8 4h16a2 2 0 012 2v20a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M11 12h10M11 17h10M11 22h6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export function DiferenciadorSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = sectionRef.current?.querySelectorAll<HTMLElement>(".reveal");
    if (!elements) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 px-6 bg-white" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-accent text-sm font-medium tracking-widest uppercase mb-3">
            Por qué elegirnos
          </p>
          <h2 className="font-display text-4xl font-semibold text-stone-900">
            La diferencia Seminara
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {diferenciadores.map((item, i) => (
            <div
              key={i}
              className="reveal"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="text-accent mb-4">{item.icon}</div>
              <h3 className="font-semibold text-stone-900 mb-2">{item.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
