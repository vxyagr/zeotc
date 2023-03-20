/* eslint-disable import/named */
/* eslint-disable sonarjs/no-identical-functions */
// import { useNotify } from 'components/notify';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ethers } from 'ethers';

import {
  erc1155_Contact_Abi,
  erc20_Contact_Abi,
  erc721_Contact_Abi
} from 'contract';
import { handleFormateData, handleSetFormateData } from 'helpers/utilities';
import { useSelectWeb3 } from 'hooks/useSelectWeb3';

import { queryKeys, TOKEN_TYPE } from './queryConstants';

// function set_allow_counter_offer(bytes32 zSwap_id, bool new_allow_counter_offer) public

export const useMutationAddOffer = () => {
  const queryClient = useQueryClient();
  const { account, zeoTC_Contract } = useSelectWeb3();

  const mutationFn = async ({ isSupplier }) => {
    const tx = await (isSupplier
      ? zeoTC_Contract.add_offer_userA()
      : zeoTC_Contract.add_counter_offer_userB());

    return tx.wait();
  };

  return useMutation(mutationFn, {
    onSettled: () => {
      //   queryClient.invalidateQueries(queryKey);
    },
    onError: (error) => {
      //console.log(error);
      //   notify('error', 'Error in Farm.');
    }
  });
};

// ===============================================================

export const useMutationAcceptOffer = () => {
  //   const notify = useNotify();
  const queryClient = useQueryClient();
  const { account, zeoTC_Contract } = useSelectWeb3();

  // function accept(bytes32 zSwap_id) external

  const queryKey = [queryKeys.getZeSwapIdList];

  const mutationFn = async () => {
    const tx = await zeoTC_Contract.accept();

    return tx.wait();
  };

  return useMutation(mutationFn, {
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
    onError: (error) => {
      //console.log(error);
      //   notify('error', 'Error in Farm.');
    }
  });
};

// ==================================================================

// --------------------------------
export const useERC20_ERC721_ERC1155Approve = () => {
  const { account, zeoTC_Contract, signer } = useSelectWeb3();

  const mutationFn = async ({
    tokenAddress,
    tokenType,
    tokenId,
    decimal,
    amount
  }) => {
    let tx;

    // console.log({
    //   tokenAddress,
    //   tokenType,
    //   tokenId,
    //   decimal,
    //   amount,
    // });
    //console.log('token Type ' + tokenType);
    // ? ERC20
    if (!tokenType || tokenType === '20') {
      const abi = erc20_Contact_Abi;
      const contract = new ethers.Contract(tokenAddress, abi, signer);

      const getDecimals = await contract?.decimals();

      const decimals = getDecimals || decimal;
      const amounts = amount.toString();

      const amount1 = ethers.utils.parseUnits(amounts, decimals);
      //console.log('approving ERC 20 ' + amount1);
      tx = await contract?.approve(zeoTC_Contract.address, amount1);
    }

    //? ERC721
    if (
      tokenType === TOKEN_TYPE.erc721 ||
      tokenType === '721' ||
      tokenType === 'ERC721'
    ) {
      const abi = erc721_Contact_Abi;
      //console.log('approving ERC721 ' + tokenId);
      const contract = new ethers.Contract(tokenAddress, abi, signer);
      tx = await contract?.approve(zeoTC_Contract.address, tokenId); //9964=token_id
    }

    //? ERC1155
    if (tokenType === TOKEN_TYPE.erc1155 || tokenType === '1155') {
      const abi = erc1155_Contact_Abi;

      const contract = new ethers.Contract(tokenAddress, abi, signer);
      tx = await contract?.setApprovalForAll(zeoTC_Contract.address, true);
    }

    return tx.wait();
  };

  return useMutation(mutationFn, {
    onError: (error) => {
      console.log(error);
      // notify('error', 'Error while fetching useIsApprovedForAll');
    }
  });
};

// ===============================================

