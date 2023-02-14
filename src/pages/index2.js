import { useEffect } from 'react';

import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import Layout from 'layout';
import OfferReceived from 'sections/Swap/OfferReceived';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/marketPlace');
  }, [router]);

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
        <Typography>Swap</Typography>

        <OfferReceived />
      </Box>
    </Layout>
  );
}
