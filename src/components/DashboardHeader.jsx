import React, { useState } from 'react';

import { Box, Button, TextField } from '@mui/material';
import { useDispatch } from 'react-redux';

import { privateInput } from 'redux/slice/web3';

export default function DashboardHeader() {
  const dispatch = useDispatch();
  const [activeButton, setActiveButton] = useState('Public');
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event);
    dispatch(privateInput(event));
  };

  return (
    <Box
      sx={{
        display: {
          xs: 'block',
          lg: 'flex'
        },
        width: '100%',
        mt: 2
      }}
    >
      <Box
        sx={{
          display: {
            xs: 'block',
            sm: 'flex'
          },
          width: '100%'
        }}
      >
        <Box
          sx={{
            background: (theme) => theme.palette.primary.main,
            borderRadius: '12px',
            maxWidth: {
              xs: '100%',
              sm: 317
            },
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            my: {
              xs: 2,
              sm: 0
            }
          }}
        >
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              // display:'flex',
              mx: 'auto'
              // gridTemplateColumns:'repeat(1, 1fr)',
              // justifyContent:'center'
            }}
          >
            <Button
              onClick={() => setActiveButton('Public')}
              sx={{
                px: 2,
                py: 1,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                alignItems: 'center',
                // background: 'linear-gradient(180deg, #0F0F0F 0%, rgba(15, 15, 15, 0) 100%)',
                background: activeButton === 'Public' && '#000',
                border: '2px solid transparent',
                position: 'relative',
                color: '#fff',
                borderRadius: '12px',

                // mx: 'auto',
                // right: { xs: '10%', md: '45%' },
                // left: { xs: '10%', md: '45%' },

                '&:after': {
                  position: 'absolute',
                  top: -3,
                  left: -3,
                  right: -3,
                  bottom: -3,
                  background:
                    activeButton === 'Public' &&
                    'linear-gradient(90deg, #C732A6 0%, #460AE4 100%, #460AE4 100%)',
                  content: '""',
                  zIndex: -1,
                  borderRadius: '12px'
                }
              }}
            >
              <Box component='img' src='/assets/svg/global.svg' />
              Public
            </Button>
          </Box>

          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              // display:'flex',
              mx: 'auto'
              // gridTemplateColumns:'repeat(1, 1fr)',
              // justifyContent:'center'
            }}
          >
            <Button
              onClick={() => setActiveButton('Private')}
              sx={{
                px: 2,
                py: 1,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                alignItems: 'center',
                // background: 'linear-gradient(180deg, #0F0F0F 0%, rgba(15, 15, 15, 0) 100%)',
                background: activeButton === 'Private' && '#000',
                border: '2px solid transparent',
                position: 'relative',
                color: '#fff',
                borderRadius: '12px',

                // mx: 'auto',
                // right: { xs: '10%', md: '45%' },
                // left: { xs: '10%', md: '45%' },

                '&:after': {
                  position: 'absolute',
                  top: -3,
                  left: -3,
                  right: -3,
                  bottom: -3,
                  background:
                    activeButton === 'Private' &&
                    'linear-gradient(90deg, #C732A6 0%, #460AE4 100%, #460AE4 100%)',
                  content: '""',
                  zIndex: -1,
                  borderRadius: '12px'
                }
              }}
            >
              <Box component='img' src='/assets/svg/lock.svg' />
              Private
            </Button>
          </Box>
        </Box>

        {activeButton === 'Private' && (
          <Box
            component='input'
            type='text'
            placeholder='Enter Receiver address'
            onChange={(e) => handleChange(e.target.value)}
            sx={{
              background: (theme) => theme.palette.primary.main,
              px: 3,
              maxWidth: {
                xs: '100%',
                sm: 260
              },
              width: '100%',
              outline: 'none',
              border: 'none',
              borderRadius: '12px',
              ml: {
                sm: 3
              },
              height: 46,
              fontFamily: 'Poppins'
            }}
          />
        )}
      </Box>
    </Box>
  );
}
