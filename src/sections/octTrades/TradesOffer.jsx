import { Box } from '@mui/material';

import {
  useQueriesFilterMarketPlaceData,
  useQueryCounterOfferIdList,
  useQueriesFilterCounterOfferData,
  useQueryMyZeSwapId,
  useQueryOfferId
} from 'hooks/react-query/queries';

import MarketPlaceSection from '../MarketPlace/MarketPlaceSection';

export default function TradesOffer() {
  const { data: counterOfferIdList } = useQueryCounterOfferIdList();

  const newZeSwapList = useQueriesFilterCounterOfferData(
    counterOfferIdList,
    true
  );

  /*const newZeSwapList = useQueriesFilterMarketPlaceData(
    counterOfferIdList,
    true
  );*/

  const basicList = counterOfferIdList;
  //console.log(JSON.stringify(newZeSwapList));
  //console.log('total counter' + basicList.length);
  //console.log(JSON.stringify(basicList));
  return (
    <Box
      sx={{
        mb: 4
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
