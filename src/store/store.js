import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./reducers/auth";
import { reportSlice } from "./reducers/report";
import { uiSlice } from "./reducers/ui";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    report: reportSlice.reducer,
    ui: uiSlice.reducer,
  },
});

export default store;
