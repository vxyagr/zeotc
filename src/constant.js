import dayjs from 'dayjs';

export const DEFAULT_CREATED_SWAP_EXPIRED_TIME = dayjs().add(7, 'day');

export const MOST_COMMON_ERC20 = [
  {
    chainId: 1,
    address: '0x2b591e99afe9f32eaa6214f7b7629768c40eeb39',
    name: 'HEX',
    symbol: 'HEX',
    decimals: 8,
    logoURI:
      'https://assets.coingecko.com/coins/images/10103/large/HEX-logo.png?1575942673',
    extensions: {
      link: 'https://hex.com',
      description:
        'Launched on December 2, 2019 by Richard Heart and team, HEX is the first certificate of deposit on the blockchain, essentially time deposits that gain interest, HEX is an ERC20 Token that runs over the Ethereum network\r\n',
      ogImage: 'https://hex.com/img/TwitterCard_Main_V3.jpg'
    }
  },
  {
    chainId: 1,
    address: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
    name: 'Lido Staked Ether',
    symbol: 'STETH',
    decimals: 18,
    logoURI:
      'https://assets.coingecko.com/coins/images/13442/large/steth_logo.png?1608607546',
    extensions: {
      link: 'https://www.lido.fi',
      description:
        'Lido Staked Ether (stETH) is a token that represents your staked ether in Lido, combining the value of initial deposit and staking rewards. stETH tokens are minted upon deposit and burned when redeemed. stETH token balances are pegged 1:1 to the ethers that are staked by Lido and the token’s balances are updated daily to reflect earnings and rewards. stETH tokens can be used as one would use ether, allowing you to earn ETH 2.0 staking rewards whilst benefiting from e.g. yields across decentralised finance products.',
      ogImage: '/static/images/meta/lido.png'
    }
  },
  {
    chainId: 1,
    address: '0x4e15361fd6b4bb609fa63c81a2be19d873717870',
    name: 'Fantom',
    symbol: 'FTM',
    decimals: 18,
    logoURI:
      'https://assets.coingecko.com/coins/images/4001/large/Fantom.png?1558015016',
    extensions: {
      link: 'http://fantom.foundation',
      description:
        'FANTOM is a new DAG based Smart Contract platform that intends to solve the scalability issues of existing public distributed ledger technologies. \r\n\r\nThe platform intends to distinguish itself from the traditional block ledger-based storage infrastructure by attempting to employ an improved version of existing DAG-based pro-tocols. The FANTOM platform adopts a new protocol known as the “Lachesis Protocol” to maintain consensus. This protocol is intended to be integrated into the Fantom OPERA Chain. The aim is to allow applications built on top of the FANTOM OPERA Chain to enjoy instant transactions and near zero transaction costs for all users. \r\n\r\nThe mission of FANTOM is to provide compatibility between all transaction bodies around the world, and create an ecosystem which allows real-time transactions and data sharing with low cost.',
      ogImage:
        'https://fantomfoundation-prod-wp-website.s3.ap-southeast-2.amazonaws.com/wp-content/uploads/2021/01/19225127/Fantom-1.png'
    }
  },
  {
    chainId: 1,
    address: '0xb83cd8d39462b761bb0092437d38b37812dd80a2',
    name: 'Golden Ratio Token',
    symbol: 'GRT',
    decimals: 18,
    logoURI:
      'https://assets.coingecko.com/coins/images/11022/large/golden_ratio_token.png?1592811112',
    extensions: {
      link: 'https://goldenratiotoken.site/',
      description:
        'GoldenRatio Token (GRT) project is an experiment which has no funding, to prove the importance of a quality community in a crypto related project.\r\n\r\nOur goal is to create value into the project which will flow back into the crypto community benefiting other projects. Therefore our supply will be distributed among active people contributing to the global crypto community.\r\n\r\nThe experiment is also aimed to be established as a viable project within 90 days. We aim to achieve this by creating several mechanisms and use cases.\r\n\r\nEverything will be given away to the people who are already building the crypto economy.\r\n\r\nAll the GoldenRatio Tokens (GRT) will be given away to active contributors of any other high quality crypto related projects.',
      ogImage:
        'https://goldenratiotoken.site/wp-content/uploads/2020/04/golden-ratio-logo-featured-image.jpg'
    }
  },
  {
    chainId: 1,
    address: '0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c',
    name: 'Enjin Coin',
    symbol: 'ENJ',
    decimals: 18,
    logoURI:
      'https://assets.coingecko.com/coins/images/1102/large/enjin-coin-logo.png?1547035078',
    extensions: {
      link: 'https://enjin.io/',
      description:
        'Enjin Coin is a cryptocurrency for virtual goods created by Enjin. Enjin is the “largest gaming community platform online” with over 250,000 gaming communities and 18.7 million registered gamers. The Enjin team is designing the coin completely around gaming with the goal of it being the most usable cryptocurrency for the industry. The project includes the Enjin Coin as well as a suite of software development kits (SDKs) that developers can integrate into their games and communities. Bringing blockchain to gaming helps to reduce the high fees and fraud that’s prevalent in the transfer of virtual goods.\r\n\r\nEnjin Coin is an ERC20 token built on the <a href="https://www.coingecko.com/en/coins/ethereum">Ethereum</a> network. With that, the project not only acts as a cryptocurrency but also has smart contract capabilities. It’s also one of the first projects testing the <a href="https://www.coingecko.com/en/coins/raiden-network">Raiden Network</a>, Ethereum’s version of the Lightning Netw...',
      ogImage:
        'https://assets-global.website-files.com/5d56cb37dc00725ec86984e3/5d847881a21fc85559338eb8_1.png'
    }
  },
  {
    chainId: 1,
    address: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
    name: 'Synthetix Network T',
    symbol: 'SNX',
    decimals: 18,
    logoURI:
      'https://assets.coingecko.com/coins/images/3406/large/SNX.png?1598631139',
    extensions: {
      link: 'https://www.synthetix.io/',
      description:
        'Synthetix is based in Australia, Synthetix launched a seed funding round in September, 2017 to develop the concept of a self-contained stablecoin payment network. They then kicked off their public ICO on February 28, 2018 and by the end of the ICO on March 7, 2018, they had met their goal of $30,000,000 USD. Synthetix was <a href="https://blog.havven.io/havven-is-transforming-into-synthetix-2fdf727b8892">rebranded</a> from Havven on November 30, 2018.\r\n\r\nSynthetix is led by a multidisciplinary team of 13 individuals. The project was founded by Kain Warwick, who previously co-founded blueshyft, one of the largest digital payment networks in Australia. The CTO is Justin Moses, who also serves as the Director of Engineering at MongoDB. Synthetix aims to address the problem that companies running centralized payment networks such as PayPal, credit card networks, or the SWIFT banking network have “absolute control over the value within the network, so any transaction conducted within the...',
      ogImage: '/public/logo-x.png'
    }
  },
  {
    chainId: 1,
    address: '0x37236cd05b34cc79d3715af2383e96dd7443dcf1',
    name: 'Small Love Potion',
    symbol: 'SLP',
    decimals: 0,
    logoURI:
      'https://assets.coingecko.com/coins/images/10366/large/SLP.png?1578640057',
    extensions: {
      link: 'https://axieinfinity.com/',
      description: 'Potion used to breed in Axie Infinity',
      ogImage: 'https://storage.googleapis.com/axie-cdn/new-banner.png'
    }
  },
  {
    chainId: 1,
    address: '0x6c6ee5e31d828de241282b9606c8e98ea48526e2',
    name: 'Holo',
    symbol: 'HOT',
    decimals: 18,
    logoURI:
      'https://assets.coingecko.com/coins/images/3348/large/Holologo_Profile.png?1547037966',
    extensions: {
      link: 'https://holo.host/',
      description:
        'Holochain enables a distributed web with user autonomy built directly into its architecture and protocols. Data is about remembering our lived and shared experiences. Distributing the storage and processing of that data can change how we coordinate and interact. With digital integration under user control, Holochain liberates our online lives from corporate control over our choices and information.\r\n\r\nHolochain is an energy efficient post-blockchain ledger system and decentralized application platform that uses peer-to-peer networking for processing agent centric agreement and consensus systems between users.\r\n\r\nHolochain enables any device to have its own chain based ledger system. By using a holographic model for data storage and transfer developers can now create decentralized applications that can scale in multiple dimensions across a network ensuring they are truly distributed. This enables every device on a network to function independently, and only requires the synchronizati...',
      ogImage: 'https://holo.host/wp-content/uploads/holoport-people-og.jpg'
    }
  }
];

