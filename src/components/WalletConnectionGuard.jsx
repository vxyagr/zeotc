import React from 'react';

import { Box, Typography } from '@mui/material';
import { useAccount } from 'wagmi';

import { Border } from 'components/Style';
import Layout from 'layout';

const WalletConnectionGuard = ({ children }) => {
  const { isConnected } = useAccount();

  return isConnected ? (
    children
  ) : (
    <Layout>
      <Box
        sx={{
          maxWidth: 'lg',
          width: '100%'
        }}
      >
        <Box
          sx={{
            width: '100%',
            minHeight: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center'
          }}
        >
          <Box
            sx={{
              ...Border,
              p: 3,
              maxWidth: 'md',
              borderRadius: 3,
              mt: 7,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '40%'
            }}
          >
            <Box
              component='img'
              src='/assets/svg/disconnect-12.svg'
              sx={{
                width: 70,
                height: 70
              }}
            />

            <Typography>
              <br />
              No Wallet Connection
            </Typography>

            <Typography
              sx={{
                fontSize: 13,
                color: '#A3A3A3'
              }}
            >
              Please connect wallet before continue.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default WalletConnectionGuard;
