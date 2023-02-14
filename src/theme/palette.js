import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

function createGradient(color1, color2) {
  return `linear-gradient(to bottom, ${color1}, ${color2})`;
}

// SETUP COLORS
const GREY = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
  500_8: alpha('#919EAB', 0.08),
  500_12: alpha('#919EAB', 0.12),
  500_16: alpha('#919EAB', 0.16),
  500_24: alpha('#919EAB', 0.24),
  500_32: alpha('#919EAB', 0.32),
  500_48: alpha('#919EAB', 0.48),
  500_56: alpha('#919EAB', 0.56),
  500_80: alpha('#919EAB', 0.8),
};

const PRIMARY = {
  lighter: '#9b958a96',
  light: '#a7a7a7',
  // main: '#363636',
  main:'#3636364d',
  dark: '#b8b8b812',
  darker: '#01072a',
  body: '#1d1d1d',
  text: '#8d8d8d',
  basic: 'rgb(238 232 232 / 37%)',
};

const SECONDARY = {
  lighter: '#C8FACD',
  light: '#c4c4c4a3',
  main: '#FD2DFF',
  dark: '#361A1A',
  darker: '#F1751C',
  contrastText: '#ffffff29',
};

const INFO = {
  lighter: '#D0F2FF',
  light: '#74CAFF',
  main:'#b8b8b812',
  dark: '#0C53B7',
  darker: '#04297A',
  contrastText: '#fff',
};
const SUCCESS = {
  lighter: '#E9FCD4',
  light: '#AAF27F',
  main: '#54D62C',
  dark: '#229A16',
  darker: '#08660D',
  contrastText: GREY[800],
};
const WARNING = {
  lighter: '#FFF7CD',
  light: '#FFE16A',
  main: '#FFC107',
  dark: '#B78103',
  darker: '#7A4F01',
  contrastText: GREY[800],
};
const ERROR = {
  lighter: '#FFE7D9',
  light: '#FFA48D',
  main: '#FF4842',
  dark: '#B72136',
  darker: '#7A0C2E',
  contrastText: '#fff',
};

const GRADIENTS = {
  primary: createGradient(PRIMARY.light, PRIMARY.main),
  info: createGradient(INFO.light, INFO.main),
  success: createGradient(SUCCESS.light, SUCCESS.main),
  warning: createGradient(WARNING.light, WARNING.main),
  error: createGradient(ERROR.light, ERROR.main),
};

const palette = {
  common: {
    black: '#000',
    white: '#fff',
  },
  primary: {
    ...PRIMARY,
  },
  secondary: {
    ...SECONDARY,
  },
  info: {
    ...INFO,
  },
  success: {
    ...SUCCESS,
  },
  warning: {
    ...WARNING,
  },
  error: {
    ...ERROR,
  },
  grey: GREY,
  gradients: GRADIENTS,
  divider: GREY[500_24],
  text: {
    primary: '#fff',
    secondary: PRIMARY.main,
    disabled: GREY[500],
  },
  background: {
    paper: '#b8b8b812',
    default: '#F3F3F3',
    neutral: GREY[200],
  },
  action: {
    active: GREY[600],
    hover: GREY[500_8],
    selected: GREY[500_16],
    disabled: GREY[500_80],
    disabledBackground: GREY[500_24],
    focus: GREY[500_24],
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

export default palette;
