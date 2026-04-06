import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  user: any | null;
  builder: any | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  builder: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('builder_token') : null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.user = action.payload.user;
      state.builder = action.payload.builder;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('builder_token', action.payload.token);
      }
    },
    logout: (state) => {
      state.user = null;
      state.builder = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('builder_token');
      }
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
