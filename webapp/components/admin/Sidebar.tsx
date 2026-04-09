"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems: NavItem[] = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="1" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    href: "/admin/leads",
    label: "Leads",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 9a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 17c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/admin/propiedades",
    label: "Propiedades",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M1.5 8.5L9 2l7.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 7.5V16h5v-4h2v4h5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/admin/leads-tibios",
    label: "Leads Tibios",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 17c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 4c.5-1 1.5-1.5 2-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside
      className={cn(
        // Base: fixed drawer en mobile
        "fixed inset-y-0 left-0 z-40 w-60 bg-stone-900 flex flex-col",
        "transition-transform duration-300 ease-in-out",
        // Desktop: vuelve al flujo normal del flex
        "lg:relative lg:translate-x-0 lg:z-auto",
        // Mobile: se muestra u oculta según isOpen
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b border-stone-800 flex items-center justify-between">
        <div>
          <p className="font-display text-lg text-white font-semibold">Seminara</p>
          <p className="text-xs text-stone-500 mt-0.5">Panel Admin</p>
        </div>
        {/* Botón cerrar — solo mobile */}
        <button
          onClick={onClose}
          className="lg:hidden text-stone-500 hover:text-white transition-colors p-1"
          aria-label="Cerrar menú"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              {...(onClose ? { onClick: onClose } : {})}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-150",
                active
                  ? "bg-accent text-white"
                  : "text-stone-400 hover:text-white hover:bg-stone-800"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-stone-800 flex flex-col gap-1">
        <Link
          href="/"
          {...(onClose ? { onClick: onClose } : {})}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M10 3H15V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 3L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M8 5H3.5A1.5 1.5 0 002 6.5v8A1.5 1.5 0 003.5 16h8A1.5 1.5 0 0013 14.5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Ver sitio web
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-400 hover:text-white hover:bg-stone-800 transition-colors w-full"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M6.5 9h9M13 6l2.5 3-2.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 2.5H3.5A1.5 1.5 0 002 4v10a1.5 1.5 0 001.5 1.5H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
