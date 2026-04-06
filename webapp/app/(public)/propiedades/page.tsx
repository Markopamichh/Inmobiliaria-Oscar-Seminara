import { createClient } from "@/lib/supabase/server";
import { PropiedadCard } from "@/components/landing/PropiedadCard";
import { Footer } from "@/components/landing/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Propiedades",
  description: "Catálogo completo de propiedades en venta y alquiler.",
};

interface Props {
  searchParams: Promise<{
    tipo?: string;
    operacion?: string;
    ciudad?: string;
    page?: string;
  }>;
}

const PER_PAGE = 12;

export default async function PropiedadesPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const from = (page - 1) * PER_PAGE;
  const to = from + PER_PAGE - 1;

  const supabase = await createClient();

  let query = supabase
    .from("propiedades")
    .select(
      "id,titulo,slug,tipo,operacion,precio,moneda,superficie_cubierta,ambientes,dormitorios,barrio,ciudad,imagenes,destacada",
      { count: "exact" }
    )
    .eq("publicada", true)
    .order("destacada", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (params.tipo) query = query.eq("tipo", params.tipo as "casa" | "departamento" | "terreno" | "local" | "oficina");
  if (params.operacion) query = query.eq("operacion", params.operacion as "venta" | "alquiler" | "venta_alquiler");
  if (params.ciudad) query = query.ilike("ciudad", `%${params.ciudad}%`);

  const { data: propiedades, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / PER_PAGE);

  function buildUrl(extra: Record<string, string | undefined>) {
    const p = new URLSearchParams();
    if (params.tipo) p.set("tipo", params.tipo);
    if (params.operacion) p.set("operacion", params.operacion);
    if (params.ciudad) p.set("ciudad", params.ciudad);
    Object.entries(extra).forEach(([k, v]) => {
      if (v) p.set(k, v);
      else p.delete(k);
    });
    const s = p.toString();
    return `/propiedades${s ? `?${s}` : ""}`;
  }

  return (
    <>
      {/* Header */}
      <div className="bg-stone-900 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="text-stone-500 text-sm hover:text-stone-300 transition-colors">
            ← Volver al inicio
          </Link>
          <h1 className="font-display text-4xl font-semibold text-white mt-4 mb-2">
            Propiedades
          </h1>
          <p className="text-stone-400">
            {count ?? 0} propiedades disponibles
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {/* Operación */}
          {["venta", "alquiler"].map((op) => (
            <Link
              key={op}
              href={buildUrl({
                operacion: params.operacion === op ? undefined : op,
                page: undefined,
              })}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all capitalize ${
                params.operacion === op
                  ? "bg-stone-900 text-white border-stone-900"
                  : "bg-white text-stone-600 border-stone-300 hover:border-stone-400"
              }`}
            >
              {op}
            </Link>
          ))}

          {/* Tipo */}
          {["casa", "departamento", "terreno", "local", "oficina"].map((t) => (
            <Link
              key={t}
              href={buildUrl({
                tipo: params.tipo === t ? undefined : t,
                page: undefined,
              })}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all capitalize ${
                params.tipo === t
                  ? "bg-stone-900 text-white border-stone-900"
                  : "bg-white text-stone-600 border-stone-300 hover:border-stone-400"
              }`}
            >
              {t}
            </Link>
          ))}
        </div>

        {/* Grid */}
        {propiedades && propiedades.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {propiedades.map((prop) => (
              <PropiedadCard key={prop.id} propiedad={prop} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-stone-400 mb-4">
              No hay propiedades con los filtros seleccionados.
            </p>
            <Link
              href="/propiedades"
              className="text-sm text-accent hover:underline"
            >
              Ver todas
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            {page > 1 && (
              <Link
                href={buildUrl({ page: String(page - 1) })}
                className="px-5 py-2.5 border border-stone-300 rounded-lg text-sm text-stone-600 hover:border-stone-400 transition-colors"
              >
                ← Anterior
              </Link>
            )}
            <span className="text-sm text-stone-500">
              {page} / {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={buildUrl({ page: String(page + 1) })}
                className="px-5 py-2.5 border border-stone-300 rounded-lg text-sm text-stone-600 hover:border-stone-400 transition-colors"
              >
                Siguiente →
              </Link>
            )}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
