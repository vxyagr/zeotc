import React, { useState } from 'react';

import { Box, Button, IconButton, Typography, Divider } from '@mui/material';

import { Border } from 'components/Style';

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
            <IconButton>
              <Box
                component='img'
                src='/assets/svg/twitter.svg'
                sx={{
                  width: 20,
                }}
              />
            </IconButton>

            <IconButton>
              <Box
                component='img'
                src='/assets/svg/mail.svg'
                sx={{
                  width: 20,
                }}
              />
            </IconButton>

            <IconButton>
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
          <Box
            sx={{
              mt: {
                xs: 3,
                sm: 2,
              },
            }}
          >
            <Typography variant='subtitle2'>Enjoying ZeOTC?</Typography>

            <Typography
              variant='subtitle2'
              sx={{
                background:
                  'linear-gradient(90deg, #C732A6 0%, #460AE4 100%, #460AE4 100%)',
                  WebkitBackgroundClip: 'text',
                webkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textFillColor: 'transparent',
              }}
            >
              Drop it like it’s HOT.
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mt: {
                xs: 3,
                sm: 1,
              },
              background: (theme) => theme.palette.primary.main,
              borderRadius: '15px',
              maxWidth: 200,
              mx: 'auto',
              position: 'relative',
            }}
          >
            <Box
              component='input'
              type='text'
              placeholder='Enter Amount'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              sx={{
                border: 0,
                p: 2,
                fontFamily: 'Poppins',
                outline: 'none',
                background: 'transparent',
                width: 120,
              }}
            />

            <Button
              onClick={handleTip}
              variant='contained'
              sx={{
                background:
                  'linear-gradient(102.47deg, #C732A6 1.43%, #460AE4 98.09%, #460AE4 98.09%)',
                fontSize: 14,
                py: 1.7,
                borderRadius: '15px',
                fontWeight: 400,
              }}
            >
              Tip
            </Button>

            <Box
              sx={{
                height: showTips ? 100 : 0,
                background: '#111111',
                border: showTips ? '0.3px solid #4e4e4eb0' : 'none',
                borderRadius: '12px 12px',
                position: 'absolute',
                bottom: 50,
                left: 0,
                right: 0,
                overflow: 'hidden',
                '& p': {
                  fontSize: '16px',
                  textAlign: 'center',
                  py: 0.5,
                  textTransform: 'uppercase',
                  cursor:'pointer',
                },
              }}
            >
              <Typography onClick={() => handleSelected('USDT')}>
                USDT
              </Typography>

              <Divider />

              <Typography onClick={() => handleSelected('ETH')}>
                ETH
              </Typography>

              <Divider />

              <Typography onClick={() => handleSelected('ZVOID')}>
                ZVOID
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
