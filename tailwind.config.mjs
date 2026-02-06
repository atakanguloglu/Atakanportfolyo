/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Lacivert ağırlıklı palet — kurumsal, güven veren */
        navy: {
          800: "#1e3a5f",
          900: "#0f172a",
        },
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          500: "#1e3a5f",
          600: "#0f172a",
        },
        gray: {
          50: "#F0F1F3",
          300: "#A5ACB5",
          400: "#87909D",
          500: "#697484",
          600: "#556070",
          700: "#424E60",
          800: "#2B384C",
          900: "#132238",
          950: "#333333",
        },
      },
    },
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1600px",
      },
    },
  },
  corePlugins: {
    preflight: false, // Disable preflight styles
  },
  plugins: [],
};

export default tailwindConfig;
