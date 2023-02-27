import * as React from 'react';

import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import DarkModeSwitch from 'components/ThemeSwitch';
import WalletConnectButton from 'components/WalletConnectButton';

import { MAPPING_CHAIN } from '../constant';

export default function Navbar({ handleDrawerOpen }) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        px: {
          xs: 0,
          md: 4,
          lg: 6
        }
      }}
    >
      <AppBar
        // position='static'

        sx={{
          background: '#000',
          border: 'none',
          boxShadow: 0,
          pt: 2,
          pb: 1
        }}
      >
        <Toolbar
          sx={{
            boxShadow: 0,
            border: 'none'
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              alignItems: 'center'
            }}
          >
            <Box
              component='img'
              src='/assets/images/Logo.png'
              sx={{
                width: {
                  xs: 110,
                  md: 200
                },
                height: {
                  xs: 30,
                  md: 'auto'
                }
              }}
            />
          </Box>

          <Box
            sx={{
              display: {
                xs: 'none',
                md: 'flex'
              },
              alignItems: 'center'
            }}
          >
            {/* <OutlineSelect /> */}

            <Box
              sx={{
                display: 'flex',
                background: (theme) => theme.palette.info.main,
                alignItems: 'center',
                gap: 2,
                // px: 3,
                // bgcolor:'red',
                px: 1,
                py: 1.5,
                mx: 1,
                ml: 2,
                borderRadius: '12px'
              }}
            >
              <Box
                component='img'
                src='/assets/images/ethereum.png'
                sx={{
                  width: 30
                }}
              />

              <Typography>
                {MAPPING_CHAIN[process.env.NEXT_PUBLIC_CHAIN]}
              </Typography>
            </Box>

            {/* </Box> */}
          </Box>

          <WalletConnectButton />

          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            // edge="start"
            sx={{
              display: {
                xs: 'block',
                md: 'none'
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
