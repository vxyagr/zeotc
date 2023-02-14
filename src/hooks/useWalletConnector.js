import { useCallback, useEffect } from 'react';

import { useWeb3Modal, Web3Button } from '@web3modal/react';
import { ethers } from 'ethers';
import { useDispatch } from 'react-redux';
import { useAccount, useProvider, useSigner } from 'wagmi';

import { useNotify } from 'components/notify';
import {
  uniSwapAbi_Contact_Abi,
  uniSwap_Contract_Address,
  zeoTC_Contract_Abi,
  zeoTC_Contract_Address
} from 'contract';
import { switchNetwork } from 'helpers/utilities';
import {
  changeAccount,
  changeChainId,
  changeContract,
  changeProvider,
  changeSigner
} from 'redux/slice/web3';

import { useSelectWeb3 } from './useSelectWeb3';
import useWeb3SubscribeProvider from './web3SubscribeProvider';

const useWalletConnector = () => {
  const dispatch = useDispatch();
  const { chainId, } = useSelectWeb3();
  const { subscribeProvider, resetAll, } = useWeb3SubscribeProvider();

  const { connector, address: account, ...rest } = useAccount();
  const { data: signer, isError, isLoading, } = useSigner();
  const provider = useProvider();

  const onConnect = useCallback(async () => {
    try {
      if (account && signer) {
        const chainId = await signer.getChainId();

        // instantiate contract instance and assign to component ref variable
        const zeoTC_Contract = new ethers.Contract(
          zeoTC_Contract_Address,
          // zeoTC_Contract_Abi.abi,
          zeoTC_Contract_Abi,
          signer
        );

        const uniSwap_Contract = new ethers.Contract(
          uniSwap_Contract_Address,
          uniSwapAbi_Contact_Abi,
          signer
        );
        dispatch(changeChainId(chainId));
        dispatch(changeAccount(account));
        dispatch(changeProvider(provider));
        dispatch(changeSigner(signer));

        dispatch(
          changeContract({
            zeoTC_Contract,
            uniSwap_Contract,
          })
        );
        // switchNetwork(provider);
      } else {
        // notify('error', 'network is not connected');
        console.log('network is not connected');
      }
    } catch (error) {
      // notify('error', error?.message);
      console.log(error);
    }
  }, [account, dispatch, provider, signer]);

  const onDisconnect = async () => {
    connector.onDisconnect();

    resetAll();
  };

  return {
    onConnect,
    onDisconnect,
  };
};

export default useWalletConnector;
