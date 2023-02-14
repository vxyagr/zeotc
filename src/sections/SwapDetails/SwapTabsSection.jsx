/* eslint-disable react-redux/useSelector-prefer-selectors */
import React from 'react';

import { Box } from '@mui/material';
import { useSelector } from 'react-redux';

import SwapDetailsHeader from 'components/SwapDetailsHeader';

import SwapDetailsReceivedOffer from './SwapDetailsReceivedOffer';
import SwapOtcTrades from './SwapOtcTrades';

const SWAP_DETAILS_TABS_DATA = [
  {
    title: 'My OTC Trades',
    component: <SwapOtcTrades />,
  },
  {
    title: 'Received Offers',
    component: <SwapDetailsReceivedOffer />,
    number: 3,
  }
];

export default function SwapTabsSection() {
  const activeTab = useSelector((state) => state.otcTrades.swapTab);

  return (
    <Box>
      <SwapDetailsHeader />

      {SWAP_DETAILS_TABS_DATA?.map((item) => {
        if (item.title === activeTab)
          return (
            <Box
              key={item.title}
              sx={{
                mt: 1,
              }}
            >
              {item.component}
            </Box>
          );
      })}
    </Box>
  );
}
