import { configureStore } from '@reduxjs/toolkit';

import otcTrades from './slice/otcTrades';
import web3Slice from './slice/web3';

const middleware = (getDefaultMiddleware) => {
  // if (import.meta.env.DEV) {
  //    // loggers.push(logger);
  // }

  return [
    ...getDefaultMiddleware({
      serializableCheck: false,
      //  serializableCheck: {
      //     // Ignore these action types
      //     ignoredActions: ['web3/changeProvider'],
      //  },
    })
  ];
};

export const store = configureStore({
  reducer: {
    otcTrades,
    web3Slice,
  },
  // preloadedState: {},
  middleware: (getDefaultMiddleware) => middleware(getDefaultMiddleware),
});
