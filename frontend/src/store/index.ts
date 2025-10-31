import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import listingsReducer from "./listings/listingSlice";
import listingDetailReducer from "./listings/listingDetailSlice";
import statisticsReducer from "./dashboard/statisticsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    listings: listingsReducer,
    listingDetail: listingDetailReducer,

    statistics: statisticsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
