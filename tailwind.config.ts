import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vw: {
          blue: "#001E50",
          "blue-light": "#00B0F0",
          silver: "#9AA0A6",
          dark: "#0A0A0A",
        },
        ronaldo: {
          gold: "#FFD700",
          "gold-dark": "#C9A227",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "wheel-spin": {
          to: { transform: "rotate(360deg)" },
        },
        "drive-across": {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(120vw)" },
        },
        "speed-line": {
          "0%": { transform: "translateX(0)", opacity: "0" },
          "20%": { opacity: "1" },
          "100%": { transform: "translateX(-120vw)", opacity: "0" },
        },
        "siu-jump": {
          "0%": { transform: "translateY(0) scale(1)" },
          "30%": { transform: "translateY(-90px) scale(1.05)" },
          "60%": { transform: "translateY(-40px) scale(1.02)" },
          "100%": { transform: "translateY(0) scale(1)" },
        },
        "siu-text": {
          "0%": { transform: "scale(0) rotate(-20deg)", opacity: "0" },
          "40%": { transform: "scale(1.3) rotate(8deg)", opacity: "1" },
          "70%": { transform: "scale(1) rotate(-4deg)", opacity: "1" },
          "100%": { transform: "scale(1.4) rotate(0deg)", opacity: "0" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(0,176,240,0.5)" },
          "50%": { boxShadow: "0 0 0 12px rgba(0,176,240,0)" },
        },
        "float": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "wheel-spin": "wheel-spin 1.2s linear infinite",
        "drive-across": "drive-across 6s linear infinite",
        "speed-line": "speed-line 1.4s linear infinite",
        "siu-jump": "siu-jump 1.6s cubic-bezier(0.22,1,0.36,1) forwards",
        "siu-text": "siu-text 1.6s ease-out forwards",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
