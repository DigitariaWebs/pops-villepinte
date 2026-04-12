export const colors = {
  primary: "#b7102a",
  primaryDark: "#8a0c20",
  primaryContainer: "#db313f",
  secondaryContainer: "#f5e3a3",
  onSecondaryContainer: "#6b4b00",
  surface: "#fdf9ee",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f7f3e6",
  surfaceContainer: "#f1eee3",
  surfaceContainerHigh: "#e8e3d0",
  surfaceContainerHighest: "#ddd6bf",
  onSurface: "#1c1c15",
  onSurfaceVariant: "#6b6658",
  outline: "#e5ddc7",
  outlineVariant: "#cdc5b4",
  success: "#2f8a4c",
  danger: "#c8321f",
  error: "#ba1a1a",
  editorialRule: "#e4bebc",
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
  xl: 48,
  pill: 999,
} as const;

export const font = {
  display: "PlusJakartaSans_800ExtraBold_Italic",
  regular: "PlusJakartaSans_400Regular",
  medium: "PlusJakartaSans_500Medium",
  semibold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
  extraBold: "PlusJakartaSans_800ExtraBold",
  extraBoldItalic: "PlusJakartaSans_800ExtraBold_Italic",
} as const;

export const shadow = {
  card: {
    shadowColor: "#1c1c15",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  hero: {
    shadowColor: "#1c1c15",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 6,
  },
} as const;
