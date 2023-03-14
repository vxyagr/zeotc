import React from 'react';

import { Box, Typography } from '@mui/material';

const LoadingAmount = ({ amount, isLoading }) => {
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Box
          component='img'
          src='/assets/svg/small-loading.svg'
          sx={{
            width: 18,
            height: 18
          }}
        />
      </Box>
    );
  }

  return (
    <Typography
      sx={{
        px: 2,
        fontSize: 14
      }}
    >
      {!isNaN(amount) ? parseInt(amount).toFixed(2) : amount} USDC
    </Typography>
  );
};

export default LoadingAmount;
