import { useEffect, useState } from 'react';

import { Box } from '@mui/material';
import { useRouter } from 'next/router';

import MarketPlaceHeader from 'components/MarketPlaceHeader';
import {
  useQueriesFilterMarketPlaceData,
  useQueryZeSwapIdList,
} from 'hooks/react-query/queries';

import MarketPlaceSection from './MarketPlaceSection';

export default function MainMarketPlaceSection() {
  const router = useRouter();
  const { data: zeSwapIdList, error } = useQueryZeSwapIdList();

  let newZeSwapList = useQueriesFilterMarketPlaceData(zeSwapIdList);
  newZeSwapList = newZeSwapList?.reverse();
  const [filteredZeSwapIdList, setFilteredZeSwapIdList] = useState();

  useEffect(() => {
    if (newZeSwapList.length !== 0) {
      let flag = true;

      newZeSwapList.forEach((e) => {
        if (e === undefined) {
          flag = false;
        }
      });

      if (flag) {
        setFilteredZeSwapIdList(newZeSwapList);
      }
    }
  }, [newZeSwapList]);

  // const handleClicked = (data) => {
  //   console.log(data);
  //   router.push('/marketPlace/swap');
  // };

  const handleSearch = (data) => {
    if (data) {
      const newList = newZeSwapList.filter(
        (item) =>
          item?.swap?.offers?.[0]?.toLowerCase().indexOf(data.toLowerCase()) !==
          -1,
      );
      setFilteredZeSwapIdList(newList);
    } else {
      const newList = newZeSwapList;
      setFilteredZeSwapIdList(newList);
    }
  };

  return (
    <Box>
      <Box>
        <MarketPlaceHeader handleSearch={handleSearch} />

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
