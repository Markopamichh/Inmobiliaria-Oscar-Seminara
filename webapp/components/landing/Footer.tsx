import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-stone-400 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <p className="font-display text-white text-xl font-semibold mb-3">
              Seminara
            </p>
            <p className="text-sm leading-relaxed">
              Inmobiliaria con más de 15 años de experiencia en el mercado
              argentino.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-white text-sm font-medium mb-4">Navegación</p>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/propiedades"
                  className="hover:text-white transition-colors"
                >
                  Propiedades
                </Link>
              </li>
              <li>
                <Link
                  href="#contacto"
                  className="hover:text-white transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white text-sm font-medium mb-4">Contacto</p>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <a
                  href="mailto:info@seminarainmobiliaria.com"
                  className="hover:text-white transition-colors"
                >
                  info@seminarainmobiliaria.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+541112345678"
                  className="hover:text-white transition-colors"
                >
                  +54 11 1234-5678
                </a>
              </li>
              <li className="text-stone-500">Buenos Aires, Argentina</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-stone-600">
          <p>© {year} Seminara Inmobiliaria. Todos los derechos reservados.</p>
          <Link
            href="/login"
            className="hover:text-stone-400 transition-colors"
          >
            Panel admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
