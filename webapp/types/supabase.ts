// Este archivo es generado automáticamente por Supabase CLI.
// Ejecutá: npm run db:types
// NO editar manualmente.
//
// Para regenerar después de cambios en la DB:
//   npx supabase gen types typescript --linked > types/supabase.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string;
          created_at: string;
          nombre: string;
          email: string;
          telefono: string | null;
          intencion: "comprar" | "vender" | "alquilar" | null;
          presupuesto_rango: string | null;
          zona_interes: string | null;
          mensaje: string | null;
          estado: "nuevo" | "contactado" | "calificado" | "descartado" | "cerrado";
          propiedad_id: string | null;
          notas_internas: string | null;
          ultima_interaccion: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          nombre: string;
          email: string;
          telefono?: string | null;
          intencion?: "comprar" | "vender" | "alquilar" | null;
          presupuesto_rango?: string | null;
          zona_interes?: string | null;
          mensaje?: string | null;
          estado?: "nuevo" | "contactado" | "calificado" | "descartado" | "cerrado";
          propiedad_id?: string | null;
          notas_internas?: string | null;
          ultima_interaccion?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          nombre?: string;
          email?: string;
          telefono?: string | null;
          intencion?: "comprar" | "vender" | "alquilar" | null;
          presupuesto_rango?: string | null;
          zona_interes?: string | null;
          mensaje?: string | null;
          estado?: "nuevo" | "contactado" | "calificado" | "descartado" | "cerrado";
          propiedad_id?: string | null;
          notas_internas?: string | null;
          ultima_interaccion?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "leads_propiedad_id_fkey";
            columns: ["propiedad_id"];
            isOneToOne: false;
            referencedRelation: "propiedades";
            referencedColumns: ["id"];
          }
        ];
      };
      propiedades: {
        Row: {
          id: string;
          created_at: string;
          titulo: string;
          slug: string;
          descripcion: string | null;
          tipo: "casa" | "departamento" | "terreno" | "local" | "oficina" | null;
          operacion: "venta" | "alquiler" | "venta_alquiler" | null;
          precio: number | null;
          moneda: string;
          superficie_total: number | null;
          superficie_cubierta: number | null;
          ambientes: number | null;
          dormitorios: number | null;
          banos: number | null;
          direccion: string | null;
          barrio: string | null;
          ciudad: string | null;
          provincia: string | null;
          latitud: number | null;
          longitud: number | null;
          imagenes: string[];
          destacada: boolean;
          publicada: boolean;
          caracteristicas: string[];
        };
        Insert: {
          id?: string;
          created_at?: string;
          titulo: string;
          slug: string;
          descripcion?: string | null;
          tipo?: "casa" | "departamento" | "terreno" | "local" | "oficina" | null;
          operacion?: "venta" | "alquiler" | "venta_alquiler" | null;
          precio?: number | null;
          moneda?: string;
          superficie_total?: number | null;
          superficie_cubierta?: number | null;
          ambientes?: number | null;
          dormitorios?: number | null;
          banos?: number | null;
          direccion?: string | null;
          barrio?: string | null;
          ciudad?: string | null;
          provincia?: string | null;
          latitud?: number | null;
          longitud?: number | null;
          imagenes?: string[];
          destacada?: boolean;
          publicada?: boolean;
          caracteristicas?: string[];
        };
        Update: {
          id?: string;
          created_at?: string;
          titulo?: string;
          slug?: string;
          descripcion?: string | null;
          tipo?: "casa" | "departamento" | "terreno" | "local" | "oficina" | null;
          operacion?: "venta" | "alquiler" | "venta_alquiler" | null;
          precio?: number | null;
          moneda?: string;
          superficie_total?: number | null;
          superficie_cubierta?: number | null;
          ambientes?: number | null;
          dormitorios?: number | null;
          banos?: number | null;
          direccion?: string | null;
          barrio?: string | null;
          ciudad?: string | null;
          provincia?: string | null;
          latitud?: number | null;
          longitud?: number | null;
          imagenes?: string[];
          destacada?: boolean;
          publicada?: boolean;
          caracteristicas?: string[];
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
