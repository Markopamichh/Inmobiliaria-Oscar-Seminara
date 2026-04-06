import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PropiedadGaleria } from "@/components/landing/PropiedadGaleria";
import { LeadFormPropiedad } from "@/components/landing/LeadFormPropiedad";
import { Footer } from "@/components/landing/Footer";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("propiedades")
    .select("titulo,descripcion")
    .eq("slug", slug)
    .eq("publicada", true)
    .single();
  if (!data) return { title: "Propiedad no encontrada" };
  return {
    title: data.titulo,
    description: data.descripcion ?? undefined,
  };
}

const tipoLabel: Record<string, string> = {
  casa: "Casa",
  departamento: "Departamento",
  terreno: "Terreno",
  local: "Local comercial",
  oficina: "Oficina",
};

const operacionLabel: Record<string, string> = {
  venta: "En venta",
  alquiler: "En alquiler",
  venta_alquiler: "Venta / Alquiler",
};

export default async function PropiedadDetallePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: propiedad } = await supabase
    .from("propiedades")
    .select("*")
    .eq("slug", slug)
    .eq("publicada", true)
    .single();

  if (!propiedad) notFound();

  const ubicacion = [propiedad.barrio, propiedad.ciudad, propiedad.provincia]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-stone-400 mb-6">
          <Link href="/" className="hover:text-stone-600 transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link
            href="/propiedades"
            className="hover:text-stone-600 transition-colors"
          >
            Propiedades
          </Link>
          <span>/</span>
          <span className="text-stone-900 line-clamp-1">{propiedad.titulo}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left — galería + descripción */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <PropiedadGaleria
              imagenes={propiedad.imagenes}
              titulo={propiedad.titulo}
            />

            {/* Header */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {propiedad.tipo && (
                  <span className="bg-stone-100 text-stone-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    {tipoLabel[propiedad.tipo] ?? propiedad.tipo}
                  </span>
                )}
                {propiedad.operacion && (
                  <span className="bg-accent text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    {operacionLabel[propiedad.operacion]}
                  </span>
                )}
              </div>
              <h1 className="font-display text-3xl font-semibold text-stone-900 mb-2">
                {propiedad.titulo}
              </h1>
              {ubicacion && (
                <p className="text-stone-500">{ubicacion}</p>
              )}
              <p className="text-3xl font-semibold text-stone-900 mt-4">
                {formatPrice(propiedad.precio, propiedad.moneda)}
              </p>
            </div>

            {/* Ficha técnica */}
            <div className="bg-stone-50 rounded-2xl p-6">
              <h2 className="font-semibold text-stone-900 mb-4">
                Ficha técnica
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {propiedad.superficie_total && (
                  <div>
                    <p className="text-xs text-stone-400 uppercase tracking-wide">
                      Sup. total
                    </p>
                    <p className="text-stone-900 font-medium mt-1">
                      {propiedad.superficie_total} m²
                    </p>
                  </div>
                )}
                {propiedad.superficie_cubierta && (
                  <div>
                    <p className="text-xs text-stone-400 uppercase tracking-wide">
                      Sup. cubierta
                    </p>
                    <p className="text-stone-900 font-medium mt-1">
                      {propiedad.superficie_cubierta} m²
                    </p>
                  </div>
                )}
                {propiedad.ambientes && (
                  <div>
                    <p className="text-xs text-stone-400 uppercase tracking-wide">
                      Ambientes
                    </p>
                    <p className="text-stone-900 font-medium mt-1">
                      {propiedad.ambientes}
                    </p>
                  </div>
                )}
                {propiedad.dormitorios !== null && propiedad.dormitorios !== undefined && (
                  <div>
                    <p className="text-xs text-stone-400 uppercase tracking-wide">
                      Dormitorios
                    </p>
                    <p className="text-stone-900 font-medium mt-1">
                      {propiedad.dormitorios}
                    </p>
                  </div>
                )}
                {propiedad.banos && (
                  <div>
                    <p className="text-xs text-stone-400 uppercase tracking-wide">
                      Baños
                    </p>
                    <p className="text-stone-900 font-medium mt-1">
                      {propiedad.banos}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Descripción */}
            {propiedad.descripcion && (
              <div>
                <h2 className="font-semibold text-stone-900 mb-3">
                  Descripción
                </h2>
                <p className="text-stone-600 leading-relaxed whitespace-pre-line">
                  {propiedad.descripcion}
                </p>
              </div>
            )}

            {/* Características */}
            {propiedad.caracteristicas && propiedad.caracteristicas.length > 0 && (
              <div>
                <h2 className="font-semibold text-stone-900 mb-3">
                  Características
                </h2>
                <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {propiedad.caracteristicas.map((c) => (
                    <li
                      key={c}
                      className="flex items-center gap-2 text-sm text-stone-600"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right — formulario de contacto */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
              <h2 className="font-semibold text-stone-900 mb-1">
                ¿Te interesa esta propiedad?
              </h2>
              <p className="text-sm text-stone-500 mb-5">
                Completá tus datos y te contactamos.
              </p>
              <LeadFormPropiedad
                propiedadTitulo={propiedad.titulo}
                operacion={propiedad.operacion ?? "venta_alquiler"}
                ubicacion={ubicacion}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
