/** @type {import('tailwindcss').Config} */
module.exports = {
  daisyui: {
    themes: [
      {
        light: {
          primary: "#a81952",

          secondary: "#cee809",

          accent: "#0e8234",

          neutral: "#28202c",

          "base-100": "#ededee",

          info: "#6cc1ef",

          success: "#6de9c0",

          warning: "#f0db70",

          error: "#e5345d",
        },
      },
      {
        dark: {
          primary: "#81f48f",

          secondary: "#ff6b66",

          accent: "#e5647e",

          neutral: "#302932",

          "base-100": "#322d39",

          info: "#76bee0",

          success: "#4be7ca",

          warning: "#eca241",

          error: "#f44e6c",
        },
      },
    ],
  },
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("daisyui")],
};
