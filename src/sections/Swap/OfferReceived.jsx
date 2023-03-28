/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable sonarjs/no-duplicate-string */

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Divider, Typography } from '@mui/material';
import { ethers } from 'ethers';
//import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useSigner } from 'wagmi';
import LoadingAmount from 'components/LoadingAmount';
import MButton from 'components/MButton';
import CreateToken from 'components/modal/CreateToken';
import CreateTokenSwap from 'components/modal/CreateTokenSwap';
import { getExpieredTime, getTokenPriceInUsd } from 'helpers/utilities';
import {
  useERC20_ERC721_ERC1155Approve,
  useMutationSetProduct,
  useMutationSwapAccept,
  useMutationSwapCounterOffer,
  useMutationReject,
  useMutationRemoveProduct
} from 'hooks/react-query/mutation';
import {
  useQueriesGetOffer,
  testGetSwap,
  getSwap,
  useQueriesGetRelatedSwaps,
  useQueryZeSwapIdList,
  useQueriesGetSwap,
  getAllowanceERC20,
  getAllowanceERC1155,
  getAllowanceERC721
} from 'hooks/react-query/queries';
import { useSelectWeb3 } from 'hooks/useSelectWeb3';
import { getProductDetails } from 'redux/slice/otcTrades';

import OfferCard from '../../components/card/OfferCard';
import { Border } from '../../components/Style';
import { filter } from 'lodash';

