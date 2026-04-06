import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LeadDetail } from "@/components/admin/LeadDetail";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("leads").select("nombre").eq("id", id).single();
  return { title: data?.nombre ?? "Lead" };
}

export default async function LeadDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: lead } = await supabase.from("leads").select("*").eq("id", id).single();

  if (!lead) notFound();

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center gap-2 text-sm text-stone-500 mb-6">
        <Link href="/admin/leads" className="hover:text-accent transition-colors">Leads</Link>
        <span>/</span>
        <span className="text-stone-900">{lead.nombre}</span>
      </div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-stone-900">{lead.nombre}</h1>
        <p className="text-stone-500 mt-1">{lead.email}</p>
      </div>
      <LeadDetail lead={lead} />
    </div>
  );
}
