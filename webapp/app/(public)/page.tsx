import { Hero } from "@/components/landing/Hero";
import { PropiedadesDestacadas } from "@/components/landing/PropiedadesDestacadas";
import { DiferenciadorSection } from "@/components/landing/DiferenciadorSection";
import { WizardCalificacion } from "@/components/landing/WizardCalificacion";
import { Footer } from "@/components/landing/Footer";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <>
      <Hero />

      <Suspense fallback={null}>
        <PropiedadesDestacadas />
      </Suspense>

      {/* Sección wizard de calificación */}
      <section className="py-20 px-6 bg-stone-50" id="contacto">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <p className="text-accent text-sm font-medium tracking-widest uppercase mb-4">
            Calificá tu búsqueda
          </p>
          <h2 className="font-display text-4xl font-semibold text-stone-900 mb-4">
            ¿Listo para encontrar tu propiedad?
          </h2>
          <p className="text-stone-500 text-lg">
            Respondé unas preguntas y Oscar te contacta directamente por WhatsApp.
          </p>
        </div>
        <div className="max-w-lg mx-auto">
          <WizardCalificacion />
        </div>
      </section>

      <DiferenciadorSection />

      <Footer />
    </>
  );
}
