import { createClient } from "@/lib/supabase/server";
import { LeadTable } from "@/components/admin/LeadTable";
import { LeadFilters } from "@/components/admin/LeadFilters";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Leads" };

const PER_PAGE = 20;

interface Props {
  searchParams: Promise<{
    q?: string;
    estado?: string;
    intencion?: string;
    page?: string;
  }>;
}

export default async function LeadsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const from = (page - 1) * PER_PAGE;
  const to = from + PER_PAGE - 1;

  const supabase = await createClient();

  let query = supabase
    .from("leads")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (params.estado) query = query.eq("estado", params.estado as "nuevo" | "contactado" | "calificado" | "descartado" | "cerrado");
  if (params.intencion) query = query.eq("intencion", params.intencion as "comprar" | "vender" | "alquilar");
  if (params.q) {
    query = query.or(`nombre.ilike.%${params.q}%,email.ilike.%${params.q}%`);
  }

  const { data: leads, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / PER_PAGE);

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Leads</h1>
          <p className="text-stone-500 mt-1">{count ?? 0} contactos registrados</p>
        </div>
      </div>

      <div className="mb-4">
        <LeadFilters />
      </div>

      <LeadTable leads={leads ?? []} />

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-stone-500">Página {page} de {totalPages}</p>
          <div className="flex gap-2">
            {page > 1 && (
              <a href={`?page=${page - 1}`}>
                <Button variant="outline" size="sm">← Anterior</Button>
              </a>
            )}
            {page < totalPages && (
              <a href={`?page=${page + 1}`}>
                <Button variant="outline" size="sm">Siguiente →</Button>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
