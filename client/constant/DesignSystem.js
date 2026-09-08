// Modern Design System inspired by bot.new and contemporary design principles

// Typography Scale
export const Typography = {
  // Font Sizes (rem equivalent in pixels)
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
    '7xl': 72,
    '8xl': 96,
    '9xl': 128,
  },
  
  // Font Weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  // Line Heights
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  
  // Letter Spacing
  letterSpacing: {
    tighter: -0.05,
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1,
  },
};

// Spacing Scale (8px base unit)
export const Spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384,
};

// Border Radius Scale
export const BorderRadius = {
  none: 0,
  sm: 2,
  base: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
};

// Shadow System
export const Shadows = {
  // Mobile shadows (elevation)
  elevation: {
    0: { elevation: 0 },
    1: { elevation: 1 },
    2: { elevation: 2 },
    3: { elevation: 3 },
    4: { elevation: 4 },
    6: { elevation: 6 },
    8: { elevation: 8 },
    12: { elevation: 12 },
    16: { elevation: 16 },
    24: { elevation: 24 },
  },
  
  // Web shadows
  web: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    base: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 15,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.1,
      shadowRadius: 25,
    },
    '2xl': {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 25 },
      shadowOpacity: 0.15,
      shadowRadius: 50,
    },
  },
};

// Component Variants
export const Components = {
  // Button variants
  button: {
    sizes: {
      sm: {
        paddingHorizontal: Spacing[3],
        paddingVertical: Spacing[2],
        fontSize: Typography.fontSize.sm,
        borderRadius: BorderRadius.md,
      },
      md: {
        paddingHorizontal: Spacing[4],
        paddingVertical: Spacing[3],
        fontSize: Typography.fontSize.base,
        borderRadius: BorderRadius.lg,
      },
      lg: {
        paddingHorizontal: Spacing[6],
        paddingVertical: Spacing[4],
        fontSize: Typography.fontSize.lg,
        borderRadius: BorderRadius.xl,
      },
    },
  },
  
  // Card variants
  card: {
    padding: Spacing[6],
    borderRadius: BorderRadius['2xl'],
    backgroundColor: '#ffffff',
    ...Shadows.web.md,
  },
  
  // Input variants
  input: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    fontSize: Typography.fontSize.base,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
};

// Breakpoints for responsive design
export const Breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Animation durations
export const Animation = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

export default {
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  Components,
  Breakpoints,
  Animation,
};