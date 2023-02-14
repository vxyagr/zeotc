import { Box, Typography } from '@mui/material';

import { Border } from 'components/Style';
import {
  useQueriesFilterMarketPlaceData,
  useQueriesGetSwapHistory,
  useQueryMyZeSwapId,
  useQueryOfferId
} from 'hooks/react-query/queries';

import MarketPlaceSection from '../MarketPlace/MarketPlaceSection';

export default function SwapOffer() {

  // const { data: zeSwapIdsList, } = useQueryMyZeSwapId();
  // const { data: offerIdList, } = useQueryOfferId();
  const { data: zeSwapIdsList, } = useQueryMyZeSwapId();
  // console.log('🚀MMM - ~ file: SwapHistory.jsx:18 ~ SwapOffer ~ zeSwapIdsList', zeSwapIdsList)

  const newZeSwapList = useQueriesGetSwapHistory(zeSwapIdsList);
  // console.log('🚀 ~ file: SwapHistory.jsx:20 ~ SwapOffer ~ newZeSwapList', newZeSwapList);

  // Number 3

  return (
    <Box
      sx={{
        ...Border,
        p: 3,
        maxWidth: 'md',
        borderRadius: 3,
        mt: 3,
      }}
    >
      <Typography>Swap Completed</Typography>

      <Typography
        sx={{
          fontSize: 13,
          color: '#A3A3A3',
        }}
      >
        You have successfuly completed the swap for a total 2,131 USDC value.
      </Typography>

      <Box
        sx={{
          width: {
            xs: '100%',
            md: 'fit-content',
          },
          mx: 'auto',
          ml: {
            md: 6,
          },
        }}
      >
        {newZeSwapList?.map((swapList, idx) => (
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
