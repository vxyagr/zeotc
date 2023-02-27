import React from 'react';

import { Box, IconButton } from '@mui/material';

const SearchSortComponent = ({ searchFunction, sortType, setSortType }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5
      }}
    >
      <Box
        sx={{
          background: (theme) => theme.palette.primary.main,
          display: 'flex',
          borderRadius: '12px',
          alignItems: 'center',
          px: 2,
          py: 0.5,
          maxWidth: 350,
          width: '100%'
        }}
      >
        <Box component='img' src='/assets/svg/search.svg' />

        <Box
          component='input'
          type='text'
          placeholder='Search by name or code'
          onChange={(e) => searchFunction(e.target.value)}
          sx={{
            px: 1,
            maxWidth: {
              xs: '100%',
              sm: '100%'
            },
            width: '100%',
            outline: 'none',
            border: 'none',
            background: 'transparent',
            height: 25,
            fontFamily: 'Poppins',
            '&::placeholder': {
              color: 'grey',
              fontSize: '11px',
              mt: '5px'
            }
          }}
        />
      </Box>

      <IconButton
        onClick={setSortType}
        sx={{
          background: (theme) => theme.palette.primary.main,
          display: 'flex',
          borderRadius: '12px',
          px: 2,
          transform: sortType === 'DESC' ? 'rotate(180deg)' : 'none',
          transition: 'transform 1s'
        }}
      >
        <Box component='img' src='/assets/svg/menu.svg' />
      </IconButton>
    </Box>
  );
};

export default SearchSortComponent;
