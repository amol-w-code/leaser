"use client";

import { useProfile } from "@/lib/use-profile";
import { useAuth } from "@/lib/auth-context";

interface TopBarProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function TopBar({ title, subtitle, action }: TopBarProps) {
  const { user } = useAuth();
  const { profile } = useProfile();
  
  const avatarUrl = user?.photoURL || profile?.profileImage;
  const displayName = user?.displayName || profile?.fullName || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="fade-in-up mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-center gap-4">
        {/* Mobile-only avatar */}
        <div className="md:hidden flex h-11 w-11 items-center justify-center overflow-hidden rounded-[14px] bg-surface ring-2 ring-brand/10">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <span className="text-lg font-semibold text-brand">{initial}</span>
          )}
        </div>
        <div>
          <h1 className="font-display text-2xl sm:text-[1.75rem] font-semibold text-ink leading-tight tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-ink-soft max-w-[500px] leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </header>
  );
}
