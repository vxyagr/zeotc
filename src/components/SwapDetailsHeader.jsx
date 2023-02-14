/* eslint-disable react-redux/useSelector-prefer-selectors */
import React, { useState } from 'react';

import { Box, Button, IconButton, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { tradesSwapTabs } from 'redux/slice/otcTrades';

const SWAP_DETAILS_TABS_DATA = [
  {
    title: 'My OTC Trades',
  },
  {
    title: 'Received Offers',
    number: 3,
  }
];

export default function SwapDetailsHeader() {
  const dispatch = useDispatch();

  const activeButton = useSelector((state) => state.otcTrades.swapTab);

  const [age, setAge] = React.useState('');
  const [searchInput, setSearchInput] = useState();

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <Box>
      <Typography
        sx={{
          px: 2,
          borderRadius: 2,
          textTransform: 'capitalize',
          color: '#fff',
        }}
      >
        Dashboard
      </Typography>

      <Box
        sx={{
          display: {
            xs: 'block',
            lg: 'flex',
          },
          width: '100%',
          mt: 2,
        }}
      >
        <Box
          sx={{
            display: {
              xs: 'block',
              sm: 'flex',
            },
            width: '100%',
          }}
        >
          <Box
            sx={{
              background: (theme) => theme.palette.primary.main,
              borderRadius: '12px',
              // maxWidth: {xs:'100%', sm:317},
              width: {
                xs: '100%',
                lg: '90%',
              },
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              },
              my: {
                xs: 2,
                sm: 0,
              },
            }}
          >
            {SWAP_DETAILS_TABS_DATA.map((tab) => (
              <Box
                key={tab.title}
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  width: '100%',
                  minHeight: 48,
                }}
              >
                <Button
                  onClick={() => dispatch(tradesSwapTabs(tab.title))}
                  sx={{
                    width: activeButton === tab.title ? '99%' : '100%',
                    border: '1px solid transparent',
                    position: 'absolute',
                    color: '#fff',
                    top: 0,
                    bottom: 0,
                    borderRadius: activeButton === tab.title && '10.19px',
                    background: activeButton === tab.title && '#000',

                    '&:after': {
                      position: 'absolute',
                      top: -2,
                      left: -2,
                      right: activeButton === tab.title && -2,
                      bottom: -2,
                      background:
                        activeButton === tab.title
                          ? 'linear-gradient(90deg, #C732A6 0%, #460AE4 100%, #460AE4 100%)'
                          : (theme) => theme.palette.primary.main,
                      content: '""',
                      zIndex: -1,
                      borderRadius: activeButton === tab.title && '10.19px',
                    },
                  }}
                >
                  {tab.title}

                  <Box
                    sx={{
                      background: '#1E1E1E',
                      borderRadius: 5,
                      ml: 2,
                      width: 20,
                    }}
                  >
                    {tab.number}
                  </Box>
                </Button>
              </Box>
            ))}
          </Box>
        </Box>

        {/* <MSelect /> */}
      </Box>

      <Box
        sx={{
          // display: activeButton === 'My OTC Trades' ? 'flex' : 'none',
          display: 'flex',
          justifyContent: 'start',
          alignItems: 'center',
          gap: 2,
          my: 3,
        }}
      >
        <Typography
          variant='subtitle1'
          // component={Link}
          // href='/swapOfferDetails'
          sx={{
            background: (theme) => theme.palette.primary.main,
            px: 2,
            py: 1,
            borderRadius: 2,
            textTransform: 'capitalize',
            cursor: 'pointer',
          }}
        >
          pending received counter offers
        </Typography>

        <Typography
          sx={{
            px: 2,
            py: 1,
            borderRadius: 2,
            textTransform: 'capitalize',
          }}
        >
          pending sent counter offers
        </Typography>
      </Box>

      <Box
        sx={{
          display: activeButton === 'My OTC Trades' ? 'flex' : 'none',
          gap: 1.5,
          mr: {
            lg: 7,
          },
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
            maxWidth: 400,
            width: '100%',
          }}
        >
          <Box
            component='img'
            src='/assets/svg/Search.svg'
          />

          <Box
            component='input'
            type='text'
            placeholder='Search by asset address, asset name'
            onChange={(e) => setSearchInput(e.target.value)}
            sx={{
              px: 3,
              maxWidth: {
                xs: '100%',
                sm: '100%',
              },
              width: '100%',
              outline: 'none',
              border: 'none',
              background: 'transparent',
              height: 46,
              fontFamily: 'Poppins',
            }}
          />
        </Box>

        <IconButton
          sx={{
            background: (theme) => theme.palette.primary.main,
            display: 'flex',
            borderRadius: '12px',
            px: 2,
          }}
        >
          <Box
            component='img'
            src='/assets/svg/menu.svg'
          />
        </IconButton>
      </Box>
    </Box>
  );
}
