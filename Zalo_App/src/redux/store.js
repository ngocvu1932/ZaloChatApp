import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import friendSlice from './friendSlice';
import deviceSlice from './deviceSlice';
import userInfoSlice from './userInfoSlice';
import groupChatInfoSlice from './groupChatInfoSlice';
import notificationSlide from './notificationSlide';

export default configureStore({
    reducer: {
      user: userSlice.reducer,
      listFriend: friendSlice.reducer,
      device: deviceSlice.reducer,
      userInfo: userInfoSlice.reducer,
      groupChatInfo: groupChatInfoSlice.reducer,
      notificationSlide: notificationSlide.reducer
    }
});