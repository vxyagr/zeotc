function pxToRem(value) {
  return `${value / 16}rem`;
}

function responsiveFontSizes({ sm, md, lg, }) {
  return {
    '@media (min-width:600px)': {
      fontSize: pxToRem(sm),
    },
    '@media (min-width:900px)': {
      fontSize: pxToRem(md),
    },
    '@media (min-width:1200px)': {
      fontSize: pxToRem(lg),
    },
  };
}

const FONT_PRIMARY = '\'Poppins\', sans-serif';
const FONT_SECONDARY = '\'Poppins\', sans-serif';

const typography = {
  fontFamily: FONT_PRIMARY,
  fontWeightRegular: 400,
  fontWeightMedium: 600,
  fontWeightBold: 700,
  background: '#1d1d1d',
  h1: {
    fontWeight: 900,
    lineHeight: 80 / 64,
    fontSize: pxToRem(36),
    ...responsiveFontSizes({
      sm: 70,
      md: 70,
      lg: 89,
    }),
  },
  h2: {
    fontFamily: FONT_SECONDARY,
    fontWeight: 700,
    lineHeight: 40 / 48,
    fontSize: pxToRem(32),
    ...responsiveFontSizes({
      sm: 45,
      md: 65,
      lg: 73,
    }),
  },
  h3: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: 20,
    ...responsiveFontSizes({
      sm: 20,
      md: 30,
      lg: 32,
    }),
  },
  h4: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(20),
    ...responsiveFontSizes({
      sm: 20,
      md: 24,
      lg: 28,
    }),
  },
  h5: {
    fontWeight: 100,
    lineHeight: 1.5,
    fontSize: pxToRem(20),
    ...responsiveFontSizes({
      sm: 20,
      md: 20,
      lg: 20,
    }),
  },
  h6: {
    fontWeight: 700,
    lineHeight: 28 / 18,
    fontSize: pxToRem(14),
    ...responsiveFontSizes({
      sm: 14,
      md: 14,
      lg: 14,
    }),
  },
  subtitle1: {
    fontWeight: 400,
    lineHeight: 1.5,
    fontSize: pxToRem(16),
    ...responsiveFontSizes({
      sm: 14,
      md: 14,
      lg: 14,
    }),
  },
  subtitle2: {
    fontWeight: 600,
    lineHeight: 22 / 14,
    fontSize: pxToRem(13),
  },
  body1: {
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  body2: {
    lineHeight: 22 / 14,
    fontSize: pxToRem(12),
  },
  caption: {
    lineHeight: 1.5,
    fontSize: pxToRem(12),
  },
  overline: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  button: {
    fontWeight: 400,
    lineHeight: 24 / 14,
    fontSize: pxToRem(14),
    textTransform: 'capitalize',
    fontFamily: FONT_SECONDARY,
    color: '#fff',
  },
};

export default typography;
