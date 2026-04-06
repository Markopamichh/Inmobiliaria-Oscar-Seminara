import { createClient } from "@/lib/supabase/server";
import { MetricCard } from "@/components/admin/MetricCard";
import { LeadRow } from "@/components/admin/LeadRow";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();

  const [
    { count: totalLeads },
    { count: leadsNuevos },
    { count: propiedadesPublicadas },
    { count: propiedadesDestacadas },
    { data: ultimosLeads },
  ] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("estado", "nuevo"),
    supabase
      .from("propiedades")
      .select("*", { count: "exact", head: true })
      .eq("publicada", true),
    supabase
      .from("propiedades")
      .select("*", { count: "exact", head: true })
      .eq("destacada", true),
    supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-900">Dashboard</h1>
        <p className="text-stone-500 mt-1">Resumen general de actividad</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Total leads" value={totalLeads ?? 0} description="Todos los contactos" />
        <MetricCard title="Leads nuevos" value={leadsNuevos ?? 0} description="Sin gestionar" />
        <MetricCard title="Publicadas" value={propiedadesPublicadas ?? 0} />
        <MetricCard title="Destacadas" value={propiedadesDestacadas ?? 0} />
      </div>

      <div className="bg-white rounded-xl border border-stone-200">
        <div className="px-6 py-4 border-b border-stone-100">
          <h2 className="font-semibold text-stone-900">Últimos leads</h2>
        </div>
        {ultimosLeads && ultimosLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-stone-100">
                  {["Contacto", "Intención", "Zona", "Estado", "Fecha", ""].map((h) => (
                    <th key={h} className="py-3 px-4 text-xs font-medium text-stone-400 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ultimosLeads.map((lead) => (
                  <LeadRow key={lead.id} lead={lead} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-stone-400 text-sm px-6 py-8 text-center">
            Todavía no hay leads registrados.
          </p>
        )}
      </div>
    </div>
  );
}
