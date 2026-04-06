"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar — solo mobile */}
        <header className="lg:hidden flex items-center gap-3 px-4 h-14 bg-stone-900 border-b border-stone-800 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-stone-400 hover:text-white transition-colors p-1"
            aria-label="Abrir menú"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <span className="font-display text-base font-semibold text-white">Seminara</span>
          <span className="text-xs text-stone-500 ml-0.5">Admin</span>
        </header>

        <main className="flex-1 overflow-auto bg-stone-50">
          {children}
        </main>
      </div>
    </div>
  );
}
