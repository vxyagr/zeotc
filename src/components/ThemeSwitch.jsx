/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable sonarjs/no-all-duplicated-branches */
import { useState } from 'react';

import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
// import { useDispatch } from 'react-redux';

export default function DarkModeSwitch({ isDark: isDarkMode, }) {
  const [isDark, setIsDark] = useState(isDarkMode);
  let style;

const MaterialUISwitch = styled(Switch)(({ theme, }) => ({
    width: 98,
    height: '100%',
    padding: 0,
    borderRadius: 22,
    background: '#363636',
    '& .MuiSwitch-switchBase': {
      margin: 0,
      marginTop: 0,
      padding: 0,

      transform: 'translateX(4px)',
      '&.Mui-checked': {
        transform: 'translateX(53px)',
        '& .MuiSwitch-thumb:before': {
          width: 45,
          height: 45,
          borderRadius: '50%',
          // backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          //    '#fff',
          // )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
          backgroundImage: isDark
            ? 'url(/assets/svg/Dark.svg), linear-gradient(90deg, #C732A6 0%, #460AE4 100%, #460AE4 100%)'
            : 'url(/assets/svg/Dark.svg), linear-gradient(90deg, #C732A6 0%, #460AE4 100%, #460AE4 100%)',
          [theme.breakpoints.down('md')]: {
            backgroundImage: 'url(/public/assets/svg/Dark.svg)',
          },

          zIndex: 9,
        },
        '&+ .MuiSwitch-track': {
          opacity: 1,
          // backgroundColor:
          //    theme.palette.mode === 'dark' ? '#fff' : '#fff',
          ...style,
          paddingLeft: '20px',
          background: isDark
            ? 'url(/assets/svg/lightModeIcon.svg)'
            : 'url(/assets/svg/lightModeIcon.svg)',
          [theme.breakpoints.down('md')]: {
            background: isDark
              ? 'url(/assets/svg/lightModeIcon.svg)'
              : 'url(/assets/svg/lightModeIcon.svg)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '10% center',
          },
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '18%',
          backgroundSize: 'auto',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      background: '#C732A6',

      // backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
      ...style,
      width: 45,
      height: 45,
      marginLeft: -2,
      '&:before': {
        content: '\'\'',
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        borderRadius: '50%',
        overflow: 'hidden',
        // backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        //   '#fff',
        // )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        backgroundImage: isDark
          ? 'url(/assets/svg/lightModeIcon.svg ),linear-gradient(90deg, #C732A6 0%, #460AE4 100%, #460AE4 100%)'
          : 'url(/assets/svg/lightModeIcon.svg), linear-gradient(90deg, #C732A6 0%, #460AE4 100%, #460AE4 100%)',
        // border:'2px solid red',
        [theme.breakpoints.down('md')]: {
          backgroundImage: 'url(/assets/svg/lightModeIcon.svg)',
        },
      },
    },
    '& .MuiSwitch-track': {
      opacity: 1,
      ...style,
      background: isDark
        ? 'url(/assets/svg/Dark.svg/), #363636'
        : 'url(/assets/svg/Dark.svg),  #363636',
      [theme.breakpoints.down('md')]: {
        background: isDark
          ? 'url(/assets/svg/Dark.svg), #363636 '
          : 'url(/assets/svg/Dark.svg), #363636',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '84% 45%',
      },
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '84% 45%',
      paddingTop: '20px',
      // backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      borderRadius: '22.5653px',
      //  padding: '20px ',
      height: 44,
    },
  }));

  const switchHandler = (event) => {
    // THIS IS THE SOLUTION - use event.target.checked to get value of switch
    setIsDark(event.target.checked);
    // dispatch(changeAppTheme(event.target.checked));
  };

  return (
    <FormControlLabel
      control={(
        <MaterialUISwitch
          // checked={isDark}
          checked
          onChange={switchHandler}
          sx={{
            m: 1,
          }}
        />
      )}
    />
  );
}
