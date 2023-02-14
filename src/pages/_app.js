/* eslint-disable import/no-unresolved */
import { CacheProvider } from '@emotion/react';
// eslint-disable-next-line import/named
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { Provider } from 'react-redux';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';

import createEmotionCache from 'createEmotionCache';
import { store } from 'redux/store';
import ThemeConfig from 'theme';
import GlobalStyles from 'theme/globalStyles';

import 'simplebar/src/simplebar.css';
import 'styles/globals.css';

const clientSideEmotionCache = createEmotionCache();

// 1. Get projectID at https://cloud.walletconnect.com
if (!process.env.NEXT_PUBLIC_PROJECT_ID)
  throw new Error('You need to provide NEXT_PUBLIC_PROJECT_ID env variable');

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

// 2. Configure wagmi client
const chains = [chain.mainnet, chain.goerli];
const { provider, } = configureChains(chains, [
  walletConnectProvider({
    projectId,
  })
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({
    appName: 'web3Modal',
    chains,
    theme: 'dark',
    accentColor: 'default',
  }),
  provider,
});

// 3. Configure modal ethereum client
const ethereumClient = new EthereumClient(wagmiClient, chains);

const queryClient = new QueryClient();

function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps, } = props;

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <CacheProvider value={emotionCache}>
          <Provider store={store}>
            <ThemeConfig>
              <GlobalStyles />

              <WagmiConfig client={wagmiClient}>
                <Component {...pageProps} />
              </WagmiConfig>
            </ThemeConfig>
          </Provider>
        </CacheProvider>
      </QueryClientProvider>

      <Web3Modal
        projectId={projectId}
        theme='dark'
        accentColor='default'
        ethereumClient={ethereumClient}
      />
    </>
  );
}

export default MyApp;
