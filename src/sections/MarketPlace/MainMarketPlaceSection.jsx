import { useEffect, useState, useMemo } from 'react';

import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useSelectWeb3 } from 'hooks/useSelectWeb3';
import MarketPlaceHeader from 'components/MarketPlaceHeader';
import { Border } from 'components/Style';
import {
  useQueriesFilterMarketPlaceData,
  useQueryZeSwapIdList
} from 'hooks/react-query/queries';

import MarketPlaceSection from './MarketPlaceSection';
import {
  swapLocalSearch,
  normalizeSwapList,
  sortSwapByExpireDate
} from '../../helpers/utilities';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default function MainMarketPlaceSection() {
  const {
    data: zeSwapIdList,
    error,
    isLoading,
    status
  } = useQueryZeSwapIdList();
  const { zeoTC_Contract, account, uniSwap_Contract } = useSelectWeb3();
  const newZeSwapList = useQueriesFilterMarketPlaceData(zeSwapIdList);
  //const newZeSwapList = useQueriesFilterMarketPlaceData(zeSwapIdList);
  /*newZeSwapList?.map((swapList, idx) => (
    console.log(JSON.stringify(swapList.swap[2]))
  )) */
  //console.log(JSON.stringify(newZeSwapList));
  const [sort, setSort] = useState('ASC');
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
    if (allFinished) {
      // all the queries have executed successfully
      setFilteredZeSwapIdList(normalizeSwapList(newZeSwapList.filter(((item) => (item.swap[2] == account || item.swap[2] == '0x0000000000000000000000000000000000000000')&&item.swap[1]!=account )), sort, true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allFinished]);

  useEffect(() => {
    if (filteredZeSwapIdList) {
      setFilteredZeSwapIdList((curr) => {
        const currentSwapList = [...curr];

        return sortSwapByExpireDate(sort, currentSwapList);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  useEffect(() => {
    console.log(isLoading, '<<<<<<< isLoading');
  }, [isLoading]);

  if (!isLoading && newZeSwapList.length === 0) {
    return (
      <Box
        sx={{
          maxWidth: 'lg',
          width: '100%'
        }}
      >
        <Box
          sx={{
            width: '100%',
            minHeight: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center'
          }}
        >
          <Box
            sx={{
              ...Border,
              p: 3,
              maxWidth: 'md',
              borderRadius: 3,
              mt: 7,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '40%'
            }}
          >
            <Box
              component='img'
              src='/assets/svg/disconnect-12.svg'
              sx={{
                width: 70,
                height: 70
              }}
            />

            <Typography>
              <br />
              No Swaps Available
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box>
        <MarketPlaceHeader
          sortType={sort}
          setSortType={() => {
            setSort((curr) => {
              if (curr === 'ASC') {
                return 'DESC';
              }

              return 'ASC';
            });
          }}
          handleSearch={(searchValues) => {
            const searchResult = swapLocalSearch(
              searchValues,
              newZeSwapList,
              sort,
              true
            );
            setFilteredZeSwapIdList(searchResult);
          }}
        />

        {}

        {filteredZeSwapIdList ? (
          filteredZeSwapIdList?.map((swapList, idx) => (
            <MarketPlaceSection
              key={swapList?.swap_id}
              zeSwapList={swapList}
              isMarketPlace
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
