import React, { useEffect, useState, useMemo } from 'react';

import { Box, Typography } from '@mui/material';
import { isEqual } from 'lodash';
import { useRouter } from 'next/router';
import { Border } from 'components/Style';
import { useSelectWeb3 } from 'hooks/useSelectWeb3';
import {
  useQueriesGetSwapHistory,
  useQueryMyZeSwapId,
  useQueriesGetSwap
} from 'hooks/react-query/queries';

import {
  swapLocalSearch,
  sortSwapByExpireDate,
  normalizeSwapList
} from '../../helpers/utilities';
import MarketPlaceSection from '../MarketPlace/MarketPlaceSection';

export default function SwapOffer({ searchValues, sort }) {
  const router = useRouter();
  const { data: zeSwapIdsList, refetch: refetchSwapId } = useQueryMyZeSwapId();
  const newZeSwapList = useQueriesGetSwap(zeSwapIdsList);
  const [filteredZeSwapIdList, setFilteredZeSwapIdList] = useState();
  const { account } = useSelectWeb3();
  //console.log('account ' + account);
  const allFinished = useMemo(() => {
    console.log('send memo ');
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
    console.log('refetching swaps history');
    refetchSwapId();
  }, [account]);
  useEffect(() => {
    if (allFinished && searchValues !== null) {
      setFilteredZeSwapIdList(
        swapLocalSearch(
          searchValues,
          newZeSwapList.filter((item) => item.swap.status > 2)
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
          newZeSwapList.filter((item) => item.swap.status > 2)
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
          newZeSwapList.filter((item) => item.swap.status > 2),
          sort
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allFinished, account]);

  const refetchSwaps = () => {};
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
      <Typography>Swap Completed </Typography>

      <Typography
        sx={{
          fontSize: 13,
          color: '#A3A3A3'
        }}
      ></Typography>

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
        {filteredZeSwapIdList ? (
          filteredZeSwapIdList?.map((swapList, idx) => (
            <MarketPlaceSection
              isSwap
              isSwapHistory
              key={swapList?.swap_id}
              zeSwapList={swapList}
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
