"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LeadFormSchema, buildMensaje } from "@/lib/validations/lead";
import type { LeadFormValues } from "@/lib/validations/lead";
import type { ZodError } from "zod";

type FieldErrors = Partial<Record<keyof LeadFormValues, string>>;

interface Props {
  propiedadTitulo: string;
  operacion: string;
  ubicacion: string;
}

function intencionFromOperacion(operacion: string): "comprar" | "alquilar" | null {
  if (operacion === "venta") return "comprar";
  if (operacion === "alquiler") return "alquilar";
  return null; // venta_alquiler → usuario elige
}

const FINANCIACION_OPTIONS = [
  { value: "propio", label: "Fondos propios" },
  { value: "hipoteca", label: "Hipoteca / crédito" },
  { value: "a_consultar", label: "A consultar" },
] as const;

const DISPONIBILIDAD_OPTIONS = [
  { value: "inmediata", label: "Inmediata" },
  { value: "1_mes", label: "En 1 mes" },
  { value: "2_3_meses", label: "En 2-3 meses" },
  { value: "flexible", label: "Flexible" },
] as const;

const FINANCIACION_LABELS: Record<string, string> = {
  propio: "Fondos propios",
  hipoteca: "Hipoteca/crédito",
  a_consultar: "A consultar",
};

const DISPONIBILIDAD_LABELS: Record<string, string> = {
  inmediata: "Inmediata",
  "1_mes": "En 1 mes",
  "2_3_meses": "En 2-3 meses",
  flexible: "Flexible",
};

export function LeadFormPropiedad({ propiedadTitulo, operacion, ubicacion }: Props) {
  const intencionFija = intencionFromOperacion(operacion);

  const [intencion, setIntencion] = useState<"comprar" | "alquilar">(
    intencionFija ?? "comprar"
  );
  const [financiacion, setFinanciacion] = useState("");
  const [disponibilidad, setDisponibilidad] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const metadatos: Record<string, string> = {};
    if (intencion === "comprar" && financiacion) {
      metadatos["Financiación"] = FINANCIACION_LABELS[financiacion] ?? financiacion;
    }
    if (intencion === "alquilar" && disponibilidad) {
      metadatos["Disponibilidad"] = DISPONIBILIDAD_LABELS[disponibilidad] ?? disponibilidad;
    }

    const mensajeBase = mensaje
      ? `[${propiedadTitulo}] ${mensaje}`
      : `Consulta sobre: ${propiedadTitulo}`;

    const data: LeadFormValues = {
      intencion,
      presupuesto_rango: "a_consultar",
      zona_interes: ubicacion || "A consultar",
      nombre,
      email,
      telefono,
      mensaje: buildMensaje(metadatos, mensajeBase),
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
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12l4 4 10-10"
              stroke="#16a34a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="font-semibold text-stone-900 mb-1">¡Consulta enviada!</h3>
        <p className="text-sm text-stone-500">
          {nombre ? `Gracias, ${nombre.split(" ")[0]}. ` : ""}
          Te contactamos a la brevedad.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Selector de intención — solo si la propiedad admite ambas operaciones */}
      {intencionFija === null && (
        <div>
          <p className="text-sm font-medium text-stone-700 mb-2">Me interesa para:</p>
          <div className="grid grid-cols-2 gap-2">
            {(["comprar", "alquilar"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  setIntencion(opt);
                  setFinanciacion("");
                  setDisponibilidad("");
                }}
                className={`py-2.5 rounded-xl border text-sm font-medium capitalize transition-all ${
                  intencion === opt
                    ? "border-accent bg-accent text-white"
                    : "border-stone-300 text-stone-600 hover:border-stone-400"
                }`}
              >
                {opt === "comprar" ? "Comprar" : "Alquilar"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Badge de intención fija */}
      {intencionFija !== null && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-accent/10 text-accent font-medium px-3 py-1 rounded-full text-xs">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l2.5 2.5 5.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Consulta de {intencionFija === "comprar" ? "compra" : "alquiler"}
          </span>
        </div>
      )}

      {/* Sección contextual — financiación (comprar) */}
      {intencion === "comprar" && (
        <div className="animate-fade-in-up">
          <p className="text-sm font-medium text-stone-700 mb-2">
            ¿Cómo pensás financiarlo?{" "}
            <span className="text-stone-400 font-normal">(opcional)</span>
          </p>
          <div className="grid grid-cols-3 gap-2">
            {FINANCIACION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFinanciacion(financiacion === opt.value ? "" : opt.value)}
                className={`py-2 px-2 rounded-lg border text-xs font-medium text-center transition-all ${
                  financiacion === opt.value
                    ? "border-accent bg-accent text-white"
                    : "border-stone-300 text-stone-600 hover:border-stone-400"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sección contextual — disponibilidad (alquilar) */}
      {intencion === "alquilar" && (
        <div className="animate-fade-in-up">
          <p className="text-sm font-medium text-stone-700 mb-2">
            ¿Cuándo necesitás entrar?{" "}
            <span className="text-stone-400 font-normal">(opcional)</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            {DISPONIBILIDAD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setDisponibilidad(disponibilidad === opt.value ? "" : opt.value)}
                className={`py-2 px-2 rounded-lg border text-xs font-medium text-center transition-all ${
                  disponibilidad === opt.value
                    ? "border-accent bg-accent text-white"
                    : "border-stone-300 text-stone-600 hover:border-stone-400"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

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
          Mensaje (opcional)
        </label>
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          rows={3}
          placeholder="¿Alguna pregunta o comentario sobre esta propiedad?"
          className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent resize-none"
        />
      </div>

      <Button type="submit" loading={submitting} className="w-full">
        Consultar ahora
      </Button>

      <p className="text-xs text-stone-400 text-center">
        Sin compromiso. Te respondemos en menos de 24 h.
      </p>
    </form>
  );
}
