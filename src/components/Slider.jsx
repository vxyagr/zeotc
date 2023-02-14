/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable sonarjs/no-all-duplicated-branches */
import * as React from 'react';

import Box from '@mui/material/Box';
import Slider, { SliderThumb } from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';

function ValueLabelComponent(props) {
  const { children, value, } = props;

  return (
    <Tooltip
      enterTouchDelay={0}
      placement='top'
      title={value}
    >
      {children}
    </Tooltip>
  );
}

const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const marks = [
  {
    value: 10,
    label: '1',
  },
  {
    value: 20,
    label: '2',
  },
  {
    value: 30,
    label: '3',
  },
  {
    value: 40,
    label: '4',
  },
  {
    value: 50,
    label: '5',
  },
  {
    value: 60,
    label: '6',
  },
  {
    value: 70,
    label: '7',
  },
  {
    value: 80,
    label: '8',
  },
  {
    value: 90,
    label: '9',
  },
  {
    value: 100,
    label: '10',
  }
];

const IOSSlider = styled(Slider)(({ theme, }) => ({
  color: theme.palette.mode === 'dark' ? '#3880ff' : '#3880ff',
  height: 2,
  padding: '15px 0',

  '& .MuiSlider-thumb': {
    height: 32,
    width: 32,

    background:
      'linear-gradient(90deg, #C732A6 0%, #460AE4 100%, #460AE4 100%)',
    backgroundSize: '150% 150%',
    backgroundRepeatX: 'no-repeat',
    backgroundPosition: 'center',
    borderRadius: '50%',
    position: 'relative',
    border: '2px solid transparent',

    // zIndex: 0,
    // backgroundSize:'80%',
    boxShadow: iOSBoxShadow,
    '&:before': {
      position: 'absolute',
      background: ' #000',

      content: '""',
      zIndex: -1,
      borderRadius: '50%',
    },
    // '&.MuiSlider-thumb:before':{
    //   padding:10,
    //   background:'#000',
    //   borderImage: 'linear-gradient(90deg, #C732A6 0%, #460AE4 100%, #460AE4 100%)',
    //   borderWidth: '3px',
    //   borderStyle: 'solid',
    //   borderImageSlice: 1,
    // },

    '&:focus, &:hover, &.Mui-active': {
      boxShadow:
        '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      background:
        'linear-gradient(90deg, #C732A6 0%, #460AE4 100%, #460AE4 100%)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: iOSBoxShadow,
      },
    },
  },
  '& .MuiSlider-markLabel': {
    color: 'rgba(139, 139, 139, 1)',
  },
  '& .MuiSlider-valueLabel': {
    fontSize: 12,
    fontWeight: 'normal',
    top: -6,
    backgroundColor: 'unset',
    color: theme.palette.text.primary,
    '&:before': {
      display: 'none',
    },
    '& *': {
      background: 'transparent',
      color: theme.palette.mode === 'dark' ? 'orange' : '#fff',
    },
  },
  '& .MuiSlider-track': {
    border: 'none',
    background:
      'linear-gradient(90deg, #C732A6 0%, #460AE4 100%, #460AE4 100%)',
    height: 8,
    color: 'rgba(139, 139, 139, 1)',
  },
  '& .MuiSlider-rail': {
    opacity: 0.5,
    backgroundColor: '#141414',
    height: 8,
  },

  '& .MuiSlider-mark': {
    backgroundColor: '#474747',
    height: 8,
    width: 2,
    marginTop: 8,
    '&.MuiSlider-markActive': {
      opacity: 1,
      backgroundColor: '#474747',
    },
  },
}));

function AirbnbThumbComponent(props) {
  const { children, ...other } = props;

  return (
    <SliderThumb {...other}>
      {children}

      <span className='airbnb-bar' />

      <span className='airbnb-bar' />

      <span className='airbnb-bar' />
    </SliderThumb>
  );
}

function valuetext(value) {
  return `${value}°C`;
}

export default function CustomizedSlider() {
  return (
    <Box
      sx={{
        maxWidth: 300,
      }}
    >
      <IOSSlider
        // aria-label="ios slider"
        // defaultValue={60}
        // marks={marks}
        // valueLabelDisplay="on"
        // // valueLabelFormat={marks.value}
        // getAriaValueText={valuetext}
        aria-label='Always visible'
        defaultValue={80}
        getAriaValueText={valuetext}
        step={10}
        marks={marks}
        // valueLabelDisplay="on"
      />
    </Box>
  );
}
