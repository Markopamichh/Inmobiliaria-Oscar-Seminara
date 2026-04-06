export type PropiedadTipo =
  | "casa"
  | "departamento"
  | "terreno"
  | "local"
  | "oficina";

export type PropiedadOperacion = "venta" | "alquiler" | "venta_alquiler";

export type PropiedadMoneda = "USD" | "ARS";

export interface Propiedad {
  id: string;
  created_at: string;
  titulo: string;
  slug: string;
  descripcion: string | null;
  tipo: PropiedadTipo | null;
  operacion: PropiedadOperacion | null;
  precio: number | null;
  moneda: PropiedadMoneda;
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
}

export type PropiedadInsert = Omit<Propiedad, "id" | "created_at"> & {
  moneda?: PropiedadMoneda;
  imagenes?: string[];
  destacada?: boolean;
  publicada?: boolean;
  caracteristicas?: string[];
};

export type PropiedadUpdate = Partial<PropiedadInsert> & { id: string };

// Para las cards del landing (datos mínimos necesarios)
export interface PropiedadCard {
  id: string;
  titulo: string;
  slug: string;
  tipo: PropiedadTipo | null;
  operacion: PropiedadOperacion | null;
  precio: number | null;
  moneda: PropiedadMoneda;
  superficie_cubierta: number | null;
  ambientes: number | null;
  dormitorios: number | null;
  barrio: string | null;
  ciudad: string | null;
  imagenes: string[];
  destacada: boolean;
}
