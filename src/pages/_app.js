/* eslint-disable import/no-unresolved */
import { CacheProvider } from '@emotion/react';
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme
} from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import {
  mainnet,
  goerli,
  configureChains,
  createClient,
  WagmiConfig
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import createEmotionCache from 'createEmotionCache';
import { store } from 'redux/store';
import ThemeConfig from 'theme';
import GlobalStyles from 'theme/globalStyles';

import WalletConnectionGuard from '../components/WalletConnectionGuard';

import 'simplebar/src/simplebar.css';
import '@rainbow-me/rainbowkit/styles.css';
import 'styles/globals.css';

const mappingChain = {
  mainnet,
  goerli
};

const { chains, provider } = configureChains(
  [mappingChain[process.env.NEXT_PUBLIC_CHAIN]],
  [
    alchemyProvider({ alchemyId: process.env.NEXT_PUBLIC_CHAIN }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

const clientSideEmotionCache = createEmotionCache();

// 1. Get projectID at https://cloud.walletconnect.com
if (!process.env.NEXT_PUBLIC_PROJECT_ID)
  throw new Error('You need to provide NEXT_PUBLIC_PROJECT_ID env variable');

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

const queryClient = new QueryClient();

function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <CacheProvider value={emotionCache}>
          <Provider store={store}>
            <ThemeConfig>
              <GlobalStyles />

              <WagmiConfig client={wagmiClient}>
                <RainbowKitProvider
                  theme={darkTheme({
                    accentColor:
                      'linear-gradient(90deg, #C732A6 0%, #460AE4 100%, #C732A6 100%)',
                    accentColorForeground: 'white',
                    borderRadius: 'small',
                    fontStack: 'system',
                    overlayBlur: 'small'
                  })}
                  chains={chains}
                >
                  <WalletConnectionGuard>
                    <Component {...pageProps} />
                  </WalletConnectionGuard>
                </RainbowKitProvider>
              </WagmiConfig>
            </ThemeConfig>
          </Provider>
        </CacheProvider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
