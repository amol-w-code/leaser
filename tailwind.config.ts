import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "var(--brand)",
          dark: "var(--brand-dark)",
          light: "var(--brand-light)",
        },
        ink: {
          DEFAULT: "var(--ink)",
          soft: "var(--ink-soft)",
          faint: "var(--ink-faint)",
        },
        surface: "var(--bg-surface)",
        border: "var(--border)",
        track: "var(--track)",
        positive: "var(--positive)",
        negative: "var(--negative)",
        accent: "var(--accent-blue)",
      },
      fontFamily: {
        // Restoring Fraunces for premium brand identity
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      borderRadius: {
        card: "24px", // Restoring luxurious border radius
        pill: "999px",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
        glow: "var(--shadow-glow)",
      },
    },
  },
  plugins: [],
};

export default config;
