import { configureStore } from '@reduxjs/toolkit';
import planReducer from './slices/planSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    plan: planReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
