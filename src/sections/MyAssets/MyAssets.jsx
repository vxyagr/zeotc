import React, { useState, useEffect } from 'react';

import { Box, Typography } from '@mui/material';
import Fuse from 'fuse.js';

import MyAssetsCard from 'components/card/MyAssetsCard';
import SearchSortComponent from 'components/SearchSortComponent';
import { Border } from 'components/Style';
import { useQueryGetUserNFTs } from 'hooks/react-query/queries';

export default function MyAssets() {
  const { data: getUserNfts } = useQueryGetUserNFTs();
  const { nftsData, tokensData } = getUserNfts || {};

  const [sort, setSort] = useState('ASC');
  const [filteredTNFT, setfilteredTNFT] = useState();
  const [filteredTokens, setFilteredTokens] = useState();

  useEffect(() => {
    if (tokensData) {
      setFilteredTokens(tokensData);
    }
  }, [tokensData]);

  useEffect(() => {
    if (nftsData) {
      setfilteredTNFT(nftsData);
    }
  }, [nftsData]);

  const handleSearch = (searchType, searchValues) => {
    const searchList = searchType === 'token' ? tokensData : nftsData;

    if (searchValues) {
      const options = {
        threshold: 0.1,
        keys: ['name', 'symbol']
      };

      const fuse = new Fuse(searchList, options);
      const result = fuse.search(searchValues).map((asset) => asset.item);

      if (searchType === 'token') {
        setFilteredTokens(result);
      } else {
        setfilteredTNFT(result);
      }
    } else {
      if (searchType === 'token') {
        setFilteredTokens(searchList);
      } else {
        setfilteredTNFT(searchList);
      }
    }
  };

  const sortFunction = (typeToSort, sortType) => {
    const sortList = typeToSort === 'token' ? tokensData : nftsData;

    const sortResult = sortList.sort((a, b) => {
      const nameA =
        sortType === 'ASC' ? a.name.toUpperCase() : b.name.toUpperCase();
      const nameB =
        sortType === 'ASC' ? b.name.toUpperCase() : a.name.toUpperCase();

      if (nameA < nameB) {
        return -1;
      }

      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });

    if (typeToSort === 'token') {
      setFilteredTokens(sortResult);
    } else {
      setfilteredTNFT(sortResult);
    }
  };

  return (
    <Box>
      <Typography variant='h5'>My Assets</Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          justifyContent: 'space-between',
          gap: 4
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
            minHeight: '400px'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              borderRadius: '12px',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              py: 0.5,
              mb: 3,
              width: '100%'
            }}
          >
            <Typography
              variant='h5'
              sx={{
                px: 2
              }}
            >
              Tokens
            </Typography>

            <SearchSortComponent
              searchFunction={(searchValues) => {
                handleSearch('token', searchValues);
              }}
              sortType={sort}
              setSortType={() => {
                const currentSort = sort === 'ASC' ? 'DESC' : 'ASC';

                sortFunction('token', currentSort);
                setSort(currentSort);
              }}
            />
          </Box>

          {filteredTokens === undefined ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mt: {
                  xs: 3,
                  sm: 1
                }
              }}
            >
              <Box
                component='img'
                src='/assets/svg/elipsis-loading.svg'
                sx={{
                  width: 75,
                  height: 75
                }}
              />
            </Box>
          ) : filteredTokens.length === 0 ? (
            <Typography
              variant='subtitle2'
              sx={{
                px: 2,
                textAlign: 'center',
                mt: '100px'
              }}
            >
              You Dont Have Any Tokens
            </Typography>
          ) : (
            filteredTokens?.map((card, idx) => {
              return <MyAssetsCard key={card.id} card={card} />;
            })
          )}
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
            minHeight: '400px'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              borderRadius: '12px',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              py: 0.5,
              mb: 3,
              width: '100%'
            }}
          >
            <Typography
              variant='h5'
              sx={{
                px: 2
              }}
            >
              NFTs
            </Typography>

            <SearchSortComponent
              searchFunction={(searchValues) => {
                handleSearch('nft', searchValues);
              }}
              sortType={sort}
              setSortType={() => {
                const currentSort = sort === 'ASC' ? 'DESC' : 'ASC';

                sortFunction('nft', currentSort);
                setSort(currentSort);
              }}
            />
          </Box>

          {filteredTokens === undefined ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mt: {
                  xs: 3,
                  sm: 1
                }
              }}
            >
              <Box
                component='img'
                src='/assets/svg/elipsis-loading.svg'
                sx={{
                  width: 75,
                  height: 75
                }}
              />
            </Box>
          ) : filteredTNFT?.length === 0 ? (
            <Typography
              variant='subtitle2'
              sx={{
                px: 2,
                textAlign: 'center',
                mt: '100px'
              }}
            >
              You Dont Have Any NFT
            </Typography>
          ) : (
            filteredTNFT?.map((card, idx) => {
              return <MyAssetsCard key={card.id} card={card} isNFTs />;
            })
          )}
        </Box>
      </Box>
    </Box>
  );
}
