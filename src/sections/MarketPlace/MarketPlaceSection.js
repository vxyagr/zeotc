/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-duplicate-string */
import { useEffect, useRef, useState } from 'react';

import { CopyAllOutlined } from '@mui/icons-material';
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import { ethers } from 'ethers';
import Link from 'next/link';
import useClipboard from 'react-use-clipboard';

import MarketPlaceCard from 'components/card/MarketPlaceCard';
import CounterOffer from 'components/modal/CounterOffer';
import { Border } from 'components/Style';
import { getExpieredTime, getTokenPriceInUsd } from 'helpers/utilities';
import {
  useMutationAccept,
  useMutationReject,
  useMutationSwapAccept,
  useMutationSwapCounterOffer,
  useMutationCancelZeSwap,
  useERC20_ERC721_ERC1155Approve
} from 'hooks/react-query/mutation';
import { useSelectWeb3 } from 'hooks/useSelectWeb3';

export default function MarketPlaceSection({
  isSwap,
  isOffer,
  isSwapDetails,
  isMarketPlace,
  zeSwapList,
  isSwapHistory
}) {
  const { account } = useSelectWeb3();
  const { mutate: CounterOfferMutate, isLoading: isCounterOfferLoading } =
    useMutationSwapCounterOffer();

  const { mutate: acceptMutate } = useMutationSwapAccept();

  const { mutate: rejectOffer } = useMutationReject();

  const { mutate: cancelSwap } = useMutationCancelZeSwap();
  const zeroAddress = '0x0000000000000000000000000000000000000000';
  const { mutate } = useMutationAccept();
  const [appStatus, setAppStatus] = useState('');
  const ProductA = zeSwapList?.productA;
  const ProductB = zeSwapList?.productB;
  const counterOfferStatus = zeSwapList?.swap?.allow_counter_offer;
  const status = zeSwapList?.swap?.status;
  const offr = zeSwapList?.swap?.offers;
  const offer_id = zeSwapList?.swap?.offers?.[0];
  const supplier = zeSwapList?.swap?.supplier;
  const demander = zeSwapList?.swap?.demander;
  const isDemander = demander === account;
  const isSupplier = supplier === account;
  const Trade = zeSwapList?.swap?.visibility;
  const swap_id = zeSwapList?.swap_id;
  let expire = zeSwapList?.swap?.expiration;
  expire = getExpieredTime(expire, 'd', false);

  const handleRejectOffer = () => {
    console.log(
      'rejecting ' + zeSwapList?.swap_id?.toString() + ' offer from ' + demander
    );
    rejectOffer({
      swap_id,
      expire: zeSwapList?.swap?.expiration?.toString()
    });
  };

  const {
    isLoading: isApproveLoading,
    mutate: mutateApprove,
    data: approvedData
  } = useERC20_ERC721_ERC1155Approve();

  const handleApproveClick = (token) => {};

  // Moralis end
  useEffect(() => {
    if (isSwap && !isSwapHistory) {
      if (status === 0) {
        setAppStatus('Initial');
      } else if (status === 1) {
        setAppStatus('Pending confirmations');
      } else if (status === 2) {
        setAppStatus('Accepted');
      } else if (status === 3) {
        setAppStatus('Rejected  ');
      } else if (status === 4) {
        setAppStatus('Canceled');
      }
    }

    if ((isSwapHistory && isSwap) || isMarketPlace) {
      if (status === 0) {
        setAppStatus('Open');
      } else if (status === 1) {
        setAppStatus('Active');
      } else if (status === 2) {
        setAppStatus('Fullfilled');
      } else if (status === 3) {
        setAppStatus('Ended');
      } else if (status === 4) {
        setAppStatus('Canceled');
      }

      //if(expire)
      //onsole.log("the swap " + JSON.stringify(zeSwapList));
    }

    if (isOffer) {
      if (status === 0) {
        setAppStatus('Initial');
      } else if (status === 1) {
        setAppStatus('Pending confirmations');
      } else if (status === 2) {
        setAppStatus('Accepted');
      } else if (status === 3) {
        setAppStatus('Rejected  ');
      } else if (status === 4) {
        setAppStatus('Canceled');
      }

      //if(expire)
    }
  }, [isMarketPlace, isSwap, isSwapHistory, status]);

  const [open, setOpen] = useState(false);
  const [isCard, setIsCard] = useState(false);
  const [isCopied, setCopied] = useClipboard(offer_id);
  const [isCopySwapId, setIsCopySwapId] = useClipboard(swap_id);
  const isCopy = useRef(false);

  const handleCloseModal = () => setOpen(false);
  const handleCounterOffer = () => {
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
      ...zeSwapList,
      ProductA
    };
    //console.log(JSON.stringify(zeSwapList));
    //CounterOfferMutate(formattedData);
  };

  const handleSwapAccept = () => {
    /*setSelectedObjForSet(token.id);

    const tokenAddress = token?.token?.toString() || token?.token_address;

    setSelectedTokenAddress(tokenAddress);

    const tokenType = token?.IERC?.toString() || token?.contract_type;
    setIsApprove(tokenAddress);
    const tokenId = token?.token_id?.toString();
    const decimal = token?.decimals?.toString() || token?.decimals;
    const amount = token?.amount;

    const zeroAddress = '0x0000000000000000000000000000000000000000';

    if (tokenAddress && amount) {
      mutateApprove({
        tokenAddress,
        tokenType,
        tokenId,
        decimal,
        amount
      });
    }

    if (demander === zeroAddress) {
      setIsSetState(true);
    }*/

    acceptMutate(swap_id);
  };

  const handleQuickSwapAccept = () => {
    if (isSupplier) {
      //console.log("list produk A " + JSON.stringify(ProductA));
    } else {
      //console.log("list produk B " + JSON.stringify(ProductB));
      ProductB?.map((item) =>
        console.log(
          'addr ' +
            item.token +
            ' type ' +
            item.IERC +
            ' id ' +
            item.token_id +
            ' dec ' +
            item.metadata.decimals +
            ' amnt ' +
            item.amount
        )
      );
      ProductB?.map((item) => {
        const tokenAddress = item.token;
        console.log('tk addr ' + tokenAddress);
        const tokenType = item.IERC.toString();
        const tokenId = item.token_id;
        const decimal = item.metadata.decimals;
        const amount = item.amount;
        mutateApprove({
          tokenAddress,
          tokenType,
          tokenId,
          decimal,
          amount
        });
      });
    }
    /*if (tokenAddress && amount) {
      mutate({
        tokenAddress,
        tokenType,
        tokenId,
        decimal,
        amount
      });
    }
    acceptMutate(swap_id);*/
  };

  const handleSwapCancel = () => {
    console.log('cancel swap');
    cancelSwap(swap_id);
  };

  const handleFormateAmount = (item) => {
    const amount = item
      ? Number(item.toString()).toLocaleString('fullwide', {
          useGrouping: false
        })
      : 0;

    return ethers.utils.formatUnits(amount, item?.metadata?.decimals);
  };

  const handleValueInUSD = async (tokenAddress, tokenAmount) => {
    //const valueInUSD = await getTokenPriceInUsd(tokenAddress);

    //return valueInUSD * tokenAmount;
    return Number(tokenAmount);
  };

  const [SumOfAmountA, setSumOfAmountA] = useState(0);

  const [SumOfAmountB, setSumOfAmountB] = useState(0);

  useEffect(() => {
    if (ProductB?.length !== 0) {
      const totalAmountPool = [];
      const totalAmount = [];
      ProductB.forEach((item) => {
        const formatedTokenAmount = handleFormateAmount(item?.amount);
        totalAmount.push(formatedTokenAmount);
        totalAmountPool.push(handleValueInUSD(item.token, formatedTokenAmount));
      });

      Promise.all(totalAmountPool).then((allValues) => {
        if (allValues.includes(NaN)) {
          //setSumOfAmountB('Failed convert to');
          setSumOfAmountB(totalAmount);
        } else {
          const allTokenAmountValueInUSD = allValues.reduce(
            (acc, curr) => acc + curr,
            0
          );
          setSumOfAmountB(parseFloat(allTokenAmountValueInUSD.toFixed(4)));
        }
      });
    }

    // totalAmount = `${totalAmount}`.replace('e-12', '');

    // setSumOfAmountB(123);
  }, [ProductB, ProductB?.length]);

  useEffect(() => {
    if (ProductA?.length !== 0) {
      const totalAmountPool = [];
      const totalAmount = [];
      ProductA.forEach((item) => {
        const formatedTokenAmount = handleFormateAmount(item?.amount);
        totalAmount.push(formatedTokenAmount);
        totalAmountPool.push(handleValueInUSD(item.token, formatedTokenAmount));
      });

      Promise.all(totalAmountPool).then((allValues) => {
        if (allValues.includes(NaN)) {
          //setSumOfAmountB('Failed convert to');
          setSumOfAmountA(totalAmount);
        } else {
          const allTokenAmountValueInUSD = allValues.reduce(
            (acc, curr) => acc + curr,
            0
          );
          setSumOfAmountA(parseFloat(allTokenAmountValueInUSD.toFixed(4)));
        }
      });
    }

    // totalAmount = `${totalAmount}`.replace('e-12', '');

    // setSumOfAmountB(123);
  }, [ProductA, ProductA?.length]);

  return (
    <Box>
      <Box
        // onClick={() => isMarketPlace(zeSwapList)}

        sx={{
          // width: { xs: '100%', lg: (isOffer) ? isSwapDetails ? '90%' : 'fit-content' : '90%' },
          width: {
            xs: '100%',
            lg: isSwap ? '96%' : '90%'
          },
          background: isSwap
            ? 'rgba(54, 54, 54, 0.19)'
            : (theme) => theme.palette.info.main,
          // mt: isSwapDetails ? 7 : 3,
          mt: 3,
          ...Border,
          borderRadius: '17px',
          mx: isMarketPlace && {
            md: 'auto'
          },

          position: 'relative'
        }}
      >
        {isSwap && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              position: 'absolute',
              right: 20,
              top: 12
            }}
          >
            <Typography
              sx={{
                width: 10,
                height: 10,
                background: '#0D50FB',
                borderRadius: 5
              }}
            ></Typography>

            <Typography sx={{}}> {appStatus}</Typography>

            <IconButton onClick={setIsCopySwapId}>
              <Tooltip title={isCopySwapId ? 'Copied' : 'Copy Swap ID'}>
                <CopyAllOutlined
                  sx={{
                    width: 20
                  }}
                />
              </Tooltip>
            </IconButton>
          </Box>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1 , 1fr)',
              md: 'repeat(5, 1fr)',
              // lg: (isOffer || isSwap) ? 'repeat(5, 1fr)' : 'repeat(6, 1fr)',
              lg: isSwap ? 'repeat(5, 1fr)' : 'repeat(6, 1fr)'
            },
            gap: {
              xs: 1,
              lg: 2
            },
            justifyContent: 'space-between',

            pl: {
              xs: 2,
              sm: 0,
              lg: 5.5
            },
            // pr: { xs: 2, sm: 0, lg: (isOffer || isSwap) ? 5.5 : 0 },
            pr: {
              xs: 2,
              sm: 0,
              lg: isSwap ? 5.5 : 0
            }
          }}
        >
          <Box
            sx={{
              gridColumn: {
                md: '1/3'
              },
              pt: 5,
              pb: isOffer ? 3 : 5,
              pl: {
                xs: 0,
                sm: 2,
                md: 3,
                lg: 0
              },
              pr: {
                xs: 0,
                sm: 2,
                md: 0,
                lg: 0
              }
            }}
          >
            <Typography
              component={Link}
              href={{
                pathname: '/marketPlace/swap',
                query: {
                  id: `${swap_id}` // should be `title` not `id`
                }
              }}
              sx={{
                px: 2
              }}
            >
              {/*offr[0]*/}
              You Will Receive
            </Typography>

            {/* {ProductA.map((token, idx)=>{
           if(idx === 0) */}

            {/* <ClickAwayListener onClickAway={handleClicked}> */}

            <Box onClick={() => setIsCard(false)}>
              <MarketPlaceCard
                // key={token?.[0]}
                isOffer={isOffer}
                title='ETH, USDC and '
                Image='/assets/images/token.png'
                token={ProductA}
              />
            </Box>

            {/* </ClickAwayListener> */}

            {/* })} */}

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 2
              }}
            >
              <Typography
                sx={{
                  px: 2,
                  fontSize: 14
                }}
              >
                Total Amount
              </Typography>

              {SumOfAmountA ? (
                <Typography
                  sx={{
                    px: 2,
                    fontSize: 14
                  }}
                >
                  {SumOfAmountA}
                </Typography>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Box
                    component='img'
                    src='/assets/svg/small-loading.svg'
                    sx={{
                      width: 18,
                      height: 18
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              gridColumn: {
                md: '3/5'
              },
              pl: {
                xs: 0,
                sm: 2,
                md: 0,
                lg: 0
              },
              // px:2,
              pr: {
                xs: 0,
                sm: 2,
                md: 3,
                lg: 0
              },
              pt: 5,
              pb: isOffer ? 0 : 5
            }}
          >
            <Typography
              sx={{
                px: 2
              }}
            >
              You Will Provide
            </Typography>

            <MarketPlaceCard
              isOffer={isOffer}
              title='BTC, XRP and '
              Image='/assets/images/token.png'
              token={ProductB}
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 2
              }}
            >
              <Typography
                sx={{
                  px: 2,
                  fontSize: 14
                }}
              >
                Total Amount
              </Typography>

              {SumOfAmountB ? (
                <Typography
                  sx={{
                    px: 2,
                    fontSize: 14
                  }}
                >
                  {SumOfAmountB}
                </Typography>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Box
                    component='img'
                    src='/assets/svg/small-loading.svg'
                    sx={{
                      width: 18,
                      height: 18
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              gridColumn: {
                md: '5/6'
              },
              pl: {
                xs: 0,
                sm: 2,
                md: 0,
                lg: 0
              },
              // px:2,
              pr: {
                xs: 0,
                sm: 2,
                md: 3,
                lg: 0
              },
              pt: 5,
              pb: isOffer ? 0 : 5
            }}
          >
            {/*!isSupplier && !isOffer && !isDemander && status < 2 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  verticalAlign: 'middle',
                  mt: 2
                }}
              >
                <Button
                  disabled={!account || isDemander}
                  onClick={
                    isDemander ? handleRejectOffer : handleQuickSwapAccept
                  }
                  sx={{
                    width: 150,
                    color: 'white',
                    // width:'100%',
                    background:
                      ' linear-gradient(90deg, #C732A6 0%, #460AE4 100%, #C732A6 100%)'
                  }}
                >
                  {isDemander ? 'Cancel Counter' : 'Accept Offer'}
                </Button>
              </Box>
            ) */}
            {counterOfferStatus && !isSupplier && status < 2 && (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    verticalAlign: 'middle',
                    mt: 2
                  }}
                >
                  <Button
                    disabled={!account}
                    sx={{
                      width: 150,
                      color: 'white',
                      // width:'100%',
                      background:
                        ' linear-gradient(90deg, #C732A6 0%, #460AE4 100%, #C732A6 100%)'
                    }}
                    component={
                      (isMarketPlace || isOffer) && !isCopy.current
                        ? Link
                        : 'div'
                    }
                    // component={Link}
                    href={{
                      pathname: '/marketPlace/swap',
                      query: {
                        id: `${swap_id}` // should be `title` not `id`
                      }
                    }}
                  >
                    {isDemander ? 'Counter Offer' : 'Accept / Counter'}
                  </Button>
                </Box>
              </>
            )}
            {isSupplier && !isSwapHistory && !isOffer && status < 3 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  verticalAlign: 'middle',
                  mt: 2
                }}
              >
                <Button
                  disabled={!account}
                  onClick={handleSwapCancel}
                  sx={{
                    width: 150,
                    color: 'white',
                    // width:'100%',
                    background:
                      ' linear-gradient(90deg, #C732A6 0%, #460AE4 100%, #C732A6 100%)'
                  }}
                >
                  Cancel Offer
                </Button>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              background: (theme) => theme.palette.primary.main,
              width: {
                xs: '100%',
                lg: '80%'
              },
              justifySelf: 'end',
              textAlign: 'center',
              gridColumn: {
                md: '1/6',
                lg: 'auto'
              },
              p: 1,
              borderRadius: 2,
              ...Border,
              // display: (isOffer || isSwap)
              //   ? 'none'
              //   : { xs: 'Block', md: 'flex', lg: 'block' },
              display: isSwap
                ? 'none'
                : {
                    xs: 'Block',
                    md: 'flex',
                    lg: 'block'
                  },
              justifyContent: 'start',
              gap: 10,
              px: {
                xs: 4,
                lg: 0
              },
              py: {
                xs: 2,
                lg: 0
              },
              alignItems: 'center',
              mb: {
                xs: 3,
                sm: 0
              }
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                justifyContent: 'center',
                alignItems: 'center',
                mt: {
                  xs: 3,
                  md: 0,
                  lg: 2
                }
              }}
            >
              <Box
                sx={{
                  background: '#0DFBBF',
                  width: 13,
                  height: 13,
                  borderRadius: '50%'
                }}
              ></Box>

              <Typography
                sx={{
                  fontSize: 13
                }}
              >
                {' '}
                {appStatus}
              </Typography>
            </Box>

            <Box
              sx={{
                mt: {
                  xs: 3,
                  md: 0,
                  lg: 3
                }
              }}
            >
              <Typography
                sx={{
                  fontSize: 11,
                  color: '#4A4A4A'
                }}
              >
                Trade
              </Typography>

              <Typography
                sx={{
                  fontSize: 12
                }}
              >
                {Trade ? 'Public' : 'Private'}
              </Typography>
            </Box>

            <Box
              sx={{
                mt: {
                  xs: 3,
                  md: 0,
                  lg: 3
                }
              }}
            >
              <Typography
                sx={{
                  fontSize: 11,
                  color: '#4A4A4A'
                }}
              >
                Expires
              </Typography>

              <Typography
                sx={{
                  fontSize: 13
                }}
              >
                {/* 6 Days */}
                {expire}
              </Typography>
            </Box>

            {isSupplier && (
              <Typography
                sx={{
                  fontSize: 13,
                  mt: {
                    md: 2
                  },
                  color: '#fff'
                }}
              >
                Me
              </Typography>
            )}

            <IconButton
              onClick={setIsCopySwapId}
              sx={{
                py: 0
              }}
            >
              <Tooltip title={isCopySwapId ? 'Copied' : 'Copy Swap ID'}>
                <CopyAllOutlined
                  sx={{
                    width: 20,
                    mt: {
                      md: 2
                    }
                  }}
                />
              </Tooltip>
            </IconButton>

            {/* <MarketPlaceCard title='BTC, XRP and ' Image='/assets/svg/CardImg.svg' /> */}
          </Box>

          {/* offer Buttons */}
        </Box>
        <Box
          sx={{
            display: isOffer
              ? {
                  xs: 'block',
                  sm: 'flex'
                }
              : 'none',
            alignItems: 'center',
            justifyContent: 'end',
            py: 2,
            gridColumn: {
              md: '1/6'
            },
            borderTop: '1px solid #4e4e4eb0',
            gap: 2,
            px: 5.5,
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
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              width: 122,
              height: 44,
              my: {
                xs: 2,
                sm: 0
              }
            }}
          >
            {/*<Button
              onClick={handleCounterOffer}
              sx={{
                width: 122,
                background: '#000',
                border: '1px solid transparent',
                position: 'absolute',
                color: '#fff',
                top: 0,
                bottom: 0,

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
                  borderRadius: '10.19px'
                }
              }}
            >
              Counter Offer
            </Button> */}
          </Box>

          {isSupplier && (
            <Button
              onClick={handleRejectOffer}
              sx={{
                background: '#FF1E4C !important',
                width: 122
              }}
            >
              Reject
            </Button>
          )}

          {!isDemander && (
            <Button
              // onClick={() => mutate(swap_id)}
              onClick={handleQuickSwapAccept}
              sx={{
                width: 150,
                background:
                  ' linear-gradient(90deg, #C732A6 0%, #460AE4 100%, #C732A6 100%)'
              }}
            >
              Accept Offer
            </Button>
          )}

          {isSupplier && !isSwapHistory && status < 3 && (
            <Button
              // onClick={() => mutate(swap_id)}
              onClick={handleSwapCancel}
              sx={{
                width: 150,
                background:
                  ' linear-gradient(90deg, #C732A6 0%, #460AE4 100%, #C732A6 100%)'
              }}
            >
              Cancel Offer
            </Button>
          )}
        </Box>
        <CounterOffer handleClose={handleCloseModal} open={open} />
      </Box>
    </Box>
  );
}
