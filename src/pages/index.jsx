import React from 'react';

import { Box } from '@mui/material';

import Layout from 'layout';
import MainMarketPlaceSection from 'sections/MarketPlace/MainMarketPlaceSection';

export default function marketPlace() {
  return (
    <Layout>
      <Box
        sx={{
          maxWidth: 'lg',
          width: '100%',
        }}
      >
        <MainMarketPlaceSection />
      </Box>
    </Layout>
  );
}
