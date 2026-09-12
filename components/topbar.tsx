"use client";

import { useProfile } from "@/lib/use-profile";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { profile } = useProfile();
  const { user } = useAuth();
  
  // Try Firebase avatar first, then Firestore profile image, then initials
  const avatarUrl = user?.photoURL || profile?.profileImage;
  const initial = user?.displayName?.charAt(0)?.toUpperCase() || profile?.fullName?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">{title}</h1>
        {subtitle && <p className="text-ink-soft text-sm mt-1.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <div className="md:hidden">
          <ThemeToggle />
        </div>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Profile"
            className="h-10 w-10 rounded-full object-cover border border-border"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white font-medium">
            {initial}
          </div>
        )}
        <button
          onClick={() => signOut(auth)}
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-full border border-border text-negative hover:bg-surface transition-colors"
          title="Sign Out"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}
