import { z } from "zod";

export const LeadFormSchema = z.object({
  intencion: z.enum(["comprar", "vender", "alquilar"], {
    required_error: "Seleccioná una intención",
  }),
  presupuesto_rango: z.string().min(1, "Seleccioná un rango de presupuesto"),
  zona_interes: z.string().min(1, "Ingresá la zona de interés").max(100),
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100),
  email: z.string().email("Ingresá un email válido"),
  telefono: z
    .string()
    .regex(/^[\d\s\-\+\(\)]{6,20}$/, "Ingresá un teléfono válido")
    .optional()
    .or(z.literal("")),
  mensaje: z.string().max(500, "El mensaje no puede superar 500 caracteres").optional(),
});

export type LeadFormValues = z.infer<typeof LeadFormSchema>;

export const LeadUpdateSchema = z.object({
  estado: z
    .enum(["nuevo", "contactado", "calificado", "descartado", "cerrado"])
    .optional(),
  notas_internas: z.string().max(2000).optional(),
  ultima_interaccion: z.string().datetime().optional(),
});

export type LeadUpdateValues = z.infer<typeof LeadUpdateSchema>;

// Presupuesto ranges for the form select
export const PRESUPUESTO_RANGES = [
  { value: "hasta_50k_usd", label: "Hasta USD 50.000" },
  { value: "50k_100k_usd", label: "USD 50.000 – 100.000" },
  { value: "100k_200k_usd", label: "USD 100.000 – 200.000" },
  { value: "200k_500k_usd", label: "USD 200.000 – 500.000" },
  { value: "mas_500k_usd", label: "Más de USD 500.000" },
  { value: "hasta_200k_ars", label: "Hasta ARS 200.000/mes (alquiler)" },
  { value: "200k_500k_ars", label: "ARS 200.000 – 500.000/mes (alquiler)" },
  { value: "mas_500k_ars", label: "Más de ARS 500.000/mes (alquiler)" },
  { value: "a_consultar", label: "A consultar" },
] as const;

// Opciones específicas por intención
export const TIPO_PROPIEDAD_OPTIONS = [
  { value: "departamento", label: "Departamento" },
  { value: "casa", label: "Casa" },
  { value: "terreno", label: "Terreno" },
  { value: "local", label: "Local comercial" },
  { value: "oficina", label: "Oficina" },
] as const;

export const AMBIENTES_OPTIONS = [
  { value: "1", label: "Monoambiente" },
  { value: "2", label: "2 ambientes" },
  { value: "3", label: "3 ambientes" },
  { value: "4", label: "4 ambientes" },
  { value: "5+", label: "5 o más" },
] as const;

export const PRESUPUESTO_COMPRA_RANGES = PRESUPUESTO_RANGES.filter(
  (r) => r.value.includes("usd") || r.value === "a_consultar"
);

export const PRESUPUESTO_ALQUILER_RANGES = PRESUPUESTO_RANGES.filter(
  (r) => r.value.includes("ars") || r.value === "a_consultar"
);

export const PRECIO_VENTA_OPTIONS = [
  { value: "hasta_50k_usd", label: "Hasta USD 50.000" },
  { value: "50k_100k_usd", label: "USD 50.000 – 100.000" },
  { value: "100k_200k_usd", label: "USD 100.000 – 200.000" },
  { value: "200k_500k_usd", label: "USD 200.000 – 500.000" },
  { value: "mas_500k_usd", label: "Más de USD 500.000" },
  { value: "a_tasacion", label: "Necesito tasación gratuita" },
] as const;

// Encodea campos extra dentro del campo `mensaje` como bloque de metadatos
export function buildMensaje(
  metadatos: Record<string, string>,
  mensajeLibre?: string
): string {
  const partes = Object.entries(metadatos)
    .filter(([, v]) => Boolean(v))
    .map(([k, v]) => `${k}: ${v}`);
  const bloque = partes.length > 0 ? `[${partes.join(" | ")}]` : "";
  const MAX = 500;
  if (!mensajeLibre?.trim()) return bloque.slice(0, MAX);
  if (!bloque) return mensajeLibre.trim().slice(0, MAX);
  const combined = `${bloque}\n${mensajeLibre.trim()}`;
  if (combined.length <= MAX) return combined;
  const available = MAX - bloque.length - 2;
  return available > 0
    ? `${bloque}\n${mensajeLibre.trim().slice(0, available)}…`
    : bloque.slice(0, MAX);
}
