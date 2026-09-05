// PLACEHOLDER — confirm against Figma. Colors are a best-guess mapping from a raw hex
// export (see the plan's Design system section); spacing/radius are carried over from an
// earlier pass and have not been checked against Figma's inspect panel. Do not treat any
// value in this file as final.
export const Colors = {
  brand: '#E8175D',
  brandDark: '#C3134E',
  brandSoft: '#FDE7EE',
  veg: '#0F8A3F',
  nonVeg: '#B3261E',
  rating: '#1BA672',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceMuted: '#F6F6F8',
  border: '#ECECEF',
  text: '#161119',
  textSecondary: '#6B6570',
  textMuted: '#9A94A0',
  overlay: 'rgba(0,0,0,0.45)',
  badgeDark: 'rgba(22,17,25,0.72)',
} as const;

// PLACEHOLDER — confirm against Figma inspect panel.
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
} as const;

// PLACEHOLDER — confirm against Figma inspect panel.
export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
} as const;

export const Shadow = {
  card: {
    shadowColor: '#1A1023',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  floating: {
    shadowColor: '#1A1023',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;
