import { configureStore } from "@reduxjs/toolkit";
import cartSliceReducer from "../features/cartSlice";
import { apiSlice } from "../features/apiSlice";
import authSliceReducer from "../features/authSlice";

const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    cart: cartSliceReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
