/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#b7102a",
        "primary-dark": "#8a0c20",
        "primary-container": "#db313f",
        "secondary-container": "#f5e3a3",
        "on-secondary-container": "#6b4b00",
        surface: "#fdf9ee",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f7f3e6",
        "surface-container": "#f1eee3",
        "surface-container-high": "#e8e3d0",
        "surface-container-highest": "#ddd6bf",
        "on-surface": "#1c1c15",
        "on-surface-variant": "#6b6658",
        outline: "#e5ddc7",
        success: "#2f8a4c",
        danger: "#c8321f",
      },
      fontFamily: {
        display: ["PlusJakartaSans_800ExtraBold_Italic"],
        sans: ["PlusJakartaSans_400Regular"],
        "sans-medium": ["PlusJakartaSans_500Medium"],
        "sans-semibold": ["PlusJakartaSans_600SemiBold"],
        "sans-bold": ["PlusJakartaSans_700Bold"],
        "sans-extrabold": ["PlusJakartaSans_800ExtraBold"],
        "sans-extrabold-italic": ["PlusJakartaSans_800ExtraBold_Italic"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "48px",
      },
    },
  },
  plugins: [],
};
