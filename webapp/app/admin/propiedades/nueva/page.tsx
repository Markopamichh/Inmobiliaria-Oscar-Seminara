import Link from "next/link";
import { PropiedadForm } from "@/components/admin/PropiedadForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Nueva propiedad" };

export default function NuevaPropiedadPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center gap-2 text-sm text-stone-500 mb-6">
        <Link href="/admin/propiedades" className="hover:text-accent transition-colors">Propiedades</Link>
        <span>/</span>
        <span className="text-stone-900">Nueva propiedad</span>
      </div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-stone-900">Nueva propiedad</h1>
      </div>
      <PropiedadForm />
    </div>
  );
}
