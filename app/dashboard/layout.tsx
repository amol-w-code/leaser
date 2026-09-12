"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { useProfile } from "@/lib/use-profile";
import { useAuth } from "@/lib/auth-context";
import { SyncIndicator } from "@/components/sync-indicator";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { profile, loaded: profileLoaded } = useProfile();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!profileLoaded) return;
    
    const applyTheme = () => {
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
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => applyTheme();
    mediaQuery.addEventListener("change", listener);
    
    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }, [profile.theme, profileLoaded]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface gap-4">
        <div className="relative">
          <div className="loading-spinner" />
          <div className="absolute inset-0 rounded-full bg-brand/10 blur-xl scale-150" />
        </div>
        <div className="flex flex-col items-center gap-1.5 fade-in-up">
          <span className="font-display text-lg font-semibold text-ink">Leaser</span>
          <span className="text-sm text-ink-faint">Loading your finances…</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col pb-20 md:pb-0">
        <main className="flex-1 px-5 sm:px-10 py-8 max-w-6xl w-full mx-auto">{children}</main>
        <MobileNav />
      </div>
      <SyncIndicator />
    </div>
  );
}
