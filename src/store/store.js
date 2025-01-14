import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./reducers/auth";
import { reportSlice } from "./reducers/report";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    report: reportSlice.reducer,
  },
});

export default store;
