"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  LeadFormSchema,
  TIPO_PROPIEDAD_OPTIONS,
  AMBIENTES_OPTIONS,
  PRESUPUESTO_COMPRA_RANGES,
  PRESUPUESTO_ALQUILER_RANGES,
  PRECIO_VENTA_OPTIONS,
  buildMensaje,
} from "@/lib/validations/lead";
import type { LeadFormValues } from "@/lib/validations/lead";
import type { ZodError } from "zod";

type Step = 1 | 2;
type FieldErrors = Partial<Record<keyof LeadFormValues, string>>;
type Intencion = "comprar" | "vender" | "alquilar";

const TIPO_LABEL: Record<string, string> = {
  departamento: "Departamento",
  casa: "Casa",
  terreno: "Terreno",
  local: "Local comercial",
  oficina: "Oficina",
};

const step1Labels: Record<Intencion | "", string> = {
  comprar: "¿Qué buscás?",
  alquilar: "¿Qué querés alquilar?",
  vender: "Tu propiedad",
  "": "¿Qué necesitás?",
};

export function LeadForm() {
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  // Campos comunes
  const [intencion, setIntencion] = useState<Intencion | "">("");
  const [presupuesto, setPresupuesto] = useState("");
  const [zona, setZona] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Campos extra — comprar / alquilar
  const [tipoPropiedad, setTipoPropiedad] = useState("");
  const [ambientes, setAmbientes] = useState("");

  // Campos extra — vender
  const [tipoPropiedadVenta, setTipoPropiedadVenta] = useState("");
  const [ubicacionVenta, setUbicacionVenta] = useState("");
  const [precioEstimado, setPrecioEstimado] = useState("");

  function getZonaInteres() {
    return intencion === "vender" ? ubicacionVenta : zona;
  }

  function getPresupuestoRango() {
    if (intencion === "vender") return precioEstimado || "a_consultar";
    return presupuesto;
  }

  function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    const partial = {
      intencion,
      presupuesto_rango: getPresupuestoRango(),
      zona_interes: getZonaInteres(),
    };
    const res = LeadFormSchema.pick({
      intencion: true,
      presupuesto_rango: true,
      zona_interes: true,
    }).safeParse(partial);

    if (!res.success) {
      const errs: FieldErrors = {};
      (res.error as ZodError).issues.forEach((i) => {
        const k = i.path[0] as keyof LeadFormValues;
        errs[k] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep(2);
  }

  async function handleStep2(e: React.FormEvent) {
    e.preventDefault();

    const metadatos: Record<string, string> = {};
    if (intencion === "comprar" || intencion === "alquilar") {
      if (tipoPropiedad) metadatos["Tipo"] = TIPO_LABEL[tipoPropiedad] ?? tipoPropiedad;
      if (ambientes) metadatos["Ambientes"] = ambientes;
    }
    if (intencion === "vender" && tipoPropiedadVenta) {
      metadatos["Tipo"] = TIPO_LABEL[tipoPropiedadVenta] ?? tipoPropiedadVenta;
    }

    const data: LeadFormValues = {
      intencion: intencion as Intencion,
      presupuesto_rango: getPresupuestoRango(),
      zona_interes: getZonaInteres(),
      nombre,
      email,
      telefono,
      mensaje: buildMensaje(metadatos, mensaje) || undefined,
    };

    const res = LeadFormSchema.safeParse(data);
    if (!res.success) {
      const errs: FieldErrors = {};
      (res.error as ZodError).issues.forEach((i) => {
        const k = i.path[0] as keyof LeadFormValues;
        errs[k] = i.message;
      });
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(res.data),
    });

    setSubmitting(false);
    if (response.ok) {
      setSuccess(true);
    } else {
      const body = await response.json().catch(() => ({}));
      if (response.status === 429) {
        setErrors({ email: "Demasiadas consultas. Intentá en unos minutos." });
      } else {
        setErrors({ email: body?.error ?? "Ocurrió un error. Intentá de nuevo." });
      }
    }
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M6 14l5 5 11-11"
              stroke="#16a34a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="font-display text-2xl font-semibold text-stone-900 mb-2">
          ¡Gracias, {nombre}!
        </h3>
        <p className="text-stone-500">
          Recibimos tu consulta. Te vamos a contactar pronto.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                step >= s
                  ? "bg-accent text-white"
                  : "bg-stone-200 text-stone-400"
              }`}
            >
              {s}
            </div>
            {s === 1 && (
              <div
                className={`h-px w-12 transition-all ${
                  step >= 2 ? "bg-accent" : "bg-stone-200"
                }`}
              />
            )}
          </div>
        ))}
        <p className="text-sm text-stone-500 ml-2">
          {step === 1 ? step1Labels[intencion] : "Tus datos de contacto"}
        </p>
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <form onSubmit={handleStep1} className="flex flex-col gap-5">
          {/* Selector de intención */}
          <div>
            <p className="text-sm font-medium text-stone-700 mb-3">
              ¿Qué querés hacer?
            </p>
            <div className="grid grid-cols-3 gap-3">
              {(["comprar", "vender", "alquilar"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setIntencion(opt);
                    setErrors({});
                    setPresupuesto("");
                    setZona("");
                    setTipoPropiedad("");
                    setAmbientes("");
                    setUbicacionVenta("");
                    setPrecioEstimado("");
                    setTipoPropiedadVenta("");
                  }}
                  className={`py-3 rounded-xl border text-sm font-medium capitalize transition-all ${
                    intencion === opt
                      ? "border-accent bg-accent text-white"
                      : "border-stone-300 text-stone-600 hover:border-stone-400"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {errors.intencion && (
              <p className="text-xs text-red-600 mt-1">{errors.intencion}</p>
            )}
          </div>

          {/* Campos específicos para COMPRAR */}
          {intencion === "comprar" && (
            <div className="animate-fade-in-up flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Tipo de propiedad"
                  value={tipoPropiedad}
                  onChange={(e) => setTipoPropiedad(e.target.value)}
                  options={TIPO_PROPIEDAD_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                  placeholder="Cualquiera"
                />
                <Select
                  label="Ambientes"
                  value={ambientes}
                  onChange={(e) => setAmbientes(e.target.value)}
                  options={AMBIENTES_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                  placeholder="Cualquiera"
                />
              </div>
              <Input
                label="Zona o barrio de interés *"
                value={zona}
                onChange={(e) => setZona(e.target.value)}
                placeholder="Ej: Palermo, Belgrano, GBA Norte…"
                error={errors.zona_interes}
              />
              <Select
                label="Presupuesto en USD *"
                value={presupuesto}
                onChange={(e) => setPresupuesto(e.target.value)}
                options={PRESUPUESTO_COMPRA_RANGES.map((r) => ({ value: r.value, label: r.label }))}
                placeholder="Seleccioná un rango"
                error={errors.presupuesto_rango}
              />
              <Button type="submit" className="w-full">
                Continuar →
              </Button>
            </div>
          )}

          {/* Campos específicos para ALQUILAR */}
          {intencion === "alquilar" && (
            <div className="animate-fade-in-up flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Tipo de propiedad"
                  value={tipoPropiedad}
                  onChange={(e) => setTipoPropiedad(e.target.value)}
                  options={TIPO_PROPIEDAD_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                  placeholder="Cualquiera"
                />
                <Select
                  label="Ambientes"
                  value={ambientes}
                  onChange={(e) => setAmbientes(e.target.value)}
                  options={AMBIENTES_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                  placeholder="Cualquiera"
                />
              </div>
              <Input
                label="Zona o barrio de interés *"
                value={zona}
                onChange={(e) => setZona(e.target.value)}
                placeholder="Ej: Palermo, Belgrano, GBA Norte…"
                error={errors.zona_interes}
              />
              <Select
                label="Presupuesto mensual *"
                value={presupuesto}
                onChange={(e) => setPresupuesto(e.target.value)}
                options={PRESUPUESTO_ALQUILER_RANGES.map((r) => ({ value: r.value, label: r.label }))}
                placeholder="Seleccioná un rango"
                error={errors.presupuesto_rango}
              />
              <Button type="submit" className="w-full">
                Continuar →
              </Button>
            </div>
          )}

          {/* Campos específicos para VENDER */}
          {intencion === "vender" && (
            <div className="animate-fade-in-up flex flex-col gap-4">
              <Select
                label="Tipo de propiedad *"
                value={tipoPropiedadVenta}
                onChange={(e) => setTipoPropiedadVenta(e.target.value)}
                options={TIPO_PROPIEDAD_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                placeholder="Seleccioná el tipo"
                error={errors.zona_interes && !tipoPropiedadVenta ? "Seleccioná el tipo de propiedad" : undefined}
              />
              <Input
                label="Dirección o barrio *"
                value={ubicacionVenta}
                onChange={(e) => setUbicacionVenta(e.target.value)}
                placeholder="Ej: Av. Corrientes 1234, Palermo…"
                error={errors.zona_interes}
              />
              <Select
                label="Precio estimado"
                value={precioEstimado}
                onChange={(e) => setPrecioEstimado(e.target.value)}
                options={PRECIO_VENTA_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                placeholder="A consultar / Necesito tasación"
              />
              <p className="text-xs text-stone-400 -mt-1">
                Si no sabés el precio, te hacemos una tasación gratuita.
              </p>
              <Button type="submit" className="w-full">
                Continuar →
              </Button>
            </div>
          )}
        </form>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <form
          onSubmit={handleStep2}
          className="flex flex-col gap-4 animate-slide-in-right"
        >
          <Input
            label="Nombre completo *"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            error={errors.nombre}
            placeholder="Juan García"
            autoComplete="name"
          />
          <Input
            label="Email *"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="juan@ejemplo.com"
            autoComplete="email"
          />
          <Input
            label="Teléfono"
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            error={errors.telefono}
            placeholder="+54 11 1234-5678"
            autoComplete="tel"
          />
          <div>
            <label className="text-sm font-medium text-stone-700 block mb-1.5">
              {intencion === "vender"
                ? "¿Algo más que quieras contarnos? (opcional)"
                : "Mensaje adicional (opcional)"}
            </label>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows={3}
              placeholder={
                intencion === "vender"
                  ? "Estado del inmueble, urgencia de venta, etc."
                  : "Contanos más sobre lo que buscás…"
              }
              className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent resize-none"
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="flex-1"
            >
              ← Atrás
            </Button>
            <Button type="submit" loading={submitting} className="flex-2 flex-1">
              Enviar consulta
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
