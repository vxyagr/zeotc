/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useEffect, useMemo } from 'react';

import ArrowBack from '@mui/icons-material/ArrowBack';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button } from '@mui/material';

import OfferCard from '../components/card/OfferCard';
import {
  useQueryGetCustomERC20,
  useQueryGetCustomNFT
} from '../hooks/react-query/queries';

export default function CustomNft({ handleSelectAsset }) {
  const [searchResult, setSearchResult] = useState(null);
  const [showResultPage, setShowResultPage] = useState(false);
  const [tokenType, setTokenType] = useState('ERC721');
  const [searchAddress, setSearchAddress] = useState('');
  const [searchId, setSearchId] = useState('');
  const {
    data: NFTSearchData,
    refetch: NFTRefetch,
    fetchStatus: NFTFetchStatus
  } = useQueryGetCustomNFT(searchAddress, searchId);
  const {
    data: tokenSearchData,
    refetch: tokensRefetch,
    fetchStatus: tokenFetchStatus
  } = useQueryGetCustomERC20(searchAddress);

  useEffect(() => {
    if (NFTSearchData?.tokensData) {
      setSearchResult(NFTSearchData.tokensData);
    }
  }, [NFTSearchData]);

  useEffect(() => {
    if (tokenSearchData?.tokensData) {
      setSearchResult(tokenSearchData.tokensData);
    }
  }, [tokenSearchData]);

  const handleSearch = () => {
    if (tokenType === 'ERC20') {
      tokensRefetch();
    } else {
      NFTRefetch();
    }

    setShowResultPage(true);
  };

  const isLoading =
    NFTFetchStatus === 'fetching' || tokenFetchStatus === 'fetching';

  const searchButtonDisabled = useMemo(() => {
    let validateField = true;

    if (tokenType === 'ERC20' && searchAddress.length >= 42) {
      validateField = false;
    }

    if (
      (tokenType === 'ERC721' || tokenType === 'ERC1155') &&
      searchAddress.length >= 42 &&
      searchId.length > 0
    ) {
      validateField = false;
    }

    return validateField;
  }, [tokenType, searchAddress, searchId]);

  return (
    <Box
      sx={{
        mt: 2
      }}
    >
      {searchResult && showResultPage ? (
        <>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)'
              },
              columnGap: 2,
              mt: 2
            }}
          >
            <OfferCard
              onClick={() => handleSelectAsset(searchResult)}
              key={searchResult?.name}
              card={searchResult}
              unSelectedItems
              isModal
            />
          </Box>

          <Button
            startIcon={<ArrowBack />}
            onClick={() => setShowResultPage(false)}
            sx={{
              background: (theme) => theme.palette.primary.main,
              borderRadius: '5px',
              fontWeight: 'normal',
              color: '#fff',
              width: '20%',
              height: 25,
              mt: 3,
              px: 2,
              py: 1,
              gap: 1
            }}
          >
            Back
          </Button>
        </>
      ) : (
        <Box
          sx={{
            mt: 8
          }}
        >
          <Box
            sx={{
              maxWidth: 300,
              mx: 'auto',
              '& input': {
                mb: 2,
                mt: 1
              }
            }}
          >
            <label>Asset type</label>

            <Box
              component='select'
              type='text'
              placeholder='Asset Address'
              value={tokenType}
              onChange={(e) => setTokenType(e.target.value)}
              sx={{
                background: (theme) => theme.palette.primary.main,
                pr: 3,
                pl: 2,
                width: '100%',
                outline: 'none',
                border: 'none',
                borderRadius: '12px',
                height: 46,
                fontFamily: 'Poppins',
                mb: 2,
                mt: 1,
                option: {
                  color: '#000',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }
              }}
            >
              <option value='ERC20'>ERC20</option>

              <option value='ERC721'>ERC721</option>

              <option value='ERC1155'>ERC1155</option>
            </Box>

            <label>Address</label>

            <Box
              component='input'
              type='text'
              placeholder='Address'
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              sx={{
                background: (theme) => theme.palette.primary.main,
                px: 3,

                width: '100%',
                outline: 'none',
                border: 'none',
                borderRadius: '12px',

                height: 46,
                fontFamily: 'Poppins'
              }}
            />

            {tokenType !== 'ERC20' && (
              <>
                <label>ID</label>

                <Box
                  component='input'
                  type='text'
                  placeholder='ID'
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  sx={{
                    background: (theme) => theme.palette.primary.main,
                    px: 3,

                    width: '100%',
                    outline: 'none',
                    border: 'none',
                    borderRadius: '12px',

                    height: 46,
                    fontFamily: 'Poppins'
                  }}
                />
              </>
            )}

            <LoadingButton
              onClick={() => handleSearch()}
              loading={isLoading}
              disabled={searchButtonDisabled}
              sx={{
                background: (theme) => theme.palette.primary.main,
                borderRadius: '12px',
                fontWeight: 'normal',
                color: '#fff',
                width: '100%',
                height: 46,
                mt: 2,
                px: 2,
                py: 1,
                gap: 1
              }}
            >
              Search NTF
            </LoadingButton>
          </Box>
        </Box>
      )}
    </Box>
  );
}
