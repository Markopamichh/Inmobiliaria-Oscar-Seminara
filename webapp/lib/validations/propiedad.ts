import { z } from "zod";

export const PropiedadSchema = z.object({
  titulo: z.string().min(5, "El título debe tener al menos 5 caracteres").max(200),
  slug: z
    .string()
    .min(3)
    .max(250)
    .regex(/^[a-z0-9-]+$/, "El slug solo puede contener letras minúsculas, números y guiones"),
  descripcion: z.string().max(5000).optional().nullable(),
  tipo: z.enum(["casa", "departamento", "terreno", "local", "oficina"]).optional().nullable(),
  operacion: z.enum(["venta", "alquiler", "venta_alquiler"]).optional().nullable(),
  precio: z.number().positive("El precio debe ser mayor a 0").optional().nullable(),
  moneda: z.enum(["USD", "ARS"]).default("USD"),
  superficie_total: z.number().positive().optional().nullable(),
  superficie_cubierta: z.number().positive().optional().nullable(),
  ambientes: z.number().int().min(1).max(20).optional().nullable(),
  dormitorios: z.number().int().min(0).max(20).optional().nullable(),
  banos: z.number().int().min(1).max(20).optional().nullable(),
  direccion: z.string().max(300).optional().nullable(),
  barrio: z.string().max(100).optional().nullable(),
  ciudad: z.string().max(100).optional().nullable(),
  provincia: z.string().max(100).optional().nullable(),
  latitud: z.number().min(-90).max(90).optional().nullable(),
  longitud: z.number().min(-180).max(180).optional().nullable(),
  imagenes: z.array(z.string().url()).default([]),
  destacada: z.boolean().default(false),
  publicada: z.boolean().default(false),
  caracteristicas: z.array(z.string().max(100)).default([]),
  grupo_familiar: z.string().max(200).optional().nullable(),
  estado: z.enum(["disponible", "reservada", "vendida", "alquilada"]).default("disponible"),
});

export type PropiedadFormValues = z.infer<typeof PropiedadSchema>;

export const PropiedadFilterSchema = z.object({
  tipo: z.enum(["casa", "departamento", "terreno", "local", "oficina"]).optional(),
  operacion: z.enum(["venta", "alquiler", "venta_alquiler"]).optional(),
  precio_min: z.coerce.number().positive().optional(),
  precio_max: z.coerce.number().positive().optional(),
  ciudad: z.string().optional(),
  barrio: z.string().optional(),
  ambientes_min: z.coerce.number().int().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
  per_page: z.coerce.number().int().min(1).max(50).default(12),
});

export type PropiedadFilterValues = z.infer<typeof PropiedadFilterSchema>;
