export const supportedChains = [
  {
    name: 'Ethereum Mainnet',
    short_name: 'ETH',
    chain: 'ETH',
    network: 'mainnet',
    chain_id: 1,
    network_id: 1,
    rpc_url: 'https://mainnet.infura.io/v3/',
    native_currency: {
      symbol: 'ETH',
      name: 'ETH',
      decimals: '18',
      contractAddress: '',
      balance: '',
    },
  },
  {
    name: 'Goerli test network',
    short_name: 'Goerli',
    chain: 'Goerli',
    network: 'GoerliETH',
    chain_id: 5,
    network_id: 5,
    rpc_url: 'https://goerli.infura.io/v3/',
    native_currency: {
      symbol: 'GoerliETH',
      name: 'GoerliETH',
      decimals: '18',
      contractAddress: '',
      balance: '',
    },
  }
];

export const supportedChainsID = supportedChains.map(
  (chainData) => chainData.chain_id
);
