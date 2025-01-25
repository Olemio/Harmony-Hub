import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      colors: {
        customWhite: "#EEEEEE",
        customBabyBlue: "#3CB7E3",
        customPink: "#B37DFF",
        customDarkGray: "#1B1B1B",
        customGray: "#1F1F1F",
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
} satisfies Config;
