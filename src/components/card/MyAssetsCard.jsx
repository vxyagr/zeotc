/* eslint-disable react-hooks/rules-of-hooks */

import { Box, Typography } from '@mui/material';

export default function MyAssetsCard({ card, isNFTs }) {
  return (
    <Box
      sx={{
        px: 2.3,
        py: 2,
        display: 'grid',
        gridTemplateColumns: 'repeat(2, max-content)',
        background: (theme) => theme.palette.primary.main,
        justifyContent: 'space-between',
        borderRadius: 2,
        border: '0.3px solid #3b1939',
        my: 1.3
      }}
    >
      <Box
        sx={{
          pl: 2,
          display: 'flex',
          gap: 2.4
        }}
      >
        <Box
          component='img'
          src={
            isNFTs
              ? card?.newMetadata?.image || '/assets/images/NFT.png'
              : '/assets/images/token.png' || card?.img
          }
          sx={{
            width: 44,
            height: 44
          }}
        />

        <Box>
          <Typography variant='subtitle1' sx={{}}>
            {isNFTs ? card?.newMetadata?.name : card?.name}
          </Typography>

          <Typography
            variant='subtitle1'
            sx={{
              color: 'gray'
            }}
          ></Typography>
        </Box>
      </Box>

      <Box
        sx={{
          pl: 2,
          textAlign: 'right'
        }}
      >
        <Typography variant='subtitle1' sx={{}}>
          {isNFTs ? card.amount : Math.floor(card?.balance / 10 ** 18)}

          {/* {card.price} */}
        </Typography>

        <Typography
          variant='subtitle1'
          sx={{
            color: 'gray'
          }}
        ></Typography>
      </Box>
    </Box>
  );
}
