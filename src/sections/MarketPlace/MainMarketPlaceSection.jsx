import { useEffect, useState, useMemo } from 'react';

import { useAccount } from 'wagmi';

import { Box, Typography } from '@mui/material';
import Fuse from 'fuse.js';
import debounce from 'lodash.debounce';

import { Border } from 'components/Style';

import MarketPlaceHeader from 'components/MarketPlaceHeader';
import {
  useQueriesFilterMarketPlaceData,
  useQueryZeSwapIdList
} from 'hooks/react-query/queries';

import MarketPlaceSection from './MarketPlaceSection';

export default function MainMarketPlaceSection() {
  const { isConnected } = useAccount();
  const { data: zeSwapIdList, error } = useQueryZeSwapIdList();

  let newZeSwapList = useQueriesFilterMarketPlaceData(zeSwapIdList);
  newZeSwapList = newZeSwapList?.reverse();
  const [filteredZeSwapIdList, setFilteredZeSwapIdList] = useState();

  useEffect(() => {
    console.log(isConnected, '<<<<<<<< ');
  }, [isConnected]);

  // const allFinished = newZeSwapList?.some((data) => data);

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
    console.log(allFinished, '<<<<<< allFinished');

    if (allFinished) {
      // all the queries have executed successfully
      setFilteredZeSwapIdList(newZeSwapList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allFinished]);

  // const handleClicked = (data) => {
  //   console.log(data);
  //   router.push('/marketPlace/swap');
  // };

  const handleSearch = (data) => {
    if (data) {
      const options = {
        threshold: 0.1,
        keys: ['offer', 'productA.metadata.name', 'productB.metadata.name']
      };
      const fuse = new Fuse(newZeSwapList, options);
      const result = fuse.search(data).map((swap) => swap.item);
      setFilteredZeSwapIdList(result);
    } else {
      const newList = newZeSwapList;
      setFilteredZeSwapIdList(newList);
    }
  };

  const debouncedSearchChange = useMemo(() => debounce(handleSearch, 700), []);

  return (
    <Box>
      <Box>
        <MarketPlaceHeader handleSearch={debouncedSearchChange} />

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
