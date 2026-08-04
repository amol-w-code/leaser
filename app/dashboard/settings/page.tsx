"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { loadProfile, saveProfile } from "@/lib/storage";
import { UserProfile } from "@/lib/types";

const themeOptions = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const;

const countryOptions = ["India", "United States", "United Kingdom", "Canada", "Australia", "Germany", "Singapore"];
const currencyOptions = ["INR", "USD", "EUR", "GBP", "CAD", "AUD", "SGD"];

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile>(loadProfile());
  const [message, setMessage] = useState("Profile saved locally in this browser.");

  useEffect(() => {
    const storedTheme = profile.theme;
    const root = document.documentElement;
    if (storedTheme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else if (storedTheme === "light") {
      root.removeAttribute("data-theme");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.setAttribute("data-theme", prefersDark ? "dark" : "light");
    }
  }, [profile.theme]);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  }

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setProfile((prev) => ({ ...prev, profileImage: result }));
    };
    reader.readAsDataURL(file);
  }

  function handleSave() {
    saveProfile(profile);
    window.dispatchEvent(new Event("profile-updated"));
    setMessage("Settings updated successfully.");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Settings</h1>
        <p className="text-sm text-ink-soft mt-1">Update your profile, email, theme, and avatar.</p>
      </div>

      <div className="rounded-card border border-border bg-white p-6 shadow-card">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <div className="flex flex-col items-center gap-3 md:w-48">
            {profile.profileImage ? (
              <img src={profile.profileImage} alt="Profile preview" className="h-24 w-24 rounded-full object-cover border border-border" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-light text-2xl font-semibold text-brand-dark">
                {profile.fullName.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <label className="cursor-pointer rounded-full border border-border px-3 py-2 text-sm font-medium text-ink-soft hover:bg-surface">
              Upload avatar
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          <div className="flex-1 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-ink">
                Full name
                <input
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink"
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-ink">
                Email
                <input
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink"
                />
              </label>
            </div>

            <label className="space-y-2 text-sm font-medium text-ink block">
              Bio
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-ink block">
                Country
                <select
                  name="country"
                  value={profile.country}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink"
                >
                  {countryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm font-medium text-ink block">
                Currency
                <select
                  name="currency"
                  value={profile.currency}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink"
                >
                  {currencyOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="space-y-2 text-sm font-medium text-ink block">
              Theme
              <select
                name="theme"
                value={profile.theme}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink"
              >
                {themeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="rounded-xl border border-border bg-surface/70 p-4 text-sm text-ink-soft">
              <p className="font-medium text-ink">Theme preview</p>
              <p className="mt-1">Choose a look that matches your workspace — light, dark, or follow your device settings.</p>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
              <p className="text-sm text-ink-soft">{message}</p>
              <button
                onClick={handleSave}
                className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
