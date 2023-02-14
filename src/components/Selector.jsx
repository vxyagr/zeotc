import * as React from 'react';

import { InputAdornment, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import SvgIconStyle from './SvgIconStyle';

const optionsCompany = ['Ethereum', 'Bitcoin'];

export default function BasicSelect() {
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <Box
      sx={{
        minWidth: 120,
        '& input': {
          color: '#fff !important',
          width: '100%',
        },
        '& label': {
          color: '#fff',
          alignItems: 'center',
          display: 'flex',
        },
        '& label.Mui-focused': {
          color: 'white',
          borderBottomColor: '#fff',
        },
        '& .MuiInput-underline:after': {
          borderBottomColor: '#fff',
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'white',
          },
          '&:hover fieldset': {
            borderColor: 'white',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#fff',
          },
        },
      }}
    >
      <TextField
        fullWidth
        select
        // label='Company'
        defaultValue='Ethereum'
        // value={filterCompany}
        // onChange={onFilterCompany}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              {/* <SvgIconStyle src={'/svg/building.svg'} /> */}

              <Box
                component='img'
                src='/assets/images/etherum.png'
                sx={{
 width: 30, 
}}
              />
            </InputAdornment>
          ),
        }}
        SelectProps={{
          MenuProps: {
            sx: {
              '& .MuiPaper-root': {
                maxHeight: 260,
                maxWidth: 260,
                ml: -2,
              },
            },
          },
        }}
        sx={{
          maxWidth: 240,
          width: '100%',
          textTransform: 'capitalize',
          '& input': {
            border: 0,
            outline: '0px',
          },
        }}
      >
        {optionsCompany?.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
