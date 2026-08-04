import { formatCurrency } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  isCurrency?: boolean;
  icon: React.ReactNode;
}

export function StatCard({ label, value, isCurrency = true, icon }: StatCardProps) {
  return (
    <div className="rise-in flex items-center justify-between rounded-card border border-border bg-white p-5 shadow-card">
      <div>
        <p className="text-sm text-ink-soft mb-1.5">{label}</p>
        <p className="text-2xl font-semibold text-ink">
          {isCurrency ? formatCurrency(value) : value}
        </p>
      </div>
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white">
        {icon}
      </span>
    </div>
  );
}
