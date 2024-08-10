/**
 * Created by Ankit Chuahan on 13/01/24
 * File Name: WelcomeReducer
 * Product Name: WebStorm
 * Project Name: owe_web_app
 * Path: src/ui/pages/welcome
 */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  inProgress: true,
  isLogin: false,
};

const welcomeReducer = (state = initialState, action: any) => {
  switch (action.type) {
    default:
      return state;
  }
};
//createSlice -> toolkit
export default welcomeReducer;

//===
const welcomeSlice = createSlice({
  name: 'welcome',
  initialState,
  reducers: {
    onChange: (state, action) => {},
  },
});
