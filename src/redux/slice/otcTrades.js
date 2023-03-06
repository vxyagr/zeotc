import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_CREATED_SWAP_EXPIRED_TIME } from '../../constant';

const otcTrades = createSlice({
  name: 'otcTrades',
  initialState: {
    currentTab: 'Swap History',
    currentTabSubMenu: '',
    swapTab: 'Received Offers',
    selectNfts: [],
    selectTokenNftsReceive: [],
    productDetails: {},
    getCreateDate: DEFAULT_CREATED_SWAP_EXPIRED_TIME
  },
  reducers: {
    tradesTabs(state, action) {
      state.currentTab = action.payload;

      if (action.payload === 'Swaps') {
        state.currentTabSubMenu = 'pending received swap confirmations';
      }

      if (action.payload === 'Counter Offers') {
        state.currentTabSubMenu = 'pending received counter offers';
      }
    },
    tradesTabsSubMenu(state, action) {
      state.currentTabSubMenu = action.payload;
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
    }
  }
});

export const {
  tradesTabs,
  tradesTabsSubMenu,
  getProductDetails,
  tradesSwapTabs,
  addNewTokenNfts,
  addNewTokenNftsReceive,
  getCreateDateTime
} = otcTrades.actions;
export default otcTrades.reducer;
