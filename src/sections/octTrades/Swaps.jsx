import React, { useEffect, useState, useMemo } from 'react';

import { Box } from '@mui/material';

import {
  useQueriesFilterMarketPlaceData,
  useQueriesGetSwap,
  useQueriesGetSwapHistory,
  useQueryMyZeSwapId,
  useQueryOfferId
} from 'hooks/react-query/queries';
import MarketPlaceSection from 'sections/MarketPlace/MarketPlaceSection';

import {
  swapLocalSearch,
  normalizeSwapList,
  sortSwapByExpireDate
} from '../../helpers/utilities';

export default function Swaps({ searchValues, sort }) {
  const { data: zeSwapIdsList } = useQueryMyZeSwapId();
  const newZeSwapList = useQueriesGetSwap(zeSwapIdsList);
  const [filteredZeSwapIdList, setFilteredZeSwapIdList] = useState();

  const allFinished = useMemo(() => {
    if (newZeSwapList.length !== 0) {
      let flag = true;

      newZeSwapList.forEach((e) => {
        if (e === undefined) {
          flag = false;
        }
      });

      return flag;
    }

    return false;
  }, [newZeSwapList]);

  useEffect(() => {
    if (allFinished && searchValues) {
      setFilteredZeSwapIdList(swapLocalSearch(searchValues, newZeSwapList));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValues]);

  useEffect(() => {
    if (allFinished) {
      setFilteredZeSwapIdList(sortSwapByExpireDate(sort, newZeSwapList));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  useEffect(() => {
    if (allFinished) {
      // all the queries have executed successfully
      setFilteredZeSwapIdList(normalizeSwapList(newZeSwapList, sort));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allFinished]);

  // Number 1
  return (
    <Box>
      {filteredZeSwapIdList?.map((swapList, idx) => (
        <MarketPlaceSection
          isSwap
          key={swapList?.swap_id}
          zeSwapList={swapList}
          // handleClicked={handleClicked}
        />
      ))}
    </Box>
  );
}
