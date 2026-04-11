/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FFCE00",
        primaryDark: "#E6B800",
        accent: "#E3000F",
        accentDark: "#B3000C",
        ink: "#111111",
        inkMuted: "#6B6B6B",
        surface: "#FFFFFF",
        background: "#FFFEF7",
        border: "#EDE7D3",
        success: "#1DB954",
        danger: "#E3000F",
      },
      fontFamily: {
        display: ["BebasNeue_400Regular"],
        sans: ["Poppins_400Regular"],
        "sans-medium": ["Poppins_500Medium"],
        "sans-semibold": ["Poppins_600SemiBold"],
        "sans-bold": ["Poppins_700Bold"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },
    },
  },
  plugins: [],
};
