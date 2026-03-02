import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wirin: {
          green: "#4CAF50",
          "green-dark": "#2E7D32",
          "green-light": "#81C784",
          yellow: "#F9A825",
          "yellow-light": "#FFD54F",
          olive: "#1B5E20",
          "gray-dark": "#374151",
          "bg-light": "#F0F7F0",
          "bg-card": "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        condensed: ["'Roboto Condensed'", "sans-serif"],
      },
      backgroundImage: {
        "wirin-gradient": "linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #4CAF50 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
