/* eslint-disable react-redux/useSelector-prefer-selectors */
import React, { useState } from 'react';

import { Box, Button, IconButton, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import {
  useQueriesFilterMarketPlaceData,
  useQueriesGetSwap,
  useQueriesGetSwapHistory,
  useQueryCounterOfferIdList,
  useQueryMyZeSwapId,
  useQueryOfferId,
} from 'hooks/react-query/queries';
import { tradesTabs } from 'redux/slice/otcTrades';

const TABS_DATA = [
  {
    title: 'Swaps',
    number: 2,
  },
  {
    title: 'Counter Offers',
    number: 3,
  },
  {
    title: 'Swap History',
  },
];
export default function OtcHeader() {
  const dispatch = useDispatch();

  const activeButton = useSelector((state) => state.otcTrades.currentTab);

  const [age, setAge] = React.useState('');
  const { data: counterOfferIdList } = useQueryCounterOfferIdList();

  const offerId = useQueriesFilterMarketPlaceData(counterOfferIdList, true);

  const [searchInput, setSearchInput] = useState();

  const { data: zeSwapIdsList } = useQueryMyZeSwapId();

  // const { data: offerIdList, } = useQueryOfferId();

  const newZeSwapList = useQueriesGetSwapHistory(zeSwapIdsList, true);
  // const newZeSwapList = useQueriesFilterMarketPlaceData(zeSwapIdsList, true);
  const ZeSwap = useQueriesGetSwap(zeSwapIdsList, false);
  // const ZeSwap = '';
  // const newZeSwapList = '';
  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <Box>
      <Box
        sx={{
          display: {
            xs: 'block',
            lg: 'flex',
          },
          width: '100%',
          mt: 2,
        }}
      >
        <Box
          sx={{
            display: {
              xs: 'block',
              sm: 'flex',
            },
            width: '100%',
          }}
        >
          <Box
            sx={{
              background: (theme) => theme.palette.primary.main,
              borderRadius: '12px',
              // maxWidth: {xs:'100%', sm:317},
              width: '100%',
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              },
              my: {
                xs: 2,
                sm: 0,
              },
            }}
          >
            {TABS_DATA.map((tab, idx) => (
              <Box
                key={tab.title}
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  width: '100%',
                  minHeight: 48,
                }}
              >
                <Button
                  onClick={() => dispatch(tradesTabs(tab.title))}
                  sx={{
                    width: activeButton === tab.title ? '99%' : '100%',
                    border: '1px solid transparent',
                    position: 'absolute',
                    color: '#fff',
                    top: 0,
                    bottom: 0,
                    borderRadius: activeButton === tab.title && '10.19px',
                    background: activeButton === tab.title && '#000',

                    '&:after': {
                      position: 'absolute',
                      top: -2,
                      left: -2,
                      right: activeButton === tab.title && -2,
                      bottom: -2,
                      background:
                        activeButton === tab.title
                          ? 'linear-gradient(90deg, #C732A6 0%, #460AE4 100%, #460AE4 100%)'
                          : (theme) => theme.palette.primary.main,
                      content: '""',
                      zIndex: -1,
                      borderRadius: activeButton === tab.title && '10.19px',
                    },
                  }}
                >
                  {tab.title}

                  <Box
                    sx={{
                      background: '#1E1E1E',
                      borderRadius: 5,
                      ml: 2,
                      width: 20,
                    }}
                  >
                    {idx === 0 && ZeSwap?.length !== 0 && ZeSwap?.length}

                    {idx === 1 && offerId?.length !== 0 && offerId?.length}

                    {idx === 2 &&
                      newZeSwapList?.length !== 0 &&
                      newZeSwapList?.length}
                  </Box>
                </Button>
              </Box>
            ))}
          </Box>
        </Box>

        {/* <MSelect /> */}
      </Box>

      {activeButton !== 'Swap History' && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
            gap: 2,
            mt: 3,
          }}
        >
          <Typography
            variant='subtitle1'
            // component={Link}
            // href='/swapOfferDetails'
            sx={{
              background: (theme) => theme.palette.primary.main,
              px: 2,
              py: 1,
              borderRadius: 2,
              textTransform: 'capitalize',
              cursor: 'pointer',
            }}
          >
            {/* pending received swap confirmations */}

            {activeButton !== 'Swaps'
              ? 'pending received counter offers'
              : 'pending received swap confirmations'}
          </Typography>

          <Typography
            sx={{
              px: 2,
              py: 1,
              borderRadius: 2,
              textTransform: 'capitalize',
              color: 'gray',
            }}
          >
            {activeButton !== 'Swaps'
              ? 'pending sent counter offers'
              : 'pending sent swap confirmations'}
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          mr: {
            lg: 7,
          },
          mt: 3,
        }}
      >
        <Box
          sx={{
            background: (theme) => theme.palette.primary.main,
            display: 'flex',
            borderRadius: '12px',
            alignItems: 'center',
            px: 2,
            py: 0.5,
            maxWidth: 400,
            width: '100%',
          }}
        >
          <Box component='img' src='/assets/svg/search.svg' />

          <Box
            component='input'
            type='text'
            placeholder='Search by asset address, asset name'
            onChange={(e) => setSearchInput(e.target.value)}
            sx={{
              px: 3,
              maxWidth: {
                xs: '100%',
                sm: '100%',
              },
              width: '100%',
              outline: 'none',
              border: 'none',
              background: 'transparent',
              height: 46,
              fontFamily: 'Poppins',
            }}
          />
        </Box>

        <IconButton
          sx={{
            background: (theme) => theme.palette.primary.main,
            display: 'flex',
            borderRadius: '12px',
            px: 2,
          }}
        >
          <Box component='img' src='/assets/svg/menu.svg' />
        </IconButton>
      </Box>
    </Box>
  );
}
