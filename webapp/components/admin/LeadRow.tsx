import Link from "next/link";
import { LeadEstadoBadge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { Lead } from "@/types/lead";

interface LeadRowProps {
  lead: Lead;
}

const intencionLabel: Record<string, string> = {
  comprar: "Comprar",
  vender: "Vender",
  alquilar: "Alquilar",
};

export function LeadRow({ lead }: LeadRowProps) {
  return (
    <tr className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
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
  );
}
