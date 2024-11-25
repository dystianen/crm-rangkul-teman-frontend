import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as API from 'src/api/menu';

interface IMenuState {
    menus: any[];
}

const initialState: IMenuState = {
    menus: [],
};

export const doFindAll = createAsyncThunk('menu/findAll', async () => {
    return API.getUserMenu();
});

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {},
    extraReducers: (builder: any) => {
        builder.addCase(doFindAll.fulfilled, (state: any, action: any) => {
            state.menus = action.payload;
        });
    },
});

export default menuSlice.reducer;