// authSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { loginAction } from '../../apiActions/auth/authActions';
import { HTTP_STATUS } from '../../../core/models/api_models/RequestModel';
import { toast } from 'react-toastify';

interface AuthState {
  loading: boolean;
  error: null | string;
  email_id: string | null;
  role_name: string | null;
  access_token: string | null;
  isAuthenticated: boolean;
  is_password_change_required: boolean;
  status: number | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  email_id: localStorage.getItem('email'),
  role_name: localStorage.getItem('role'),
  access_token: localStorage.getItem('token'),
  isAuthenticated: localStorage.getItem('token') ? true : false,
  status: null,
  is_password_change_required: localStorage.getItem(
    'is_password_change_required'
  )
    ? true
    : false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // loginSuccess(state, action) {
    //   const { email_id, role_name, access_token } = action.payload;
    //   state.email_id = email_id;
    //   state.role_name = role_name;
    //   state.access_token = access_token;
    //   state.isAuthenticated = true;
    // },
    logout(state) {
      state.email_id = null;
      state.role_name = null;
      state.access_token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('role');
    },
    initializeAuth(state) {
      state.isAuthenticated = state.access_token !== null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAction.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAction.fulfilled, (state: AuthState, action) => {
        state.loading = false;
        state.error = null;
        console.log(' action.payload........', action.payload);

        const { status, data } = action.payload;
        if (status === HTTP_STATUS.OK) {
          // on succesfull login dismiss previous toasters
          toast.dismiss()

          state.email_id = data.email_id;
          state.role_name = data.role_name;
          state.access_token = data.access_token;
          state.isAuthenticated = true;
          state.is_password_change_required = data.is_password_change_required;
        }
      })
      .addCase(loginAction.rejected, (state: AuthState, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Unable to login User';
         // on succesfull logout dismiss previous toasters
         toast.dismiss()
      });
  },
});

export const { logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
