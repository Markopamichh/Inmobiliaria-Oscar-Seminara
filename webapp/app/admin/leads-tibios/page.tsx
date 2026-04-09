import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { Metadata } from "next";
import type { Lead } from "@/types/lead";

export const metadata: Metadata = { title: "Leads Tibios" };

const estadoLabels: Record<string, { label: string; variant: "warning" | "info" | "success" }> = {
  esperando_propiedad: { label: "Esperando propiedad", variant: "warning" },
  contactado: { label: "Contactado", variant: "info" },
  cerrado: { label: "Cerrado", variant: "success" },
};

const urgenciaLabels: Record<string, string> = {
  ahora: "Urgente",
  "3_meses": "3 meses",
  "6_meses": "6+ meses",
};

const tipoLabels: Record<string, string> = {
  casa: "Casa",
  departamento: "Depto",
  local: "Local",
  terreno: "Terreno",
  oficina: "Oficina",
};

interface Props {
  searchParams: Promise<{
    zona?: string;
    tipo?: string;
    presupuesto?: string;
  }>;
}

export default async function LeadsTibiosPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("leads")
    .select("*", { count: "exact" })
    .eq("temperatura", "warm")
    .order("created_at", { ascending: false });

  if (params.zona) {
    query = query.ilike("zona_preferida", `%${params.zona}%`);
  }
  if (params.tipo) {
    query = query.eq("tipo_propiedad_buscado", params.tipo);
  }
  if (params.presupuesto) {
    query = query.eq("presupuesto_rango", params.presupuesto);
  }

  const { data: leads, count } = await query;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-stone-900">
            Leads Tibios
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            {count ?? 0} contacto{count !== 1 ? "s" : ""} esperando la propiedad indicada
          </p>
        </div>
        <Link href="/admin/leads-tibios/nueva">
          <Button>+ Nuevo lead tibio</Button>
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        <form className="flex flex-wrap gap-3">
          <select
            name="tipo"
            defaultValue={params.tipo ?? ""}
            className="rounded-lg border border-stone-200 text-sm px-3 py-2 text-stone-700 bg-white focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">Todos los tipos</option>
            <option value="casa">Casa</option>
            <option value="departamento">Departamento</option>
            <option value="local">Local</option>
            <option value="terreno">Terreno</option>
            <option value="oficina">Oficina</option>
          </select>
          <select
            name="presupuesto"
            defaultValue={params.presupuesto ?? ""}
            className="rounded-lg border border-stone-200 text-sm px-3 py-2 text-stone-700 bg-white focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">Todos los presupuestos</option>
            <option value="menos_50k">Menos de USD 50k</option>
            <option value="50k_100k">USD 50k – 100k</option>
            <option value="100k_200k">USD 100k – 200k</option>
            <option value="mas_200k">Más de USD 200k</option>
          </select>
          <input
            name="zona"
            defaultValue={params.zona ?? ""}
            placeholder="Zona..."
            className="rounded-lg border border-stone-200 text-sm px-3 py-2 text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            className="rounded-lg bg-stone-900 text-white text-sm px-4 py-2 hover:bg-stone-800 transition-colors"
          >
            Filtrar
          </button>
          {(params.tipo || params.presupuesto || params.zona) && (
            <Link
              href="/admin/leads-tibios"
              className="rounded-lg border border-stone-200 text-stone-500 text-sm px-4 py-2 hover:bg-stone-50 transition-colors"
            >
              Limpiar
            </Link>
          )}
        </form>
      </div>

      {/* Tabla */}
      {!leads || leads.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <p className="text-stone-400 text-sm">No hay leads tibios cargados.</p>
          <Link href="/admin/leads-tibios/nueva" className="mt-4 inline-block">
            <Button variant="outline">Cargar el primero</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wide">
                    Contacto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wide">
                    Busca
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wide">
                    Zona
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wide">
                    Presupuesto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wide">
                    Urgencia
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wide">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wide">
                    Fecha
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {(leads as Lead[]).map((lead) => {
                  const estadoInfo = estadoLabels[lead.estado] ?? {
                    label: lead.estado,
                    variant: "default" as const,
                  };
                  return (
                    <tr key={lead.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-stone-900">
                          {lead.nombre} {lead.apellido}
                        </p>
                        <p className="text-stone-400 text-xs mt-0.5">
                          {lead.telefono}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-stone-600">
                        {lead.tipo_propiedad_buscado
                          ? tipoLabels[lead.tipo_propiedad_buscado] ?? lead.tipo_propiedad_buscado
                          : "—"}
                        {lead.ambientes_minimos && (
                          <span className="text-stone-400 ml-1">
                            {lead.ambientes_minimos}amb+
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-stone-600">
                        {lead.zona_preferida ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-stone-600">
                        {lead.presupuesto_rango ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        {lead.urgencia ? (
                          <span className="text-stone-600">
                            {urgenciaLabels[lead.urgencia] ?? lead.urgencia}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={estadoInfo.variant}>{estadoInfo.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-stone-400 text-xs">
                        {new Date(lead.created_at).toLocaleDateString("es-AR")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/leads-tibios/${lead.id}`}
                          className="text-accent hover:text-accent-dark text-xs font-medium transition-colors"
                        >
                          Ver
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
