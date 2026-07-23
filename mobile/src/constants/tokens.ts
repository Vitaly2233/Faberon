/**
 * Design tokens derived from FaberonDesign mobile client (`MobileClient.tsx`)
 * and the monochrome admin palette in `theme.css`.
 */
export const colors = {
  brand: {
    primary: '#202020',
    primaryHover: '#1C1C1C',
    primaryForeground: '#FFFFFF',
    secondary: '#2B2B2B',
  },
  background: {
    canvas: '#FAFAF8',
    login: '#F5F5F2',
    surface: '#FFFFFF',
    muted: '#EFEFEC',
    elevated: '#202020',
    overlay: 'rgba(0, 0, 0, 0.35)',
    onDarkMuted: '#333333',
    onDarkSubtle: '#2A2A2A',
  },
  text: {
    primary: '#202020',
    secondary: '#71716B',
    tertiary: '#999993',
    muted: '#85857F',
    label: '#555555',
    placeholder: '#8E8E88',
    inverse: '#FFFFFF',
    inverseMuted: 'rgba(255, 255, 255, 0.45)',
    destructive: '#A43A32',
  },
  border: {
    default: '#E9E9E5',
    input: '#E2E2DD',
    strong: '#D9D9D3',
    divider: '#EEEEEA',
  },
  icon: {
    default: '#777777',
    muted: '#92928D',
  },
  status: {
    waiting: { background: '#F1F1EF', text: '#5D5D57' },
    travel: { background: '#E8F0FF', text: '#28549B' },
    parts: { background: '#FFF0D8', text: '#89580A' },
    repaired: { background: '#DEF5E8', text: '#236544' },
    confirmed: { background: '#242424', text: '#FFFFFF' },
    success: { background: '#E2F3E9', text: '#235B3D' },
    working: { background: '#DEF5E8', text: '#236544' },
    error: { background: '#FDE8E7', text: '#A82C24' },
    info: { background: '#E6F0FF', text: '#245FAE' },
  },
  indicator: {
    active: '#E2A437',
    healthy: '#57A77A',
    notification: '#E95C4B',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 18,
  '2xl': 20,
  '3xl': 22,
  pill: 999,
  card: 24,
} as const;

export const typography = {
  fontFamily: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    extrabold: 'Inter_800ExtraBold',
    black: 'Inter_900Black',
  },
  size: {
    xs: 9,
    sm: 10,
    md: 11,
    base: 12,
    lg: 13,
    xl: 14,
    '2xl': 16,
    '3xl': 20,
    '4xl': 26,
    '5xl': 29,
    '6xl': 36,
  },
  lineHeight: {
    tight: 1.04,
    snug: 1.1,
    normal: 1.25,
    relaxed: 1.5,
  },
  letterSpacing: {
    tight: -0.045,
    snug: -0.03,
    normal: -0.02,
    wide: 0.14,
    wider: 0.16,
    widest: 0.18,
  },
} as const;

export const iconSizes = {
  sm: 15,
  md: 17,
  lg: 18,
  xl: 20,
  '2xl': 21,
  '3xl': 24,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 30,
    elevation: 6,
  },
} as const;

export const layout = {
  minTouchTarget: 44,
  headerHeight: 64,
  bottomNavHeight: 100,
  inputHeight: 56,
  buttonHeight: 56,
} as const;
