// material
import { GlobalStyles as GlobalThemeStyles } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// ----------------------------------------------------------------------

export default function GlobalStyles() {
  const theme = useTheme();

  return (
    <GlobalThemeStyles
      styles={{
        '*': {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
          color:'#fff',
        },
        html: {
          width: '100%',
          height: '100%',
          WebkitOverflowScrolling: 'touch',
        },
        body: {
          width: '100%',
          height: '100%',
          color:'#fff',
        },
        '#root': {
          width: '100%',
          height: '100%',
          color:'#fff',

        },

      
      }}
    />
  );
}
