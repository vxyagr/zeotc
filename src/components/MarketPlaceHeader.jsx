import React, { useState } from 'react';

import { Box, IconButton, Typography } from '@mui/material';
import { useRouter } from 'next/router';

export default function MarketPlaceHeader({
  handleSearch,
  sortType,
  setSortType
}) {
  const router = useRouter();

  const handleCreateOffer = () => {
    router.push('/dashboard');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: {
          xs: '100%',
          lg: '88%'
        },
        mx: {
          md: 'auto'
        }
      }}
    >
      <Box
        sx={{
          background:
            'linear-gradient(90deg, #C732A6 10%, #460AE4 100%, #C732A6 0%)',
          borderRadius: 2,
          maxWidth: 214,
          width: '100%',
          border: '2px dashed #000',
          backgroundSize: '110% 110%',
          flexGrow: 1
          // backgroundRepeat: 'no-repeat',
          // backgroundPosition: 'center',
        }}
      >
        <Box
          onClick={handleCreateOffer}
          sx={{
            // border:'2px solid transparent',
            backgroundColor: '#000',
            position: 'relative',
            color: '#fff',
            mx: 'auto',
            py: 1.5,
            textAlign: 'center',
            borderRadius: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <Box component='img' src='/assets/svg/Otc.svg' />

          <Typography
            sx={{
              fontSize: 11,
              ml: 1
            }}
          >
            Create OTC Trade{' '}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          mr: {
            lg: 7
          }
        }}
      >
        <Box
          sx={{
            background: (theme) => theme.palette.primary.main,
            display: {
              xs: 'none',
              md: 'flex'
            },
            borderRadius: '12px',
            alignItems: 'center',
            px: 2,
            py: 0.5
          }}
        >
          <Box component='img' src='/assets/svg/search.svg' />

          <Box
            component='input'
            type='text'
            placeholder='aSearch by asset name or swap ida'
            onChange={(e) => handleSearch(e.target.value)}
            sx={{
              px: 3,
              maxWidth: {
                xs: '100%',
                sm: 260
              },
              width: '100%',
              outline: 'none',
              border: 'none',
              background: 'transparent',
              height: 46,
              fontFamily: 'Poppins'
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
            py: 2,
            transform: sortType === 'DESC' ? 'rotate(180deg)' : 'none',
            transition: 'transform 1s'
          }}
        >
          <Box component='img' src='/assets/svg/menu.svg' />
        </IconButton>
      </Box>
    </Box>
  );
}
