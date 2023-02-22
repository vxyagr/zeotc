import { useEffect, useState, useMemo } from 'react';

import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import Fuse from 'fuse.js';
import { useAccount } from 'wagmi';

import MarketPlaceHeader from 'components/MarketPlaceHeader';
import { Border } from 'components/Style';
import {
  useQueriesFilterMarketPlaceData,
  useQueryZeSwapIdList
} from 'hooks/react-query/queries';

import MarketPlaceSection from './MarketPlaceSection';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default function MainMarketPlaceSection() {
  const { isConnected } = useAccount();
  const { data: zeSwapIdList, error } = useQueryZeSwapIdList();
  const newZeSwapList = useQueriesFilterMarketPlaceData(zeSwapIdList);
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

  const sortSwap = (swapList) => {
    console.log('<<<<< wadiaw ciaw');

    return swapList.sort((a, b) => {
      const expireTimeA =
        sort === 'ASC'
          ? dayjs.unix(a.swap.expiration.toString())
          : dayjs.unix(b.swap.expiration.toString());
      const expireTimeB =
        sort === 'ASC'
          ? dayjs.unix(b.swap.expiration.toString())
          : dayjs.unix(a.swap.expiration.toString());

      return expireTimeA - expireTimeB;
    });
  };

  const normalizeSwapList = (swapList) => {
    let filterResult = swapList;

    // remove expired swap
    filterResult = filterResult.filter((singleSwap) =>
      dayjs().isBefore(dayjs.unix(singleSwap.swap.expiration.toString()))
    );

    return sortSwap(filterResult);
  };

  const handleSearch = (data) => {
    if (data) {
      const options = {
        threshold: 0.1,
        keys: ['offer', 'productA.metadata.name', 'productB.metadata.name']
      };
      const fuse = new Fuse(newZeSwapList, options);
      const result = fuse.search(data).map((swap) => swap.item);
      setFilteredZeSwapIdList(normalizeSwapList(result));
    } else {
      const newList = newZeSwapList;
      setFilteredZeSwapIdList(newList);
    }
  };

  useEffect(() => {
    if (allFinished) {
      // all the queries have executed successfully
      setFilteredZeSwapIdList(normalizeSwapList(newZeSwapList));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allFinished]);

  useEffect(() => {
    if (filteredZeSwapIdList) {
      setFilteredZeSwapIdList((curr) => {
        return sortSwap(curr);
      });
    }
  }, [sort]);

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
          handleSearch={handleSearch}
        />

        {!isConnected ? (
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
                No Wallet Connection
              </Typography>

              <Typography
                sx={{
                  fontSize: 13,
                  color: '#A3A3A3'
                }}
              >
                Please connect wallet before continue.
              </Typography>
            </Box>
          </Box>
        ) : filteredZeSwapIdList ? (
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
