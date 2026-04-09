import { LeadTibioForm } from "@/components/admin/LeadTibioForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Nuevo lead tibio" };

export default function NuevoLeadTibioPage() {
  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-stone-900">
          Nuevo lead tibio
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Cargá los datos del contacto que Oscar te pasó por WhatsApp.
        </p>
      </div>
      <LeadTibioForm />
    </div>
  );
}
