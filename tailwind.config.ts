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
      },
    },
  },
  plugins: [],
};

export default config;
