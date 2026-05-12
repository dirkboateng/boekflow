import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#0F1737", soft: "#2A3258" },
        lime: { DEFAULT: "#C4F542", deep: "#9FCD2C" },
        cream: "#FAF7F0",
        paper: "#FFFFFF",
        slate: { DEFAULT: "#8B92A8", light: "#C8CDD9" },
        line: { DEFAULT: "#E8E5DC", soft: "#F0EDE5" },
      },
      fontFamily: {
        display: ["var(--font-bricolage)", "system-ui", "sans-serif"],
        body: ["var(--font-geist)", "system-ui", "sans-serif"],
      },
      letterSpacing: { "tight-2": "-0.02em", "tight-3": "-0.03em" },
    },
  },
  plugins: [],
};

export default config;
