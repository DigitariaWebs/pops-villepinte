export const colors = {
  primary: "#b7102a",
  primaryDark: "#8a0c20",
  surface: "#fdf9ee",
  surfaceElevated: "#ffffff",
  onSurface: "#1c1c15",
  onSurfaceVariant: "#6b6658",
  outline: "#e5ddc7",
  success: "#2f8a4c",
  danger: "#c8321f",
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  14: 56,
  18: 72,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const font = {
  display: "PlusJakartaSans_800ExtraBold_Italic",
  regular: "PlusJakartaSans_400Regular",
  medium: "PlusJakartaSans_500Medium",
  semibold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
  extraBold: "PlusJakartaSans_800ExtraBold",
} as const;

export const shadow = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
} as const;
