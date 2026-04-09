import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PropiedadCard } from "@/components/landing/PropiedadCard";

export async function PropiedadesDestacadas() {
  const supabase = await createClient();
  const { data: propiedades } = await supabase
    .from("propiedades")
    .select(
      "id,titulo,slug,tipo,operacion,precio,moneda,superficie_cubierta,ambientes,dormitorios,barrio,ciudad,imagenes,destacada,estado"
    )
    .eq("publicada", true)
    .eq("destacada", true)
    .limit(6);

  if (!propiedades || propiedades.length === 0) return null;

  return (
    <section className="py-20 px-6 bg-stone-50" id="propiedades">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-accent text-sm font-medium tracking-widest uppercase mb-3">
              Destacadas
            </p>
            <h2 className="font-display text-4xl font-semibold text-stone-900">
              Propiedades seleccionadas
            </h2>
          </div>
          <Link
            href="/propiedades"
            className="text-sm text-stone-500 hover:text-accent transition-colors hidden md:inline"
          >
            Ver todas →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {propiedades.map((prop) => (
            <PropiedadCard key={prop.id} propiedad={prop} />
          ))}
        </div>

        <div className="text-center mt-10 md:hidden">
          <Link
            href="/propiedades"
            className="text-sm text-stone-500 hover:text-accent transition-colors"
          >
            Ver todas las propiedades →
          </Link>
        </div>
      </div>
    </section>
  );
}
