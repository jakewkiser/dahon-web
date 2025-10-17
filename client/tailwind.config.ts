import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "var(--surface)",
        surfaceAlt: "var(--surface-alt)",
        ink: "var(--ink)",
        accent: "var(--accent)",
        accent2: "var(--accent2)",
        accent3: "var(--accent3)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(0,0,0,0.1)",
        glass: "inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 30px rgba(0,0,0,0.2)",
        soft: "var(--shadow-soft)",
        medium: "var(--shadow-medium)",
        strong: "var(--shadow-strong)",
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px",
      },
      backdropBlur: {
        glass: "var(--glass-blur)",
      },
      backgroundImage: {
        "dahon-gradient":
          "linear-gradient(90deg, var(--accent3), var(--accent2), var(--accent))",
      },
      fontFamily: {
        sans: ['"Inter"', '"Nunito"', "system-ui", "sans-serif"],
      },
      transitionProperty: {
        DEFAULT:
          "background-color, border-color, color, fill, stroke, opacity, box-shadow, transform",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".glass-card": {
          background: "var(--glass-surface)",
          backdropFilter: "blur(var(--glass-blur)) saturate(160%)",
          border: "1px solid var(--glass-border)",
          boxShadow: "var(--shadow-medium)",
          transition: "all 0.25s ease",
          borderRadius: "1rem",
        },
        ".hover-glow": {
          transition: "all 0.25s ease",
          transform: "translateY(0)",
        },
        ".hover-glow:hover": {
          transform: "translateY(-3px)",
          boxShadow: "var(--shadow-strong)",
        },
      });
    },
  ],
} satisfies Config;
