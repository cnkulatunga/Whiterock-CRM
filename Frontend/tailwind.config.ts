import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          900: "#312e81",
        },
        navy: {
          DEFAULT: "#0f172a",
          light: "#1e293b",
        },
      },
      boxShadow: {
        card: "0 4px 20px rgba(0,0,0,0.04)",
        panel: "0 20px 50px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
