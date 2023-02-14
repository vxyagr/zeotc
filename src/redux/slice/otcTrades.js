import { createSlice } from '@reduxjs/toolkit';

const otcTrades = createSlice({
  name: 'otcTrades',
  initialState: {
    currentTab: 'Swap History',
    swapTab: 'Received Offers',
    selectNfts: [],
    selectTokenNftsReceive: [],
    productDetails: {},
    getCreateDate: null,
  },
  reducers: {
    tradesTabs(state, action) {
      state.currentTab = action.payload;
    },
    tradesSwapTabs(state, action) {
      state.swapTab = action.payload;
    },
    addNewTokenNfts(state, action) {
      state.selectNfts = action.payload;
    },
    addNewTokenNftsReceive(state, action) {
      state.selectTokenNftsReceive = action.payload;
    },
    getProductDetails(state, action) {
      state.productDetails = action.payload;
    },
    getCreateDateTime(state, action) {
      state.getCreateDate = action.payload;
    },
  },
});

export const {
  tradesTabs,
  getProductDetails,
  tradesSwapTabs,
  addNewTokenNfts,
  addNewTokenNftsReceive,
  getCreateDateTime,
} = otcTrades.actions;
export default otcTrades.reducer;
