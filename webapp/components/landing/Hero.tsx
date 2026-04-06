import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-stone-900">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(184,151,90,0.4), transparent)",
          }}
        />
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-20" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32">
        <div className="max-w-3xl">
          <p className="text-accent text-sm font-medium tracking-widest uppercase mb-6 animate-fade-in">
            Seminara Inmobiliaria
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-semibold text-white leading-tight mb-8 animate-fade-in-up">
            Tu propiedad
            <br />
            <span className="text-accent">ideal</span>, sin vueltas.
          </h1>
          <p className="text-stone-300 text-lg md:text-xl leading-relaxed mb-10 max-w-xl animate-fade-in-up">
            Asesoramiento personalizado en compra, venta y alquiler de
            propiedades. Más de 15 años acompañando a familias y empresas.
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-in-up">
            <Link
              href="#contacto"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-medium px-8 py-4 rounded-xl transition-colors duration-200"
            >
              Quiero que me asesoren
            </Link>
            <Link
              href="/propiedades"
              className="inline-flex items-center gap-2 border border-white/30 hover:border-white/60 text-white font-medium px-8 py-4 rounded-xl transition-colors duration-200"
            >
              Ver propiedades
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone-500">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-stone-500" />
      </div>
    </section>
  );
}
