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
  __InternalSupabase: {
    PostgrestVersion: "12.2";
  };
  public: {
    Tables: {
      leads: {
        Row: {
          id: string;
          created_at: string;
          nombre: string;
          apellido: string | null;
          email: string;
          telefono: string | null;
          intencion: "comprar" | "vender" | "alquilar" | null;
          presupuesto_rango: string | null;
          zona_interes: string | null;
          mensaje: string | null;
          estado: "nuevo" | "contactado" | "calificado" | "descartado" | "cerrado" | "esperando_propiedad";
          propiedad_id: string | null;
          notas_internas: string | null;
          ultima_interaccion: string | null;
          temperatura: "hot" | "warm" | "cold" | null;
          financiamiento: "disponible" | "parte_propia" | "completo" | null;
          urgencia: "ahora" | "3_meses" | "6_meses" | null;
          tipo_propiedad_buscado: string | null;
          zona_preferida: string | null;
          ambientes_minimos: number | null;
          familia: string | null;
        };
        Insert: {
          id?: string | undefined;
          created_at?: string | undefined;
          nombre: string;
          apellido?: string | null | undefined;
          email: string;
          telefono?: string | null | undefined;
          intencion?: "comprar" | "vender" | "alquilar" | null | undefined;
          presupuesto_rango?: string | null | undefined;
          zona_interes?: string | null | undefined;
          mensaje?: string | null | undefined;
          estado?: "nuevo" | "contactado" | "calificado" | "descartado" | "cerrado" | "esperando_propiedad" | undefined;
          propiedad_id?: string | null | undefined;
          notas_internas?: string | null | undefined;
          ultima_interaccion?: string | null | undefined;
          temperatura?: "hot" | "warm" | "cold" | null | undefined;
          financiamiento?: "disponible" | "parte_propia" | "completo" | null | undefined;
          urgencia?: "ahora" | "3_meses" | "6_meses" | null | undefined;
          tipo_propiedad_buscado?: string | null | undefined;
          zona_preferida?: string | null | undefined;
          ambientes_minimos?: number | null | undefined;
          familia?: string | null | undefined;
        };
        Update: {
          id?: string | undefined;
          created_at?: string | undefined;
          nombre?: string | undefined;
          apellido?: string | null | undefined;
          email?: string | undefined;
          telefono?: string | null | undefined;
          intencion?: "comprar" | "vender" | "alquilar" | null | undefined;
          presupuesto_rango?: string | null | undefined;
          zona_interes?: string | null | undefined;
          mensaje?: string | null | undefined;
          estado?: "nuevo" | "contactado" | "calificado" | "descartado" | "cerrado" | "esperando_propiedad" | undefined;
          propiedad_id?: string | null | undefined;
          notas_internas?: string | null | undefined;
          ultima_interaccion?: string | null | undefined;
          temperatura?: "hot" | "warm" | "cold" | null | undefined;
          financiamiento?: "disponible" | "parte_propia" | "completo" | null | undefined;
          urgencia?: "ahora" | "3_meses" | "6_meses" | null | undefined;
          tipo_propiedad_buscado?: string | null | undefined;
          zona_preferida?: string | null | undefined;
          ambientes_minimos?: number | null | undefined;
          familia?: string | null | undefined;
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
          moneda: "USD" | "ARS";
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
          grupo_familiar: string | null;
          estado: "disponible" | "reservada" | "vendida" | "alquilada" | null;
        };
        Insert: {
          id?: string | undefined;
          created_at?: string | undefined;
          titulo: string;
          slug: string;
          descripcion?: string | null | undefined;
          tipo?: "casa" | "departamento" | "terreno" | "local" | "oficina" | null | undefined;
          operacion?: "venta" | "alquiler" | "venta_alquiler" | null | undefined;
          precio?: number | null | undefined;
          moneda?: "USD" | "ARS" | undefined;
          superficie_total?: number | null | undefined;
          superficie_cubierta?: number | null | undefined;
          ambientes?: number | null | undefined;
          dormitorios?: number | null | undefined;
          banos?: number | null | undefined;
          direccion?: string | null | undefined;
          barrio?: string | null | undefined;
          ciudad?: string | null | undefined;
          provincia?: string | null | undefined;
          latitud?: number | null | undefined;
          longitud?: number | null | undefined;
          imagenes?: string[] | undefined;
          destacada?: boolean | undefined;
          publicada?: boolean | undefined;
          caracteristicas?: string[] | undefined;
          grupo_familiar?: string | null | undefined;
          estado?: "disponible" | "reservada" | "vendida" | "alquilada" | null | undefined;
        };
        Update: {
          id?: string | undefined;
          created_at?: string | undefined;
          titulo?: string | undefined;
          slug?: string | undefined;
          descripcion?: string | null | undefined;
          tipo?: "casa" | "departamento" | "terreno" | "local" | "oficina" | null | undefined;
          operacion?: "venta" | "alquiler" | "venta_alquiler" | null | undefined;
          precio?: number | null | undefined;
          moneda?: "USD" | "ARS" | undefined;
          superficie_total?: number | null | undefined;
          superficie_cubierta?: number | null | undefined;
          ambientes?: number | null | undefined;
          dormitorios?: number | null | undefined;
          banos?: number | null | undefined;
          direccion?: string | null | undefined;
          barrio?: string | null | undefined;
          ciudad?: string | null | undefined;
          provincia?: string | null | undefined;
          latitud?: number | null | undefined;
          longitud?: number | null | undefined;
          imagenes?: string[] | undefined;
          destacada?: boolean | undefined;
          publicada?: boolean | undefined;
          caracteristicas?: string[] | undefined;
          grupo_familiar?: string | null | undefined;
          estado?: "disponible" | "reservada" | "vendida" | "alquilada" | null | undefined;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}
