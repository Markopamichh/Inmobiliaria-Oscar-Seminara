import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PropiedadForm } from "@/components/admin/PropiedadForm";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("propiedades").select("titulo").eq("id", id).single();
  return { title: data?.titulo ?? "Editar propiedad" };
}

export default async function EditarPropiedadPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: propiedad } = await supabase.from("propiedades").select("*").eq("id", id).single();

  if (!propiedad) notFound();

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center gap-2 text-sm text-stone-500 mb-6">
        <Link href="/admin/propiedades" className="hover:text-accent transition-colors">Propiedades</Link>
        <span>/</span>
        <span className="text-stone-900 line-clamp-1">{propiedad.titulo}</span>
      </div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-stone-900">Editar propiedad</h1>
      </div>
      <PropiedadForm propiedad={propiedad} />
    </div>
  );
}
