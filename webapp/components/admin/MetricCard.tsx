import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function MetricCard({
  title,
  value,
  description,
  trend,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-stone-200 p-6",
        className
      )}
    >
      <p className="text-sm text-stone-500 font-medium">{title}</p>
      <p className="text-3xl font-semibold text-stone-900 mt-2">{value}</p>
      {description && (
        <p className="text-sm text-stone-400 mt-1">{description}</p>
      )}
      {trend && (
        <p
          className={cn(
            "text-xs font-medium mt-3",
            trend.value >= 0 ? "text-green-600" : "text-red-600"
          )}
        >
          {trend.value >= 0 ? "+" : ""}
          {trend.value}% {trend.label}
        </p>
      )}
    </div>
  );
}
