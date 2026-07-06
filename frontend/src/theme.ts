// Design tokens per /app/design_guidelines.json
export const colors = {
  primary: "#FF4FC3",
  secondary: "#8B5CF6",
  background: "#111111",
  card: "#1B1B1B",
  cardElevated: "#232326",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  text: "#FFFFFF",
  textSecondary: "#A1A1AA",
  textTertiary: "#71717A",
  border: "#27272A",
  borderFocus: "#FF4FC3",
  overlayDark: "rgba(0,0,0,0.7)",
  glass: "rgba(27,27,27,0.6)",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  screen: 24,
} as const;

export const radius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
} as const;

export const type = {
  h1: { fontSize: 40, lineHeight: 48, fontWeight: "800" as const, letterSpacing: -1, color: colors.text },
  h2: { fontSize: 32, lineHeight: 40, fontWeight: "700" as const, letterSpacing: -0.5, color: colors.text },
  h3: { fontSize: 24, lineHeight: 32, fontWeight: "600" as const, letterSpacing: -0.3, color: colors.text },
  h4: { fontSize: 20, lineHeight: 28, fontWeight: "600" as const, color: colors.text },
  bodyLarge: { fontSize: 18, lineHeight: 26, color: colors.text },
  body: { fontSize: 16, lineHeight: 22, color: colors.text },
  small: { fontSize: 14, lineHeight: 20, color: colors.textSecondary },
  tiny: { fontSize: 12, lineHeight: 16, color: colors.textTertiary },
  jaHero: { fontSize: 40, lineHeight: 52, fontWeight: "700" as const, color: colors.text },
  jaLarge: { fontSize: 28, lineHeight: 38, fontWeight: "600" as const, color: colors.text },
  jaBody: { fontSize: 20, lineHeight: 30, fontWeight: "500" as const, color: colors.text },
  romaji: { fontSize: 13, lineHeight: 18, fontWeight: "500" as const, color: colors.secondary, letterSpacing: 0.3 },
} as const;

export const shadowSoft = {
  shadowColor: colors.primary,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.18,
  shadowRadius: 20,
  elevation: 8,
};

export const IMAGES = {
  toriiNight: "https://images.unsplash.com/photo-1771893327514-842e33b8bf85?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODd8MHwxfHNlYXJjaHwxfHx0b3JpaSUyMGdhdGUlMjBuaWdodCUyMGRhcmslMjBtb29keXxlbnwwfHx8fDE3ODMzNTc1NjN8MA&ixlib=rb-4.1.0&q=85",
  sakuraNight: "https://images.unsplash.com/photo-1710216106278-a64505ca2141?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODd8MHwxfHNlYXJjaHwyfHxzYWt1cmElMjBjaGVycnklMjBibG9zc29tcyUyMG5pZ2h0fGVufDB8fHx8MTc4MzM1NzU2NHww&ixlib=rb-4.1.0&q=85",
  tokyoStreet: "https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA4Mzl8MHwxfHNlYXJjaHwxfHx0b2t5byUyMHN0cmVldCUyMG5pZ2h0JTIwbmVvbnxlbnwwfHx8fDE3ODMzNTc1NjR8MA&ixlib=rb-4.1.0&q=85",
  darkTexture: "https://images.unsplash.com/photo-1721587887543-33e4fb11107d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMG1pbmltYWwlMjBkYXJrJTIwdGV4dHVyZXxlbnwwfHx8fDE3ODMzNTc1NjR8MA&ixlib=rb-4.1.0&q=85",
};
