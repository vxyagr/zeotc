/* eslint-disable sonarjs/no-extra-arguments */
/* eslint-disable sonarjs/no-use-of-empty-return-value */
import React, { useEffect, useState } from 'react';

import { Box, Typography } from '@mui/material';
import { Network, Alchemy } from 'alchemy-sdk';
import { useRouter } from 'next/router';

import { conciseAddress } from 'helpers/utilities';

import Scrollbar from '../Scrollbar';

const LIST_DETAILS = [
  {
    id: 1,
    title: 'BTC',
    price: '$1,212',
    token: '0.0000 BTC',
    img: '/assets/images/Dollar.png',
  },
  {
    id: 2,
    title: 'XRP',
    price: '$600',
    token: '0.0000 XRP',
    img: '/assets/images/xrp.png',
  },
  {
    id: 3,
    title: 'BNB',
    price: '$212',
    token: '212 BNB',
    img: '/assets/images/Bnb.png',
  }
];

export default function MarketPlaceCard({ Image, title, isOffer, token, }) {
  const [tokenMetaData, setTokenMetaData] = useState({
});

  // Get all outbound transfers for a provided address

  const router = useRouter();
  const [openList, setOpenList] = useState(0);

  const handleCustomSelector = () => {
    if (openList === 0) {
      setOpenList(150);
    } else {
      setOpenList(0);
    }
  };

  const handleTokenAmount = (amount) => {
    let price = amount.toString();
    price = Math.floor(price / 10 ** 18);

    return price;
  };

  return (
    <Box
      sx={{
        position: 'relative',
        // background:'red',
        zIndex: 9,
      }}
    >
      <Box
        onClick={() => {
          if (isOffer) {
            router.push('/myOtcTrades/swap');
          } else {
            token?.length > 1 && handleCustomSelector();
          }
        }}
        sx={{
          display: 'flex',
          alignItems: token?.length > 1 ? 'start' : 'center',
          gap: 2,
          mt: 2,
          cursor: 'pointer',
          background:
            ' linear-gradient(180deg, rgba(54, 54, 54, 0.19) 0%, rgba(54, 54, 54, 0) 100%)',
          p: 3,
          borderRadius: 2,
          border: '0.3px solid #3b1939',
        }}
      >
        <Box
          component='img'
          src={Image}
          sx={{
            cursor: 'pointer',
          }}
        />

        <Box>
          <Typography variant='subtitle1'>
            {/* {title}{' '} */}

            {token?.[0]?.metadata?.name}

            <span
              style={{
                color: '#69A5E6',
              }}
            >
              {' '}

              {token?.length > 1 && `${token?.length - 1} more`}
            </span>
          </Typography>

          {token?.length > 1 && (
            <Typography
              variant='subtitle1'
              color='#69A5E6'
            >
              Preview List
            </Typography>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          maxHeight: openList,
          background: '#111111',
          transition: 'height 0.2s',
          mt: -3,
          borderRadius: 2,
          border: openList !== 0 ? ' 0.3px solid #3A3A3A' : 0,
          overflow: 'auto',
          position: 'absolute',
          right: 0,
          left: 0,
          height: 100,
        }}
      >
        <Scrollbar>
          {token?.length > 1 &&
            token &&
            token?.map((item, idx) => {
              return (
                <Box
                  key={item.id}
                  onClick={handleCustomSelector}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    py: 1.25,
                    alignItems: 'center',
                    px: 2,
                    borderBottom: '1px solid #252525',
                    cursor: 'pointer',
                    '& p': {
                      fontSize: 14,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      alignItems: 'center',
                    }}
                  >
                    <Box
                      component='img'
                      src={item.img}
                      sx={{
                        width: 28,
                      }}
                    />

                    <Typography>{item?.metadata?.name}</Typography>
                  </Box>

                  <Typography
                    sx={{
                      textAlign: 'center',
                    }}
                  >
                    {/* {item.price}*/}

                    {handleTokenAmount(item.amount)}
                  </Typography>

                  <Typography
                    sx={{
                      textAlign: 'right',
                      width: 90,
                    }}
                  >
                    {conciseAddress(item.token)}
                  </Typography>
                </Box>
              );
            })}
        </Scrollbar>
      </Box>
    </Box>
  );
}
