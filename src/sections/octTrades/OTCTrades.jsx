/* eslint-disable react-redux/useSelector-prefer-selectors */
import React from 'react';

import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

import OtcHeader from '../../components/OtcHeader';
import MarketPlaceSection from '../MarketPlace/MarketPlaceSection';
import SwapOffer from './SwapHistory';
import TradesOffer from './TradesOffer';
import Swaps from './Swaps';

export default function OTCTrades() {
  const activeTab = useSelector((state) => state.otcTrades.currentTab);

  const TABS_DATA = [
    {
      title: 'Swaps',
      component: <Swaps />,
      number: 3,
    },
    {
      title: 'Counter Offers',
      component: <TradesOffer />,

      number: 3,
    },
    {
      title: 'Swap History',
      component: <SwapOffer />,
    }
  ];

  return (
    <Box
      sx={{
        width: '100%',
      }}
    >
      <Typography
        sx={{
          fontSize: 20,
        }}
      >
        OTC Trades
      </Typography>

      <OtcHeader />

      {TABS_DATA.map((item) => {
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
