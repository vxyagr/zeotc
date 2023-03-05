/* eslint-disable react-redux/useSelector-prefer-selectors */
import { useEffect, useState } from 'react';

import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';

import CustomNft from 'components/CustomNft';
import SearchAssets from 'components/SearchAssets';
import {
  useQueryGetUserNFTs,
  useQuerySearchNFTs,
  useQuerySearchTokens
} from 'hooks/react-query/queries';
import { useSelectWeb3 } from 'hooks/useSelectWeb3';
import { addNewTokenNfts, addNewTokenNftsReceive } from 'redux/slice/otcTrades';

import OfferCard from '../card/OfferCard';
import Scrollbar from '../Scrollbar';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 954,
  width: '100%',
  bgcolor: '#0A0A0A',
  border: '0px solid #000',
  boxShadow: ' 0px 0px 19.9613px 4.33941px rgba(253, 45, 255, 0.1)',
  borderRadius: '14.754px',
  outline: 'none',
  height: {
    xs: '90vh',
    sm: '70vh'
  },
  overflow: 'auto',
  py: {
    xs: 2,
    md: 0
  }
};

export default function CreateTokenSwap({
  handleClose,
  open,
  isReceived,
  handleProducts,
  counterArr,
  productDetailsA,
  supplier
}) {
  const dispatch = useDispatch();
  const [activeButton, setActiveButton] = useState('Token');
  const { account } = useSelectWeb3();
  const [tokensData, setTokensData] = useState([]);
  const [nftsData, setNftsData] = useState([]);
  const [tokensDataSearch, setTokensDataSearch] = useState([]);
  const [nftsDataSearch, setNftsDataSearch] = useState([]);

  const [searchInput, setSearchInput] = useState('');
  const [isSearch, setIsSearch] = useState(false);

  const { data: getUserNfts } = useQueryGetUserNFTs();
  const { data: searchTokens, refetch: tokensRefetch } = useQuerySearchTokens({
    account: searchInput
  });

  const { data: searchNFTs, refetch: nftRefetch } = useQuerySearchNFTs({
    account: searchInput
  });

  const dataFetch = useSelector((state) => state.otcTrades.selectNfts);

  const receivedData = useSelector(
    (state) => state.otcTrades.selectTokenNftsReceive
  );

  const handleSelected = (card) => {
    if (supplier === account) {
      if (isReceived) {
        handleProducts(card, false);
      } else {
        handleProducts(card, true);
      }
    } else {
      if (isReceived) {
        handleProducts(card, true);
      } else {
        handleProducts(card, false);
      }
    }
    // else {
    //   if (isReceived) {
    //     const newValue = receivedData.includes(card)
    //       ? receivedData.filter((el) => el !== card)
    //       : [...receivedData, card];

    //     dispatch(addNewTokenNftsReceive(newValue));
    //   } else {
    //     const newValue = dataFetch.includes(card)
    //       ? dataFetch.filter((el) => el !== card)
    //       : [...dataFetch, card];

    //     dispatch(addNewTokenNfts(newValue));
    //   }
    // }
  };

  const TAB_OPTIONS = [
    {
      label: 'Token',
      component: tokensData
    },
    {
      label: 'NFTs',
      component: nftsData
    },
    {
      label: 'Custom',
      component: (
        <CustomNft handleSelectAsset={(asset) => handleSelected(asset)} />
      )
    }
  ];

  useEffect(() => {
    if (!isReceived) {
      if (activeButton === 'NFTs') {
        nftRefetch();
        setNftsData(searchNFTs);
      }

      if (activeButton === 'Token') {
        tokensRefetch();
        setTokensData(searchTokens);
      }
    } else if (isReceived) {
      const { nftsData, tokensData } =
        getUserNfts ||
        {
          //
        };
      setTokensData(tokensData);
      setNftsData(nftsData);
    }
  }, [
    activeButton,
    getUserNfts,
    isReceived,
    nftRefetch,
    searchNFTs,
    searchTokens,
    tokensRefetch,
    searchInput
  ]);

  const leftSide = supplier === account ? productDetailsA : counterArr;
  const rightSide = supplier === account ? counterArr : productDetailsA;

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Scrollbar>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(1,1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)'
                }
              }}
            >
              {/* Modal part 1 */}

              <Box
                sx={{
                  width: '100%',
                  p: 3,
                  pt: 2,
                  gridColumn: {
                    xs: '1/2',
                    sm: '1/3'
                  }
                }}
              >
                {/* modal header */}

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Typography
                    id='modal-modal-title'
                    variant='h5'
                    component='h2'
                    sx={{
                      flexGrow: 1,
                      textAlign: 'center'
                    }}
                  >
                    Choose what you want to {!isReceived ? 'receive' : 'offer'}
                  </Typography>

                  <IconButton onClick={handleClose}>
                    <Box component='img' src='/assets/svg/close.svg' />
                  </IconButton>
                </Box>

                {/* custom tabs buttons */}

                <Box
                  sx={{
                    display: {
                      xs: 'block',
                      sm: 'flex'
                    },
                    alignItems: 'center',
                    mt: 2
                  }}
                >
                  <Box
                    sx={{
                      background: (theme) => theme.palette.primary.main,
                      borderRadius: '12px',
                      maxWidth: {
                        xs: '100%',
                        sm: 321
                      },
                      width: '100%',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      my: {
                        xs: 2,
                        sm: 0
                      }
                    }}
                  >
                    {TAB_OPTIONS.map((btn, idx) => (
                      <Button
                        key={btn.label}
                        onClick={() => setActiveButton(btn.label)}
                        sx={{
                          border:
                            activeButton === btn.label
                              ? '1px solid #C732A6'
                              : '1px solid transparent',
                          borderRadius: '12px',
                          fontWeight: 'normal',
                          color: '#fff',
                          px: 2,
                          py: 1,
                          gap: 1
                        }}
                      >
                        {btn.label}
                      </Button>
                    ))}
                  </Box>

                  {/* search Input */}
                  {!isReceived && activeButton !== 'Custom' && (
                    <SearchAssets
                      assetType={activeButton}
                      onSearchAssetAddress={(address) => {
                        setSearchInput(address);
                      }}
                    />
                  )}
                </Box>

                {/* tabs map data */}

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
                  {TAB_OPTIONS.map((item, idx) => {
                    if (item?.label === activeButton) {
                      const currentItem = item?.component;

                      // !isReceived &&
                      if (item.label !== 'Custom') {
                        return currentItem?.map((card, idx) => {
                          if (card.name !== '') {
                            return (
                              <OfferCard
                                onClick={() => handleSelected(card)}
                                key={card?.name + idx}
                                card={card}
                                unSelectedItems
                                isModal
                              />
                            );
                          }
                        });
                      } else {
                        // custom component
                        return (
                          <Box
                            key={item?.label + idx}
                            sx={{
                              gridColumn: '1/-1'
                            }}
                          >
                            {item.component}
                          </Box>
                        );
                      }
                    }
                  })}
                </Box>

                {activeButton !== 'Custom' && (
                  <Typography
                    onClick={() => {
                      // handleClose();
                      // setSelectedCard([])
                    }}
                    sx={{
                      background:
                        'linear-gradient(90deg, #C732A6 0%, #460AE4 100%, #460AE4 100%)',
                      WebkitBackgroundClip: 'text',
                      webkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      textFillColor: 'transparent',
                      pt: 1.3,
                      mb: 0,
                      boxShadow: 'none',
                      mx: 'auto',
                      cursor: 'pointer',
                      textAlign: 'center',
                      width: 'fit-content'
                    }}
                  >
                    Load More
                  </Typography>
                )}
              </Box>

              {/* Modal part 2 */}

              <Box
                sx={{
                  p: 3,
                  borderLeft: '0.4px solid #4D4D4D',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '70vh'
                }}
              >
                <Typography variant='h5'>Selected Assets</Typography>

                <Box
                  sx={{
                    mt: 2,
                    flexGrow: 1
                  }}
                >
                  {!isReceived &&
                    counterArr?.map((card, idx) => {
                      return (
                        <OfferCard
                          key={card?.name + idx}
                          onClick={() => handleSelected(card)}
                          card={card}
                          isDashboard
                          isModal
                        />
                      );
                    })}

                  {isReceived &&
                    productDetailsA?.map((card, idx) => {
                      return (
                        <OfferCard
                          key={card?.name + idx}
                          onClick={() => handleSelected(card)}
                          card={card}
                          isDashboard
                          isModal
                        />
                      );
                    })}
                </Box>

                <Button
                  variant='contained'
                  onClick={() => {
                    handleClose();
                    // setSelectedCard([]);
                  }}
                  sx={{
                    background:
                      ' linear-gradient(90deg, #C732A6 0%, #460AE4 100%, #C732A6 100%)',
                    py: 1.3,
                    borderRadius: '10.1927px'
                  }}
                >
                  CONFIRM selection
                </Button>
              </Box>
            </Box>
          </Scrollbar>
        </Box>
      </Modal>
    </div>
  );
}