export const useMutationRemoveProduct = () => {
  const { account, zeoTC_Contract, signer } = useSelectWeb3();

  const mutationFn = async ({ swap_id, offer_id, product_id }) => {
    let tx;
    //console.log(
    //'function removing ' + swap_id + ' ' + offer_id + ' ' + product_id
    //);
    let result = await zeoTC_Contract.remove_product(
      swap_id,
      offer_id,
      product_id
    );
    let res = result.wait();
    //console.log('result : ' + JSON.stringify(res));
    return res;
  };

  return useMutation(mutationFn, {
    onError: (error) => {
      console.log(error);
      // notify('error', 'Error while fetching useIsApprovedForAll');
    }
  });
};
// * Nft Address
// 0xf4910c763ed4e47a585e2d34baa9a4b611ae448c

export const useMutationCreateZeSwap = () => {
  //   const notify = useNotify();
  const queryClient = useQueryClient();
  const { account, zeoTC_Contract } = useSelectWeb3();

  //the supplier should give this info
  const zeroAddress = '0x0000000000000000000000000000000000000000';

  const queryKey = [queryKeys.getZeSwapIdList, account];

  const mutationFn = async ({ productA, productB, isChecked, newDate }) => {
    const productAs = handleFormateData(productA);
    const productBs = handleFormateData(productB);

    const now = Math.floor(new Date(newDate).getTime() / 1000);
    const userDate = newDate
      ? now
      : ethers.utils.hexlify(now + 60 * 60 * 24 * 6);

    // const expiration_in_UTC = ethers.utils.hexlify(now + 60 * 60 * 24 * 6);
    const expiration_in_UTC = userDate;

    // const data = await tx.wait();
    // const zSwap_id = data?.events?.[0]?.['args']?.[0];

    // await zeoTC_Contract.set_allow_counter_offer(zSwap_id, isChecked);
    console.log('creating OTC');
    // console.log('prod A ' + JSON.stringify(productAs));
    return await zeoTC_Contract.create_zeSwap(
      productAs,
      productBs,
      expiration_in_UTC,
      zeroAddress,
      isChecked
    );
  };

  return useMutation(mutationFn, {
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
    onError: (error) => {
      console.log(error);
      //   notify('error', 'Error in Farm.');
    }
  });
};
// accept
// ============================================================

export const useMutationAccept = () => {
  //   const notify = useNotify();
  const queryClient = useQueryClient();
  const { account, zeoTC_Contract } = useSelectWeb3();

  const queryKey = [queryKeys.createCounterOffer, account];

  const mutationFn = async (id) => {
    const tx = await zeoTC_Contract.accept(id);

    return tx.wait();
  };

  return useMutation(mutationFn, {
    // onSettled: () => {
    //   queryClient.invalidateQueries(queryKey);
    // },
    onError: (error) => {
      console.log(error);
      //   notify('error', 'Error in Farm.');
    }
  });
};

// =================================================================
// add_new_product_A(zSwap_id, offer_id, newProductsA)
// add_new_product_B(zSwap_id, offer_id,newProductsB
export const useMutationAddProductAToCounterOffer = () => {
  const queryClient = useQueryClient();
  const { account, zeoTC_Contract } = useSelectWeb3();

  const queryKey = [queryKeys.getZeSwapIdList];
  const mutationFn = async ({ id: data, product }) => {
    //console.log(JSON.stringify(data));
    //return;
    const offer_id = data?.swap?.offers?.[0];
    const productA = data?.productA;
    const productB = data?.productB;
    const zSwap_id = data?.swap_id;
    const queryKey = [queryKeys.getQueriesSwapDetails, zSwap_id];
    const oldList = queryClient.getQueryData(queryKey);
    const oldIds = oldList?.[0]?.[product]?.map((product) => product.id);

    if (product === 'productA') {
      const productAs = handleFormateData(productA, true);
      //console.log('prod A ' + JSON.stringify(productA));
      const filteredProducts = productAs.filter(
        (product) => !oldIds.includes(product.id)
      );

      const tx = await zeoTC_Contract.add_new_product_A(
        zSwap_id,
        offer_id,
        filteredProducts
      );
      await tx.wait();
    }

    if (product === 'productB') {
      const productBs = handleFormateData(productB, true);
      const filteredProducts = productBs.filter(
        (product) => !oldIds.includes(product.id)
      );

      const tx = await zeoTC_Contract.add_new_product_B(
        zSwap_id,
        offer_id,
        filteredProducts
      );
      await tx.wait();
    }
  };

  return useMutation(mutationFn, {
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
    onError: (error) => {
      console.log(error);
    }
  });
};

