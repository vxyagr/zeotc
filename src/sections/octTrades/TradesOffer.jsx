import React, { useEffect, useState, useMemo } from 'react';

import { Box } from '@mui/material';
import { useAccount } from 'wagmi';

import {
  useQueriesFilterMarketPlaceData,
  useQueryCounterOfferIdList,
  useQueryZeSwapIdList,
  testFunction,
  getCounterOffers
} from 'hooks/react-query/queries';

import MarketPlaceSection from '../MarketPlace/MarketPlaceSection';

export default function TradesOffer({ searchValues, sort, subMenu }) {
  const account = useAccount();

  const counterList = getCounterOffers(account.toString());
  const { data: counterOfferIdList } = useQueryCounterOfferIdList();
  const { data: swaplist_ } = useQueryZeSwapIdList();
  const allSwapList = useQueriesFilterMarketPlaceData(swaplist_);
  const [receivedCounter, setReceivedCounter] = useState(allSwapList);
  const [sentCounter, setSentCounter] = useState(allSwapList);
  // const theswap = testFunction();
  const [filteredOffer, setFillteredOffer] = useState();
  // console.log('fetched swap ' + JSON.stringify(theswap));
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
    //console.log('swap list ' + JSON.stringify(allSwapList));
    return false;
  }, [allSwapList]);

  const normalizeOfferData = (allSwapList, offerIdList, subMenuType) => {
    const filterSwapBasedOnOfferIdList = [];
    console.log('submenu : ' + subMenuType.toString());
    console.log('all swaps ' + JSON.stringify(allSwapList));
    if (subMenuType === 'pending received counter offers') {
      let receivedSwapCounter = allSwapList.filter(
        (item) => item.swap[1] === account.address.toString() //&&
        //item.swap[2] != '0x0000000000000000000000000000000000000000' &&
        //Number(item.swap.status) < 2
      );

      setReceivedCounter(receivedSwapCounter);
      setFillteredOffer(receivedSwapCounter);
      console.log('received counters ' + JSON.stringify(receivedSwapCounter));

      return receivedSwapCounter;
    } else {
      let sentSwapCounter = allSwapList.filter(
        (item) =>
          item.swap[1] != account.address.toString() &&
          item.swap[2] == account.address.toString() &&
          Number(item.swap.status) < 2
      );
      setReceivedCounter(sentSwapCounter);
      setFillteredOffer(sentSwapCounter);
      console.log('sent counters ' + JSON.stringify(sentSwapCounter));
      return sentSwapCounter;
    }
    /*const sentSwapCounter = allSwapList.filter(
      (item) =>
        item.swap[2] == account &&
        item.swap[1] != account &&
        Number(item.swap.status) < 1
    );*/
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
