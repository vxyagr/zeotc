import React, { useEffect, useState, useMemo } from 'react';

import { Box } from '@mui/material';
import { useAccount } from 'wagmi';
import { useSelectWeb3 } from 'hooks/useSelectWeb3';
import { useRouter } from 'next/router';
import {
  useQueriesFilterMarketPlaceData,
  useQueryCounterOfferIdList,
  useQueryZeSwapIdList,
  testFunction,
  getCounterOffers
} from 'hooks/react-query/queries';

import MarketPlaceSection from '../MarketPlace/TradeOfferSection';

export default function TradesOffer({ searchValues, sort, subMenu }) {
  const router = useRouter();
  const { account } = useSelectWeb3();

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
    //console.log('submenu : ' + subMenuType.toString());
    //console.log('all swaps ' + JSON.stringify(allSwapList));
    if (subMenuType === 'pending received counter offers') {
      let receivedSwapCounter = allSwapList.filter(
        (item) =>
          item.swap[1] === account.toString() &&
          item.swap[2] != '0x0000000000000000000000000000000000000000' &&
          item.swap[5] != account.toString() &&
          Number(item.swap.status) < 2
      );

      setReceivedCounter(receivedSwapCounter);
      setFillteredOffer(receivedSwapCounter);
      console.log('received counters ' + JSON.stringify(receivedSwapCounter));

      return receivedSwapCounter;
    } else if (subMenuType === 'pending sent counter offers') {
      let sentSwapCounter = allSwapList.filter(
        (item) =>
          item.swap[1] != account.toString() &&
          item.swap[2] == account.toString() &&
          Number(item.swap.status) < 2
      );
      setReceivedCounter(sentSwapCounter);
      setFillteredOffer(sentSwapCounter);
      console.log('sent counters ' + JSON.stringify(sentSwapCounter));
      return sentSwapCounter;
    } else {
      let receivedSwapCounter = allSwapList.filter(
        (item) =>
          item.swap[1] != account.toString() &&
          item.swap[2] != '0x0000000000000000000000000000000000000000' &&
          item.swap[5] === account.toString() &&
          Number(item.swap.status) < 2
      );

      setReceivedCounter(receivedSwapCounter);
      setFillteredOffer(receivedSwapCounter);
      console.log('received counters ' + JSON.stringify(receivedSwapCounter));

      return receivedSwapCounter;
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

  function refreshPage() {
    // refetchData();
    router.reload();
  }

  useEffect(() => {
    if (allFinished) {
      // all the queries have executed successfully

      setFillteredOffer(
        normalizeOfferData(allSwapList, counterOfferIdList, subMenu)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allFinished, account]);

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
        {allFinished ? (
          filteredOffer?.map((swapList, idx) => (
            <MarketPlaceSection
              isOffer
              key={swapList?.swap_id}
              zeSwapList_={swapList}
              refreshPage={refreshPage}
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
