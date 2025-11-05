/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./pages/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
      extend: {
        colors: {
          primary: "#6A5ACD",
          sidebar: "#FFFFFF",
          background: "#F5F6FA",
          darkSidebar: "#1E1E1E",
          darkBg: "#121212",
        },
      },
    },
    plugins: [],
  };
  