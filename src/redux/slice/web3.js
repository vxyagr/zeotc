import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chainId: null,
  account: null,
  provider: null,
  signer: null,
  zeoTC_Contract: null,
  uniSwap_Contract: null,
  privateInputValue:null,
};

export const web3Slice = createSlice({
  name: 'web3',
  initialState,
  reducers: {
    changeChainId: (state, action) => {
      state.chainId = action.payload;
    },
    changeAccount: (state, action) => {
      state.account = action.payload;
    },
    changeProvider: (state, action) => {
      state.provider = action.payload;
    },
    changeSigner: (state, action) => {
      state.signer = action.payload;
    },
    privateInput: (state, action) => {
      state.privateInputValue = action.payload;
    },
    changeContract: (state, action) => {
      state.zeoTC_Contract = action.payload.zeoTC_Contract;
      state.uniSwap_Contract = action.payload.uniSwap_Contract;
    },
  },
});

export const { changeAccount, changeChainId, changeProvider, changeContract, changeSigner, privateInput} =
  web3Slice.actions;
export default web3Slice.reducer;
