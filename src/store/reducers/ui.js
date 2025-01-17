import { createSlice } from "@reduxjs/toolkit";

const initialState={
    drawerOpen:false,
}

export const uiSlice = createSlice({
    name:'ui',
    initialState,
    reducers:{
        toggleDrawer(state,action){
            state.drawerOpen = !state.drawerOpen;
        }
    }
})

export const {toggleDrawer}= uiSlice.actions;

export default uiSlice.reducer;