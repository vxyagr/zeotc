import { useEffect, useState } from 'react';

import { Box } from '@mui/material';
import { useRouter } from 'next/router';

import MarketPlaceHeader from 'components/MarketPlaceHeader';
import {
  useQueriesFilterMarketPlaceData,
  useQueryZeSwapIdList
} from 'hooks/react-query/queries';

import MarketPlaceSection from './MarketPlaceSection';

export default function MainMarketPlaceSection() {
  const router = useRouter();
  const { data: zeSwapIdList, error, } = useQueryZeSwapIdList();

  let newZeSwapList = useQueriesFilterMarketPlaceData(zeSwapIdList);
  newZeSwapList = newZeSwapList?.reverse();
  const [filteredZeSwapIdList, setFilteredZeSwapIdList] =
    useState();

  const allFinished = newZeSwapList?.some((data) => data);

  useEffect(() => {
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
      const newList = newZeSwapList.filter(
        (item) =>
          item?.swap?.offers?.[0]?.toLowerCase().indexOf(data.toLowerCase()) !==
          -1
      );
      setFilteredZeSwapIdList(newList);
    }
  };

  return (
    <Box>
      <Box>
        <MarketPlaceHeader handleSearch={handleSearch} />

        {filteredZeSwapIdList?.map((swapList, idx) => (
          <MarketPlaceSection
            key={swapList?.swap_id}
            zeSwapList={swapList}
            isMarketPlace
          />
        ))}
      </Box>
    </Box>
  );
}
