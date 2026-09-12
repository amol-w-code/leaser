import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#5B4FE9",
          dark: "#4338CA",
          light: "#EEECFD",
        },
        ink: "#15161E",
        "ink-soft": "#6B6D7E",
        "ink-faint": "#9B9DAE",
        surface: "#F6F6FB",
        border: "#EDEDF3",
        track: "#E7E7F1",
        positive: "#16A34A",
        negative: "#DC2626",
        credit: "#2f5d50",
        debit: "#a8384a",
        gold: "#b98b2e",
        "paper-card": "#FFFDF5",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "16px",
        pill: "999px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(21,22,30,0.04), 0 1px 12px rgba(21,22,30,0.03)",
        "card-hover": "0 4px 16px rgba(21,22,30,0.08), 0 1px 4px rgba(21,22,30,0.04)",
        glow: "0 0 20px rgba(91, 79, 233, 0.15)",
      },
      animation: {
        "rise-in": "rise-in 0.3s ease-out both",
        "fade-in-up": "fade-in-up 0.4s ease-out both",
        "slide-up": "slide-up 0.35s cubic-bezier(0.16,1,0.3,1) both",
        "scale-in": "scale-in 0.2s ease-out both",
        "bar-grow": "bar-grow 0.6s cubic-bezier(0.16,1,0.3,1) both",
        "progress-fill": "progress-fill 0.8s cubic-bezier(0.16,1,0.3,1) both",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "stroke-draw": "stroke-draw 1s cubic-bezier(0.16,1,0.3,1) both",
        shimmer: "shimmer 1.8s ease-in-out infinite",
        "spin-slow": "spin-slow 1.5s linear infinite",
        "toast-in": "toast-in 0.3s ease-out both",
        "toast-out": "toast-out 0.3s ease-in both",
        "backdrop-in": "backdrop-in 0.2s ease-out both",
        "sidebar-slide": "sidebar-slide 0.3s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
