/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable react-redux/useSelector-prefer-selectors */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react-hooks/rules-of-hooks */

import { useEffect, useState } from 'react';

import { CopyAllOutlined } from '@mui/icons-material';
import {
  Box,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import { ethers } from 'ethers';
import { useDispatch, useSelector } from 'react-redux';
import useClipboard from 'react-use-clipboard';
import { useSelectWeb3 } from 'hooks/useSelectWeb3';
//const { account, signer } = useSelectWeb3();
import MButton from 'components/MButton';
import {
  useERC20_ERC721_ERC1155Approve,
  useMutationSetProduct
} from 'hooks/react-query/mutation';
import {
  useQueryGetUserTokenBalance,
  useTokenPrice,
  getAllowanceERC20,
  getAllowanceERC721,
  getAllowanceERC1155
} from 'hooks/react-query/queries';
import { addNewTokenNfts, addNewTokenNftsReceive } from 'redux/slice/otcTrades';
import { zeoTC_Contract_Address } from 'contract';

export default function OfferCard({
  idx,
  value,
  isDashboard,
  unSelectedItems,
  onClick,
  isModal,
  card,
  //isApprove,
  //handleApproveClick,
  //isApproveLoading,
  isMarketCard,
  isDashboardR,
  isSetState,
  // handleSetFun,
  // isSetLoading,
  handleProductDetails,
  handleProductAmountA,
  counterOfferStatus,
  selectedObjForSet,
  isSupplier,
  isOfferReceived,
  swap_id,
  offer_id,
  tokenBalance,
  account,
  signer,
  confirmAllowance,
  getOfferedTokenAmount,
  allFinished
}) {
  const [totalOfferedTokens, setTotalOfferedTokens] = useState(0);
  const dispatch = useDispatch();
  // const initialValue = card?.newMetadata
  //   ? card?.amount
  //   : Math.floor(card?.balance / 10 ** 18) || '0';
  const [isCopied, setCopied] = useClipboard(
    card.token || card.token_address || card.address
  );
  //console.log('card token ' + JSON.stringify(card));
  const [updateProductB, setUpdateProductB] = useState([]);
  const [isApprove, setIsApprove] = useState('');
  const [tokenAllowance, setTokenAllowance] = useState(0);
  const dataFetch = useSelector((state) => state.otcTrades.selectNfts);
  const receivedData = useSelector(
    (state) => state.otcTrades.selectTokenNftsReceive
  );
  useEffect(() => {
    //confirmAllowance();
    if (!isDashboardR) confirmAllowance();
  }, [dataFetch]);
  useEffect(() => {
    if (!isDashboardR && getOfferedTokenAmount) {
      handleAddApproveState(card);
      let ttl = 0;
      //console.log('accessing : ');
      ttl = getOfferedTokenAmount(card);
      setTotalOfferedTokens(ttl);
      confirmAllowance();
      //console.log('crd ' + JSON.stringify(card));
      //console.log('total token ' + ttl);
    }
  }, [isDashboardR, allFinished, tokenAllowance]);
  // const useValue = card?.amount?.toString();
  const useValue = 2.5;
  const {
    isLoading: isApproveLoading,
    mutate,
    data: approvedData
  } = useERC20_ERC721_ERC1155Approve();

  /*let balance = getAllowanceERC20(card?.token_address, account, signer)
    .then((result) => {
      setTokenAllowance(Number(result / 10 ** card.decimals));
    })
    .catch((error) => {
      console.error(error);
    }); */
  const [approving, setApproving] = useState(false);
  const handleApproveClick = (token) => {
    const tokenAddress = token.token_address;
    setApproving(true);
    const tokenType = token.contract_type;
    //console.log('token type ' + tokenType + ' ' + tokenAddress);
    const tokenId = token.token_id;
    const decimal = token.decimals;
    console.log('already approved : ' + Number(tokenAllowance.toString()));
    const amount =
      Number(token?.amount?.toString()) + Number(totalOfferedTokens.toString());
    console.log('to be approved : ' + amount);

    if (tokenAddress) {
      mutate({
        tokenAddress,
        tokenType,
        tokenId,
        decimal,
        amount
      });
    }
  };
  const [toBeApproved, setToBeApproved] = useState(0);
  const handleAddApproveState = (card) => {
    setValueInput(value);

    //console.log('card is ' + JSON.stringify(card));
    const newData = dataFetch.map((item, index) => {
      if (item?.token_address === card?.token_address) {
        if (card.contract_type === undefined) {
          // result = tokenAllowance;
          // let balance = getAllowanceERC20(item?.token_address, account, signer)
          //.then((result) => {
          console.log(
            'currently approved ' + tokenAllowance + ' ' + JSON.stringify(card)
          );

          let mustBeApproved =
            Number(totalOfferedTokens) * 10 ** card.decimals +
            Number(item.amount) * 10 ** card.decimals +
            card.amount * 10 ** card.decimals;
          console.log(
            'must approved ' +
              mustBeApproved +
              ' already approed ' +
              tokenAllowance * 10 ** card.decimals
          );

          if (Number(tokenAllowance * 10 ** card.decimals) >= mustBeApproved) {
            console.log('passed');
            setIsApprove(true);

            return {
              ...item,
              isApproved: isApprove
            };
          } else {
            setIsApprove(false);
            //console.log('not enough approved');
          }
          // })
          //.catch((error) => {
          // console.error(error);
          //});
        }
        if (card.contract_type === 'ERC721') {
          //console.log('approving NFT ');
          let balance = getAllowanceERC721(
            item?.token_address,
            item?.token_id,
            account,
            signer
          )
            .then((result) => {
              if (result) {
                setIsApprove(true);
                confirmAllowance();
                return {
                  ...item,
                  isApproved: isApprove
                };
              } else {
                setIsApprove(false);
                //console.log('not enough approved');
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
        if (card.contract_type === 'ERC1155') {
          let balance = getAllowanceERC1155(
            item?.token_address,
            item?.token_id,
            account,
            signer
          )
            .then((result) => {
              if (result) {
                setIsApprove(true);
                confirmAllowance();
                return {
                  ...item,
                  isApproved: isApprove
                };
              } else {
                setIsApprove(false);
                //console.log('not approved');
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
        // let balance = getAllowanceERC20(item?.token_address, account, signer);
        //console.log('balance ' + balance);

        //check if NFT or ERC20
        //call check approved
        //const approvalCheck = call check approved
        return {
          ...item,
          isApproved: true
        };
        setIsApprove(tokenAddress);
      }

      return {
        ...item
      };
    });

    dispatch(addNewTokenNfts(newData));
  };
  const [initialLoad, setInitialLoad] = useState(true);
  useEffect(() => {
    if (!isApproveLoading && approving) {
      handleAddApproveState(card);
      setApproving(false);
      confirmAllowance();
    }
    if (isApproveLoading) setInitialLoad(false);
    if (!isApproveLoading && initialLoad) {
    }
  }, [isApproveLoading]);
  useEffect(() => {}, [isApprove]);

  const productB = useSelector((state) => state.otcTrades.productDetails);
  const tokenPrice = useTokenPrice(card?.token_address);
  const cardTokenBalance =
    card?.contract_type == 'ERC721'
      ? card.amount
      : parseFloat(Number(card?.balance / 10 ** card?.decimals).toFixed(6));

  const handleFormateAmount = (item) => {
    const amount =
      Number(item.toString()).toLocaleString('fullwide', {
        useGrouping: false
      }) || 0;
    //console.log("offer card formatting attempt " + amount);
    return ethers.utils.formatUnits(amount, item?.metadata?.decimals);
  };
  //const initVal = handleFormateAmount(card?.amount? card.amount : 0);
  const initVal = card?.amount ? card.amount : 0;
  const initialValue =
    !isModal && !isDashboard && card?.amount?.toString()
      ? ethers.utils
          .formatUnits(useValue, card?.metadata?.decimals)
          ?.split('.')[0]
      : '0';
  const [valueInput, setValueInput] = useState(0);
  useEffect(() => {
    setValueInput(initVal);
    handleChangeInputAmount(initVal, card);
    getAllowanceERC20(card?.token_address, account, signer)
      .then((result) => {
        setTokenAllowance(Number(result / 10 ** card.decimals));
      })
      .catch((error) => {
        console.error(error);
      });
    //setTokenAllowance(0)
  }, [card.decimals, approving]);

  const checkIfNFTOwned = (id, selectedCard) => {
    if (!isDashboardR) {
      setIsApprove(false);
      const newData = dataFetch.map((item, index) => {
        if (item?.token_address === selectedCard?.token_address) {
          return {
            ...item,
            token_id: id,
            amount: 0
          };
        }

        return {
          ...item,
          token_id: item.token_id || '0',
          amount: item.amount
        };
      });

      dispatch(addNewTokenNfts(newData));
    }
  };

  const checkIf1155Owned = (id, selectedCard, nftAmount) => {
    if (!isDashboardR) {
      setIsApprove(false);
      const newData = dataFetch.map((item, index) => {
        if (item?.token_address === selectedCard?.token_address) {
          return {
            ...item,
            token_id: id,
            amount: nftAmount
          };
        }

        return {
          ...item,
          token_id: item.token_id || '0',
          amount: item.amount || '0'
        };
      });

      dispatch(addNewTokenNfts(newData));
    }
  };

  //function handle change input
  const regex = /^(\d*\.?\d*)$/;
  const handleChangeInputAmount = (value, selectedCard, nftAmount) => {
    if (value != '' && !regex.test(value)) {
      setValueInput(0);
      return;
    }
    if (value > cardTokenBalance) {
      value = cardTokenBalance;
    }
    if (selectedCard?.contract_type?.toString() === 'ERC721') {
      //console.log('is 721');
      checkIfNFTOwned(value, selectedCard);
      setValueInput(value);
      return;
    }
    if (selectedCard?.contract_type?.toString() === 'ERC1155') {
      //console.log('is 1155');
      checkIf1155Owned(value, selectedCard, nftAmount);
      setValueInput(value);
      return;
    }
    let mustProve = Number(totalOfferedTokens) + Number(value);
    let passed = Number(tokenAllowance) > Number(mustProve);
    if (!isDashboardR) {
      console.log('approved : ' + tokenAllowance);
      console.log('must approved : ' + mustProve);
      let appr = Number(mustProve) > Number(tokenAllowance);

      if (passed) {
        setIsApprove(true);
        console.log(passed);
        console.log('approved');
      } else {
        console.log('not approved');
        console.log(passed);
        setIsApprove(false);
      }
    }
    //setIsApprove(false);

    //console.log('val ' + value.toString());
    let val = parseFloat(value);
    // console.log(
    //'parsed val ' + val + ' ' + isOfferReceived + ' ' + selectedCard.decimals
    // );
    let weiVal = val * 10 ** selectedCard.decimals;
    //console.log('processed val ' + weiVal);
    //let weiVal = val;
    if (val * 10 ** selectedCard.decimals > card?.balance)
      weiVal = card?.balance;
    //setValueInput(handleFormateAmount(weiVal));
    setValueInput(value);

    if (handleProductDetails) {
      handleProductDetails(idx, weiVal);
    } else if (handleProductAmountA) {
      handleProductAmountA(idx, weiVal);
    } else {
      if (!isDashboardR) {
        const newData = dataFetch.map((item, index) => {
          if (item?.token_address === selectedCard?.token_address) {
            return {
              ...item,
              amount: val,
              isApproved: passed
            };
          }

          return {
            ...item,
            amount: item.amount || '0'
          };
        });

        dispatch(addNewTokenNfts(newData));
      }

      if (isDashboardR) {
        const newData = receivedData.map((item, index) => {
          if (item?.address === selectedCard?.address && item?.address) {
            //console.log(' similar ');
            return {
              ...item,
              amount: val
            };
          }

          return {
            ...item,
            amount: item.amount || '0'
          };
        });

        dispatch(addNewTokenNftsReceive(newData));
      }
    }
  };

  const { mutate: mutateSetProduct, isLoading: isSetLoading } =
    useMutationSetProduct();

  const handleSetFun = (data) => {
    //console.log('handle set ' + JSON.stringify(data));
    mutateSetProduct({
      swap_id,
      offer_id,
      ProductB: [data]
    });
  };

  const cardArray = dataFetch.map((item) => {
    return item.token_id || item.token_address;
  });

  const isMatch = card.token_id || card.token_address;
  //const token_balance = useQueryGetUserTokenBalance(card.token_address);
  // console.log("bln " +token_balance[0].toString());

  return (
    <Box
      sx={{
        mb: 1.5,
        display:
          cardArray?.includes(isMatch) || receivedData.includes(card)
            ? isDashboard
              ? 'flex'
              : 'none'
            : 'flex',
        gap: 2,
        background: (theme) => theme.palette.primary.main,
        borderRadius: '6px',
        border: isModal ? 0 : '0.3px solid #4e4e4eb0',
        py: 1.5,
        px: 2,
        minHeight: '170px'
      }}
    >
      <Box
        component='img'
        src={
          card?.newMetadata
            ? card.newMetadata?.image || '/assets/images/NFT.png'
            : card?.img
            ? card?.img
            : card?.logo
            ? card?.logo
            : '/assets/images/token.png'
        }
        sx={{
          width: 45,
          height: 45
        }}
      />

      <Box
        sx={{
          width: '100%'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant='subtitle1'>
              {card?.newMetadata
                ? card.newMetadata?.name
                : card?.name || card?.metadata?.name}
            </Typography>

            {/* {isMarketCard && ( */}

            <IconButton
              onClick={setCopied}
              sx={{
                py: 0
              }}
            >
              <Tooltip title={isCopied ? 'Copied' : 'Copy'}>
                <CopyAllOutlined
                  sx={{
                    width: 20
                  }}
                />
              </Tooltip>
            </IconButton>

            {/* )} */}
          </Box>

          {isDashboard && (
            <Box
              onClick={onClick}
              component='img'
              src='/assets/svg/removeIcon.png'
              sx={{
                cursor: 'pointer'
              }}
            />
          )}

          {unSelectedItems && (
            <Box
              onClick={onClick}
              component='img'
              src='/assets/svg/addItem.svg'
              sx={{
                cursor: 'pointer'
              }}
            />
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: isDashboard || unSelectedItems ? 1 : 0
          }}
        >
          <Typography variant='subtitle1' color='#AEAEAE'>
            {true
              ? cardTokenBalance != cardTokenBalance
                ? ''
                : 'Balance: ' + cardTokenBalance
              : card?.contract_type == 'ERC721'
              ? ''
              : cardTokenBalance != 'Balance: ' + cardTokenBalance
              ? ''
              : cardTokenBalance}
          </Typography>
        </Box>

        {(isDashboardR ||
          handleApproveClick ||
          (handleProductAmountA && counterOfferStatus) ||
          isOfferReceived) && (
          <>
            <Divider
              sx={{
                my: 1
              }}
            />

            <Box
              sx={{
                display: {
                  xs: 'block',
                  sm: 'flex'
                },
                mt: 0.5,
                alignItems: 'center'
              }}
            >
              <Typography variant='subtitle1'>
                {card.contract_type == 'ERC721' ? 'NFT ID' : 'Amount'}{' '}
              </Typography>

              <Box
                component='input'
                value={valueInput}
                onChange={(e) => handleChangeInputAmount(e.target.value, card)}
                sx={{
                  ml: {
                    sm: 2
                  },
                  background: (theme) => theme.palette.primary.main,
                  p: 1,
                  borderRadius: 1,
                  maxWidth: 200,
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  color: value === 'Amount' ? ' gray' : '#fff'
                }}
              />

              {card.contract_type == 'ERC1155' && (
                <>
                  <Typography variant='subtitle1'> NFT Amount</Typography>

                  <Box
                    component='input'
                    value={valueInput}
                    onChange={(e) =>
                      handleChangeInputAmount(e.target.value, card)
                    }
                    sx={{
                      ml: {
                        sm: 2
                      },
                      background: (theme) => theme.palette.primary.main,
                      p: 1,
                      borderRadius: 1,
                      maxWidth: 200,
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      color: value === 'Amount' ? ' gray' : '#fff'
                    }}
                  />
                </>
              )}
            </Box>
          </>
        )}

        {/* {handleApproveClick && ( */}

        <Stack
          direction='row'
          spacing={1}
          justifyContent='end'
          alignItems='center'
          mt={1}
        >
          {/* isDashboardR && (
            <MButton
              loading={isSetLoading}
              variant='contained'
              disabled={card?.isApproved || valueInput <= '0'}
              sx={{
                boxShadow: 0,
                fontSize: 14,
                backgroundColor: 'orange !important'
              }}
              onClick={() => {
                handleSetFun(card);
              }}
              title='Set'
            />
          )*/}

          {/*  */}

          {handleApproveClick && !isDashboardR && (
            <MButton
              loading={
                (isApprove === card?.token_address && isApproveLoading) ||
                (isSetState === card?.token && isApproveLoading)
              }
              variant='contained'
              disabled={isApprove || valueInput < '0'}
              sx={{
                boxShadow: 0,
                fontSize: 14
              }}
              onClick={() => {
                handleApproveClick(card);
                handleAddApproveState(card);
              }}
              title={isApprove ? 'Approved' : 'Approve'}
            />
          )}
        </Stack>
      </Box>
    </Box>
  );
}
