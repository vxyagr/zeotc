import React, { useEffect, useState, useMemo } from 'react';

import { Box } from '@mui/material';
import { useAccount } from 'wagmi';

import {
  useQueriesFilterMarketPlaceData,
  useQueryCounterOfferIdList,
  useQueryZeSwapIdList,
  testFunction
} from 'hooks/react-query/queries';

import MarketPlaceSection from '../MarketPlace/MarketPlaceSection';

export default function TradesOffer({ searchValues, sort, subMenu }) {
  const account = useAccount();
  const { data: counterOfferIdList } = useQueryCounterOfferIdList();
  const { data: swaplist_ } = useQueryZeSwapIdList();
  const allSwapList = useQueriesFilterMarketPlaceData(swaplist_);
  const theswap = testFunction();
  const [filteredOffer, setFillteredOffer] = useState();
  console.log('fetched swap ' + JSON.stringify(theswap));
  const allFinished = useMemo(() => {
    if (allSwapList.length !== 0) {
      let flag = true;

      allSwapList.forEach((e) => {
        if (e === undefined) {
          flag = false;
        }
      });

      return flag;
    }

    return false;
  }, [allSwapList]);

  const normalizeOfferData = (allSwapList, offerIdList, subMenuType) => {
    const filterSwapBasedOnOfferIdList = [];

    if (subMenuType === 'pending received counter offers') {
      allSwapList.forEach((swapData) => {
        swapData.swap?.offers.forEach((offerId) => {
          if (offerIdList.includes(offerId)) {
            filterSwapBasedOnOfferIdList.push(swapData);
          }
        });
      });
    } else {
      allSwapList.forEach((swapData) => {
        if (swapData.swap[2] === account.address) {
          filterSwapBasedOnOfferIdList.push(swapData);
        }
      });
    }

    return filterSwapBasedOnOfferIdList;
  };

  useEffect(() => {
    if (allFinished) {
      // all the queries have executed successfully

      setFillteredOffer(
        normalizeOfferData(allSwapList, counterOfferIdList, subMenu)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allFinished]);

  useEffect(() => {
    if (filteredOffer) {
      setFillteredOffer(
        normalizeOfferData(allSwapList, counterOfferIdList, subMenu)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subMenu]);

  return (
    <Box
      sx={{
        mb: 4
      }}
    >
      <Box>
        {filteredOffer?.map((swapList, idx) =>
          swapList.swap.status != 4 ? (
            <MarketPlaceSection
              isOffer
              key={swapList?.swap_id}
              zeSwapList={swapList}
            />
          ) : (
            ''
          )
        )}
      </Box>
    </Box>
  );
}
