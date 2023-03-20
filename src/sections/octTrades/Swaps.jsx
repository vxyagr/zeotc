import React, { useEffect, useState, useMemo } from 'react';

import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useAccount, useSigner } from 'wagmi';
import {
  useQueriesFilterMarketPlaceData,
  useQueriesGetSwap,
  useQueriesGetSwapHistory,
  useQueryMyZeSwapId,
  useQueryOfferId
} from 'hooks/react-query/queries';
import MarketPlaceSection from 'sections/MarketPlace/SwapListSection';

import {
  swapLocalSearch,
  normalizeSwapList,
  sortSwapByExpireDate
} from '../../helpers/utilities';
import { compose } from '@reduxjs/toolkit';

export default function Swaps({ searchValues, sort }) {
  const router = useRouter();
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
    if (allFinished && searchValues !== null) {
      setFilteredZeSwapIdList(
        swapLocalSearch(
          searchValues,
          newZeSwapList.filter((item) => item.swap.status < 2)
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValues]);
  function refreshPage() {
    // refetchData();
    router.reload();
  }
  useEffect(() => {
    if (allFinished) {
      setFilteredZeSwapIdList(
        sortSwapByExpireDate(
          sort,
          newZeSwapList.filter((item) => item.swap.status < 2)
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  useEffect(() => {
    if (allFinished) {
      // all the queries have executed successfully
      setFilteredZeSwapIdList(
        normalizeSwapList(
          newZeSwapList.filter((item) => item.swap.status < 2),
          sort
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allFinished]);

  const refetchSwaps = () => {};

  // Number 1
  return (
    <Box>
      {filteredZeSwapIdList?.map((swapList, idx) => (
        <MarketPlaceSection
          isSwap
          key={swapList?.swap_id}
          zeSwapList_={swapList}
          refreshPage={refreshPage}
          // handleClicked={handleClicked}
        />
      ))}
    </Box>
  );
}
