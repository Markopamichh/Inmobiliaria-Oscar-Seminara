"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";

export function LeadFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3">
      <div className="w-full sm:w-52">
        <Input
          placeholder="Buscar por nombre o email…"
          defaultValue={searchParams.get("q") ?? ""}
          onChange={(e) => updateParam("q", e.target.value)}
        />
      </div>
      <div className="w-full sm:w-44">
        <Select
          options={[
            { value: "", label: "Todos los estados" },
            { value: "nuevo", label: "Nuevo" },
            { value: "contactado", label: "Contactado" },
            { value: "calificado", label: "Calificado" },
            { value: "descartado", label: "Descartado" },
            { value: "cerrado", label: "Cerrado" },
          ]}
          value={searchParams.get("estado") ?? ""}
          onChange={(e) => updateParam("estado", e.target.value)}
        />
      </div>
      <div className="w-full sm:w-44">
        <Select
          options={[
            { value: "", label: "Todas las intenciones" },
            { value: "comprar", label: "Comprar" },
            { value: "vender", label: "Vender" },
            { value: "alquilar", label: "Alquilar" },
          ]}
          value={searchParams.get("intencion") ?? ""}
          onChange={(e) => updateParam("intencion", e.target.value)}
        />
      </div>
    </div>
  );
}
