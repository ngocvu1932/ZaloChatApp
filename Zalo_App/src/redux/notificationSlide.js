import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    friendRequestRe: []
};

const notificationSlide = createSlice({
    name: 'friendRequestRe',
    initialState, 
    reducers: {
      setFriendRequestRe(state, action) {
        state.friendRequestRe = action.payload;
      },
    }
});

export const { setFriendRequestRe } = notificationSlide.actions;
export default notificationSlide;