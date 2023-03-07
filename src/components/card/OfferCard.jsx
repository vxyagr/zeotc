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

import MButton from 'components/MButton';
import { useMutationSetProduct } from 'hooks/react-query/mutation';
import { useTokenPrice, useQueryTokenBalance } from 'hooks/react-query/queries';
import { addNewTokenNfts, addNewTokenNftsReceive } from 'redux/slice/otcTrades';

export default function OfferCard({
  idx,
  value,
  prod,
  isDashboard,
  unSelectedItems,
  onClick,
  isModal,
  card,
  isApprove,
  handleApproveClick,
  isApproveLoading,
  isMarketCard,
  isDashboardR,
  isSetState,
  handleProductDetails,
  handleProductAmountA,
  counterOfferStatus,
  selectedObjForSet,
  isSupplier,
  isOfferReceived,
  swap_id,
  offer_id,
  isProvideItems,
  tokenBalance,
  handleCounterOffer,
  isCounterOfferLoading,
  allowCounterButton
}) {
  const dispatch = useDispatch();
  const [passInit, setPassInit] = useState(false);
  const { data: tokenBalanceInWallet } = useQueryTokenBalance(card.token || 0);
  const [balanceInWallet, setBalanceInWallet] = useState('-');
  const [isCopied, setCopied] = useClipboard(card.token || card.token_address);
  const dataFetch = useSelector((state) => state.otcTrades.selectNfts);

  const receivedData = useSelector(
    (state) => state.otcTrades.selectTokenNftsReceive
  );
  // console.log("kard " + JSON.stringify(card.id));
  const useValue = 2.5;
  const initialValue =
    !isModal && !isDashboard && card?.amount?.toString()
      ? ethers.utils
          .formatUnits(useValue, card?.metadata?.decimals)
          ?.split('.')[0]
      : '0';

  const cardTokenBalance =
    card?.contract_type == 'ERC721'
      ? card.amount
      : Math.floor(card?.balance / 10 ** card?.decimals);

  //function handle format
  const handleFormateAmount = (item, decimalsValue, isInit) => {
    let item_ =
      Number(item.toString()).toLocaleString('fullwide', {
        useGrouping: false
      }) || 0;
    if (!isInit) {
      item_ =
        Number(item.toString()).toLocaleString('fullwide', {
          useGrouping: false
        }) || 0;
    } else {
      //console.log("call from init");
    }
    //console.log("formatting " + item_);

    //console.log("format result " + ethers.utils.formatUnits(item_, decimalsValue))
    return ethers.utils.formatUnits(item_, decimalsValue);
  };
  const [valueInput, setValueInput] = useState(0);
  const [valueInit, setValueInit] = useState(true);
  useEffect(() => {
    let initVal = card?.amount
      ? handleFormateAmount(card.amount, card?.metadata?.decimals, true)
      : 0;
    console.log('render ' + card.amount + ' ' + initVal);
    setValueInput(initVal);
    //handleChangeInputAmount(initVal, card);
  }, [card?.metadata?.decimals]);

  useEffect(() => {
    if (card.id == undefined && allowCounterButton) allowCounterButton(true);
  });

  useEffect(() => {
    console.log(tokenBalanceInWallet, '<<<<<< tokenBalanceInWallet');
    if (tokenBalanceInWallet && typeof tokenBalanceInWallet === 'number') {
      setBalanceInWallet(
        handleFormateAmount(
          tokenBalanceInWallet,
          card?.metadata?.decimals,
          false
        )
      );
    }
  }, [tokenBalanceInWallet]);
  //console.log("exc " + card.amount);

  const checkIfNFTOwned = (id, selectedCard) => {
    if (!isDashboardR) {
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
          amount: 0
        };
      });

      dispatch(addNewTokenNfts(newData));
    }
  };

  const checkIf1155Owned = (id, selectedCard, nftAmount) => {
    if (!isDashboardR) {
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

  //function handle change input==========================================

  const handleChangeInputAmount = (value, selectedCard) => {
    if (valueInit) setValueInit(false);
    console.log('being input ' + value);
    if (selectedCard?.contract_type?.toString() === 'ERC721') {
      console.log('is 721');
      checkIfNFTOwned(value, selectedCard);
      setValueInput(value);
      return;
    }
    if (selectedCard?.contract_type?.toString() === 'ERC1155') {
      console.log('is 1155');
      checkIf1155Owned(value, selectedCard, nftAmount);
      setValueInput(value);
      return;
    }

    if (Number(value) > balanceInWallet) {
      //setValueInput(balanceInWallet);
      //return;
    }
    //console.log("in wallet " + balanceInWallet + " " );
    //console.log('val ' + value.toString() + ' ' + JSON.stringify(selectedCard));
    let decs = selectedCard?.decimals
      ? selectedCard.decimals
      : selectedCard.metadata.decimals;
    let val = parseFloat(value);

    let weiVal = val * 10 ** decs;
    //let weiVal =  val;
    //console.log('processed val ' + val + ' ' + weiVal);
    //let weiVal = val;
    console.log('parsed val ' + weiVal + ' ' + isOfferReceived + ' ' + decs);
    if (!isOfferReceived && val * 10 ** decs > balanceInWallet)
      weiVal = balanceInWallet / 10 ** decs;

    setValueInput(handleFormateAmount(weiVal, decs, false));
    //console.log('parsed val ' + weiVal + ' ' + isOfferReceived + ' ' + decs);
    if (handleProductDetails) {
      handleProductDetails(idx, val);
    } else if (handleProductAmountA) {
      handleProductAmountA(idx, val);
    }
  };

  const handleAddApproveState = (card) => {
    setValueInput(value);
    const newData = dataFetch.map((item, index) => {
      if (item?.token_address === card?.token_address) {
        return {
          ...item,
          isApproved: true
        };
      }

      return {
        ...item
      };
    });

    dispatch(addNewTokenNfts(newData));
  };

  const { mutate: mutateSetProduct, isLoading: isSetLoading } =
    useMutationSetProduct();

  const handleSetFun = (data) => {
    //console.log("list data " + JSON.stringify(data));
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
        px: 2
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
          {/*
          {isDashboard && (
            <Box
              onClick={onClick}
              component='img'
              src='/assets/svg/removeIcon.png'
              sx={{
                cursor: 'pointer'
              }}
            />
            )} */}

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
            mt: isDashboard || unSelectedItems ? 0.5 : 0
          }}
        >
          <Typography
            variant='subtitle1'
            color='#AEAEAE'
            sx={{
              mt: '-5px',
              fontSize: '12px'
            }}
          >
            {isProvideItems && `Available Balance: ${balanceInWallet}`}
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
                {card.id == undefined
                  ? 'Attach this new offer to be able to set amount'
                  : card.contract_type == 'ERC721'
                  ? 'NFT ID'
                  : 'Amount'}
              </Typography>

              {true && (
                <Box
                  component='input'
                  value={valueInput}
                  onLoad={(e) => console.log('card loading')}
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
          {isOfferReceived && card.id != undefined && (
            <MButton
              loading={isSetLoading}
              variant='contained'
              disabled={card?.isApproved || valueInput <= '0'}
              sx={{
                boxShadow: 0,
                fontSize: 14,
                //backgroundColor: 'orange !important'
                backgroundColor: '#391a92'
              }}
              onClick={() => {
                handleSetFun(card);
              }}
              title='Set'
            />
          )}
          {isOfferReceived && card.id == undefined && (
            <MButton
              loading={isCounterOfferLoading}
              variant='contained'
              disabled={card?.isApproved || valueInput <= '0'}
              sx={{
                boxShadow: 0,
                fontSize: 14,
                //backgroundColor: 'orange !important'
                background:
                  'linear-gradient(90deg, #C732A6 0%, #460AE4 100%, #460AE4 100%)'
              }}
              onClick={() => {
                handleCounterOffer(prod);
              }}
              title='Add Token'
            />
          )}

          {/*  */}

          {handleApproveClick && card.id != undefined && (
            <MButton
              loading={
                (isApprove === card?.token_address && isApproveLoading) ||
                (isSetState === card?.token && isApproveLoading)
              }
              variant='contained'
              disabled={card?.isApproved || valueInput <= '0'}
              sx={{
                boxShadow: 0,
                fontSize: 14
              }}
              onClick={() => {
                handleChangeInputAmount(valueInput, card);
                handleApproveClick(card);
                handleAddApproveState(card);
              }}
              title={card?.isApproved ? 'Approved' : 'Approve'}
            />
          )}
        </Stack>
      </Box>
    </Box>
  );
}
