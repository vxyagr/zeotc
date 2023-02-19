/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable no-self-assign */
import axios from 'axios';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ethers } from 'ethers';

import { NETWORK } from 'config';

import { supportedChains } from './chains';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export function getChainData(chainId) {
  const chainData = supportedChains.find((chain) => chain.chain_id === chainId);

  if (!chainData) {
    throw new Error('ChainId missing or not supported');
  }

  const API_KEY = process.env.NEXT_PUBLIC_PROJECT_ID;

  if (
    chainData.rpc_url.includes('infura.io') &&
    chainData.rpc_url.includes('%API_KEY%') &&
    API_KEY
  ) {
    const rpcUrl = chainData.rpc_url.replace('%API_KEY%', API_KEY);

    return {
      ...chainData,
      rpc_url: rpcUrl
    };
  }

  return chainData;
}

export function switchNetwork(provider) {
  const { chain_id: chainId, rpc_url: rpcUrl } = getChainData(NETWORK.ID);

  provider.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: `0x${chainId.toString(16)}`,
        rpcUrls: [rpcUrl]
      }
    ]
  });
}

export const conciseAddress = (address, startSlice = 6, endSlice = 3) =>
  `${address?.slice(0, startSlice)}...${address?.slice(
    address?.length - endSlice,
    address?.length
  )}`;

export const truncateAddress = (address) => {
  if (!address) return 'No Account';

  const match = address.match(/^(0x[\dA-Za-z]{2})[\dA-Za-z]+([\dA-Za-z]{2})$/);

  if (!match) return address;

  return `${match[1]}…${match[2]}`;
};

export const shorter = (str) =>
  str?.length > 8 ? `${str.slice(0, 6)}...${str.slice(-4)}` : str;

export const toHex = (num) => {
  const val = Number(num);

  return `0x${val.toString(16)}`;
};

export function addZeroes(num) {
  // Cast as number
  num = Number(num);

  // If not a number, return 0
  if (Number.isNaN(num)) {
    return 0;
  }

  // If there is no decimal, or the decimal is less than 2 digits, toFixed
  if (
    String(num).split('.').length < 5 ||
    String(num).split('.')[1].length <= 5
  ) {
    num = num.toFixed(5);
  }

  // Return the number
  return num;
}

export const bigNumberToStr = (str) =>
  Math.round(Number.parseFloat(str) * 10 ** 18);

export const bigNumberToStr2 = (str) => (str / 10 ** 18).toFixed(3);

export const titleCase = (str) =>
  str.toLowerCase().replace(/\b(\w)/g, (s) => s.toUpperCase());

export const mileSecondToDays = (ms) => {
  // const daysms = ms % (24*60*60*1000);
  // const hours = Math.floor(daysms / (60*60*1000));
  // const hoursms = ms % (60*60*1000);
  // const minutes = Math.floor(hoursms / (60*1000));
  // const minutesms = ms % (60*1000);
  // const sec = Math.floor(minutesms / 1000);
  // return days + ":" + hours + ":" + minutes + ":" + sec;
  return Math.floor(ms / (24 * 60 * 60 * 1000));
};

// todo USER INPUT VALUE
export const handleFormateData = (receivedData, useId = false) => {
  const now = Math.floor(new Date().getTime() / 1000);

  const standard_bytes32_id =
    '0x022515039d4a89e1a162666e15b8e6a6c6cdf4a919364e3f8e68225ede335949';

  return receivedData.map((item, data) => {
    // console.log(item);
    const type = item?.IERC?.toString();
    let tokenType = item?.contract_type || type;
    const decimal = item?.metadata?.decimals || item?.decimals;
    let tokenAddress;
    let tokenId;
    let amountValue = item?.amount?.toString() || '0.00002';

    // ? IF TYPE DOS'T EXIST ITS MEANS TOKEN TYPE IS ERC20

    if (!tokenType || tokenType === '20') {
      tokenType = 20;
      // tokenAddress = (item?.symbol !== 'LINK' && item?.symbol !== 'UNI')? item?.address : item.token_address;
      tokenAddress = item?.address || item?.token_address || item?.token;

      tokenId = 0;
      amountValue = ethers.utils.parseUnits(amountValue, decimal);
      // amountValue = ethers.utils.parseEthers(amountValue);
    } else {
      const numb = tokenType.match(/\d/g);
      tokenType = numb.join('');
      tokenAddress = item?.token_address || item?.token;
      tokenId = item.token_id;
      amountValue = amountValue;
    }

    return {
      id: useId && item?.id ? item?.id : standard_bytes32_id,
      token_id: tokenId, //token-ID
      IERC: Number(tokenType), //ERC1155
      token: tokenAddress, //token address
      amount: amountValue, //NFT amount // User input amounts
      created: ethers.utils.hexlify(now) //date
    };
  });
};

