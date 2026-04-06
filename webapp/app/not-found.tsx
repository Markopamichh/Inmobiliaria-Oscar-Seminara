import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-accent text-sm font-medium tracking-widest uppercase mb-4">
          Error 404
        </p>
        <h1 className="font-display text-5xl font-semibold text-stone-900 mb-4">
          Página no encontrada
        </h1>
        <p className="text-stone-500 mb-8">
          La página que buscás no existe o fue eliminada.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-medium px-6 py-3 rounded-xl transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
