import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", "Inter", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
        cormorant: ["Cormorant Garamond", "serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        dark: "#222831",
        semiDark: "#393E46",
        lightAccent: "#33C2CC",
        accent: "#00ADB5",
        light: "#EEEEEE",
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
} satisfies Config;
