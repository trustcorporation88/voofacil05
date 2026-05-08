import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0A5C9E",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#00C4B4",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#7CFF9E",
          foreground: "#0A5C9E",
        },
        brand: {
          primary: "#0b1621",
          charcoal: "#202a36",
          surface: "#f9f9ff",
          "gray-900": "#111827",
          "gray-600": "#4b5563",
          "gray-500": "#6b7280",
          "gray-300": "#d1d5db",
        },
      },
      spacing: {
        gutter: "24px",
      },
    },
  },
  plugins: [],
};

export default config;