import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xxs: "274px",
        xs: "465px",
      },
      boxShadow: {
        "inner-sym": "inset 0px 0px 5px 0px #FF6B10",
      },
      dropShadow: {
        text: "2px 2px 2px #FF6B10",
      },
      backgroundImage: {
        "hero-pattern": "url('/banner.jpg')",
      },
      colors: {
        bgColor: "#000000",
        textColor: "#ffffff",
        primary: "#ff009c",
        secondary: "#ef81b2",
        titleColor: "#ffffff",
        accent: "rgb(234 179 8)",
        highlight: "rgb(253 224 71)",
        hover: "rgb(154 52 18)",
        button: "#fff",
        buttonHover: "#ffe200",
        buttonInactive: "rgb(100 116 139)",
        buttonInactiveText: "rgb(203 213 225)",
        inputBackground: "rgb(31 41 55)",
      },
    },
  },
  plugins: [],
};
export default config;
