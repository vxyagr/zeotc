import React from 'react';

import { Box } from '@mui/material';

import Layout from 'layout';
import OTCTrades from 'sections/octTrades/OTCTrades';

export default function myOtcTrades() {
  return (
    <Layout>
      <Box
        sx={{
          maxWidth: 'lg',
          width: '100%',
        }}
      >
        <OTCTrades />
      </Box>
    </Layout>
  );
}
