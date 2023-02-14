import React from 'react';

import { Box, Typography } from '@mui/material';

import Layout from 'layout';
import OfferReceived from 'sections/Swap/OfferReceived';

export default function MarketPlaceSwaping() {
  return (
    <Layout>
      <Box
        sx={{
          maxWidth: 1300,
          width: {
            xs: '100%',
            lg: '90%',
          },
          mt: {
            xs: 10,
            md: 0,
          },
        }}
      >
        <Typography>Counter Offer</Typography>

        <OfferReceived />
      </Box>
    </Layout>
  );
}
