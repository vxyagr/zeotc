import { Box, Typography } from '@mui/material';
import axios from 'axios';

import MyAssetsCard from 'components/card/MyAssetsCard';
import { Border } from 'components/Style';
import { useQueryGetUserNFTs } from 'hooks/react-query/queries';


export default function MyAssets() {
  // Setup: npm install alchemy-sdk

  const { data: getUserNfts, } = useQueryGetUserNFTs();

  const { nftsData, tokensData, } = getUserNfts || {
};

  return (
    <Box>
      <Typography variant='h5'>My Assets</Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          justifyContent: 'space-between',
          gap: 4,
        }}
      >
        <Box
          sx={{
            width: '100%',
            background: (theme) => theme.palette.info.main,
            mt: 4,
            borderRadius: '17px',
            border: '0.3px solid #4E4E4E',
            mb: 10,
            py: 3,
            px: 1,
          }}
        >
          <Typography
            variant='h5'
            sx={{
              px: 2,
              mb: 2,
            }}
          >
            Tokens
          </Typography>

          {tokensData?.map((card, idx) => {
            return (
<MyAssetsCard
  key={card.id}
  card={card}
/>
);
          })}

          {/* {getUserNfts?.ownedNfts?.map((card, idx) => {
            return <MyAssetsCard key={card.id} card={card} />;
          })} */}
        </Box>

        <Box
          sx={{
            width: '100%',
            background: (theme) => theme.palette.info.main,
            mt: 4,
            borderRadius: '17px',
            ...Border,

            mb: 10,
            py: 3,
            px: 1,
          }}
        >
          <Typography
            variant='h5'
            sx={{
              px: 2,
            }}
          >
            NFTs
          </Typography>

          {nftsData?.map((card, idx) => {
            return (
<MyAssetsCard
  key={card.id}
  card={card}
  isNFTs
/>
);
          })}
        </Box>
      </Box>
    </Box>
  );
}