//function to counter an offer
export const useMutationSwapCounterOffer = () => {
  const queryClient = useQueryClient();
  const { account, zeoTC_Contract } = useSelectWeb3();

  const queryKey = [queryKeys.getZeSwapIdList];
  const mutationFn = async ({ id: data, product }) => {
    //console.log(JSON.stringify(data));
    const supplier = data?.swap?.supplier;
    const demander = data?.swap[2];
    //console.log('swap creator ' + supplier);
    //console.log('counter : ' + demander);
    //return;
    const offer_id = data?.swap?.offers?.[0];
    const productA = data?.productA;
    const productB = data?.productB;
    const zSwap_id = data?.swap_id;
    const queryKey = [queryKeys.getQueriesSwapDetails, zSwap_id];
    const oldList = queryClient.getQueryData(queryKey);
    const oldIds = oldList?.[0]?.[product]?.map((product) => product.id);

    if (product === 'productA') {
      const productAs = handleFormateData(productA, true);

      const filteredProducts = productAs.filter(
        (product) => !oldIds.includes(product.id)
      );

      const tx = await zeoTC_Contract.add_new_product_A(
        zSwap_id,
        offer_id,
        filteredProducts
      );
      await tx.wait();
    }

    if (product === 'productB') {
      const productBs = handleFormateData(productB, true);
      const filteredProducts = productBs.filter(
        (product) => !oldIds.includes(product.id)
      );

      const tx = await zeoTC_Contract.add_new_product_B(
        zSwap_id,
        offer_id,
        filteredProducts
      );
      await tx.wait();
    }
  };

  return useMutation(mutationFn, {
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
    onError: (error) => {
      console.log(error);
    }
  });
};

export const useMutationSwapAccept = () => {
  const queryClient = useQueryClient();
  const { account, zeoTC_Contract } = useSelectWeb3();

  const queryKey = [queryKeys.getZeSwapIdList];
  const mutationFn = async (id) => {
    const tx = await zeoTC_Contract.accept(id);

    return tx.wait();
  };

  return useMutation(mutationFn, {
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
    onError: (error) => {
      console.log(error);
    }
  });
};

export const useMutationSetProduct = () => {
  const queryClient = useQueryClient();
  const { account, zeoTC_Contract } = useSelectWeb3();

  const queryKey = [queryKeys.getZeSwapIdList];
  // function set_product(zSwap_id, offer_id, Product[] memory new_products) public

  const mutationFn = async ({ swap_id, offer_id, ProductB }) => {
    const productBs = handleFormateData(ProductB, true);
    //console.log('setting ' + swap_id + ' ' + offer_id + ' ' + productBs);
    // return true
    const tx = await zeoTC_Contract.set_product(swap_id, offer_id, productBs);

    return tx.wait();
  };

  return useMutation(mutationFn, {
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
    onError: (error) => {
      console.log(error);
    }
  });
};

// ================================================================

// function reset_zeSwap(bytes32 zSwap_id, uint256 expiration_in_UTC)

export const useMutationReject = () => {
  const queryClient = useQueryClient();
  const { account, zeoTC_Contract } = useSelectWeb3();

  const queryKey = [queryKeys.getZeSwapIdList];
  const mutationFn = async ({ swap_id, expire }) => {
    // console.log( swap_id, expire);
    //console.log('rejecting ' + swap_id.toString());
    //console.log('reject expiry ' + expire);
    const tx = await zeoTC_Contract.reset_zeSwap(swap_id, expire);

    return tx.wait();
  };

  return useMutation(mutationFn, {
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
    onError: (error) => {
      console.log(error);
    }
  });
};

export const useMutationCancelZeSwap = () => {
  const queryClient = useQueryClient();
  const { account, zeoTC_Contract } = useSelectWeb3();

  const queryKey = [queryKeys.getZeSwapIdList];
  const mutationFn = async (id) => {
    const tx = await zeoTC_Contract.cancel_zSwap(id);

    return tx.wait();
  };

  return useMutation(mutationFn, {
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
    onError: (error) => {
      console.log(error);
    }
  });
};
