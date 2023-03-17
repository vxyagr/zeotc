/* eslint-disable import/no-unresolved */
import { useState } from 'react';
import { Box, Typography } from '@mui/material';

import DashboardHeader from 'components/DashboardHeader';
import Layout from 'layout';
import DashboardSection from 'sections/Dashboard/Dashboard';

export default function Dashboard() {
  const [swapType, setSwapType] = useState('Public');
  return (
    <Layout>
      <Box
        sx={{
          maxWidth: 'lg',
          width: {
            xs: '100%',
            lg: '90%'
          },
          mt: {
            xs: 10,
            md: 0
          }
        }}
      >
        <Typography>Create OTC Trade</Typography>

        <DashboardHeader swapType={swapType} setSwapType={setSwapType} />

        <DashboardSection swapType={swapType} />
      </Box>
    </Layout>
  );
}
