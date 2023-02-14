import { Box } from '@mui/material';

import {
  useQueriesFilterMarketPlaceData,
  useQueryCounterOfferIdList,
  useQueryMyZeSwapId,
  useQueryOfferId
} from 'hooks/react-query/queries';

import MarketPlaceSection from '../MarketPlace/MarketPlaceSection';

export default function TradesOffer() {
  const { data: counterOfferIdList, } = useQueryCounterOfferIdList();
  

  const newZeSwapList = useQueriesFilterMarketPlaceData(
    counterOfferIdList,
    true
  );


  return (
    <Box
      sx={{
        mb: 4,
      }}
    >
      <Box>
        {newZeSwapList?.map((swapList, idx) => (
          <MarketPlaceSection
            isOffer
            key={swapList?.swap_id}
            zeSwapList={swapList}
          />
        ))}
      </Box>
    </Box>
  );
}
