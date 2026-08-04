"use client";

import { useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { loadProfile } from "@/lib/storage";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const applyTheme = () => {
      const profile = loadProfile();
      const root = document.documentElement;

      if (profile.theme === "dark") {
        root.setAttribute("data-theme", "dark");
      } else if (profile.theme === "light") {
        root.removeAttribute("data-theme");
      } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.setAttribute("data-theme", prefersDark ? "dark" : "light");
      }
    };

    applyTheme();
    window.addEventListener("profile-updated", applyTheme);
    window.addEventListener("storage", applyTheme);

    return () => {
      window.removeEventListener("profile-updated", applyTheme);
      window.removeEventListener("storage", applyTheme);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col pb-20 md:pb-0">
        <main className="flex-1 px-5 sm:px-10 py-8 max-w-6xl w-full mx-auto">{children}</main>
        <MobileNav />
      </div>
    </div>
  );
}
