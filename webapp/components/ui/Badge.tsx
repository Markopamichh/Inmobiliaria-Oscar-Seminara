import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "accent";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-stone-100 text-stone-700",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  danger: "bg-red-100 text-red-800",
  info: "bg-blue-100 text-blue-800",
  accent: "bg-amber-100 text-amber-800",
};

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// Helpers for lead estado
export function LeadEstadoBadge({ estado }: { estado: string }) {
  const map: Record<string, { variant: BadgeVariant; label: string }> = {
    nuevo: { variant: "info", label: "Nuevo" },
    contactado: { variant: "accent", label: "Contactado" },
    calificado: { variant: "success", label: "Calificado" },
    descartado: { variant: "danger", label: "Descartado" },
    cerrado: { variant: "default", label: "Cerrado" },
  };
  const config = map[estado] ?? { variant: "default" as BadgeVariant, label: estado };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
