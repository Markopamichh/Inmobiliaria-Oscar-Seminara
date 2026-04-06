import Link from "next/link";
import { LeadEstadoBadge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { Lead } from "@/types/lead";

interface LeadTableProps {
  leads: Lead[];
}

const intencionLabel: Record<string, string> = {
  comprar: "Comprar",
  vender: "Vender",
  alquilar: "Alquilar",
};

export function LeadTable({ leads }: LeadTableProps) {
  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-stone-200 px-6 py-16 text-center">
        <p className="text-stone-400">No se encontraron leads con los filtros aplicados.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              <th className="py-3 px-4 text-xs font-medium text-stone-400 uppercase tracking-wide">
                Contacto
              </th>
              <th className="py-3 px-4 text-xs font-medium text-stone-400 uppercase tracking-wide">
                Teléfono
              </th>
              <th className="py-3 px-4 text-xs font-medium text-stone-400 uppercase tracking-wide">
                Intención
              </th>
              <th className="py-3 px-4 text-xs font-medium text-stone-400 uppercase tracking-wide">
                Zona
              </th>
              <th className="py-3 px-4 text-xs font-medium text-stone-400 uppercase tracking-wide">
                Estado
              </th>
              <th className="py-3 px-4 text-xs font-medium text-stone-400 uppercase tracking-wide">
                Fecha
              </th>
              <th className="py-3 px-4" />
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors"
              >
                <td className="py-3 px-4">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="font-medium text-stone-900 hover:text-accent transition-colors"
                  >
                    {lead.nombre}
                  </Link>
                  <p className="text-xs text-stone-400 mt-0.5">{lead.email}</p>
                </td>
                <td className="py-3 px-4 text-sm text-stone-600">
                  {lead.telefono ?? "—"}
                </td>
                <td className="py-3 px-4 text-sm text-stone-600">
                  {lead.intencion ? intencionLabel[lead.intencion] : "—"}
                </td>
                <td className="py-3 px-4 text-sm text-stone-500">
                  {lead.zona_interes ?? "—"}
                </td>
                <td className="py-3 px-4">
                  <LeadEstadoBadge estado={lead.estado} />
                </td>
                <td className="py-3 px-4 text-sm text-stone-400">
                  {formatDate(lead.created_at)}
                </td>
                <td className="py-3 px-4">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="text-xs text-stone-500 hover:text-accent transition-colors"
                  >
                    Ver →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
