"use client";

import { useProfile } from "@/lib/use-profile";

type ThemeValue = "light" | "dark" | "system";

const CYCLE: ThemeValue[] = ["light", "dark", "system"];

export function ThemeToggle() {
  const { profile, saveProfile } = useProfile();

  async function handleToggle() {
    const next = CYCLE[(CYCLE.indexOf(profile.theme as ThemeValue) + 1) % CYCLE.length];
    await saveProfile({ ...profile, theme: next });
  }

  const label =
    profile.theme === "light" ? "Light" : profile.theme === "dark" ? "Dark" : "System";

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={`Theme: ${label}. Click to change.`}
      title={`Theme: ${label}`}
      className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-surface hover:text-ink transition-colors"
    >
      <span className="flex h-5 w-5 items-center justify-center">
        {profile.theme === "light" && <SunIcon />}
        {profile.theme === "dark" && <MoonIcon />}
        {profile.theme === "system" && <MonitorIcon />}
      </span>
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}