export const MOST_COMMON_NFT = [
  {
    name: '0xmons',
    chainId: 1,
    address: '0x0427743df720801825a5c82e0582b1e915e0f750',
    standard: 'erc721',
    symbol: '0XMON',
    logoURI:
      'https://lh3.googleusercontent.com/ntBn5aWnCQ1Yi0seKu_xxztYTTm4-uHeViv0WUrWQrg1so4ULSnQ0dBBh9XVLvL5CCabjAaFGAjyiuoup1xsgT2-7XsXHGBY_Bi_7Q=s120'
  },
  {
    name: 'Anata NFT',
    chainId: 1,
    address: '0xf729f878f95548bc7f14b127c96089cf121505f8',
    standard: 'erc721',
    symbol: 'ANATA',
    logoURI:
      'https://lh3.googleusercontent.com/Jbrv-cAm_SgfoEmG8YSvlZATkiqNKfXbVrxzOneu898wpIm9aCnIrzDCMt7zrth2z52BSoazqmJ_zSwzMcSeJhM0cVMeFT61qP6DZQ=s130'
  },
  {
    name: 'Bored Ape Yacht Club',
    chainId: 1,
    address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
    standard: 'erc721',
    symbol: 'BAYC',
    logoURI:
      'https://lh3.googleusercontent.com/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB=s120'
  },
  {
    name: 'VeeFriends',
    chainId: 1,
    address: '0xa3aee8bce55beea1951ef834b99f3ac60d1abeeb',
    standard: 'erc721',
    symbol: 'VFT',
    logoURI:
      'https://lh3.googleusercontent.com/5y-UCAXiNOFXH551w5bWdZEYOCdHPwbqmcKb-xa3uVQEjQgxvih3HtZWSmzqDqd0uk7kIqFrZhw32Gt6xPBFg4t_n9BKhpou-dwnOg=s120'
  },
  {
    name: 'Art Blocks Curated',
    chainId: 1,
    address: '0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270',
    standard: 'erc721',
    symbol: 'BLOCKS',
    logoURI:
      'https://lh3.googleusercontent.com/7UdPY2uj4mirP7C8IcQSuQPoZYqtE9tqwgBVs4l7TS-qkG2pZWdkferrqTQjVxun8E8Asz1IlVAhnF3OOTMyKFWO_yNK4YZtGI_UwQ=s120'
  },
  {
    name: 'Sorare',
    chainId: 1,
    address: '0x629a673a8242c2ac4b7b8c5d8735fbeac21a6205',
    standard: 'erc721',
    symbol: 'SOR',
    logoURI:
      'https://lh3.googleusercontent.com/gj47nmAR3valkmpVbwamiuTJfWEWSCyVeORdjM6DRWrZ1o8WaqBxFXmpBrzZnGoWaPwq1Y0jiXRrBLbnLcawAp92=s120'
  },
  {
    name: 'Bored Ape Kennel Club',
    chainId: 1,
    address: '0xba30e5f9bb24caa003e9f2f0497ad287fdf95623',
    standard: 'erc721',
    symbol: 'BAKC',
    logoURI:
      'https://lh3.googleusercontent.com/l1wZXP2hHFUQ3turU5VQ9PpgVVasyQ79-ChvCgjoU5xKkBA50OGoJqKZeMOR-qLrzqwIfd1HpYmiv23JWm0EZ14owiPYaufqzmj1=s120'
  },
  {
    name: 'Decentraland',
    chainId: 1,
    address: '0x959e104e1a4db6317fa58f8295f586e1a978c297',
    standard: 'erc721',
    symbol: 'EST',
    logoURI:
      'https://lh3.googleusercontent.com/5KIxEGmnAiL5psnMCSLPlfSxDxfRSk4sTQRSyhPdgnu70nGb2YsuVxTmO2iKEkOZOfq476Bl1hAu6aJIKjs1myY=s60'
  }
];

