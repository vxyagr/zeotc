import React from 'react';

import { Box } from '@mui/material';

import Layout from 'layout';
import SwapTabsSection from 'sections/SwapDetails/SwapTabsSection';

export default function swapOfferDetails() {
  return (
    <Layout>
      <Box
        sx={{
          maxWidth: 'lg',
          width: '100%',
        }}
      >
        <SwapTabsSection />
      </Box>
    </Layout>
  );
}
