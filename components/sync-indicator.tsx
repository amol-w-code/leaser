"use client";

import { useAuth } from "@/lib/auth-context";

export function SyncIndicator() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6 fade-in-up">
      <div className="flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-lg border border-border px-3 py-1.5 shadow-card dark-card">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-positive opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-positive" />
        </span>
        <span className="text-[11px] font-medium text-ink-soft">Cloud synced</span>
      </div>
    </div>
  );
}
