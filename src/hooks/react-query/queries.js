/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-identical-functions */
import { useQueries, useQuery } from '@tanstack/react-query';
import { Alchemy, Network } from 'alchemy-sdk';
import { useAccount, useWagmi, useSigner } from 'wagmi';
import { ethers } from 'ethers';
import axios from 'axios';
import {
  erc1155_Contact_Abi,
  erc721_Contact_Abi,
  erc20_Contact_Abi,
  zeoTC_Contract_Address,
  zeoTC_Contract_Abi
} from 'contract';
import { delay, getUserNFts, isJsonString } from 'helpers/utilities';
import { useSelectWeb3 } from 'hooks/useSelectWeb3';
//const { signer } = useSelectWeb3();
import { queryKeys } from './queryConstants';

const settings = {
  apiKey: '9BAxqf4GeMLJ4C9uwsOGo-1PSjtGmsFu',
  network: Network.ETH_GOERLI
};
//a function to get tokenAllowance

export const getAllowanceERC20 = async (tokenAddress, account, signer) => {
  const abi = erc20_Contact_Abi;
  //console.log('getting balance');
  //const { zeoTC_Contract, account, uniSwap_Contract, signer } = useSelectWeb3();

  const contract = new ethers.Contract(tokenAddress, abi, signer);
  // console.log('🚀 ~ file: queries.js:174 ~ queryFn ~ balance', contract);

  let balance = await contract.allowance(account, zeoTC_Contract_Address);
  //console.log('balance ' + balance);
  //let finalBalance = Number(balance?.toString(account, zeoTC_Contract_Address));
  //let balance = 0;
  return balance;
};

export const getAllowanceERC721 = async (
  tokenAddress,
  tokenId,
  account,
  signer
) => {
  const abi = erc721_Contact_Abi;
  const contract = new ethers.Contract(tokenAddress, abi, signer);

  let address = await contract.getApproved(tokenId);
  return address.toString() === zeoTC_Contract_Address;
};

export const getAllowanceERC1155 = async (
  tokenAddress,
  tokenId,
  account,
  signer
) => {
  const abi = erc1155_Contact_Abi;
  const contract = new ethers.Contract(tokenAddress, abi, signer);

  let address = await contract.isApprovedForAll(
    account,
    zeoTC_Contract_Address
  );
  return address.toString() === zeoTC_Contract_Address;
};