export default function OfferReceived({ selectedCard_, refetchData }) {
  const swap_id = selectedCard_?.swap_id;
  const { data: zeSwapIdsList, error, isLoading } = useQueryZeSwapIdList();
  const newZeSwapList = useQueriesGetSwap(zeSwapIdsList);
  const [filteredZeSwapIdList, setFilteredZeSwapIdList] = useState();
  const { account } = useSelectWeb3();
  //console.log('account ' + account);
  const allFinished = useMemo(() => {
    //console.log('send memo ');
    if (newZeSwapList.length !== 0) {
      //console.log('send memo ' + newZeSwapList.length);
      let flag = true;

      newZeSwapList.forEach((e) => {
        if (e === undefined) {
          flag = false;
        }
      });

      return flag;
    }

    return false;
  }, [newZeSwapList]);
  //////////////////////////////////////////////////////////////////////////////////////////////////
  const getOfferedTokenAmount = (card) => {
    //console.log('swap id ' + swap_id);
    if (
      !filteredZeSwapIdList ||
      filteredZeSwapIdList.length < 1 ||
      card === undefined
    )
      return 0;
    let totalOffered = 0;

    const A_ = filteredZeSwapIdList
      .filter(
        (swapList) =>
          swapList.swap[2] === account && swapList.swap[0] != swap_id
      )
      .map((swapList, idx) => {
        //console.log('checking prod B ');
        const checkProductB = swapList.productB.map((item, index) => {
          //console.log('card detail ' + JSON.stringify(card));
          // console.log('item detail ' + JSON.stringify(item));

          if (card?.token != undefined && item?.token === card?.token) {
            //console.log('demander ' + item.metadata.name + ' ' + item.amount);
            totalOffered += Number(item.amount);
            /*// if (card?.contract_type && card?.contract_type === undefined) {
          let balance = getAllowanceERC20(item.token, account, signer)
            .then((result) => {
              totalOffered += Number(result);
              console.log('offered Token Total ' + totalOffered);
            })
            .catch((error) => {
              console.error(error);
            });
          //} */
          }
        });
      });
    const B_ = filteredZeSwapIdList
      .filter((swapList) => swapList.swap[1] === account)
      .map((swapList, idx) => {
        // console.log('checking prod A ');
        const checkProductA = swapList.productB.map((item, index) => {
          // console.log('card detail ' + JSON.stringify(card));
          // console.log('item detail ' + JSON.stringify(item));

          if (card?.token != undefined && item?.token === card?.token) {
            console.log('creator ' + item.metadata.name + ' ' + item.amount);
            totalOffered += parseFloat(
              Number(item.amount / 10 ** item.metadata.decimals).toFixed(6)
            );
            /*// if (card?.contract_type && card?.contract_type === undefined) {
          let balance = getAllowanceERC20(item.token, account, signer)
            .then((result) => {
              totalOffered += Number(result);
              console.log('offered Token Total ' + totalOffered);
            })
            .catch((error) => {
              console.error(error);
            });
          //} */
          }
        });
      });
    console.log('total offered ' + totalOffered);
    return totalOffered;
  };

  useEffect(() => {
    if (allFinished) {
      // all the queries have executed successfully
      setFilteredZeSwapIdList(
        newZeSwapList.filter(
          (item) =>
            item.swap[0] != swap_id &&
            item.swap.status < 2 &&
            (item.swap[1] == account ||
              item.swap[2] == account ||
              item.swap[2] == '0x0000000000000000000000000000000000000000')
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allFinished, account]);
  const { data: signer } = useSigner();
  const [removableA, setRemovableA] = useState(true);
  const [removableB, setRemovableB] = useState(true);
  const [selectedCard, setSelectedCard] = useState(selectedCard_);
  useEffect(() => {
    if (selectedCard_ == undefined || signer == undefined) return;
    setSelectedCard(selectedCard_);
  }, [selectedCard_, signer]);
  //
  const [openReceive, setOpenReceive] = useState(false);
  const handleOpenReceive = () => setOpenReceive(true);
  const handleCloseReceive = () => setOpenReceive(false);

  const [openOffer, setOpenOffer] = useState(false);
  const handleOpenOffer = () => setOpenOffer(true);
  const handleCloseOffer = () => setOpenOffer(false);

  const [counterArr, setCounterArr] = useState([]);

  //const { account } = useSelectWeb3();
  const dispatch = useDispatch();
  const router = useRouter();
  const [productDetails, setProductDetails] = useState([]);
  const [productDetailsA, setProductDetailsA] = useState([]);
  //const isDemander = account.address === selectedCard?.demander;
  const [isDemander, setIsDemander] = useState(false);

  useEffect(() => {
    //console.log('account : ' + JSON.stringify(account));
    //console.log('card : ' + JSON.stringify(selectedCard?.swap[2]));
    setIsDemander(account === selectedCard?.swap[2]);
  }, [account, selectedCard]);
  useEffect(() => {
    //setProductDetails(selectedCard?.productB);
    //setProductDetailsA(selectedCard?.productA);
    //console.log(' total swap offer A ' + selectedCard?.productA.length);
    //console.log(' total swap offer B ' + selectedCard?.productB.length);
    let pB = selectedCard?.productB;
    let newPB = pB?.map((item, idx) => {
      //console.log('original B ' + selectedCard?.productB[idx].amount);
      pB[idx].amount = item.amount / 10 ** item.metadata.decimals;
      //handleProductDetails(item.idx, (item.amount / (10 ** item.metadata.decimals)));
    });
    setProductDetails(pB);
    let pA = selectedCard?.productA;
    let newPA = pA?.map((item, idx) => {
      //console.log('original A ' + selectedCard?.productA[idx].amount);
      pA[idx].amount = item.amount / 10 ** item.metadata.decimals;
      //handleProductDetails(item.idx, (item.amount / (10 ** item.metadata.decimals)));
    });
    setProductDetailsA(pA);
    //setProductDetailsA(newPA);*/
  }, [selectedCard]);
  const { mutate: rejectOffer } = useMutationReject();
  const handleRejectOffer = () => {
    //console.log('rejecting ' + zeSwapList?.swap_id?.toString());
    rejectOffer({
      swap_id,
      expire: expire
    });
  };
  const handleProductDetails = (idx, value) => {
    setInitB(1);
    // console.log('details ' + value);
    const updatedAmount = [...productDetails];
    updatedAmount[idx].amount = value;
    setProductDetails(updatedAmount);
  };

  const handleProductAmountA = (idx, value) => {
    setInitA(1);
    // console.log('detailsA ' + value);
    const updatedAmount = [...productDetailsA];
    updatedAmount[idx].amount = value;
    setProductDetailsA(updatedAmount);
  };

  const refreshPage = () => {
    // refetchData();
    let r = getSwap(swap_id, signer)
      .then((result) => {
        //console.log('before cancel ' + JSON.stringify(zeSwapList));
        //console.log('fetched after cancel ' + JSON.stringify(result));
        setSelectedCard(result);
      })
      .catch((error) => {
        console.error(error);
      });
    //router.reload();
  };

  useEffect(() => {
    /*if (productDetails.length() < 2) {
      setRemovableB(false);
    } else {
      setRemovableB(true);
    }
    if (productDetailsA.length() < 2) {
      setRemovableA(false);
    } else {
      setRemovableA(true);
    } */
  }, [productDetails, productDetailsA]);

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
  const [zeroProductA, setZeroProductA] = useState(0);
  const [zeroProductB, setZeroProductB] = useState(0);
  const [isNewToken, setIsNewToken] = useState(false);
  //const [ProductA, setProductA] = useState(productDetailsA);
  //const [ProductB, setProductB] = useState(productDetails);
  const ProductA = productDetailsA;
  const ProductB = productDetails;

  const status = selectedCard?.swap?.status;
  const Trade = selectedCard?.swap?.visibility;

  const supplier = selectedCard?.swap?.supplier;
  const isSupplier = supplier === account;

  const counterOfferStatus = selectedCard?.swap?.allow_counter_offer;
  const demander = selectedCard?.swap?.demander;
  const offer_id = selectedCard?.swap?.offers?.[0];
  let expire = selectedCard?.swap?.expiration;
  expire = expire?.toString();
  const dataFetch = useSelector((state) => state.otcTrades.selectNfts);

  const receivedData = useSelector(
    (state) => state.otcTrades.selectTokenNftsReceive
  );

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
  const { mutate: mutateRemoveOffer, isLoading: isRemoveLoading } =
    useMutationRemoveProduct();
  //const datas = useQueriesGetOffer(offer_id);
  //const someswap = testGetSwap();
  const removeOffer = (card, isReceived) => {
    console.log(
      'removing ' +
        JSON.stringify(card[0]) +
        ' from ' +
        JSON.stringify(
          selectedCard.swap[0] + ' ' + JSON.stringify(selectedCard.swap.offers)
        )
    );
    return;
    /*useMutationRemoveProduct(swap_id, offer_id, card[0]);
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
    } */
  };

  const removeCard = (card, isReceived) => {
    console.log('unchain card being removed ' + JSON.stringify(card));
    if (productDetailsA.includes(card)) {
      //console.log('it is in prodcut A');
      const newValue = productDetailsA.includes(card)
        ? productDetailsA.filter((el) => el !== card)
        : [...productDetailsA, card];
      setProductDetailsA(newValue);
    }
    if (productDetails.includes(card)) {
      //console.log('it is in prodcut A');
      const newValue = productDetails.includes(card)
        ? productDetails.filter((el) => el !== card)
        : [...productDetails, card];
      setProductDetails(newValue);
    }

    return;
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

  const handleSetFun = (data) => {
    mutateSetProduct({
      swap_id,
      offer_id,
      ProductB: [data]
    });
  };
  const allowCounterButton = (isAllow) => {
    //console.log('setting to ' + isAllow);
    setIsNewToken(isAllow);
  };
  const [initA, setInitA] = useState(0);
  const [initB, setInitB] = useState(0);
  const zeroAddress = '0x0000000000000000000000000000000000000000';
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const handleApproveClick = (token, amountToApprove) => {
    setSelectedObjForSet(token.id);

    const tokenAddress = token?.token?.toString() || token?.token_address;

    setSelectedTokenAddress(tokenAddress);

    const tokenType = token?.IERC?.toString() || token?.contract_type;
    setIsApprove(tokenAddress);
    const tokenId = token?.token_id?.toString();
    const decimal = token?.decimals?.toString() || token?.decimals;
    const amount = amountToApprove;

    console.log('to be approved ' + amount);

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
    const formattedData = {
      ...selectedCard,
      productB: ProductB,
      productA: ProductA
    };
    console.log(JSON.stringify(selectedCard));

    CounterOfferMutate({
      id: formattedData,
      product
    });
    allowCounterButton(false);
    // CounterOfferMutate(ProductB);
  };

  const handleSwapAccept = () => {
    acceptMutate(swap_id);
  };

  const handleFormateAmount = (item) => {
    const amount = item
      ? Number(item.toString()).toLocaleString('fullwide', {
          useGrouping: false
        })
      : 0;

    return ethers.utils.formatUnits(amount, item?.metadata?.decimals);
  };

  const [SumOfAmountA, setSumOfAmountA] = useState(0);

  const [SumOfAmountB, setSumOfAmountB] = useState(0);

  const expireDateString = getExpieredTime(expire, 'd:h:m:s', true);

  useEffect(() => {
    if (ProductB?.length !== 0) {
      const totalAmountPool = [];

      ProductB?.forEach((item) => {
        //const formatedTokenAmount = handleFormateAmount(item?.amount);
        const formatedTokenAmount = item?.amount;
        totalAmountPool.push(
          //getTokenPriceInUsd(item.token, formatedTokenAmount)
          Number(formatedTokenAmount)
        );
      });

      Promise.all(totalAmountPool).then((allValues) => {
        if (allValues.includes('conversion not found')) {
          setSumOfAmountB('Failed convert to');
        } else {
          const allTokenAmountValueInUSD = allValues.reduce(
            (acc, curr) => Number(acc) + Number(curr),
            0
          );
          setSumOfAmountB(allTokenAmountValueInUSD);
        }
      });
    }
  }, [ProductB, ProductB?.length]);
  //const {query:} = useQueriesGetOffer()
  useEffect(() => {
    //let datas = useQueriesGetOffer(offer_id);
    if (ProductA?.length !== 0) {
      const totalAmountPool = [];

      ProductA?.forEach((item) => {
        //const formatedTokenAmount = handleFormateAmount(item?.amount);
        const formatedTokenAmount = item?.amount;
        totalAmountPool.push(
          //getTokenPriceInUsd(item.token, formatedTokenAmount)
          Number(formatedTokenAmount)
        );
      });

      Promise.all(totalAmountPool).then((allValues) => {
        if (allValues.includes('conversion not found')) {
          setSumOfAmountA('Failed convert to');
        } else {
          const allTokenAmountValueInUSD = allValues.reduce(
            (acc, curr) => Number(acc) + Number(curr),
            0
          );
          setSumOfAmountA(allTokenAmountValueInUSD);
        }
      });
    }
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
            <Typography color='gray'>Total Value</Typography>

            <LoadingAmount
              isLoading={SumOfAmountA === 0}
              amount={SumOfAmountA + ' USD'}
            />
          </Box>

          {ProductA?.map((card, idx) => {
            //console.log('A datas ' + JSON.stringify(card));

            return (
              <OfferCard
                idx={idx}
                prod={'productA'}
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
                isCounterOfferLoading={isCounterOfferLoading}
                handleApproveClick={isSupplier && handleApproveClick}
                handleCounterOffer={handleCounterOffer}
                isProvideItems={supplier === account}
                isOfferReceived
                allowCounterButton={allowCounterButton}
                removeCard={removeCard}
                refreshPage={refreshPage}
                removableA={removableA}
                getOfferedTokenAmount={getOfferedTokenAmount}
                //onClick={() => removeOffer(card)}
              />
            );
          })}

          {counterOfferStatus && (
            <Box
              sx={{
                display: 'grid',
                width: '100%',
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
                {false && isNewToken && (
                  <MButton
                    disabled={!account && isNewToken}
                    Loading={isCounterOfferLoading}
                    title='Add Token'
                    onClick={() => handleCounterOffer('productA')}
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
                )}
              </Box>

              {counterOfferStatus && (
                <Box
                  onClick={
                    // supplier === account ?
                    handleOpenOffer
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
                    + Search new Token or NFT
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>

        <Box
          sx={{
            alignSelf: 'center',
            justifySelf: 'center'
          }}
        ></Box>

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
            <Typography color='gray'>Total Value</Typography>

            <LoadingAmount
              isLoading={SumOfAmountB === 0}
              amount={SumOfAmountB + ' USD'}
            />
          </Box>

          {ProductB?.map((card, idx) => {
            return (
              <OfferCard
                idx={idx}
                prod={'productB'}
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
                handleCounterOffer={handleCounterOffer}
                isProvideItems={supplier !== account}
                isOfferReceived
                allowCounterButton={allowCounterButton}
                //refreshPage
                removeCard={removeCard}
                refreshPage={refreshPage}
                removableB={removableB}
                allowCounter={counterOfferStatus}
                getOfferedTokenAmount={getOfferedTokenAmount}
                account={account}
                signer={signer}
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
                {false && (
                  <MButton //B
                    disabled={!account && isNewToken}
                    Loading={isCounterOfferLoading}
                    title='Attach Offer'
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
                )}
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
                  + Search new Token or NFT
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
            {
              //demander === zeroAddress &&
              !isDemander && (
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
              )
            }
            {false && demander === account && (
              <Button
                disabled={!account}
                onClick={handleRejectOffer}
                sx={{
                  width: 200,
                  // width:'100%',
                  background:
                    ' linear-gradient(90deg, #C732A6 0%, #460AE4 100%, #C732A6 100%)'
                }}
              >
                Cancel Counter Offer
              </Button>
            )}
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
