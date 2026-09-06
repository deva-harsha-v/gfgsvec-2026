import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        gfg: {
          dark: "#0c0e12",
          surface: "#141820",
          border: "#1e2632",
          emerald: "#00b964",
          glow: "#00e575",
          amber: "#f59e0b",
          muted: "#94a3b8",
        },
      },
    },
  },
  plugins: [],
};
export default config;
