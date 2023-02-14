/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-identical-functions */
import { useQueries, useQuery } from '@tanstack/react-query';
import { Alchemy, Network } from 'alchemy-sdk';
import { ethers } from 'ethers';

import { erc1155_Contact_Abi, erc721_Contact_Abi } from 'contract';
import { delay, getUserNFts, isJsonString } from 'helpers/utilities';
import { useSelectWeb3 } from 'hooks/useSelectWeb3';

import { queryKeys } from './queryConstants';

const settings = {
  apiKey: '9BAxqf4GeMLJ4C9uwsOGo-1PSjtGmsFu',
  network: Network.ETH_GOERLI,
};

const getMetaData = async (tokenAddress) => {
  const alchemy = new Alchemy(settings);

  return alchemy.core.getTokenMetadata(tokenAddress);
};

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
    image,
  };
};
// =====================================================
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
    },
  });
};

// =====================================================

export const useQueriesFilterMarketPlaceData = (
  zeSwapIdList = [],
  isTrade = false,
) => {
  const { zeoTC_Contract, account, uniSwap_Contract } = useSelectWeb3();

  const queryFn = async (swap_id) => {
    const data = [];

    const swap = await zeoTC_Contract.get_zeSwap(swap_id);

    data[swap_id] = {
      swap: swap,
      swap_id,
    };

    for (const offer_id of swap.offers) {
      const offer = await zeoTC_Contract.get_offers(offer_id);

      data[swap_id] = {
        ...data[swap_id],
        offer,
        productA: [],
        productB: [],
      };

      for (const productA_id of offer.product_A_ids) {
        const product = await zeoTC_Contract.get_product(productA_id);

        let amount = product.amount.toString();
        amount = Number(amount);

        const metadata = await getMetaData(product?.token);

        data[swap_id].productA.push({
          ...product,
          metadata,
        });
      }

      for (const productB_id of offer.product_B_ids) {
        const product = await zeoTC_Contract.get_product(productB_id);
        const metadata = await getMetaData(product.token);

        data[swap_id].productB.push({
          ...product,
          metadata,
        });
      }
    }

    return Object.values(data);
  };

  const queries = zeSwapIdList?.map((swap_id, idx) => ({
    queryKey: [queryKeys.getQueriesSwapDetails, swap_id],
    queryFn: () => queryFn(swap_id),
    enabled: !!zeoTC_Contract && !!zeSwapIdList,
  }));
  const results = useQueries({
    queries,
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
    refetchOnWindowFocus: false,
  });
};

// ===================================================================

export const useQueryGetUserNFTs = () => {
  // // const notify = useNotify();
  const { zeoTC_Contract, account, uniSwap_Contract, signer } = useSelectWeb3();

  const queryKey = [queryKeys.getUserNFTS, account];
  const nftApi = `https://deep-index.moralis.io/api/v2/${account}/nft`;
  const tokensApi = `https://deep-index.moralis.io/api/v2/${account}/erc20`;

  const queryFn = async () => {
    const tokensData = await getUserNFts(tokensApi);
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
            signer,
          );
          // console.log('🚀 ~ file: queries.js:174 ~ queryFn ~ balance', contract);

          balance = await contract.balanceOf(account);
          balance = Number(balance?.toString());
          // console.log('🚀 ~ file: queries.js:174 ~ queryFn ~ balance', balance);
        }

        //? ERC1155
        if (item?.contract_type === 'ERC1155') {
          console.log('ERC1155');
          const abi = erc1155_Contact_Abi;

          const contract = new ethers.Contract(
            item?.token_address,
            abi,
            signer,
          );

          balance = await contract.balanceOf(account, item?.token_id);
          balance = Number(balance?.toString());
        }
      } catch (error) {
        console.log(error);
      }

      let newMetadata;

      if (balance > 0) {
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
          newMetadata,
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
      tokensData,
    };
  };

  return useQuery(queryKey, queryFn, {
    refetchOnWindowFocus: false,
    enabled: !!account,
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
    enabled: false,

    // onError: (error) => notify('error', 'Error while fetching the name'),
  });
};

// ================================================================

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
        newMetadata: res,
      };
    });

    return await Promise.all(unresolved);
  };

  return useQuery(queryKey, queryFn, {
    refetchOnWindowFocus: false,
    enabled: false,
    // onError: (error) => notify('error', 'Error while fetching the name'),
  });
};

// ==========================================================================

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
    enabled: !!account,
    // onError: (error) => notify('error', 'Error while fetching the name'),
  });
};

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
    enabled: !!account,
  });
};

// function get_counter_offers_id_list(address addr)

export const useQueryCounterOfferIdList = () => {
  const { zeoTC_Contract, account, uniSwap_Contract } = useSelectWeb3();

  const queryKey = [queryKeys.createCounterOffer, account];

  const queryFn = async () => {
    return await zeoTC_Contract.get_counter_offers_id_list(account);
  };

  return useQuery(queryKey, queryFn, {
    refetchOnWindowFocus: false,
    enabled: !!account,
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
      swap_id,
    };

    for (const offer_id of swap.offers) {
      const offer = await zeoTC_Contract.get_offers(offer_id);

      data[swap_id] = {
        ...data[swap_id],
        offer,
        productA: [],
        productB: [],
      };

      for (const productA_id of offer.product_A_ids) {
        const product = await zeoTC_Contract.get_product(productA_id);

        let amount = product.amount.toString();
        amount = Number(amount);

        const metadata = await getMetaData(product?.token);

        data[swap_id].productA.push({
          ...product,
          metadata,
        });
      }

      for (const productB_id of offer.product_B_ids) {
        const product = await zeoTC_Contract.get_product(productB_id);

        const metadata = await getMetaData(product.token);

        data[swap_id].productB.push({
          ...product,
          metadata,
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
    queryFn: () => queryFn(swap_id),
    // enabled: !!zeoTC_Contract && !!zeSwapIdList,
  }));
  const results = useQueries({
    queries,
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
        swap_id,
      };

      for (const offer_id of swap.offers) {
        const offer = await zeoTC_Contract.get_offers(offer_id);

        data[swap_id] = {
          ...data[swap_id],
          offer,
          productA: [],
          productB: [],
        };

        for (const productA_id of offer.product_A_ids) {
          const product = await zeoTC_Contract.get_product(productA_id);

          let amount = product.amount.toString();
          amount = Number(amount);

          const metadata = await getMetaData(product?.token);

          data[swap_id].productA.push({
            ...product,
            metadata,
          });
        }

        for (const productB_id of offer.product_B_ids) {
          const product = await zeoTC_Contract.get_product(productB_id);
          const metadata = await getMetaData(product.token);

          data[swap_id].productB.push({
            ...product,
            metadata,
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
    enabled: !!zeoTC_Contract && !!zeSwapIdList,
  }));
  const results = useQueries({
    queries,
  });

  const swapData = results.map((result) => result?.data?.[0]);

  return swapData.filter((item) => item);
};

// ============================================================
