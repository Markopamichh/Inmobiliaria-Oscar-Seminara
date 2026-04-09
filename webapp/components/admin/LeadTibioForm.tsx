"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { Lead } from "@/types/lead";

interface LeadTibioFormProps {
  lead?: Lead;
}

type FormErrors = Partial<Record<string, string>>;

export function LeadTibioForm({ lead }: LeadTibioFormProps) {
  const router = useRouter();
  const isEditing = !!lead;

  const [nombre, setNombre] = useState(lead?.nombre ?? "");
  const [apellido, setApellido] = useState(lead?.apellido ?? "");
  const [telefono, setTelefono] = useState(lead?.telefono ?? "");
  const [tipoPropiedadBuscado, setTipoPropiedadBuscado] = useState(
    lead?.tipo_propiedad_buscado ?? ""
  );
  const [zonaPreferida, setZonaPreferida] = useState(lead?.zona_preferida ?? "");
  const [presupuesto, setPresupuesto] = useState(lead?.presupuesto_rango ?? "");
  const [ambientesMinimos, setAmbientesMinimos] = useState(
    lead?.ambientes_minimos?.toString() ?? ""
  );
  const [familia, setFamilia] = useState(lead?.familia ?? "");
  const [urgencia, setUrgencia] = useState(lead?.urgencia ?? "");
  const [notas, setNotas] = useState(lead?.notas_internas ?? "");
  const [estado, setEstado] = useState<Lead["estado"]>(
    lead?.estado ?? "esperando_propiedad"
  );

  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  function validate(): boolean {
    const e: FormErrors = {};
    if (!nombre.trim()) e.nombre = "Requerido";
    if (!apellido.trim()) e.apellido = "Requerido";
    if (!telefono.trim()) e.telefono = "Requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    const supabase = createClient();

    const data = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: "no-email@tibio.local",
      telefono: telefono.trim(),
      temperatura: "warm" as const,
      tipo_propiedad_buscado: tipoPropiedadBuscado || null,
      zona_preferida: zonaPreferida || null,
      presupuesto_rango: presupuesto || null,
      ambientes_minimos: ambientesMinimos ? parseInt(ambientesMinimos, 10) : null,
      familia: familia || null,
      urgencia: (urgencia || null) as "ahora" | "3_meses" | "6_meses" | null,
      notas_internas: notas || null,
      estado: estado as Lead["estado"],
    };

    if (isEditing) {
      await supabase.from("leads").update(data).eq("id", lead.id);
    } else {
      await supabase.from("leads").insert(data);
    }

    setSaving(false);
    router.push("/admin/leads-tibios");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Datos personales */}
      <section className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="font-semibold text-stone-900 mb-4">Datos del contacto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre *"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            error={errors.nombre}
            placeholder="Juan"
          />
          <Input
            label="Apellido *"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            error={errors.apellido}
            placeholder="Pérez"
          />
          <div className="md:col-span-2">
            <Input
              label="Teléfono / WhatsApp *"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              error={errors.telefono}
              placeholder="+54 299 123-4567"
            />
          </div>
        </div>
      </section>

      {/* Qué busca */}
      <section className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="font-semibold text-stone-900 mb-4">Qué está buscando</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Tipo de propiedad"
            value={tipoPropiedadBuscado}
            onChange={(e) => setTipoPropiedadBuscado(e.target.value)}
            options={[
              { value: "casa", label: "Casa" },
              { value: "departamento", label: "Departamento" },
              { value: "local", label: "Local comercial" },
              { value: "terreno", label: "Terreno" },
              { value: "oficina", label: "Oficina" },
            ]}
            placeholder="Seleccioná tipo"
          />
          <Input
            label="Zona preferida"
            value={zonaPreferida}
            onChange={(e) => setZonaPreferida(e.target.value)}
            placeholder="Alta Barda, Confluencia..."
          />
          <Select
            label="Presupuesto"
            value={presupuesto}
            onChange={(e) => setPresupuesto(e.target.value)}
            options={[
              { value: "menos_50k", label: "Menos de USD 50.000" },
              { value: "50k_100k", label: "USD 50.000 – 100.000" },
              { value: "100k_200k", label: "USD 100.000 – 200.000" },
              { value: "mas_200k", label: "Más de USD 200.000" },
            ]}
            placeholder="Seleccioná rango"
          />
          <Input
            label="Ambientes mínimos"
            type="number"
            value={ambientesMinimos}
            onChange={(e) => setAmbientesMinimos(e.target.value)}
            placeholder="2"
          />
          <Input
            label="Grupo familiar"
            value={familia}
            onChange={(e) => setFamilia(e.target.value)}
            placeholder="Pareja con 2 hijos"
          />
          <Select
            label="Urgencia"
            value={urgencia}
            onChange={(e) => setUrgencia(e.target.value)}
            options={[
              { value: "ahora", label: "Lo antes posible" },
              { value: "3_meses", label: "En 3 meses" },
              { value: "6_meses", label: "En 6 meses o más" },
            ]}
            placeholder="Seleccioná urgencia"
          />
        </div>
      </section>

      {/* Estado y notas */}
      <section className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="font-semibold text-stone-900 mb-4">Seguimiento</h2>
        <div className="flex flex-col gap-4">
          <Select
            label="Estado"
            value={estado}
            onChange={(e) => setEstado(e.target.value as Lead["estado"])}
            options={[
              { value: "esperando_propiedad", label: "Esperando propiedad" },
              { value: "contactado", label: "Contactado" },
              { value: "cerrado", label: "Cerrado" },
            ]}
          />
          <div>
            <label className="text-sm font-medium text-stone-700 block mb-1.5">
              Notas
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={4}
              placeholder="Lo que Oscar comentó sobre este contacto…"
              className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent resize-none"
            />
          </div>
        </div>
      </section>

      <div className="flex gap-3 justify-end pb-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/leads-tibios")}
        >
          Cancelar
        </Button>
        <Button type="submit" loading={saving}>
          {isEditing ? "Guardar cambios" : "Crear lead tibio"}
        </Button>
      </div>
    </form>
  );
}
