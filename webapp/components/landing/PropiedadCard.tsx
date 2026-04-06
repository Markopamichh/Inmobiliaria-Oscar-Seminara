import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { PropiedadCard as PropiedadCardType } from "@/types/propiedad";

interface PropiedadCardProps {
  propiedad: PropiedadCardType;
}

const tipoLabel: Record<string, string> = {
  casa: "Casa",
  departamento: "Depto.",
  terreno: "Terreno",
  local: "Local",
  oficina: "Oficina",
};

const operacionLabel: Record<string, string> = {
  venta: "Venta",
  alquiler: "Alquiler",
  venta_alquiler: "Venta / Alquiler",
};

export function PropiedadCard({ propiedad }: PropiedadCardProps) {
  const imagen = propiedad.imagenes[0];
  const ubicacion = [propiedad.barrio, propiedad.ciudad]
    .filter(Boolean)
    .join(", ");

  return (
    <Link
      href={`/propiedades/${propiedad.slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-stone-300 hover:shadow-lg transition-all duration-300"
    >
      {/* Imagen */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        {imagen ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagen}
            alt={propiedad.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path
                d="M4 20L24 6l20 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 18v22h12v-10h8v10h12V18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {propiedad.tipo && (
            <span className="bg-white/90 text-stone-800 text-xs font-medium px-2.5 py-1 rounded-full">
              {tipoLabel[propiedad.tipo] ?? propiedad.tipo}
            </span>
          )}
          {propiedad.operacion && (
            <span className="bg-accent text-white text-xs font-medium px-2.5 py-1 rounded-full">
              {operacionLabel[propiedad.operacion]}
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <p className="text-xs text-stone-400 mb-1">{ubicacion || "Ubicación a confirmar"}</p>
          <h3 className="font-semibold text-stone-900 line-clamp-2 group-hover:text-accent transition-colors">
            {propiedad.titulo}
          </h3>
        </div>

        <p className="text-xl font-semibold text-stone-900 mt-auto">
          {formatPrice(propiedad.precio, propiedad.moneda)}
        </p>

        {/* Features */}
        <div className="flex gap-4 text-sm text-stone-500 border-t border-stone-100 pt-3">
          {propiedad.ambientes && (
            <span>{propiedad.ambientes} amb.</span>
          )}
          {propiedad.dormitorios !== null && propiedad.dormitorios !== undefined && (
            <span>{propiedad.dormitorios} dorm.</span>
          )}
          {propiedad.superficie_cubierta && (
            <span>{propiedad.superficie_cubierta} m²</span>
          )}
        </div>
      </div>
    </Link>
  );
}
