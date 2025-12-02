import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isLoggedIn: localStorage.getItem("user") ? true : false,
  loginError: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLogin(state, action) {
      localStorage.setItem("user", JSON.stringify(action.payload));
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    userLogout(state) {
      localStorage.removeItem("user");
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { userLogin, userLogout } = authSlice.actions;

export default authSlice.reducer;
