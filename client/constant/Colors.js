const tintColorLight = '#FFD700'; // Gold
const tintColorDark = '#FFD700'; // Gold

export const Colors = {
  light: { // This will be less used if dark mode is default, but should still be black/gold
    text: '#000000', // Black text on light (gold) background
    background: '#FFD700', // Gold background
    tint: tintColorLight,
    icon: '#000000',
    tabIconDefault: '#000000',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#FFD700', // Gold text on dark (black) background
    background: '#000000', // Black background
    tint: tintColorDark,
    icon: '#FFD700',
    tabIconDefault: '#FFD700',
    tabIconSelected: tintColorDark,
  },

  // Brand Colors
  PRIMARY: '#FFD700', // Gold
  SECONDARY: '#000000', // Black

  // Primary Color Variants (Gold variants)
  PRIMARY_50: '#FFFBEA',
  PRIMARY_100: '#FFF4B3',
  PRIMARY_200: '#FFED80',
  PRIMARY_300: '#FFE64D',
  PRIMARY_400: '#FFDF1A',
  PRIMARY_500: '#FFD700', // Main gold color
  PRIMARY_600: '#E6C200',
  PRIMARY_700: '#CCAE00',
  PRIMARY_800: '#B39A00',
  PRIMARY_900: '#998600',

  // Secondary Color Variants (Black/Gray variants)
  SECONDARY_50: '#F0F0F0', // Very light gray for subtle contrast
  SECONDARY_100: '#D9D9D9',
  SECONDARY_200: '#A3A3A3',
  SECONDARY_300: '#7A7A7A',
  SECONDARY_400: '#4D4D4D',
  SECONDARY_500: '#262626', // Dark gray
  SECONDARY_600: '#1A1A1A',
  SECONDARY_700: '#121212', // Main dark background
  SECONDARY_800: '#0A0A0A',
  SECONDARY_900: '#000000', // Pure black

  // Neutral Colors - Modern Gray Scale (Adjusted to fit black theme)
  WHITE: '#FFFFFF', // Keep white for some elements that need to pop
  BLACK: '#000000', // Pure black
  GRAY_50: '#1F1F1F', // Very dark gray, almost black
  GRAY_100: '#2A2A2A',
  GRAY_200: '#3A3A3A',
  GRAY_300: '#4A4A4A',
  GRAY_400: '#6A6A6A',
  GRAY_500: '#8A8A8A',
  GRAY_600: '#A0A0A0',
  GRAY_700: '#B0B0B0',
  GRAY_800: '#C0C0C0',
  GRAY_900: '#D0D0D0',

  // Semantic Colors (Adjusted for dark theme)
  TEXT: '#FFD700', // Gold text by default (dark mode)
  TEXT_SECONDARY: '#B0B0B0', // Lighter gray for secondary text
  TEXT_MUTED: '#8A8A8A', // Even lighter gray for muted text
  BACKGROUND: '#000000', // Default background is black
  BACKGROUND_SECONDARY: '#121212', // Slightly lighter black for secondary backgrounds
  BORDER: '#4D4D4D', // Dark gray border
  BORDER_LIGHT: '#2A2A2A',

  // Legacy Colors (Adjusted)
  LIGHT_BLUE: '#FFD700', // Replace with gold
  DARK_BLUE: '#E6C200', // Replace with darker gold
  LIGHT_GOLD: '#FFED80', // Adjust gold
  DARK_GOLD: '#CCAE00', // Adjust gold
  LIGHT_GRAY: '#2A2A2A', // Dark gray
  GRAY: '#6A6A6A', // Medium gray
  DARK_GRAY: '#1A1A1A', // Darker gray

  // Status Colors (Keep as is, or adjust if gold/black versions are needed)
  SUCCESS: '#10b981',
  SUCCESS_LIGHT: '#d1fae5',
  WARNING: '#f59e0b',
  WARNING_LIGHT: '#fef3c7',
  ERROR: '#ef4444',
  ERROR_LIGHT: '#fee2e2',
  INFO: '#3b82f6',
  INFO_LIGHT: '#dbeafe',

  // Mood colors (keep for daily check-in)
  RED: '#ef4444',
  ORANGE: '#f59e0b',
  GREEN: '#10b981',

  // Interactive Colors (Adjusted)
  HOVER: '#1A1A1A', // Dark gray hover
  ACTIVE: '#2A2A2A', // Darker gray active
  FOCUS: '#4D4D4D', // Even darker gray focus

  // Opacity Variants (Adjusted for new palette)
  WHITE_OPACITY_80: 'rgba(255, 255, 255, 0.8)',
  BLACK_OPACITY_10: 'rgba(0, 0, 0, 0.1)',
  BLACK_OPACITY_20: 'rgba(0, 0, 0, 0.2)',
  PRIMARY_OPACITY_10: 'rgba(255, 215, 0, 0.1)', // Gold opacity
  PRIMARY_OPACITY_20: 'rgba(255, 215, 0, 0.2)', // Gold opacity
};

export default Colors;