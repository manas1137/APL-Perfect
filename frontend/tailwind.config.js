/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "475px",
      },
      colors: {
        primary: {
          50: "#f5f7fa",
          100: "#e6edf5",
          200: "#d0deeb",
          300: "#b3c7da",
          400: "#8fa9c4",
          500: "#6b8aaf",
          600: "#4f6e96",
          700: "#3a5475",
          800: "#283b54",
          900: "#1a2332",
        },
        secondary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
    },
  },
  plugins: [],
};