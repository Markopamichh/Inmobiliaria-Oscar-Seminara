// Tipos derivados del schema SQL. Cuando generes los tipos con
// `npm run db:types`, estos tipos serán la fuente de verdad.

export type LeadIntencion = "comprar" | "vender" | "alquilar";

export type LeadEstado =
  | "nuevo"
  | "contactado"
  | "calificado"
  | "descartado"
  | "cerrado"
  | "esperando_propiedad";

export type LeadTemperatura = "hot" | "warm" | "cold";

export interface Lead {
  id: string;
  created_at: string;
  nombre: string;
  apellido: string | null;
  email: string;
  telefono: string | null;
  intencion: LeadIntencion | null;
  presupuesto_rango: string | null;
  zona_interes: string | null;
  mensaje: string | null;
  estado: LeadEstado;
  propiedad_id: string | null;
  notas_internas: string | null;
  ultima_interaccion: string | null;
  temperatura: LeadTemperatura | null;
  financiamiento: "disponible" | "parte_propia" | "completo" | null;
  urgencia: "ahora" | "3_meses" | "6_meses" | null;
  tipo_propiedad_buscado: string | null;
  zona_preferida: string | null;
  ambientes_minimos: number | null;
  familia: string | null;
}

export type LeadInsert = Omit<Lead, "id" | "created_at" | "estado"> & {
  estado?: LeadEstado;
};

export type LeadUpdate = Partial<LeadInsert> & { id: string };

// Para el formulario público (subset del Lead)
export interface LeadFormData {
  intencion: LeadIntencion;
  presupuesto_rango: string;
  zona_interes: string;
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
}
