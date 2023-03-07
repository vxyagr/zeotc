/* eslint-disable react-redux/useSelector-prefer-selectors */
/* eslint-disable sonarjs/no-duplicate-string */
import { useEffect, useState } from 'react';

import { Box, Button, Checkbox, Divider, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import OfferCard from 'components/card/CreateOfferCard';
import ReactDatePicker from 'components/DateTimePicker';
import MButton from 'components/MButton';
import CreateToken from 'components/modal/CreateToken';
import Slider from 'components/Slider';
import { ethers } from 'ethers';
import { Border } from 'components/Style';
import {
  useERC20_ERC721_ERC1155Approve,
  useMutationCreateZeSwap
} from 'hooks/react-query/mutation';
import {
  addNewTokenNfts,
  addNewTokenNftsReceive,
  getCreateDateTime
} from 'redux/slice/otcTrades';

export default function DashboardSection() {
  const dispatch = useDispatch();
  const [openOffer, setOpenOffer] = useState(false);
  const [openReceive, setOpenReceive] = useState(false);
  const [SumOfAmount, setSumOfAmount] = useState(0);
  const [SumOfReceive, setSumOfReceive] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isApprove, setIsApprove] = useState('');

  const dataFetch = useSelector((state) => state.otcTrades.selectNfts);

  const receivedData = useSelector(
    (state) => state.otcTrades.selectTokenNftsReceive
  );
  const {
    data: mutateData,
    isLoading: createIsLoading,
    mutate: createMutate
  } = useMutationCreateZeSwap();

  useEffect(() => {
    if (mutateData?.hash) {
      setSumOfAmount(0);
      setOpenOffer(false);
      setOpenReceive(false);
      setSumOfAmount(0);
      setIsChecked(false);
      setIsDisabled(true);
      setIsApprove('');
      dispatch(addNewTokenNftsReceive([]));
      dispatch(addNewTokenNfts([]));
    }
  }, [mutateData]);

  const {
    isLoading: isApproveLoading,
    mutate,
    data: approvedData
  } = useERC20_ERC721_ERC1155Approve();

  const handleApproveClick = (token) => {
    const tokenAddress = token.token_address;

    const tokenType = token.contract_type;
    setIsApprove(tokenAddress);
    const tokenId = token.token_id;
    const decimal = token.decimals;
    const amount = token?.amount.toString();
    console.log("to be approved : " + amount);

    if (tokenAddress && amount) {
      mutate({
        tokenAddress,
        tokenType,
        tokenId,
        decimal,
        amount
      });
    }
  };

  const isReceived = true;

  const handleSelected = (card, isReceived) => {
    if (isReceived) {
      const newValue = receivedData.includes(card)
        ? receivedData.filter((el) => el !== card)
        : [...receivedData, card];

      dispatch(addNewTokenNftsReceive(newValue));
    } else {
      const newValue = dataFetch.includes(card)
        ? dataFetch.filter((el) => el !== card)
        : [...dataFetch, card];

      dispatch(addNewTokenNfts(newValue));
    }
  };

  const handleDate = (value) => {
    dispatch(getCreateDateTime(value));
  };

  const handleFormateAmount = (item) => {
    const amount = item? Number(item.toString()).toLocaleString('fullwide', {useGrouping:false}) : 0;
    console.log("item value " + item);
    return amount;
    //return ethers.utils.formatUnits(amount, decimal);
  };

  useEffect(() => {
    //const newData = dataFetch.filter(
      //(item) => item?.isApproved === true && item.amount > 0
    //);
    const newData = dataFetch.filter(
      (item) => item?.isApproved === true 
    );

    if (
      newData.length === dataFetch.length &&
      dataFetch.length > 0 &&
      receivedData.length > 0
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
      console.log('Please Approve All tokens and NFTs before create');
    }
  }, [dataFetch,receivedData, dataFetch.length, receivedData.length]);

  useEffect(() => {
    const totalAmount =
      (dataFetch?.length !== 0 &&
        dataFetch
          ?.map((item) => item?.amount)
          //?.reduce((prev, curr) => Number(handleFormateAmount(Number(prev))) + Number(handleFormateAmount(Number(curr))), 0)) ||
          ?.reduce((prev, curr) => Number(prev) + Number(curr), 0)) || 0;
    setSumOfAmount(handleFormateAmount(totalAmount));
  }, [dataFetch, dataFetch?.length]);


  useEffect(() => {
    const totalAmount =
      (receivedData?.length !== 0 &&
        receivedData
          ?.map((item) => item?.amount)
        //  ?.reduce((prev, curr) => Number(handleFormateAmount(Number(prev))) + Number(handleFormateAmount(Number(curr))), 0)) ||
        ?.reduce((prev, curr) => Number(prev) + Number(curr), 0)) || 0;
    setSumOfReceive(handleFormateAmount(totalAmount));
  }, [receivedData, receivedData?.length]);

  const date = useSelector((state) => state.otcTrades.getCreateDate);

  return (
    <Box
      sx={{
        width: '100%',
        background: (theme) => theme.palette.info.main,
        mt: 8,
        borderRadius: '17px',
        ...Border,
        mb: 10
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
          px: {
            xs: 2,
            md: 5.5
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
            I will offer
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

            <Typography>{SumOfAmount} USDC</Typography>
          </Box>

          {dataFetch?.map((card, idx) => {
            return (
              <OfferCard
                key={card?.name}
                card={card}
                onClick={() => handleSelected(card)}
                isDashboard
                isApprove={isApprove}
                isApproveLoading={isApproveLoading}
                handleApproveClick={handleApproveClick}
              />
            );
          })}

          <Box
            onClick={() => setOpenOffer(true)}
            sx={{
              border: '0.3px dashed #FFFFFF',
              borderRadius: '17px',
              background: (theme) => theme.palette.primary.main,
              py: 2,
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            <Typography variant='subtitle1'>+ Add new Token or NFT</Typography>
          </Box>

          <CreateToken
            handleClose={() => setOpenOffer(false)}
            open={openOffer}
          />
        </Box>

        <Box
          sx={{
            justifySelf: 'center',
            mt: {
              md: 16
            }
          }}
        ></Box>

        <Box
          sx={{
            gridColumn: {
              md: '4/6'
            }
          }}
        >
          <Typography>I will receive</Typography>

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

            <Typography>{SumOfReceive} USDC</Typography>
          </Box>

          {receivedData?.map((card, idx) => {
            return (
              <OfferCard
                key={card?.name}
                card={card}
                isDashboard
                onClick={() => handleSelected(card, isReceived)}
                isDashboardR
              />
            );
          })}

          <Box
            onClick={() => setOpenReceive(true)}
            sx={{
              border: '0.3px dashed #FFFFFF',
              borderRadius: '17px',
              background: (theme) => theme.palette.primary.main,
              py: 2,
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            <Typography variant='subtitle1'>+ Add new Token or NFT</Typography>
          </Box>

          <CreateToken
            handleClose={() => setOpenReceive(false)}
            open={openReceive}
            isReceived
          />
        </Box>
      </Box>

      <Divider />

      <Box
        sx={{
          width: '100%',
          px: {
            xs: 2,
            md: 5.5
          },
          pt: 2,
          position: 'relative'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
            gap: 1,
            width: 'fit-content',
            cursor: 'pointer'
          }}
        >
          {/* <Box component='img' src='/assets/svg/checkBox.svg' /> */}

          <Checkbox
            value='Tutor 1'
            checked={isChecked}
            onClick={() => setIsChecked(!isChecked)}
          />

          <Typography onClick={() => setIsChecked(!isChecked)}>
            Allow counter offers
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'start',
            alignItems: 'center'
          }}
        >
          <Typography>Expired date : </Typography>
          <ReactDatePicker handleDate={handleDate} dateValue={date} />
        </Box>

        {/* {isChecked && (
          <Box
            sx={{
              mt: {
                xs: 4,
                md: 3,
              },
            }}
          >
            <Slider />
          </Box>
        )} */}

        <Box
          sx={{
            mt: 6,
            position: 'relative',
            zIndex: 1,
            // width: 'fit-content',
            width: 104,
            // display:'flex',
            mx: 'auto'
            // gridTemplateColumns:'repeat(1, 1fr)',
            // justifyContent:'center'
          }}
        >
          <MButton
            loading={createIsLoading}
            title='CREATE'
            disabled={isDisabled}
            onClick={() => {
              createMutate({
                productB: receivedData,
                productA: dataFetch,
                isChecked,
                newDate: date
              });
            }}
            sx={{
              width: 114,
              height: 114,
              borderRadius: '50%',
              // background: 'linear-gradient(180deg, #0F0F0F 0%, rgba(15, 15, 15, 0) 100%)',
              background: '#000',
              border: '2px solid transparent',
              position: 'absolute',
              color: '#fff',
              top: -55,
              // mx: 'auto',
              // right: { xs: '10%', md: '45%' },
              // left: { xs: '10%', md: '45%' },

              '&:after': {
                position: 'absolute',
                top: -5,
                left: -5,
                right: -5,
                bottom: -5,
                background:
                  'linear-gradient(90deg, #C732A6 0%, #460AE4 100%, #460AE4 100%)',
                content: '""',
                zIndex: -1,
                borderRadius: '50%'
              }
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
