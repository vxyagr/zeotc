import { ReactNode, useMemo } from 'react';

import { CssBaseline } from '@mui/material';
import {
  createTheme,
  ThemeProvider as MUIThemeProvider
} from '@mui/material/styles';

import breakpoints from './breakpoints';
import palette from './palette';
import shadows, { customShadows } from './shadows';
import typography from './typography';
// ----------------------------------------------------------------------

export default function ThemeProvider({ children, }) {
  const themeOptions = useMemo(
    () => ({
      palette,
      typography,
      breakpoints,
      shape: {
        borderRadius: 5,
      },
      shadows,
      customShadows,
    }),
    []
  );

  const theme = createTheme(themeOptions);
  // theme.components = componentsOverride(theme);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />

      {children}
    </MUIThemeProvider>
  );
}
