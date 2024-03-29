import React, { useEffect, useState } from 'react';

import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import {
  useQueriesFilterMarketPlaceData,
  useQueryZeSwapIdList
} from 'hooks/react-query/queries';
import Layout from 'layout';
import OfferReceived from 'sections/Swap/OfferReceived';

export default function MarketPlaceSwaping(context) {
  const [selectedCard, setSelectedCard] = useState([]);

  const router = useRouter();
  let pathName = router.asPath;
  pathName = pathName.split('/');
  pathName = pathName[2].split('=');
  pathName = pathName[1];

  const { data: zeSwapIdList, error, } = useQueryZeSwapIdList();

  const newZeSwapList = useQueriesFilterMarketPlaceData(zeSwapIdList);

  useEffect(() => {
    const selectData = newZeSwapList?.filter(
      (item) => item?.swap_id === pathName
    );
    setSelectedCard(selectData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newZeSwapList?.[0]?.swap_id, pathName]);

  return (
    <Layout>
      <Box
        sx={{
          maxWidth: 1300,
          width: {
            xs: '100%',
            lg: '90%',
          },
          mt: {
            xs: 10,
            md: 0,
          },
        }}
      >
        <Typography>Swap</Typography>

        <OfferReceived selectedCard={selectedCard?.[0]} />
      </Box>
    </Layout>
  );
}
