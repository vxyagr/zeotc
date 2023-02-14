import React from 'react';

import { Box } from '@mui/material';

import {
  useQueriesFilterMarketPlaceData,
  useQueriesGetSwap,
  useQueriesGetSwapHistory,
  useQueryMyZeSwapId,
  useQueryOfferId
} from 'hooks/react-query/queries';
import MarketPlaceSection from 'sections/MarketPlace/MarketPlaceSection';

export default function Swaps() {
  const { data: zeSwapIdsList, } = useQueryMyZeSwapId();
  const newZeSwapList =  useQueriesGetSwap(zeSwapIdsList);

  // Number 1
  return (
    <Box>
      {newZeSwapList?.map((swapList, idx) => (
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
