import { Dimensions, Platform } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
export const isWeb = Platform.OS === 'web';
export const { width } = Dimensions.get('window');

// Breakpoints
const Breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Get current breakpoint
export const getCurrentBreakpoint = () => {
  if (screenWidth >= Breakpoints['2xl']) return '2xl';
  if (screenWidth >= Breakpoints.xl) return 'xl';
  if (screenWidth >= Breakpoints.lg) return 'lg';
  if (screenWidth >= Breakpoints.md) return 'md';
  if (screenWidth >= Breakpoints.sm) return 'sm';
  return 'xs';
};

// Check if screen is at least a certain breakpoint
export const isBreakpoint = (breakpoint) => {
  const breakpointValues = {
    xs: 0,
    sm: Breakpoints.sm,
    md: Breakpoints.md,
    lg: Breakpoints.lg,
    xl: Breakpoints.xl,
    '2xl': Breakpoints['2xl'],
  };
  return screenWidth >= breakpointValues[breakpoint];
};

// Responsive value selector - mobile first approach
export const responsive = (values) => {
  if (typeof values !== 'object') return values;
  
  const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  let selectedValue = values.xs || values.default;
  
  for (const bp of breakpoints) {
    if (values[bp] !== undefined && isBreakpoint(bp)) {
      selectedValue = values[bp];
    }
  }
  
  return selectedValue;
};

// Responsive spacing helper
export const responsiveSpacing = (values) => {
  return responsive(values);
};

// Responsive font size helper
export const responsiveFontSize = (values) => {
  return responsive(values);
};

// Responsive width helper
export const responsiveWidth = (values) => {
  return responsive(values);
};

// Responsive padding helper
export const responsivePadding = (values) => {
  if (typeof values === 'object') {
    return {
      paddingHorizontal: responsive(values.horizontal || values),
      paddingVertical: responsive(values.vertical || values),
    };
  }
  return responsive(values);
};

// Grid system helpers
export const getGridColumns = (columns = { xs: 1, sm: 2, md: 3, lg: 4 }) => {
  return responsive(columns);
};

export const getGridItemWidth = (columns = { xs: 1, sm: 2, md: 3, lg: 4 }) => {
  const cols = responsive(columns);
  const gap = responsive({ xs: 16, sm: 20, md: 24 });
  return `${(100 / cols) - (gap * (cols - 1)) / cols}%`;
};

// Container max width helper
export const getContainerMaxWidth = () => {
  return responsive({
    xs: '100%',
    sm: Breakpoints.sm,
    md: Breakpoints.md,
    lg: Breakpoints.lg,
    xl: Breakpoints.xl,
    '2xl': 1200, // Custom max width for better readability
  });
};

// Responsive flex direction
export const responsiveFlexDirection = (values = { xs: 'column', md: 'row' }) => {
  return responsive(values);
};

// Hide/show elements based on breakpoint
export const hideOn = (breakpoints) => {
  const currentBp = getCurrentBreakpoint();
  return breakpoints.includes(currentBp) ? { display: 'none' } : {};
};

export const showOn = (breakpoints) => {
  const currentBp = getCurrentBreakpoint();
  return breakpoints.includes(currentBp) ? {} : { display: 'none' };
};

// Responsive styles creator
export const createResponsiveStyles = (baseStyles) => {
  const processedStyles = {};
  
  Object.keys(baseStyles).forEach(key => {
    const style = baseStyles[key];
    const processedStyle = {};
    
    Object.keys(style).forEach(prop => {
      const value = style[prop];
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Check if it's a responsive object (has breakpoint keys)
        const hasBreakpointKeys = Object.keys(value).some(k => 
          ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'default'].includes(k)
        );
        
        if (hasBreakpointKeys) {
          processedStyle[prop] = responsive(value);
        } else {
          processedStyle[prop] = value;
        }
      } else {
        processedStyle[prop] = value;
      }
    });
    
    processedStyles[key] = processedStyle;
  });
  
  return processedStyles;
};

export default {
  getCurrentBreakpoint,
  isBreakpoint,
  responsive,
  responsiveSpacing,
  responsiveFontSize,
  responsiveWidth,
  responsivePadding,
  getGridColumns,
  getGridItemWidth,
  getContainerMaxWidth,
  responsiveFlexDirection,
  hideOn,
  showOn,
  createResponsiveStyles,
  Breakpoints,
};