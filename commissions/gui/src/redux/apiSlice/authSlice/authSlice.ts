// authSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  email_id: string | null;
  role_name: string | null;
  access_token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  email_id: localStorage.getItem("email"),
  role_name: localStorage.getItem("role"),
  access_token: localStorage.getItem("token"),
  isAuthenticated: localStorage.getItem("token") ? true : false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      const { email_id, role_name, access_token } = action.payload;
      state.email_id = email_id;
      state.role_name = role_name;
      state.access_token = access_token;
      state.isAuthenticated = true;
      // localStorage.setItem('email', email_id);
      // localStorage.setItem('role', role_name);
      // localStorage.setItem('token', access_token)
    },
    logout(state) {
      state.email_id = null;
      state.role_name = null;
      state.access_token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      // localStorage.removeItem('email');
      //localStorage.removeItem('role');
    },
    initializeAuth(state) {
      state.isAuthenticated = state.access_token !== null;
    },
  },
});

export const { loginSuccess, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
