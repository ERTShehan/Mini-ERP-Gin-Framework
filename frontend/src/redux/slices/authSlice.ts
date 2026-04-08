import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user_id: number | null;
}

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem('access_token'),
  user_id: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ user_id: number }>) {
      state.isAuthenticated = true;
      state.user_id = action.payload.user_id;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user_id = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
