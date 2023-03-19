import React, { useEffect, useState, useMemo } from 'react';

import { Box, Typography } from '@mui/material';
import { isEqual } from 'lodash';

import { Border } from 'components/Style';
import {
  useQueriesGetSwapHistory,
  useQueryMyZeSwapId,
  useQueriesGetSwap
} from 'hooks/react-query/queries';

import { swapLocalSearch, sortSwapByExpireDate } from '../../helpers/utilities';
import MarketPlaceSection from '../MarketPlace/MarketPlaceSection';

export default function SwapOffer({ searchValues, sort }) {
  const { data: zeSwapIdsList } = useQueryMyZeSwapId();
  const newZeSwapList = useQueriesGetSwap(zeSwapIdsList);
  ///useQueriesGetSwapHistory(zeSwapIdsList);

  const [filteredZeSwapIdList, setFilteredZeSwapIdList] = useState();

  const swapListChange = useMemo(() => {
    return isEqual(newZeSwapList, filteredZeSwapIdList);
  }, [newZeSwapList]);

  useEffect(() => {
    if (filteredZeSwapIdList && searchValues !== null) {
      setFilteredZeSwapIdList(
        swapLocalSearch(
          searchValues,
          newZeSwapList.filter((item) => item.swap.status > 1)
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValues]);

  useEffect(() => {
    if (filteredZeSwapIdList) {
      setFilteredZeSwapIdList(
        sortSwapByExpireDate(
          sort,
          newZeSwapList.filter((item) => item.swap.status > 1)
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  useEffect(() => {
    if (searchValues === null && !swapListChange) {
      setFilteredZeSwapIdList(
        newZeSwapList.filter((item) => item.swap.status > 1)
      );
    }
  }, [swapListChange]);

  // Number 3
  return (
    <Box
      sx={{
        ...Border,
        p: 3,
        maxWidth: 'lg',
        borderRadius: 3,
        mt: 3
      }}
    >
      <Typography>Swap Completed</Typography>

      <Typography
        sx={{
          fontSize: 13,
          color: '#A3A3A3'
        }}
      ></Typography>

      <Box
        sx={{
          width: {
            xs: '100%',
            md: '100%',
            lg: '100%'
          },
          mx: 'auto',
          ml: {
            md: 3
          }
        }}
      >
        {filteredZeSwapIdList ? (
          filteredZeSwapIdList?.map((swapList, idx) => (
            <MarketPlaceSection
              isSwap
              isSwapHistory
              key={swapList?.swap_id}
              zeSwapList={swapList}
            />
          ))
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '450px',
              mt: {
                xs: 3,
                sm: 1
              }
            }}
          >
            <Box
              component='img'
              src='/assets/svg/loading-spinner.svg'
              sx={{
                width: 75,
                height: 75
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
