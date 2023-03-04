import React, { useState } from 'react';

import { Box, Button, IconButton, Typography, Divider } from '@mui/material';

import { Border } from 'components/Style';
import Link from 'next/link';

export default function Footer() {
  const [showTips, setShowTips] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleTip = () => {
    setShowTips(!showTips);
  };
  const handleSelected = (value) => {
    setInputValue(value);
    setShowTips(!showTips);
  };

  return (
    <Box
      sx={{
        mt: {
          xs: 5,
          md: 0,
        },
        zIndex: 11,
      }}
    >
      <Box
        sx={{
          display: {
            xs: 'block',
            sm: 'flex',
          },
          justifyContent: {
            xs: 'center',
            sm: 'space-between',
          },
          alignItems: 'center',
          textAlign: {
            xs: 'center',
            sm: 'left',
          },
          background: (theme) => theme.palette.primary.main,
          py: {
            xs: 4,
            sm: 2,
          },
          px: 3,
          borderRadius: '17px',
          ...Border,
        }}
      >
        <Box
          sx={{
            width: {
              xs: '100%',
              sm: 'fit-content',
            },
          }}
        >
          <Typography
            variant='subtitle2'
            sx={{
              ml: 1,
            }}
          >
            Find us on:
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              mt: {
                xs: 3,
                sm: 1,
              },
            }}
          >
            <IconButton component={Link } target='_blank' href="https://twitter.com/ZeVoidOfficial">
              <Box
                
                component='img'
                src='/assets/svg/twitter.svg'
                sx={{
                  width: 20,
                }}
              />
            </IconButton>

            <IconButton component={Link } target='_blank' href="https://zevoid.medium.com/">
              <Box
                
                component='img'
                src='/assets/svg/mail.svg'
                sx={{
                  width: 20,
                }}
              />
            </IconButton>

            <IconButton component={Link } target='_blank' href="https://t.me/ZeVoidEntry">
              <Box
                
                component='img'
                src='/assets/svg/telegram.svg'
                sx={{
                  width: 25,
                }}
              />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            display: {
              xs: 'block',
              sm: 'flex',
            },
            alignItems: 'center',
            gap: 2,
            justifyContent: 'space-between',
          }}
        >
          {/*tip goes here*/}
        </Box>
      </Box>
    </Box>
  );
}