export const MOST_COMMON_ERC20_GOERLI = [
  {
    chainId: 1,
    address: '0xd8a6a0cf9b0e1c985582f41ff3f5f6e4226487e7',
    name: 'Token ZToken1',
    symbol: 'ZTK',
    decimals: 8,
    logoURI:
      'https://assets.coingecko.com/coins/images/9956/thumb/4943.png?1636636734',
    extensions: {
      link: 'https://hex.com',
      description:
        'Launched on December 3, 2019 by Richard Heart and team, HEX is the first certificate of deposit on the blockchain, essentially time deposits that gain interest, HEX is an ERC20 Token that runs over the Ethereum network\r\n',
      ogImage: 'https://hex.com/img/TwitterCard_Main_V3.jpg'
    }
  },
  {
    chainId: 1,
    address: '0x3f0d76bfdb27efd6cac0c109c6ecee72eef5ffb6',
    name: 'Token ZToken2',
    symbol: 'ZTK2',
    decimals: 8,
    logoURI:
      'https://assets.coingecko.com/coins/images/9956/thumb/4943.png?1636636734',
    extensions: {
      link: 'https://hex.com',
      description:
        'Launched on December 4, 2019 by Richard Heart and team, HEX is the first certificate of deposit on the blockchain, essentially time deposits that gain interest, HEX is an ERC20 Token that runs over the Ethereum network\r\n',
      ogImage: 'https://hex.com/img/TwitterCard_Main_V3.jpg'
    }
  },
  {
    chainId: 1,
    address: '0xd77b79be3e85351ff0cbe78f1b58cf8d1064047c',
    name: 'Token Dai',
    symbol: 'DAI',
    decimals: 8,
    logoURI:
      'https://assets.coingecko.com/coins/images/9956/thumb/4943.png?1636636734',
    extensions: {
      link: 'https://hex.com',
      description:
        'Launched on December 5, 2019 by Richard Heart and team, HEX is the first certificate of deposit on the blockchain, essentially time deposits that gain interest, HEX is an ERC20 Token that runs over the Ethereum network\r\n',
      ogImage: 'https://hex.com/img/TwitterCard_Main_V3.jpg'
    }
  },
  {
    chainId: 1,
    address: '0x4f7a67464b5976d7547c860109e4432d50afb38e',
    name: 'Token Native Goerli ETH',
    symbol: 'GETH',
    decimals: 18,
    logoURI:
      'https://assets.coingecko.com/coins/images/12817/thumb/filecoin.png?1602753933',
    extensions: {
      link: 'https://www.lido.fi',
      description:
        'Lido Staked Ether (stETH) is a token that represents your staked ether in Lido, combining the value of initial deposit and staking rewards. stETH tokens are minted upon deposit and burned when redeemed. stETH token balances are pegged 1:1 to the ethers that are staked by Lido and the token’s balances are updated daily to reflect earnings and rewards. stETH tokens can be used as one would use ether, allowing you to earn ETH 2.0 staking rewards whilst benefiting from e.g. yields across decentralised finance products.',
      ogImage: '/static/images/meta/lido.png'
    }
  },
  {
    chainId: 1,
    address: '0x5c946740441c12510a167b447b7de565c20b9e3c',
    name: 'Token Graph Token',
    symbol: 'GRT',
    decimals: 18,
    logoURI:
      'https://assets.coingecko.com/coins/images/4001/large/Fantom.png?1558015016',
    extensions: {
      link: 'http://fantom.foundation',
      description:
        'FANTOM is a new DAG based Smart Contract platform that intends to solve the scalability issues of existing public distributed ledger technologies. \r\n\r\nThe platform intends to distinguish itself from the traditional block ledger-based storage infrastructure by attempting to employ an improved version of existing DAG-based pro-tocols. The FANTOM platform adopts a new protocol known as the “Lachesis Protocol” to maintain consensus. This protocol is intended to be integrated into the Fantom OPERA Chain. The aim is to allow applications built on top of the FANTOM OPERA Chain to enjoy instant transactions and near zero transaction costs for all users. \r\n\r\nThe mission of FANTOM is to provide compatibility between all transaction bodies around the world, and create an ecosystem which allows real-time transactions and data sharing with low cost.',
      ogImage:
        'https://fantomfoundation-prod-wp-website.s3.ap-southeast-2.amazonaws.com/wp-content/uploads/2021/01/19225127/Fantom-1.png'
    }
  },
  {
    chainId: 1,
    address: '0x3a034fe373b6304f98b7a24a3f21c958946d4075',
    name: 'GToken USD Coin',
    symbol: 'USDC',
    decimals: 6,
    logoURI:
      'https://assets.coingecko.com/coins/images/11022/large/golden_ratio_token.png?1592811112',
    extensions: {
      link: 'https://goldenratiotoken.site/',
      description:
        'GoldenRatio Token (GRT) project is an experiment which has no funding, to prove the importance of a quality community in a crypto related project.\r\n\r\nOur goal is to create value into the project which will flow back into the crypto community benefiting other projects. Therefore our supply will be distributed among active people contributing to the global crypto community.\r\n\r\nThe experiment is also aimed to be established as a viable project within 90 days. We aim to achieve this by creating several mechanisms and use cases.\r\n\r\nEverything will be given away to the people who are already building the crypto economy.\r\n\r\nAll the GoldenRatio Tokens (GRT) will be given away to active contributors of any other high quality crypto related projects.',
      ogImage:
        'https://goldenratiotoken.site/wp-content/uploads/2020/04/golden-ratio-logo-featured-image.jpg'
    }
  },
  {
    chainId: 1,
    address: '0x9ed02f1c12adb524ec901f37cb4d9b183b2e578d',
    name: 'Token Mock ALCX',
    symbol: 'ALCX',
    decimals: 18,
    logoURI:
      'https://assets.coingecko.com/coins/images/1102/large/enjin-coin-logo.png?1547035078',
    extensions: {
      link: 'https://enjin.io/',
      description:
        'Enjin Coin is a cryptocurrency for virtual goods created by Enjin. Enjin is the “largest gaming community platform online” with over 250,000 gaming communities and 18.7 million registered gamers. The Enjin team is designing the coin completely around gaming with the goal of it being the most usable cryptocurrency for the industry. The project includes the Enjin Coin as well as a suite of software development kits (SDKs) that developers can integrate into their games and communities. Bringing blockchain to gaming helps to reduce the high fees and fraud that’s prevalent in the transfer of virtual goods.\r\n\r\nEnjin Coin is an ERC20 token built on the <a href="https://www.coingecko.com/en/coins/ethereum">Ethereum</a> network. With that, the project not only acts as a cryptocurrency but also has smart contract capabilities. It’s also one of the first projects testing the <a href="https://www.coingecko.com/en/coins/raiden-network">Raiden Network</a>, Ethereum’s version of the Lightning Netw...',
      ogImage:
        'https://assets-global.website-files.com/5d56cb37dc00725ec86984e3/5d847881a21fc85559338eb8_1.png'
    }
  },
  {
    chainId: 1,
    address: '0x44fe41071baa4832513db1b07908fdaec64c59e8',
    name: 'DZOO',
    symbol: 'SNX',
    decimals: 18,
    logoURI:
      'https://assets.coingecko.com/coins/images/3406/large/SNX.png?1598631139',
    extensions: {
      link: 'https://www.synthetix.io/',
      description:
        'Synthetix is based in Australia, Synthetix launched a seed funding round in September, 2017 to develop the concept of a self-contained stablecoin payment network. They then kicked off their public ICO on February 28, 2018 and by the end of the ICO on March 7, 2018, they had met their goal of $30,000,000 USD. Synthetix was <a href="https://blog.havven.io/havven-is-transforming-into-synthetix-2fdf727b8892">rebranded</a> from Havven on November 30, 2018.\r\n\r\nSynthetix is led by a multidisciplinary team of 13 individuals. The project was founded by Kain Warwick, who previously co-founded blueshyft, one of the largest digital payment networks in Australia. The CTO is Justin Moses, who also serves as the Director of Engineering at MongoDB. Synthetix aims to address the problem that companies running centralized payment networks such as PayPal, credit card networks, or the SWIFT banking network have “absolute control over the value within the network, so any transaction conducted within the...',
      ogImage: '/public/logo-x.png'
    }
  },
  {
    chainId: 1,
    address: '0x326c977e6efc84e512bb9c30f76e30c160ed06fb',
    name: 'Token ChainLink Token',
    symbol: 'LINK',
    decimals: 0,
    logoURI:
      'https://assets.coingecko.com/coins/images/10366/large/SLP.png?1578640057',
    extensions: {
      link: 'https://axieinfinity.com/',
      description: 'Potion used to breed in Axie Infinity',
      ogImage: 'https://storage.googleapis.com/axie-cdn/new-banner.png'
    }
  },
  {
    chainId: 1,
    address: '0x1dcd297530778f987e8deeb07667e29cd052bc50',
    name: 'Token TETH',
    symbol: 'TETH',
    decimals: 18,
    logoURI:
      'https://assets.coingecko.com/coins/images/3348/large/Holologo_Profile.png?1547037966',
    extensions: {
      link: 'https://holo.host/',
      description:
        'Holochain enables a distributed web with user autonomy built directly into its architecture and protocols. Data is about remembering our lived and shared experiences. Distributing the storage and processing of that data can change how we coordinate and interact. With digital integration under user control, Holochain liberates our online lives from corporate control over our choices and information.\r\n\r\nHolochain is an energy efficient post-blockchain ledger system and decentralized application platform that uses peer-to-peer networking for processing agent centric agreement and consensus systems between users.\r\n\r\nHolochain enables any device to have its own chain based ledger system. By using a holographic model for data storage and transfer developers can now create decentralized applications that can scale in multiple dimensions across a network ensuring they are truly distributed. This enables every device on a network to function independently, and only requires the synchronizati...',
      ogImage: 'https://holo.host/wp-content/uploads/holoport-people-og.jpg'
    }
  }
];
