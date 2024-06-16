/** @type {import('tailwindcss').Config} */
module.exports = {
  daisyui: {
    themes: [
      {
        light: {
          primary: "#3d3951",

          secondary: "#bba0b9",

          accent: "#7e5870",

          "base-100": "#f7f6f9",

          neutral: "#0e0d12",

          info: "#6cc1ef",

          success: "#00a600",

          warning: "#f0db70",

          error: "#e5345d",
        },
      },
      {
        dark: {
          primary: "#b2aec6",

          secondary: "#5f435d",

          accent: "#a68098",

          "base-100": "#3d3951",

          neutral: "#efeef3",

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
