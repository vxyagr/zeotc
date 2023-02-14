import * as React from 'react';

import { Box, InputAdornment, TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import SvgIconStyle from './SvgIconStyle';

const optionsCompany = ['Expiration', 'Expiration1', 'Expiration2'];

export default function MSelect() {
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <Box
      sx={{
        background: (theme) => theme.palette.primary.main,
        borderRadius: '12px',
        // overflow: 'hidden',
        pr: 3,
        pl: 1,
        display: 'flex',
        '& input': {
          color: '#fff !important',
          fontSize: 14,
          // '& .MuiPaper-root': {
          //   background: 'red',
          // },
        },
        '& label': {
          color: 'gray',
          alignItems: 'center',
          display: 'flex',
        },
        '& label.Mui-focused': {
          color: 'white',
          mt: 0.5,
          borderBottomColor: 'transparent',
        },
        '& .MuiInput-underline:after': {
          borderBottomColor: 'transparent',
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'transparent',
          },
          '&:hover fieldset': {
            borderColor: 'transparent',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'transparent',
          },
        },
      }}
    >
      {/* <FormControl sx={{
        minWidth: 140,
      }}>
        <InputLabel id="demo-simple-select-autowidth-label" sx={{ color: '#fff' }}>Expiration</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={age}
          onChange={handleChange}
          autoWidth
          label="Expiration"
         
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10} sx={{ width: 140 }}>Twenty </MenuItem>
          <MenuItem value={21}>Forty</MenuItem>
          <MenuItem value={22}>Sixty</MenuItem>
        </Select>
      </FormControl> */}

      <InputLabel
        id='demo-simple-select-autowidth-label'
        sx={{
          color: '#fff',
        }}
      >
        Expiration
      </InputLabel>

      <TextField
        id='demo-simple-select-autowidth'
        fullWidth
        select
        label='Company'
        // value={filterCompany}
        // onChange={onFilterCompany}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SvgIconStyle src='/svg/building.svg' />
            </InputAdornment>
          ),
        }}
        SelectProps={{
          MenuProps: {
            sx: {
              '& .MuiPaper-root': {
                width: 140,
                background: (theme) => theme.palette.info.main,
                ml: -2,
              },
            },
          },
        }}
        sx={{
          width: 120,
          textTransform: 'capitalize',
          display: 'flex',
        }}
      >
        {optionsCompany.map((option) => (
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
