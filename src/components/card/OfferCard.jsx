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
  tokenBalance
}) {
  console.log(card, '<<<<<<xx card');
  const dispatch = useDispatch();
  const { data: tokenBalanceInWallet } = useQueryTokenBalance(card.token || 0);
  const [balanceInWallet, setBalanceInWallet] = useState('-');
  const [isCopied, setCopied] = useClipboard(card.token || card.token_address);
  const dataFetch = useSelector((state) => state.otcTrades.selectNfts);
  const receivedData = useSelector(
    (state) => state.otcTrades.selectTokenNftsReceive
  );

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

  const handleFormateAmount = (item, decimalsValue) => {
    const amount =
      Number(item.toString()).toLocaleString('fullwide', {
        useGrouping: false
      }) || 0;
    const decimals = decimalsValue ? decimalsValue : item?.metadata?.decimals;

    return ethers.utils.formatUnits(amount, decimals);
  };

  useEffect(() => {
    console.log(tokenBalanceInWallet, '<<<<<< tokenBalanceInWallet');
    if (tokenBalanceInWallet && typeof tokenBalanceInWallet === 'number') {
      setBalanceInWallet(
        handleFormateAmount(tokenBalanceInWallet, card?.metadata?.decimals)
      );
    }
  }, [tokenBalanceInWallet]);

  const initVal = card?.amount ? handleFormateAmount(card.amount) : 0;
  const [valueInput, setValueInput] = useState(initVal);

  const handleChangeInputAmount = (value, selectedCard) => {
    if (Number(value) > balanceInWallet) {
      setValueInput(balanceInWallet);
      return;
    }

    console.log('val ' + value.toString() + ' ' + JSON.stringify(selectedCard));
    let decs = selectedCard?.decimals
      ? selectedCard.decimals
      : selectedCard.metadata.decimals;
    let val = parseFloat(value);
    console.log('parsed val ' + val + ' ' + isOfferReceived + ' ' + decs);
    let weiVal = isOfferReceived ? val : val;
    //let weiVal =  val;
    console.log('processed val ' + weiVal);
    //let weiVal = val;
    if (val * 10 ** decs > card?.balance) weiVal = card?.balance / 10 ** decs;
    setValueInput(val);

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
              amount: weiVal
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
          if (item?.token_address === selectedCard?.token_address) {
            return {
              ...item,
              amount: weiVal
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
              <Typography variant='subtitle1'>Amount</Typography>

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
          {isOfferReceived && (
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
          )}

          {/*  */}

          {handleApproveClick && (
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
