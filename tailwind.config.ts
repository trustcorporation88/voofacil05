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
      },
    },
  },
  plugins: [],
};

export default config;