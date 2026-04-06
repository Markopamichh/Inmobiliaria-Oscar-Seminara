// Tipos derivados del schema SQL. Cuando generes los tipos con
// `npm run db:types`, estos tipos serán la fuente de verdad.

export type LeadIntencion = "comprar" | "vender" | "alquilar";

export type LeadEstado =
  | "nuevo"
  | "contactado"
  | "calificado"
  | "descartado"
  | "cerrado";

export interface Lead {
  id: string;
  created_at: string;
  nombre: string;
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
