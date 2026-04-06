"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { LeadEstadoBadge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { Lead, LeadEstado } from "@/types/lead";

interface LeadDetailProps {
  lead: Lead;
}

const ESTADO_OPTIONS = [
  { value: "nuevo", label: "Nuevo" },
  { value: "contactado", label: "Contactado" },
  { value: "calificado", label: "Calificado" },
  { value: "descartado", label: "Descartado" },
  { value: "cerrado", label: "Cerrado" },
];

const intencionLabel: Record<string, string> = {
  comprar: "Comprar",
  vender: "Vender",
  alquilar: "Alquilar",
};

export function LeadDetail({ lead }: LeadDetailProps) {
  const router = useRouter();
  const [estado, setEstado] = useState<LeadEstado>(lead.estado);
  const [notas, setNotas] = useState(lead.notas_internas ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from("leads")
      .update({
        estado,
        notas_internas: notas,
        ultima_interaccion: new Date().toISOString(),
      })
      .eq("id", lead.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  }

  const whatsappUrl = lead.telefono
    ? `https://wa.me/${lead.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(
        `Hola ${lead.nombre}, te contactamos desde Seminara Inmobiliaria.`
      )}`
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Info principal */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Datos de contacto */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="font-semibold text-stone-900 mb-4">
            Datos de contacto
          </h2>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-xs text-stone-400 uppercase tracking-wide">
                Nombre
              </dt>
              <dd className="text-sm text-stone-900 mt-1 font-medium">
                {lead.nombre}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-stone-400 uppercase tracking-wide">
                Email
              </dt>
              <dd className="text-sm text-stone-900 mt-1">
                <a
                  href={`mailto:${lead.email}`}
                  className="text-accent hover:underline"
                >
                  {lead.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-stone-400 uppercase tracking-wide">
                Teléfono
              </dt>
              <dd className="text-sm text-stone-900 mt-1 flex items-center gap-2">
                {lead.telefono ?? "—"}
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 text-xs font-medium"
                  >
                    WhatsApp →
                  </a>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-stone-400 uppercase tracking-wide">
                Registrado
              </dt>
              <dd className="text-sm text-stone-900 mt-1">
                {formatDate(lead.created_at)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-stone-400 uppercase tracking-wide">
                Intención
              </dt>
              <dd className="text-sm text-stone-900 mt-1">
                {lead.intencion ? intencionLabel[lead.intencion] : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-stone-400 uppercase tracking-wide">
                Zona de interés
              </dt>
              <dd className="text-sm text-stone-900 mt-1">
                {lead.zona_interes ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-stone-400 uppercase tracking-wide">
                Presupuesto
              </dt>
              <dd className="text-sm text-stone-900 mt-1">
                {lead.presupuesto_rango ?? "—"}
              </dd>
            </div>
          </dl>
          {lead.mensaje && (
            <div className="mt-4 pt-4 border-t border-stone-100">
              <dt className="text-xs text-stone-400 uppercase tracking-wide mb-1">
                Mensaje
              </dt>
              <dd className="text-sm text-stone-700">{lead.mensaje}</dd>
            </div>
          )}
        </div>

        {/* Notas internas */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="font-semibold text-stone-900 mb-4">Notas internas</h2>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            rows={5}
            placeholder="Agregá notas sobre este lead…"
            className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent resize-none"
          />
        </div>
      </div>

      {/* Sidebar derecho */}
      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="font-semibold text-stone-900 mb-4">Estado</h2>
          <div className="flex items-center gap-2 mb-4">
            <LeadEstadoBadge estado={estado} />
          </div>
          <Select
            options={ESTADO_OPTIONS}
            value={estado}
            onChange={(e) => setEstado(e.target.value as LeadEstado)}
          />
          <Button
            className="w-full mt-4"
            onClick={handleSave}
            loading={saving}
          >
            {saved ? "¡Guardado!" : "Guardar cambios"}
          </Button>
        </div>

        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium text-sm rounded-xl px-4 py-3 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
              <path d="M9 0C4.03 0 0 4.03 0 9c0 1.59.41 3.07 1.13 4.36L0 18l4.75-1.25A8.95 8.95 0 009 18c4.97 0 9-4.03 9-9S13.97 0 9 0zm4.41 12.75c-.19.52-1.09.97-1.5 1.02-.38.05-.87.07-1.4-.09a12.9 12.9 0 01-1.28-.47c-2.25-1-3.72-3.3-3.83-3.45-.11-.15-.88-1.17-.88-2.23 0-1.06.56-1.58.76-1.8.19-.21.42-.27.56-.27h.4c.13 0 .3-.05.47.36l.67 1.63c.06.13.1.28.02.44l-.25.36-.37.4c-.12.13-.25.27-.11.52.14.25.63 1.04 1.35 1.68.93.82 1.71 1.07 1.95 1.19.25.12.39.1.53-.06l.54-.63c.14-.17.28-.13.47-.08l1.49.7c.22.1.37.15.42.24.05.08.05.48-.14 1z" />
            </svg>
            Contactar por WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
