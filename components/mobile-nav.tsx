"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/dashboard", label: "Home" },
  { href: "/dashboard/budgets", label: "Budgets" },
  { href: "/dashboard/expenses", label: "Expenses" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 flex border-t border-border bg-white">
      {ITEMS.map((item) => {
        const active =
          item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 text-center py-3 text-sm font-medium ${
              active ? "text-brand" : "text-ink-faint"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
