import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Propiedades" };

export default async function PropiedadesPage() {
  const supabase = await createClient();
  const { data: propiedades } = await supabase
    .from("propiedades")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Propiedades</h1>
          <p className="text-stone-500 mt-1">{propiedades?.length ?? 0} propiedades en total</p>
        </div>
        <Link href="/admin/propiedades/nueva">
          <Button>+ Nueva propiedad</Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {!propiedades || propiedades.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-stone-400 mb-4">No hay propiedades cargadas.</p>
            <Link href="/admin/propiedades/nueva">
              <Button>Cargar primera propiedad</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50">
                  {["Propiedad", "Tipo / Op.", "Precio", "Estado", "Fecha", ""].map((h) => (
                    <th key={h} className="py-3 px-4 text-xs font-medium text-stone-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {propiedades.map((prop) => (
                  <tr key={prop.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-4">
                      <Link href={`/admin/propiedades/${prop.id}`} className="font-medium text-stone-900 hover:text-accent transition-colors line-clamp-1">
                        {prop.titulo}
                      </Link>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {[prop.barrio, prop.ciudad].filter(Boolean).join(", ") || "—"}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-sm text-stone-600 capitalize">
                      {prop.tipo ?? "—"} / {prop.operacion?.replace("_", " ") ?? "—"}
                    </td>
                    <td className="py-3 px-4 text-sm text-stone-900">
                      {formatPrice(prop.precio, prop.moneda)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1.5 flex-wrap">
                        {prop.publicada ? (
                          <Badge variant="success">Publicada</Badge>
                        ) : (
                          <Badge variant="default">Borrador</Badge>
                        )}
                        {prop.destacada && <Badge variant="accent">Destacada</Badge>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-stone-400">{formatDate(prop.created_at)}</td>
                    <td className="py-3 px-4">
                      <Link href={`/admin/propiedades/${prop.id}`} className="text-xs text-stone-500 hover:text-accent transition-colors">
                        Editar →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
