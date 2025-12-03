import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawerOpen: false,
  sideNavCollapse: window.innerWidth < 768 ? true : false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleDrawer(state, action) {
      state.drawerOpen = !state.drawerOpen;
    },
    toggleSideNav(state, action) {
      state.sideNavCollapse = !state.sideNavCollapse;
    },
    changeSideNav(state, action) {
      state.sideNavCollapse = action.payload;
    },
  },
});

export const { toggleDrawer, toggleSideNav, changeSideNav } = uiSlice.actions;

export default uiSlice.reducer;
