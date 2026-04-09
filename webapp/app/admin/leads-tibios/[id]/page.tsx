import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LeadTibioForm } from "@/components/admin/LeadTibioForm";
import type { Metadata } from "next";
import type { Lead } from "@/types/lead";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Editar lead tibio" };

export default async function EditarLeadTibioPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .eq("temperatura", "warm")
    .single();

  if (!data) notFound();

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-stone-900">
          {data.nombre} {data.apellido}
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Lead tibio · Ingresado el{" "}
          {new Date(data.created_at).toLocaleDateString("es-AR")}
        </p>
      </div>
      <LeadTibioForm lead={data as Lead} />
    </div>
  );
}
