import React from 'react';

import { Box } from '@mui/material';

import Layout from 'layout';
import MyAssets from 'sections/MyAssets/MyAssets';

export default function myAssets() {
  return (
    <Layout>
      <Box
        sx={{
          maxWidth: 'lg',
          width: '100%',
        }}
      >
        <MyAssets />
      </Box>
    </Layout>
  );
}