export const handleSetFormateData = (receivedData, useId = false) => {
  const now = Math.floor(new Date().getTime() / 1000);

  const standard_bytes32_id =
    '0x022515039d4a89e1a162666e15b8e6a6c6cdf4a919364e3f8e68225ede335949';

  return receivedData.map((item, data) => {
    const type = item?.IERC?.toString();
    let tokenType = item?.contract_type || type;
    let tokenAddress;
    let tokenId;
    let amountValue = item?.amount?.toString() || '0.00002';

    // ? IF TYPE DOS'T EXIST ITS MEANS TOKEN TYPE IS ERC20

    if (!tokenType || tokenType === '20') {
      tokenType = 20;
      // tokenAddress = (item?.symbol !== 'LINK' && item?.symbol !== 'UNI')? item?.address : item.token_address;
      tokenAddress = item?.address || item?.token_address || item?.token;

      tokenId = 0;
      amountValue = amountValue;
      // amountValue = ethers.utils.parseEthers(amountValue);
    } else {
      const numb = tokenType.match(/\d/g);
      tokenType = numb.join('');
      tokenAddress = item?.token_address || item?.token;
      tokenId = item.token_id;
      amountValue = amountValue;
    }

    return {
      id: useId ? item?.id : standard_bytes32_id,
      token_id: tokenId, //token-ID
      IERC: Number(tokenType), //ERC1155
      token: tokenAddress, //token address
      amount: amountValue, //NFT amount // User input amounts
      created: ethers.utils.hexlify(now) //date
    };
  });
};

// ========================================================

export const getUserNFts = async (url, address) => {
  let nftsOptions;

  if (address) {
    nftsOptions = {
      method: 'GET',
      url: url,
      params: {
        chain: `${process.env.NEXT_PUBLIC_CHAIN}`,
        addresses: `${address}`
      },
      headers: {
        accept: 'application/json',
        'X-API-Key': `${process.env.NEXT_PUBLIC_MORALIS_KEY}`
      }
    };
  }

  if (!address) {
    nftsOptions = {
      method: 'GET',
      url: url,
      params: {
        chain: `${process.env.NEXT_PUBLIC_CHAIN}`,
        format: 'decimal',
        normalizeMetadata: 'false'
      },
      headers: {
        accept: 'application/json',
        'X-API-Key': `${process.env.NEXT_PUBLIC_MORALIS_KEY}`
      }
    };
  }

  return await axios
    .request(nftsOptions)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    });
};

// -------------------------------------

export const delay = async (ms = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// -------------------------------------

export const isJsonString = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }

  return true;
};

/**
 * Generate swap expire time in string format
 * @param {expire} hex date value in hex //1680120958
 * @param {format} str string format return // d:h:m:s
 * @param {shortHand} bol string format return type  // true
 * @returns {string} return expire date time in string // 8d : 16h : 28m : 0s
 */

export const getExpieredTime = (
  expire,
  format = 'd:h:m:s',
  shortHand = true
) => {
  if (!expire) {
    return '';
  }

  const sortHandMapping = {
    d: ' days',
    h: ' hours',
    m: ' minutes',
    s: ' seconds'
  };

  const expireDateString = dayjs.unix(expire.toString());
  const now = dayjs();
  const timeDurationObject = dayjs.duration(expireDateString.diff(now));
  const formatSplited = format.split(':');

  return formatSplited
    .map((time) => {
      return `${timeDurationObject.get(time)}${
        shortHand ? time : sortHandMapping(time)
      }`;
    })
    .join(' : ');
};
