import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  groupChatInfo : null,
};

const groupChatInfoSlice = createSlice({
    name: 'groupChatInfo',
    initialState,
    reducers: {
      setGroupChatInfo(state, action) {
        state.groupChatInfo = action.payload;
      },

      clearGroupChatInfo(state) {
        state.groupChatInfo = null;
      },
    }
});

export const { setGroupChatInfo, clearGroupChatInfo } = groupChatInfoSlice.actions;
export default groupChatInfoSlice;