export const useQueryGetERC20TokenAllowance = async (
  tokenType,
  tokenAddress
) => {
  const { zeoTC_Contract, account, uniSwap_Contract, signer } = useSelectWeb3();

  const tokenAddress_ = tokenAddress;
  if (!tokenType || tokenType === '20') {
    const abi = erc20_Contact_Abi;
    console.log('getting balance');
    const contract = new ethers.Contract(tokenAddress_, abi, signer);
    // console.log('🚀 ~ file: queries.js:174 ~ queryFn ~ balance', contract);

    let balance = await contract.allowance(account, zeoTC_Contract_Address);
    balance = Number(balance?.toString(account, zeoTC_Contract_Address));

    return balance;
  }
  if (!tokenType || tokenType === '721') {
    const abi = erc721_Contact_Abi;

    const contract = new ethers.Contract(tokenAddress_, abi, signer);
    // console.log('🚀 ~ file: queries.js:174 ~ queryFn ~ balance', contract);

    let balance = await contract.allow;
    balance = Number(balance?.toString(account, zeoTC_Contract_Address));

    return balance;
  }
  if (!tokenType || tokenType === '1155') {
    const abi = erc721_Contact_Abi;

    const contract = new ethers.Contract(tokenAddress_, abi, signer);
    // console.log('🚀 ~ file: queries.js:174 ~ queryFn ~ balance', contract);

    let balance = await contract.allow;
    balance = Number(balance?.toString(account, zeoTC_Contract_Address));

    return balance;
  }
};
//a function to get USD value of a listed token, using CoinGecko API. Will return {} if coin is not listed
export const useTokenPrice = (tokenAddress) => {
  const queryKey = ['tokenPrice', tokenAddress];

  return useQuery(queryKey, async () => {
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${tokenAddress}&vs_currencies=usd`
    );
    return data[tokenAddress].usd;
  });
};

//a function to get Metadata of a token
const getMetaData = async (tokenAddress) => {
  const alchemy = new Alchemy(settings);

  return alchemy.core.getTokenMetadata(tokenAddress);
};

//a function to split metadata into readeable datas to be shown on OfferCard
export const handleMetaData = (data) => {
  const url = data;
  const newUrl = url?.split(':');
  let name = newUrl[1]?.split(',');
  name = name[0];
  let description = newUrl[2]?.split(',');
  description = description[0] + ' ' + description[1] + ' ' + description[2];
  let image = newUrl[3] + ':' + newUrl[4]?.split('}');
  image = image.split(',');
  image = image[0].split('"');
  image = image[1];

  return {
    name,
    description,
    image
  };
};
// =====================================================

//a function to get all the existing zeSwaps, for example to be shown on marketplace page
export const useQueryZeSwapIdList = () => {
  const { zeoTC_Contract, account, uniSwap_Contract } = useSelectWeb3();
  const queryKey = [queryKeys.getZeSwapIdList];
  // const queryFn = () => zeoTC_Contract.get_zeSwap_id_list();
  const queryFn = () => zeoTC_Contract.get_zeSwap_id_list();

  return useQuery(queryKey, queryFn, {
    enabled: !!zeoTC_Contract,
    select: (res) => {
      return res;
    },
    onError: (err) => {
      console.log(err);
    }
  });
};

// =====================================================
//a function to filter certain list of swaps (could be initial or counter swaps), and split the data from chain into javascript variables respectively as swap structure
export const useQueriesFilterMarketPlaceData = (
  zeSwapIdList = [],
  isTrade = false
) => {
  const { zeoTC_Contract, account, uniSwap_Contract } = useSelectWeb3();
  //console.log('total swap ' + zeSwapIdList.length);
  //console.log(JSON.stringify(zeSwapIdList));
  const queryFn = async (swap_id) => {
    const data = [];

    const swap = await zeoTC_Contract.get_zeSwap(swap_id);
    //console.log('getting swap id ' + swap_id.toString());

    data[swap_id] = {
      swap: swap,
      swap_id
    };

    for (const offer_id of swap.offers) {
      const offer = await zeoTC_Contract.get_offers(offer_id);

      data[swap_id] = {
        ...data[swap_id],
        offer,
        productA: [],
        productB: []
      };

      for (const productA_id of offer.product_A_ids) {
        const product = await zeoTC_Contract.get_product(productA_id);
        let amount = product.amount.toString();
        amount = Number(amount);

        const metadata = await getMetaData(product?.token);

        data[swap_id].productA.push({
          ...product,
          metadata
        });
      }

      for (const productB_id of offer.product_B_ids) {
        const product = await zeoTC_Contract.get_product(productB_id);
        const metadata = await getMetaData(product.token);

        data[swap_id].productB.push({
          ...product,
          metadata
        });
      }
    }

    return Object.values(data);
  };

  const queries = zeSwapIdList?.map((swap_id, idx) => ({
    queryKey: [queryKeys.getQueriesSwapDetails, swap_id],
    queryFn: () => queryFn(swap_id),
    enabled: !!zeoTC_Contract && !!zeSwapIdList
  }));
  const results = useQueries({
    queries
  });

  return results?.map((result) => result.data?.[0]);
};

export const testGetSwap = async () => {
  const { zeoTC_Contract, account, uniSwap_Contract } = useSelectWeb3();
  const swap = await zeoTC_Contract.get_swap_by_offer(
    '0x11e6d8bbcf24e712b1337bab85461d8e8d1d562a2bb92747843fc36e34a3dbf7'
  );
  console.log(JSON.stringify(swap));
  return swap;
};

export const useQueriesFilterCounterOfferData = (
  offerIdList = [],
  isTrade = false
) => {
  const { zeoTC_Contract, account, uniSwap_Contract } = useSelectWeb3();
  console.log('filtering offers ');

  //console.log('total swap ' + zeSwapIdList.length);
  //console.log(JSON.stringify(zeSwapIdList));
  //const { swaplist } = useQueryZeSwapIdList();
  //swaplist_ = zeSwapIdList;
  const queryFn = async (offer_id, swaplist_) => {
    const data = [];
    //console.log('looping offer id ' + offer_id);
    let swap_id_ = '0x1';
    const swap = await zeoTC_Contract.get_swap_by_offer(offer_id);
    swap_id_ = swap.swap_id;
    //console.log('swaplist : ' + JSON.stringify(swaplist_));

    //console.log('getting swap id ' + swap_id.toString());
    //console.log(JSON.stringify(swap));
    data[swap_id_] = {
      swap: swap,
      swap_id_
    };

    const offer = await zeoTC_Contract.get_offers(offer_id);

    data[swap_id] = {
      ...data[swap_id],
      offer,
      productA: [],
      productB: []
    };

    for (const productA_id of offer.product_A_ids) {
      const product = await zeoTC_Contract.get_product(productA_id);
      let amount = product.amount.toString();
      amount = Number(amount);

      const metadata = await getMetaData(product?.token);

      data[swap_id].productA.push({
        ...product,
        metadata
      });
    }

    for (const productB_id of offer.product_B_ids) {
      const product = await zeoTC_Contract.get_product(productB_id);
      const metadata = await getMetaData(product.token);

      data[swap_id].productB.push({
        ...product,
        metadata
      });
    }

    return Object.values(data);
  };

  const queries = offerIdList?.map((offer_id, idx) => ({
    queryKey: [queryKeys.getQueriesSwapDetails, offer_id],
    queryFn: () => queryFn(offer_id),
    enabled: !!zeoTC_Contract
  }));
  const results = useQueries({
    queries
  });

  return results?.map((result) => result.data?.[0]);
};

//================================================

export const useQueryApprove = () => {
  const queryKey = [queryKeys.approveContract];
  const queryFn = async () => {
    return null;
  };

  return useQuery(queryKey, queryFn, {
    refetchOnWindowFocus: false
  });
};

// ===================================================================
//function to get list of tokens owned by an address, all will be returned : ERC721, ERC20, and ERC1155. Used in selecting token in Create OTC
export const useQueryGetUserNFTs = () => {
  // // const notify = useNotify();
  const { zeoTC_Contract, account, uniSwap_Contract, signer } = useSelectWeb3();

  const queryKey = [queryKeys.getUserNFTS, account];
  const nftApi = `https://deep-index.moralis.io/api/v2/${account}/nft`;
  const tokensApi = `https://deep-index.moralis.io/api/v2/${account}/erc20`;

  const queryFn = async () => {
    const tokensData = await getUserNFts(tokensApi);
    //console.log('getting tokens in wallet ' + JSON.stringify(tokensData));
    let nftsData = await getUserNFts(nftApi);
    nftsData = nftsData.result;
    // nftsData = nftsData.slice(0, 2);
    const nftsWithMetaData = [];
    const abi = erc721_Contact_Abi;

    for (const item of nftsData) {
      // console.log(item);
      const metadata = item?.metadata;

      let balance = 0;

      //? ERC721
      try {
        if (item?.contract_type === 'ERC721') {
          const abi = erc721_Contact_Abi;

          const contract = new ethers.Contract(
            item?.token_address,
            abi,
            signer
          );
          // console.log('🚀 ~ file: queries.js:174 ~ queryFn ~ balance', contract);

          balance = await contract.balanceOf(account);
          balance = Number(balance?.toString());
          // console.log('🚀 ~ file: queries.js:174 ~ queryFn ~ balance', balance);
        }

        //? ERC1155
        if (item?.contract_type === 'ERC1155') {
          // /console.log('ERC1155');
          const abi = erc1155_Contact_Abi;

          const contract = new ethers.Contract(
            item?.token_address,
            abi,
            signer
          );

          balance = await contract.balanceOf(account, item?.token_id);
          balance = Number(balance?.toString());
        }
      } catch (error) {
        console.log(error);
      }

      let newMetadata;

      if (balance > 0) {
        //metadata.balance = balance;
        if (!metadata) {
          const fetchMetadata = await fetch(item?.token_uri);
          const res = await fetchMetadata.json();
          newMetadata = res;
          await delay(1000);
        } else {
          const isJson = isJsonString(metadata);

          if (isJson) newMetadata = JSON.parse(metadata);
          else newMetadata = metadata;
        }

        nftsWithMetaData.push({
          ...item,
          newMetadata
        });
      }
    }

    // const unresolved = nftsData?.map(async (item, idx) => {
    //   return await setTimeout(async () => {

    //     // const res = await handleMetaDataFromUri(item.token_uri);

    //   }, 1000);
    // });

    // const resolved = await Promise.all(unresolved);

    return {
      nftsData: nftsWithMetaData,
      tokensData
    };
  };

  ///function to get specific token balance

  return useQuery(queryKey, queryFn, {
    refetchOnWindowFocus: false,
    enabled: !!account
    // onError: (error) => notify('error', 'Error while fetching the name'),
  });
};

//function to get specific token balance
export const useQueryTokenBalance = (tokenAddress) => {
  // // const notify = useNotify();
  const { zeoTC_Contract, account, uniSwap_Contract, signer } = useSelectWeb3();

  const queryKey = [queryKeys.getUserNFTS, tokenAddress];
  const tokenAddress_ = tokenAddress;

  const queryFn = async () => {
    const abi = erc20_Contact_Abi;

    const contract = new ethers.Contract(tokenAddress_, abi, signer);
    // console.log('🚀 ~ file: queries.js:174 ~ queryFn ~ balance', contract);

    let balance = await contract.balanceOf(account);
    balance = Number(balance.toString()).toLocaleString('fullwide', {
      useGrouping: false
    });

    return balance;
  };

  return useQuery(queryKey, queryFn, {
    refetchOnWindowFocus: false,
    enabled: !!account
    // onError: (error) => notify('error', 'Error while fetching the name'),
  });
};

//function to get custom ERC20 token metadata on create OTC
export const useQueryGetCustomERC20 = (tokenAddress_) => {
  // // const notify = useNotify();
  const { zeoTC_Contract, account, uniSwap_Contract, signer } = useSelectWeb3();

  const queryKey = [queryKeys.searchCustomTokens, account];
  const tokenAddress = tokenAddress_;
  const url = `https://deep-index.moralis.io/api/v2/erc20/${tokenAddress}`;

  const queryFn = async () => {
    const tokensData = await getUserNFts(url);
    console.log('axios 2 ' + tokensData.toString());

    return {
      tokensData
    };
  };

  return useQuery(queryKey, queryFn, {
    refetchOnWindowFocus: false,
    enabled: false
    // onError: (error) => notify('error', 'Error while fetching the name'),
  });
};

//function to get custom NFT metadata on create OTC
export const useQueryGetCustomNFT = (tokenAddress_, tokenId_) => {
  // // const notify = useNotify();
  const { zeoTC_Contract, account, uniSwap_Contract, signer } = useSelectWeb3();

  const queryKey = [queryKeys.searchCustomNFTS, account];
  const tokenAddress = tokenAddress_;
  const url = `https://deep-index.moralis.io/api/v2/nft/${tokenAddress}/${tokenId_}`;

  const queryFn = async () => {
    const NFTData = await getUserNFts(url);

    const NFTDataMapping = {
      ...NFTData,
      ...(typeof NFTData.metadata === 'string' && {
        newMetadata: JSON.parse(NFTData.metadata)
      })
    };

    return {
      tokensData: NFTDataMapping
    };
  };

  return useQuery(queryKey, queryFn, {
    refetchOnWindowFocus: false,
    enabled: false
    // onError: (error) => notify('error', 'Error while fetching the name'),
  });
};

//===================================================
export const useQueriesGetUserData = () => {
  // // const notify = useNotify();
  // const { zeoTC_Contract, account, uniSwap_Contract, } = useSelectWeb3();
  // // const queryKey = [queryKeys.getUserNFTS, account];
  // const nftApi = 'https://deep-index.moralis.io/api/v2/0x231f1408651bEc4f7fDe1670d29BD90477E92768/nft';
  // const tokensApi = 'https://deep-index.moralis.io/api/v2/0x231f1408651bEc4f7fDe1670d29BD90477E92768/erc20';
  // const queryFn = async (tokenId) => {
  //   const tokensData = await getUserNFts(tokensApi);
  //   let nftsData = await getUserNFts(nftApi);
  //   nftsData = nftsData.result;
  //   nftsData = nftsData.slice(0, 5);
  //   return {
  //     nftsData,
  //     tokensData,
  //   };
  // };
  // const nftsData = queryFn();
  // const queries = nftsData?.map((nft, idx) => ({
  //   queryKey: [queryKeys.babyParent, account, nft.name],
  //   queryFn: () => queryFn(),
  //   enabled: !!account,
  //   select: (res) => {
  //     console.log(res);
  //   },
  // }));
  // const results = useQueries({
  //   queries,
  // });
  // return results.map((result) => result);
};

// ==========================================================
//get ERC20 token owned by a certain address regardless of the balance
export const useQuerySearchTokens = ({ account }) => {
  const queryKey = [queryKeys.getSearchTokens, account];
  const queryFn = async () => {
    //  const nftApi = `https://deep-index.moralis.io/api/v2/${account}/nft`;
    // const tokensApi = `https://deep-index.moralis.io/api/v2/${account}/erc20`;
    const tokensApi = 'https://deep-index.moralis.io/api/v2/erc20/metadata';

    return await getUserNFts(tokensApi, account);
  };

  return useQuery(queryKey, queryFn, {
    refetchOnWindowFocus: false,
    enabled: false

    // onError: (error) => notify('error', 'Error while fetching the name'),
  });
};

// ================================================================
//get NFT token owned by a certain address regardless of the balance
export const useQuerySearchNFTs = ({ account }) => {
  const queryKey = [queryKeys.getSearchNFTs, account];

  const queryFn = async () => {
    const nftApi = `https://deep-index.moralis.io/api/v2/nft/${account}`;

    let nftsData = await getUserNFts(nftApi);
    nftsData = nftsData.result;
    nftsData = nftsData.slice(0, 2);

    const unresolved = nftsData?.map(async (item, idx) => {
      const newMetadata = await fetch(item?.token_uri);
      const res = await newMetadata.json();

      return {
        ...item,
        newMetadata: res
      };
    });

    return await Promise.all(unresolved);
  };

  return useQuery(queryKey, queryFn, {
    refetchOnWindowFocus: false,
    enabled: false
    // onError: (error) => notify('error', 'Error while fetching the name'),
  });
};

// ==========================================================================
//function to get list of swaps created by the caller's address
export const useQueryMyZeSwapId = () => {
  const { zeoTC_Contract, account, uniSwap_Contract } = useSelectWeb3();

  const queryKey = [queryKeys.myZeSwapId, account];

  const queryFn = async () => {
    return await zeoTC_Contract.get_my_zeSwaps_ids();
  };

  return useQuery(queryKey, queryFn, {
    refetchOnWindowFocus: false,
    select: (res) => {
      // console.log('🚀3', res);

      return res;
    },
    enabled: !!account
    // onError: (error) => notify('error', 'Error while fetching the name'),
  });
};
//function to get list of offers created by the caller's address
export const useQueryOfferId = () => {
  const { zeoTC_Contract, account, uniSwap_Contract } = useSelectWeb3();

  const queryKey = [queryKeys.offerIdList, account];

  const queryFn = async () => {
    return await zeoTC_Contract.get_my_offer_ids();
  };

  return useQuery(queryKey, queryFn, {
    refetchOnWindowFocus: false,
    select: (res) => {
      return res;
    },
    enabled: !!account
  });
};

// function get_counter_offers_id_list(address addr)
export const getCounterOffers = async (userAddress) => {
  //console.log('getting list of counter offers');
  return '';
  if (!userAddress) return null;
  const { zeoTC_Contract, account, uniSwap_Contract } = useSelectWeb3();
  const offersList = await zeoTC_Contract.get_counter_offers_id_list(
    userAddress
  );
  return offersList;
};
//function to get list of counter offers created by the caller's address

export const useQueryCounterOfferIdList = () => {
  const { zeoTC_Contract, account, uniSwap_Contract } = useSelectWeb3();

  const queryKey = [queryKeys.createCounterOffer, account];

  const queryFn = async () => {
    const offersList = await zeoTC_Contract.get_counter_offers_id_list(account);
    //console.log('offers : ' + JSON.stringify(offersList));
    for (const offer of offersList) {
      // console.log('offer list ' + JSON.stringify(offer));
      const theoffer = await zeoTC_Contract.get_offers(offer);
      //console.log('theoffer ' + JSON.stringify(theoffer));
    }
    return offersList;
  };
  // const queryKey = [queryKeys.createCounterOffer, account];

  return useQuery(queryKey, queryFn, {
    refetchOnWindowFocus: false,
    enabled: !!account
  });
};

// =====================================================

// let nft_contract = new ethers.Contract(token, nft_erc1155_abi, signer_wss);
// console.log(
//   'nft',
//   nft_contract.address,
//   (await nft_contract.balanceOf(signer_wss.address, token_id)) + '',
//   token_id + '',
// );

//function to get list of Swap history with status completed created by the caller's address
export const useQueriesGetSwapHistory = (zeSwapIdList = []) => {
  const { zeoTC_Contract, account, uniSwap_Contract } = useSelectWeb3();

  const queryFn = async (swap_id) => {
    const data = [];

    const swap = await zeoTC_Contract.get_zeSwap(swap_id);

    if (swap?.status !== 2) return null;

    // Swap History
    // if (swap?.[7] == 2) {
    data[swap_id] = {
      swap: swap,
      swap_id
    };

    for (const offer_id of swap.offers) {
      const offer = await zeoTC_Contract.get_offers(offer_id);

      data[swap_id] = {
        ...data[swap_id],
        offer,
        productA: [],
        productB: []
      };

      for (const productA_id of offer.product_A_ids) {
        const product = await zeoTC_Contract.get_product(productA_id);

        let amount = product.amount.toString();
        amount = Number(amount);

        const metadata = await getMetaData(product?.token);

        data[swap_id].productA.push({
          ...product,
          metadata
        });
      }

      for (const productB_id of offer.product_B_ids) {
        const product = await zeoTC_Contract.get_product(productB_id);

        const metadata = await getMetaData(product.token);

        data[swap_id].productB.push({
          ...product,
          metadata
        });
      }
    }

    // console.log(data);
    let swapHistoryData = Object.values(data);
    swapHistoryData = swapHistoryData?.[0]?.offer ? swapHistoryData : null;

    return swapHistoryData;
    // }

    // return 1  ;
  };

  const queries = zeSwapIdList?.map((swap_id, idx) => ({
    queryKey: [queryKeys.getSwapHistory, swap_id],
    queryFn: () => queryFn(swap_id)
    // enabled: !!zeoTC_Contract && !!zeSwapIdList,
  }));
  const results = useQueries({
    queries
  });

  const data = results.map((result) => {
    // console.log(result?.data)
    return result?.data?.[0];
  });

  //  console.log(data);
  return data.filter((item) => item);
};

// =====================================================

export const useQueriesGetSwap = (zeSwapIdList = []) => {
  const { zeoTC_Contract, account, uniSwap_Contract } = useSelectWeb3();

  const queryFn = async (swap_id) => {
    const data = [];

    const swap = await zeoTC_Contract.get_zeSwap(swap_id);

    // Swap
    if (swap?.status === 0 || swap?.status === 1) {
      data[swap_id] = {
        swap: swap,
        swap_id
      };

      for (const offer_id of swap.offers) {
        const offer = await zeoTC_Contract.get_offers(offer_id);

        data[swap_id] = {
          ...data[swap_id],
          offer,
          productA: [],
          productB: []
        };

        for (const productA_id of offer.product_A_ids) {
          const product = await zeoTC_Contract.get_product(productA_id);

          let amount = product.amount.toString();
          amount = Number(amount);

          const metadata = await getMetaData(product?.token);

          data[swap_id].productA.push({
            ...product,
            metadata
          });
        }

        for (const productB_id of offer.product_B_ids) {
          const product = await zeoTC_Contract.get_product(productB_id);
          const metadata = await getMetaData(product.token);

          data[swap_id].productB.push({
            ...product,
            metadata
          });
        }
      }

      return Object.values(data);
    }

    return null;
  };

  const queries = zeSwapIdList?.map((swap_id, idx) => ({
    queryKey: [queryKeys.getQueriesSwapDetails, swap_id],
    queryFn: () => queryFn(swap_id),
    enabled: !!zeoTC_Contract && !!zeSwapIdList
  }));
  const results = useQueries({
    queries
  });

  const swapData = results.map((result) => result?.data?.[0]);

  return swapData.filter((item) => item);
};

export const useQueriesGetProduct = () => {
  const { zeoTC_Contract, account, uniSwap_Contract } = useSelectWeb3();

  const queryFn = async (product_id) => {
    const data = [];

    const prod = await zeoTC_Contract.get_product(product_id);

    if (prod.length > 0) {
      return {
        product: true
      };
    } else {
      return {
        product: false
      };
    }

    return null;
  };

  const queries = zeSwapIdList?.map((swap_id, idx) => ({
    queryKey: [queryKeys.getQueriesSwapDetails, swap_id],
    queryFn: () => queryFn(swap_id),
    enabled: !!zeoTC_Contract && !!zeSwapIdList
  }));
  const results = useQueries({
    queries
  });

  const swapData = results.map((result) => result?.data?.[0]);

  return swapData.filter((item) => item);
};
///////////////////////////////////////////////////////////////////////////////////////////////
export const useQueriesGetOffer = async (offer_id) => {
  const { zeoTC_Contract, account, uniSwap_Contract } = useSelectWeb3();

  //const queryFn = async (product_id) => {
  const data = [];
  //let offer_id = offer_id;
  let offer_id_ =
    '0x09b6d386c36272697d152369d132879d603246827e1251f2f856f198d75dc8f0';
  const prod = await zeoTC_Contract.get_offers(offer_id_);
  //const { zeoTC_Contract, account, uniSwap_Contract } = useSelectWeb3();
  //const swap = await zeoTC_Contract.get_swap_by_offer(
  //'0x11e6d8bbcf24e712b1337bab85461d8e8d1d562a2bb92747843fc36e34a3dbf7'
  //);
  //console.log('theswap is : ' + JSON.stringify(swap));
  if (prod.length > 0) {
    console.log('offer id : ' + offer_id_);
    //console.log()
    //console.log('offer data : ' + JSON.stringify(prod));
    //console.log('product A ids : ' + JSON.stringify(prod.product_A_ids));
    //console.log('product B ids : ' + JSON.stringify(prod.product_B_ids));
    return {
      product: true
    };
  } else {
    return {
      product: false
    };
  }

  return null;
  //};

  const queries = zeSwapIdList?.map((swap_id, idx) => ({
    queryKey: [queryKeys.getQueriesSwapDetails, swap_id],
    queryFn: () => queryFn(swap_id),
    enabled: !!zeoTC_Contract && !!zeSwapIdList
  }));
  const results = useQueries({
    queries
  });

  const swapData = results.map((result) => result?.data?.[0]);

  return swapData.filter((item) => item);
};
// ============================================================
export const getSwap = async (swap_id, signer) => {
  const abi = zeoTC_Contract_Abi;
  const data = [];
  const contract = new ethers.Contract(zeoTC_Contract_Address, abi, signer);
  //console.log('refetching ' + swap_id);
  const swap = await contract.get_zeSwap(swap_id);

  // Swap
  if (swap?.status === 0 || swap?.status === 1) {
    //console.log('loop');
    data[swap_id] = {
      swap: swap,
      swap_id
    };

    for (const offer_id of swap.offers) {
      //console.log('loop 2');
      const offer = await contract.get_offers(offer_id);

      data[swap_id] = {
        ...data[swap_id],
        offer,
        productA: [],
        productB: []
      };

      for (const productA_id of offer.product_A_ids) {
        const product = await contract.get_product(productA_id);

        let amount = product.amount.toString();
        amount = Number(amount);

        const metadata = await getMetaData(product?.token);

        data[swap_id].productA.push({
          ...product,
          metadata
        });
      }

      for (const productB_id of offer.product_B_ids) {
        const product = await contract.get_product(productB_id);
        const metadata = await getMetaData(product.token);

        data[swap_id].productB.push({
          ...product,
          metadata
        });
      }
    }
    //console.log(
    // 'fetch result ' + JSON.stringify(data[swap_id]) + ' from ' + swap
    //);
    //return Object.values(data[swap_id]);
    return data[swap_id];
  }
};
