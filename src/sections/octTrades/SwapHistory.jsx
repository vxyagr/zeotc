import React, { useEffect, useState, useMemo } from 'react';

import { Box, Typography } from '@mui/material';
import { isEqual } from 'lodash';

import { Border } from 'components/Style';
import {
  useQueriesGetSwapHistory,
  useQueryMyZeSwapId
} from 'hooks/react-query/queries';

import { swapLocalSearch, sortSwapByExpireDate } from '../../helpers/utilities';
import MarketPlaceSection from '../MarketPlace/MarketPlaceSection';

export default function SwapOffer({ searchValues, sort }) {
  const { data: zeSwapIdsList } = useQueryMyZeSwapId();
  const newZeSwapList = useQueriesGetSwapHistory(zeSwapIdsList);

  const [filteredZeSwapIdList, setFilteredZeSwapIdList] = useState();

  const swapListChange = useMemo(() => {
    return isEqual(newZeSwapList, filteredZeSwapIdList);
  }, [newZeSwapList]);

  useEffect(() => {
    if (filteredZeSwapIdList && searchValues !== null) {
      setFilteredZeSwapIdList(swapLocalSearch(searchValues, newZeSwapList));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValues]);

  useEffect(() => {
    if (filteredZeSwapIdList) {
      setFilteredZeSwapIdList(sortSwapByExpireDate(sort, newZeSwapList));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  useEffect(() => {
    if (searchValues === null && !swapListChange) {
      setFilteredZeSwapIdList(newZeSwapList);
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
      >
        You have successfuly completed the swap for a total 2,131 USDC value.
      </Typography>

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
        {filteredZeSwapIdList?.map((swapList, idx) => (
          <MarketPlaceSection
            isSwap
            isSwapHistory
            key={swapList?.swap_id}
            zeSwapList={swapList}
          />
        ))}
      </Box>
    </Box>
  );
}
