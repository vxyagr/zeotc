import { useEffect, useState, useMemo } from 'react';

import { Box } from '@mui/material';
import Fuse from 'fuse.js';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/router';

import MarketPlaceHeader from 'components/MarketPlaceHeader';
import {
  useQueriesFilterMarketPlaceData,
  useQueryZeSwapIdList
} from 'hooks/react-query/queries';

import MarketPlaceSection from './MarketPlaceSection';

export default function MainMarketPlaceSection() {
  const router = useRouter();
  const { data: zeSwapIdList, error } = useQueryZeSwapIdList();

  let newZeSwapList = useQueriesFilterMarketPlaceData(zeSwapIdList);
  newZeSwapList = newZeSwapList?.reverse();
  const [filteredZeSwapIdList, setFilteredZeSwapIdList] = useState();

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
