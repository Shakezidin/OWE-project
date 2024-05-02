import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getArscheduleList,
  IARSchedule,
  createArSchedule,
} from "../../../apiActions/arScheduleAction";

interface IState {
  data: IARSchedule[];
  error: string;
  isLoading: boolean;
  isFormSubmitting: boolean;
}
const initialState: IState = {
  isLoading: false,
  isFormSubmitting: false,
  error: "",
  data: [],
};

const arSchedule = createSlice({
  name: "arSchedule",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getArscheduleList.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getArscheduleList.fulfilled, (state, action) => {
        state.isLoading = true;
        state.data = action.payload;
      })
      .addCase(getArscheduleList.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(createArSchedule.pending, (state, action) => {
        state.isFormSubmitting = true;
      })
      .addCase(createArSchedule.fulfilled, (state, action) => {
        state.isFormSubmitting = false;
      })
      .addCase(createArSchedule.rejected, (state, action) => {
        state.isFormSubmitting = true;
        state.error = action.payload as string;
      });
  },
});

export default arSchedule.reducer;
