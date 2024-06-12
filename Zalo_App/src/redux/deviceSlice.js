import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    device: null,
};

const deviceSlice = createSlice({
    name: 'device',
    initialState,
    reducers: {
      setDevice(state, action) { 
        state.device = action.payload;
      },
    }
});

export const { setDevice } = deviceSlice.actions;
export default deviceSlice;