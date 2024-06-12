import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    listFriend: []
};

const friendSlice = createSlice({
    name: 'listFriend',
    initialState, 
    reducers: {
      setListFriend(state, action) {
        state.listFriend = action.payload;
      },

      clearListFriend(state) {
        state.listFriend = null; 
      },
    }
});

export const { setListFriend, clearListFriend } = friendSlice.actions;
export default friendSlice;