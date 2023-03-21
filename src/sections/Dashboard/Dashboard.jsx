/* eslint-disable react-redux/useSelector-prefer-selectors */
/* eslint-disable sonarjs/no-duplicate-string */
import { useEffect, useState } from 'react';
import { useSelectWeb3 } from 'hooks/useSelectWeb3';
import { Box, Checkbox, Divider, Typography, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import OfferCard from 'components/card/CreateOfferCard';
import ReactDatePicker from 'components/DateTimePicker';
import LoadingAmount from 'components/LoadingAmount';
import MButton from 'components/MButton';
import CreateToken from 'components/modal/CreateToken';
import { Border } from 'components/Style';
import { getTokenPriceInUsd } from 'helpers/utilities';
import {
  useERC20_ERC721_ERC1155Approve,
  useMutationCreateZeSwap
} from 'hooks/react-query/mutation';
import { getAllowanceERC20 } from 'hooks/react-query/queries';
import {
  addNewTokenNfts,
  addNewTokenNftsReceive,
  getCreateDateTime
} from 'redux/slice/otcTrades';
import { useQueryGetERC20TokenAllowance } from 'hooks/react-query/queries';
export default function DashboardSection({ swapType }) {
  const dispatch = useDispatch();
  const [openOffer, setOpenOffer] = useState(false);
  const [openReceive, setOpenReceive] = useState(false);
  const [SumOfAmount, setSumOfAmount] = useState(0);
  const [SumOfReceive, setSumOfReceive] = useState(0);
  const [SumOfAmountLoading, setSumOfAmountLoading] = useState(false);
  const [SumOfReceiveLoading, setSumOfReceiveLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isApprove, setIsApprove] = useState('');
  //const { account } = useSelectWeb3();
  const { zeoTC_Contract, account, uniSwap_Contract, signer } = useSelectWeb3();
  const dataFetch = useSelector((state) => state.otcTrades.selectNfts);
  const router = useRouter();

  const privateInput = useSelector(
    (state) => state.web3Slice.privateInputValue
  );
  const zeroAddress = '0x0000000000000000000000000000000000000000';
  const isPrivateInputEmpty =
    swapType === 'Private' && (privateInput === null || privateInput === '');
  useEffect(() => {
    console.log('private input ' + privateInput + ' ' + isPrivateInputEmpty);
  }, [privateInput, isPrivateInputEmpty]);
  const receivedData = useSelector(
    (state) => state.otcTrades.selectTokenNftsReceive
  );
  const {
    data: mutateData,
    isLoading: createIsLoading,
    mutate: createMutate
  } = useMutationCreateZeSwap();
  const [creating, setCreating] = useState(false);
  useEffect(() => {
    if (!createIsLoading && creating) {
      router.push('/myOtcTrades');
    }
  }, [createIsLoading]);

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
    //console.log('to be approved : ' + amount);

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
    const amount = item
      ? Number(item.toString()).toLocaleString('fullwide', {
          useGrouping: false
        })
      : 0;
    // console.log('item value ' + item);

    return amount;
  };
  const [isAllApprovd, setIsAllApprovd] = useState(false);
  const confirmAllowance = async () => {
    let isAllApproved = true;
    dataFetch.forEach(async (item) => {
      //console.log('item approved? ' + item.isApproved);

      if (!item.isApproved) {
        //console.log('not approved');
        isAllApproved = false;
        setIsAllApprovd(false);
        return false;
      }
    });
    //console.log('done ' + isAllApproved);
    setIsAllApprovd(isAllApproved);
    return isAllApproved;
  };

  useEffect(() => {
    //const newData = dataFetch.filter(
    //(item) => item?.isApproved === true && item.amount > 0
    //);
    const newData = dataFetch.filter((item) => item?.isApproved === true);

    if (
      newData.length === dataFetch.length &&
      dataFetch.length > 0 &&
      receivedData.length > 0
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
      //console.log('Please Approve All tokens and NFTs before create');
    }
  }, [dataFetch, receivedData, dataFetch.length, receivedData.length]);

  useEffect(() => {
    if (dataFetch?.length !== 0) {
      setSumOfAmountLoading(true);
      const totalAmountPool = [];

      dataFetch.forEach((item) => {
        //console.log('item type ' + JSON.stringify(item));
        if (item.amount > 0 || item?.contract_type) {
          let vl = item?.amount;
          if (item?.contract_type) vl = 0;
          //console.log('pushing value ' + vl);
          const formatedTokenAmount = handleFormateAmount(vl);

          totalAmountPool.push(
            //getTokenPriceInUsd(item.token, formatedTokenAmount)
            Number(formatedTokenAmount)
          );
        }
      });

      Promise.all(totalAmountPool).then((allValues) => {
        if (allValues.includes('conversion not found')) {
          setSumOfAmountLoading(false);
          setSumOfAmount('Failed convert to');
        } else {
          //console.log('total allValues ' + allValues);
          const allTokenAmountValueInUSD = allValues.reduce(
            (acc, curr) => Number(acc) + Number(curr),
            0
          );
          setSumOfAmountLoading(false);
          //console.log('total ' + allTokenAmountValueInUSD);
          setSumOfAmount(
            parseFloat(Number(allTokenAmountValueInUSD).toFixed(6))
          );
        }
      });
    }
  }, [dataFetch, dataFetch?.length]);

  useEffect(() => {
    if (receivedData?.length !== 0) {
      setSumOfReceiveLoading(true);
      const totalAmountPool = [];

      receivedData.forEach((item) => {
        if (item.amount > 0) {
          const formatedTokenAmount = handleFormateAmount(item?.amount);

          totalAmountPool.push(
            //getTokenPriceInUsd(item.token, formatedTokenAmount)
            Number(formatedTokenAmount)
          );
        }
      });

      Promise.all(totalAmountPool).then((allValues) => {
        if (allValues.includes('conversion not found')) {
          setSumOfReceiveLoading(false);
          setSumOfReceive('Failed convert to');
        } else {
          const allTokenAmountValueInUSD = allValues.reduce(
            (acc, curr) => Number(acc) + Number(curr),
            0
          );
          setSumOfReceiveLoading(false);
          setSumOfReceive(
            parseFloat(Number(allTokenAmountValueInUSD).toFixed(6))
          );
        }
      });
    }
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
            <Typography color='gray'>Total Value</Typography>

            <LoadingAmount
              isLoading={SumOfAmountLoading}
              amount={SumOfAmount + ' USD'}
            />
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
                //handleApproveClick={handleApproveClick}
                getAllowanceERC20={getAllowanceERC20}
                account={account}
                signer={signer}
                confirmAllowance={confirmAllowance}
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
            <Typography color='gray'>Total Value</Typography>

            <LoadingAmount
              isLoading={SumOfReceiveLoading}
              amount={SumOfReceive + ' USD'}
            />
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

          <Button
            onClick={() => setOpenReceive(true)}
            disabled={isPrivateInputEmpty}
            sx={{
              border: `0.3px dashed ${
                isPrivateInputEmpty ? 'gray' : '#FFFFFF'
              }`,
              borderRadius: '17px',
              background: (theme) => theme.palette.primary.main,
              py: 2,
              textAlign: 'center',
              width: '100%',
              '& h6': {
                color: isPrivateInputEmpty ? 'gray' : 'white'
              }
            }}
          >
            <Typography variant='subtitle1'>+ Add new Token or NFT</Typography>
          </Button>

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
            disabled={!isAllApprovd}
            onClick={() => {
              if (confirmAllowance()) {
                let demanderAddress = zeroAddress;
                //console.log('deman 1 ' + demanderAddress);
                if (!isPrivateInputEmpty && privateInput != null)
                  demanderAddress = privateInput;
                // console.log('deman ' + demanderAddress);
                createMutate({
                  productB: receivedData,
                  productA: dataFetch,
                  isChecked,
                  demander: demanderAddress,
                  newDate: date
                });
              } else {
                //console.log('need to approve');
              }
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
