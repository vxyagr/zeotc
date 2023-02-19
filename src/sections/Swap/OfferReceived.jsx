/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable sonarjs/no-duplicate-string */

import { useEffect, useState } from 'react';

import { Box, Button, Divider, Typography } from '@mui/material';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import MButton from 'components/MButton';
import CreateToken from 'components/modal/CreateToken';
import CreateTokenSwap from 'components/modal/CreateTokenSwap';
import { getExpieredTime } from 'helpers/utilities';
import {
  useERC20_ERC721_ERC1155Approve,
  useMutationSetProduct,
  useMutationSwapAccept,
  useMutationSwapCounterOffer
} from 'hooks/react-query/mutation';
import { useSelectWeb3 } from 'hooks/useSelectWeb3';
import { getProductDetails } from 'redux/slice/otcTrades';

import OfferCard from '../../components/card/OfferCard';
import { Border } from '../../components/Style';

export default function OfferReceived({ selectedCard }) {
  const [openReceive, setOpenReceive] = useState(false);
  const handleOpenReceive = () => setOpenReceive(true);
  const handleCloseReceive = () => setOpenReceive(false);

  const [openOffer, setOpenOffer] = useState(false);
  const handleOpenOffer = () => setOpenOffer(true);
  const handleCloseOffer = () => setOpenOffer(false);

  const [counterArr, setCounterArr] = useState([]);

  const { account } = useSelectWeb3();
  const dispatch = useDispatch();
  const router = useRouter();
  const [productDetails, setProductDetails] = useState([]);
  const [productDetailsA, setProductDetailsA] = useState([]);

  useEffect(() => {
    setProductDetails(selectedCard?.productB);
    setProductDetailsA(selectedCard?.productA);
  }, [selectedCard]);

  const handleProductDetails = (idx, value) => {
    const updatedAmount = [...productDetails];
    updatedAmount[idx].amount = value;
    setProductDetails(updatedAmount);
  };

  const handleProductAmountA = (idx, value) => {
    const updatedAmount = [...productDetailsA];
    updatedAmount[idx].amount = value;
    setProductDetailsA(updatedAmount);
  };

  const handleProducts = (card, isProvider) => {
    if (isProvider) {
      const updateCounterArrayB = productDetails?.includes(card)
        ? productDetails?.filter((el) => el !== card)
        : [...productDetails, card];

      setProductDetails(updateCounterArrayB);
    } else {
      const updateCounterArrayA = productDetailsA?.includes(card)
        ? productDetailsA?.filter((el) => el !== card)
        : [...productDetailsA, card];

      setProductDetailsA(updateCounterArrayA);
    }
  };

  const { mutate: CounterOfferMutate, isLoading: isCounterOfferLoading } =
    useMutationSwapCounterOffer();
  const { mutate: acceptMutate } = useMutationSwapAccept();
  const [isApprove, setIsApprove] = useState('');
  const [isSetState, setIsSetState] = useState(true);
  const [selectedObjForSet, setSelectedObjForSet] = useState(null);
  const [selectedTokenAddress, setSelectedTokenAddress] = useState();
  const [appStatus, setAppStatus] = useState('');

  const ProductA = productDetailsA;
  const ProductB = productDetails;

  const status = selectedCard?.swap?.status;
  const Trade = selectedCard?.swap?.visibility;
  const swap_id = selectedCard?.swap_id;
  const supplier = selectedCard?.swap?.supplier;
  const isSupplier = supplier === account;

  const counterOfferStatus = selectedCard?.swap?.allow_counter_offer;
  const demander = selectedCard?.swap?.demander;
  const offer_id = selectedCard?.swap?.offers?.[0];
  let expire = selectedCard?.swap?.expiration;
  expire = expire?.toString();

  const {
    isLoading: isApproveLoading,
    mutate,
    data: approvedData
  } = useERC20_ERC721_ERC1155Approve();

  // Moralis end
  // useEffect(() => {
  //   if (status === 0) {
  //     setAppStatus('Open');
  //   } else if (status === 1) {
  //     setAppStatus('Active');
  //   } else if (status === 2) {
  //     setAppStatus('Fullfilled');
  //   } else if (status === 3) {
  //     setAppStatus('Ended');
  //   } else if (status === 4) {
  //     setAppStatus('Canceled');
  //   }
  // }, [status]);

  const STATUS = {
    0: 'Open',
    1: 'Active',
    2: 'Fullfilled',
    3: 'Ended',
    4: 'Canceled'
  };

  const { mutate: mutateSetProduct, isLoading: isSetLoading } =
    useMutationSetProduct();

  const handleSetFun = (data) => {
    mutateSetProduct({
      swap_id,
      offer_id,
      ProductB: [data]
    });
  };

  const handleApproveClick = (token) => {
    setSelectedObjForSet(token.id);

    const tokenAddress = token?.token?.toString() || token?.token_address;

    setSelectedTokenAddress(tokenAddress);

    const tokenType = token?.IERC?.toString() || token?.contract_type;
    setIsApprove(tokenAddress);
    const tokenId = token?.token_id?.toString();
    const decimal = token?.decimals?.toString() || token?.decimals;
    const amount = token?.amount;

    const zeroAddress = '0x0000000000000000000000000000000000000000';

    if (tokenAddress && amount) {
      mutate({
        tokenAddress,
        tokenType,
        tokenId,
        decimal,
        amount
      });
    }

    if (demander === zeroAddress) {
      setIsSetState(true);
    }
  };

  const handleCounterOffer = (product) => {
    // const newProductB = ProductB.map((item) => {
    //   return {
    //     ...item,
    //     amount: ethers.utils
    //       .formatUnits(
    //         item?.amount?.toString(),
    //         ProductB?.[0]?.metadata?.decimals
    //       )
    //       ?.split('.')[0],
    //   };
    // });

    const formattedData = {
      ...selectedCard,
      productB: ProductB,
      productA: ProductA
    };

    CounterOfferMutate({
      id: formattedData,
      product
    });
    // CounterOfferMutate(ProductB);
  };
  const handleSwapAccept = () => {
    acceptMutate(swap_id);
  };

  const handleFormateAmount = (item) => {
    const amount = item?.toString() || 0;

    return ethers.utils.formatUnits(amount, item?.metadata?.decimals);
  };

  const [SumOfAmountA, setSumOfAmountA] = useState(0);

  const [SumOfAmountB, setSumOfAmountB] = useState(0);

  const expireDateString = getExpieredTime(expire, 'd:h:m:s', true);

  useEffect(() => {
    let totalAmount =
      (ProductB?.length !== 0 &&
        ProductB?.map((item) => handleFormateAmount(item?.amount))?.reduce(
          (prev, curr) => Number(prev) + Number(curr),
          0
        )) ||
      '0';

    totalAmount = `${totalAmount}`.replace('e-18', '');
    setSumOfAmountB(totalAmount);
  }, [ProductB, ProductB?.length]);

  useEffect(() => {
    let totalAmount =
      (ProductA?.length !== 0 &&
        ProductA?.map((item) => handleFormateAmount(item?.amount))?.reduce(
          (prev, curr) => Number(prev) + Number(curr),
          0
        )) ||
      '0';
    totalAmount = `${totalAmount}`.replace('e-18', '');

    // totalAmount = totalAmoun;
    setSumOfAmountA(totalAmount);
  }, [ProductA, ProductA?.length]);

  return (
    <Box
      sx={{
        background: (theme) => theme.palette.info.main,
        borderRadius: '17px',
        ...Border,
        mt: 3
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1 , 1fr)',
            md: 'repeat(5, 1fr)'
          },
          gap: 2,
          justifyContent: 'space-between',
          width: '100%',
          px: {
            xs: 2,
            lg: 5.5
          },
          py: 5
        }}
      >
        <Box
          sx={{
            gridColumn: {
              md: '1/3'
            }
          }}
        >
          <Typography
            sx={{
              px: 2
            }}
          >
            {/* I will receive */}

            {supplier === account ? 'I will provide' : 'I will receive'}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              mt: 0.5,
              justifyContent: 'space-between',
              alignItems: 'center',
              background: (theme) => theme.palette.primary.main,
              py: 1.3,
              px: 2,
              borderRadius: '6px',
              border: ' 0.3px solid #4E4E4E',
              my: 1.5
            }}
          >
            <Typography color='gray'>Total Amount</Typography>

            <Typography>{Number(SumOfAmountA).toFixed(0)} USDC</Typography>
          </Box>

          {ProductA?.map((card, idx) => {
            return (
              <OfferCard
                idx={idx}
                key={`productA__${idx}__${card?.id}`}
                card={card}
                handleProductAmountA={handleProductAmountA}
                counterOfferStatus={counterOfferStatus}
                // handleSetFun={isSupplier && handleSetFun}
                handleSetFun={handleSetFun}
                cardAddress={card?.address}
                selectedObjForSet={isSupplier && selectedObjForSet}
                isDashboard
                // handleProductDetails={isSupplier && handleProductDetails}
                isSetState={isSupplier && isSetState}
                // isSetLoading={isSupplier && isSetLoading}
                swap_id={swap_id}
                offer_id={offer_id}
                isApprove={isSupplier && isApprove}
                isMarketCard={isSupplier && selectedCard}
                isApproveLoading={isSupplier && isApproveLoading}
                handleApproveClick={isSupplier && handleApproveClick}
                isOfferReceived
              />
            );
          })}

          {counterOfferStatus && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'min-content 1fr',
                justifyContent: 'center',
                gap: 1,
                alignItems: 'center'
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  width: 120,
                  height: '100%',
                  my: {
                    xs: 2,
                    sm: 0
                  }
                }}
              >
                <MButton
                  disabled={!account}
                  Loading={isCounterOfferLoading}
                  title='Counter Offer'
                  onClick={() => handleCounterOffer('productA')}
                  sx={{
                    width: 'max-content',
                    background: '#000',
                    border: '1px solid transparent',
                    position: 'absolute',
                    fontSize: 13,

                    color: '#fff',
                    top: 0,
                    bottom: 0,
                    borderRadius: '12px',

                    '&:after': {
                      position: 'absolute',
                      top: -2,
                      left: -2,
                      right: -2,
                      bottom: -2,
                      background:
                        'linear-gradient(90deg, #C732A6 0%, #460AE4 100%, #460AE4 100%)',
                      content: '""',
                      zIndex: -1,
                      overflow: 'hidden',
                      borderRadius: '10.19px'
                    }
                  }}
                />
              </Box>

              <Box
                onClick={
                  // supplier === account ?
                  handleOpenOffer
                  //  :
                  //  handleOpenReceive
                }
                sx={{
                  border: '0.3px dashed #FFFFFF',
                  borderRadius: '17px',
                  background: (theme) => theme.palette.primary.main,
                  py: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
                  alignItems: 'center',
                  px: 2
                }}
              >
                <Typography variant='subtitle1'>
                  + Add new Token or NFT
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            alignSelf: 'center',
            justifySelf: 'center'
          }}
        >
          <Button
            variant='contained'
            sx={{
              py: 2,
              transform: 'matrix(1, 0, 0, -1, 0, 0)'
            }}
          >
            <Box
              component='img'
              src='/assets/svg/MyOtc.svg'
              sx={{
                width: 20
              }}
            />
          </Button>
        </Box>

        <Box
          sx={{
            gridColumn: {
              md: '4/6'
            }
          }}
        >
          <Typography>
            {/* I will provide */}

            {supplier === account ? 'I will receive' : 'I will provide'}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              mt: 0.5,
              justifyContent: 'space-between',
              alignItems: 'center',
              background: (theme) => theme.palette.primary.main,
              py: 1.3,
              px: 2,
              borderRadius: '6px',
              ...Border,
              my: 1.5
            }}
          >
            <Typography color='gray'>Total Amount</Typography>

            <Typography>{Number(SumOfAmountB).toFixed(0)} USDC</Typography>
          </Box>

          {ProductB?.map((card, idx) => {
            return (
              <OfferCard
                idx={idx}
                key={`productB__${idx}__${card?.id}`}
                card={card}
                // handleSetFun={!isSupplier && handleSetFun}
                handleSetFun={handleSetFun}
                cardAddress={card?.address}
                selectedObjForSet={!isSupplier && selectedObjForSet}
                isDashboard
                handleProductDetails={!isSupplier && handleProductDetails}
                isSetState={!isSupplier && isSetState}
                // isSetLoading={!isSupplier && isSetLoading}
                swap_id={swap_id}
                offer_id={offer_id}
                isApprove={!isSupplier && isApprove}
                isMarketCard={!isSupplier && selectedCard}
                isApproveLoading={!isSupplier && isApproveLoading}
                handleApproveClick={!isSupplier && handleApproveClick}
                isOfferReceived
              />
            );
          })}

          {counterOfferStatus && (
            <Box
              sx={{
                display: 'grid',
                justifyContent: 'center',
                gridTemplateColumns: 'min-content 1fr',
                gap: 1,
                alignItems: 'center'
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  width: 120,
                  height: '100%',
                  my: {
                    xs: 2,
                    sm: 0
                  }
                }}
              >
                <MButton
                  disabled={!account}
                  Loading={isCounterOfferLoading}
                  title='Counter Offer'
                  onClick={() => handleCounterOffer('productB')}
                  sx={{
                    width: 'max-content',
                    background: '#000',
                    border: '1px solid transparent',
                    position: 'absolute',
                    // fontSize: 14,
                    fontSize: 13,
                    color: '#fff',
                    top: 0,
                    bottom: 0,
                    borderRadius: '12px',

                    '&:after': {
                      position: 'absolute',
                      top: -2,
                      left: -2,
                      right: -2,
                      bottom: -2,
                      background:
                        'linear-gradient(90deg, #C732A6 0%, #460AE4 100%, #460AE4 100%)',
                      content: '""',
                      // overflow: 'hidden',

                      zIndex: -1,
                      borderRadius: '10.19px'
                    }
                  }}
                />
              </Box>

              <Box
                onClick={
                  // supplier === account ?
                  handleOpenReceive
                  // :
                  //  handleOpenOffer
                }
                sx={{
                  border: '0.3px dashed #FFFFFF',
                  borderRadius: '17px',
                  background: (theme) => theme.palette.primary.main,
                  py: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  px: 2
                }}
              >
                <Typography variant='subtitle1'>
                  + Add new Token or NFT
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      <Divider />

      <Box
        sx={{
          pt: 4,
          pb: {
            xs: 0,
            sm: 4
          },
          pl: {
            xs: 2,
            lg: 5
          },
          pr: {
            xs: 2,
            lg: 0
          },
          display: 'grid',
          justifyContent: 'space-between',
          gridTemplateColumns: {
            md: 'repeat(1, 1fr)',
            lg: 'repeat(3, 1fr)'
          }
        }}
      >
        {!counterOfferStatus && <Box />}

        {!counterOfferStatus && <Box />}

        {counterOfferStatus && (
          <Box
            sx={{
              display: {
                xs: 'block',
                sm: 'flex'
              },
              justifyContent: 'start',
              gap: 4,
              gridColumn: {
                lg: '1/3'
              }
            }}
          >
            <Box>
              <Typography color='#616161'>Trade</Typography>

              <Typography
                sx={{
                  fontSize: 20,
                  color: '#fff',
                  mt: 0.5
                }}
              >
                {/* Public */}

                {STATUS?.[status]}

                {/* {appStatus} */}
              </Typography>
            </Box>

            <Box>
              <Typography color='#616161'>Expires in</Typography>

              <Typography
                sx={{
                  fontSize: 20,
                  color: '#fff',
                  mt: 0.5
                }}
              >
                {/* {expire} Days */}
                {expireDateString}
              </Typography>
            </Box>

            <Box>
              <Typography color='#616161'>Allowed Counter Offer</Typography>

              <Typography
                sx={{
                  fontSize: 20,
                  color: '#fff',
                  mt: 0.5
                }}
              >
                {counterOfferStatus ? 'Allowed' : 'Not Allowed'}
              </Typography>
            </Box>
          </Box>
        )}

        <Box
          sx={{
            py: 4,
            pr: {
              xs: 2,
              lg: 5
            },
            pl: {
              xs: 2,
              lg: 0
            }
          }}
        >
          <Box
            sx={{
              display: {
                xs: 'block',
                sm: 'flex'
              },
              alignItems: 'end',
              justifyContent: 'end',
              gridColumn: {
                md: '1/6'
              },
              gap: 2,
              '& button': {
                color: '#ffff',
                height: 44,
                mr: {
                  xs: 2,
                  sm: 0
                },
                borderRadius: '10.19px',
                mt: {
                  xs: 2,
                  sm: 0
                }
              }
            }}
          >
            <Button
              disabled={!account}
              onClick={handleSwapAccept}
              sx={{
                width: 150,
                // width:'100%',
                background:
                  ' linear-gradient(90deg, #C732A6 0%, #460AE4 100%, #C732A6 100%)'
              }}
            >
              Accept Offer
            </Button>
          </Box>
        </Box>
      </Box>

      <CreateTokenSwap
        handleClose={handleCloseOffer}
        open={openOffer}
        handleProducts={handleProducts}
        counterArr={supplier === account ? productDetails : productDetailsA}
        productDetailsA={
          supplier === account ? productDetailsA : productDetails
        }
        supplier={supplier}
        isReceived={supplier === account ? true : false}
      />

      <CreateTokenSwap
        handleClose={handleCloseReceive}
        open={openReceive}
        handleProducts={handleProducts}
        productDetailsA={
          supplier === account ? productDetailsA : productDetails
        }
        counterArr={supplier === account ? productDetails : productDetailsA}
        isReceived={supplier === account ? false : true}
        supplier={supplier}
      />
    </Box>
  );
}
