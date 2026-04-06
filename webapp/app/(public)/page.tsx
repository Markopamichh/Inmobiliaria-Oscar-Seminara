import { Hero } from "@/components/landing/Hero";
import { PropiedadesDestacadas } from "@/components/landing/PropiedadesDestacadas";
import { DiferenciadorSection } from "@/components/landing/DiferenciadorSection";
import { LeadForm } from "@/components/landing/LeadForm";
import { Footer } from "@/components/landing/Footer";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <>
      <Hero />

      <Suspense fallback={null}>
        <PropiedadesDestacadas />
      </Suspense>

      <DiferenciadorSection />

      {/* Sección de contacto */}
      <section className="py-20 px-6 bg-stone-900" id="contacto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-accent text-sm font-medium tracking-widest uppercase mb-4">
              Contacto
            </p>
            <h2 className="font-display text-4xl font-semibold text-white mb-6 leading-tight">
              Empezá hoy.
              <br />
              Sin compromiso.
            </h2>
            <p className="text-stone-400 text-lg leading-relaxed">
              Contanos qué necesitás y uno de nuestros asesores se va a
              comunicar con vos en menos de 24 horas.
            </p>
            <div className="mt-8 flex flex-col gap-4 text-sm text-stone-400">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-accent text-xs">
                  ✓
                </span>
                Asesoramiento gratuito y sin presión
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-accent text-xs">
                  ✓
                </span>
                Respuesta en menos de 24 horas
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-accent text-xs">
                  ✓
                </span>
                Atención personalizada
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8">
            <LeadForm />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
