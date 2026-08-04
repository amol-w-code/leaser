import { loadProfile } from "@/lib/storage";

export function formatCurrency(amount: number): string {
  const profile = loadProfile();
  const currency = profile.currency || "USD";
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  return formatter.format(Math.round(amount));
}

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function categoryColor(category: string): string {
  const palette: Record<string, string> = {
    Food: "#d97706",
    Travel: "#2563eb",
    Shopping: "#be185d",
    Entertainment: "#7c3aed",
    Bills: "#059669",
    Health: "#dc2626",
    Education: "#0f766e",
    Other: "#64748b",
  };

  return palette[category] ?? "#64748b";
}

export function isSameMonth(left: string, right: Date): boolean {
  const leftDate = new Date(left + "T00:00:00");
  return leftDate.getMonth() === right.getMonth() && leftDate.getFullYear() === right.getFullYear();
}

export function monthLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}
