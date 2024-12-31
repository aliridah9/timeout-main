/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        lato: "'Lato', sans-serif;",
      },
      colors: {
        black: {
          DEFAULT: "#264653",
          dark: "#2C3447",
          input: "#1B1E25",
        },
        gray: {
          light: "#EEEFF6",
          "light-2": "#C7C7C9",
          DEFAULT: "#2D3B4C",
          text: "#9494C3",
        },
        green: {
          DEFAULT: "#6EBA78",
        },
        red: {
          DEFAULT: "#880C1B",
        },
        yellow: {
          DEFAULT: "#FFC975",
          dark: "#FFAE75",
        },
        orange: {
          DEFAULT: "#E9804E",
        },
        blue: {
          DEFAULT: "#3CADB9",
        },
        purple: {
          DEFAULT: "#A365A6",
        },
      },
      animation: {
        "grow-x": "grow-x 1s cubic-bezier(0.65, 0, 0.35, 1)",
        overlayShow: "overlayShow 500ms cubic-bezier(0.16, 1, 0.3, 1)",
        contentShow: "contentShow 500ms cubic-bezier(0.16, 1, 0.3, 1)",
        hide: "hide 100ms ease-in",
        slideIn: "slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        swipeOut: "swipeOut 100ms ease-out",
      },
      keyframes: {
        "grow-x": {
          "0%": { transform: "scaleX(0)", "transform-origin": "left" },
          "100%": { transform: "scaleX(1)", "transform-origin": "left" },
        },
        overlayShow: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        contentShow: {
          from: { opacity: 0, transform: "translate(-50%, -40%) scale(0.96)" },
          to: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
        },
        hide: {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        slideIn: {
          from: { transform: "translateX(calc(100% + var(--viewport-padding)))" },
          to: { transform: "translateX(0)" },
        },
        swipeOut: {
          from: { transform: "translateX(var(--radix-toast-swipe-end-x))" },
          to: { transform: "translateX(calc(100% + var(--viewport-padding)))" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
