import { createSlice } from "@reduxjs/toolkit";

import {  RepPaySettingsModel} from "../../../../core/models/configuration/create/RepPaySettingsModel";
import { fetchRepaySettings } from "../../../apiActions/repPayAction";


interface repaySettings {
  repPaySettingsList: RepPaySettingsModel[];
  loading: boolean;
  error: string | null;
}
const initialState: repaySettings = {
  repPaySettingsList: [],
  loading: false,
  error: null,
};



const repaySettingSlice = createSlice({
  name: "repaySettings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRepaySettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRepaySettings.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        console.log(action.payload,"check")
        if (
          action.payload &&
          action.payload.data &&
          action.payload.data.rep_pay_settings_list
        ) {
          state.repPaySettingsList =
            action.payload.data.rep_pay_settings_list;
        } else {
          state.repPaySettingsList = [];
        }
      })
      .addCase(fetchRepaySettings.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? "Failed to fetch RepPaySettings Data";
      });
  },
});

export default repaySettingSlice.reducer;
