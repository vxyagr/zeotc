/* eslint-disable react-redux/useSelector-prefer-selectors */
import React, { useState, useEffect } from 'react';

import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

import OtcHeader from '../../components/OtcHeader';
import SwapOffer from './SwapHistory';
import TradesOffer from './TradesOffer';
import Swaps from './Swaps';

export default function OTCTrades() {
  const activeTab = useSelector((state) => state.otcTrades.currentTab);
  const activeSubMenu = useSelector(
    (state) => state.otcTrades.currentTabSubMenu
  );
  const [searchValues, setSearchValues] = useState(null);
  const [sort, setSort] = useState('ASC');

  const TABS_DATA = [
    {
      title: 'Swaps',
      component: (
        <Swaps
          searchValues={searchValues}
          sort={sort}
          subMenu={activeSubMenu}
        />
      ),
      number: 3
    },
    {
      title: 'Counter Offers',
      component: (
        <TradesOffer
          searchValues={searchValues}
          sort={sort}
          subMenu={activeSubMenu}
        />
      ),

      number: 3
    },
    {
      title: 'Swap History',
      component: <SwapOffer searchValues={searchValues} sort={sort} />
    }
  ];

  return (
    <Box
      sx={{
        width: '100%'
      }}
    >
      <Typography
        sx={{
          fontSize: 20
        }}
      >
        OTC Trades
      </Typography>

      <OtcHeader
        searchFunction={setSearchValues}
        sortType={sort}
        setSortType={() => {
          setSort((curr) => {
            if (curr === 'ASC') {
              return 'DESC';
            }

            return 'ASC';
          });
        }}
      />

      {TABS_DATA.map((item) => {
        if (item.title === activeTab)
          return (
            <Box
              key={item.title}
              sx={{
                mt: 1
              }}
            >
              {item.component}
            </Box>
          );
      })}
    </Box>
  );
}
