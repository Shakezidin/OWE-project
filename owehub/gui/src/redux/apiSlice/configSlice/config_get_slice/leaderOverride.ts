import { createSlice } from "@reduxjs/toolkit";
import {toast} from "react-toastify"
import { createleaderOverride, getleaderOverride, updateleaderOverride } from "../../../apiActions/leaderOverrideAction";
interface IState {
  isLoading: boolean,
  isFormSubmitting: boolean,
  error:string,
  data: [],
  isSuccess:boolean
};

  const initialState:IState = {
    isLoading: false,
    isFormSubmitting: false,
    error: "",
    data: [],
    isSuccess:false
  };
  

const leaderOverride = createSlice({
    name:"leaderOverride",
    initialState,
    reducers:{
        resetSuccess:(state)=>{
            state.isSuccess = false
        }
    },
    extraReducers: (builder) => {
        builder
          .addCase(getleaderOverride.pending, (state, action) => {
            state.isLoading = true;
          })
          .addCase(getleaderOverride.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;                       
          })
          .addCase(getleaderOverride.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
          })


          builder.addCase(createleaderOverride.pending, (state, action) => {
            state.isFormSubmitting = true;
          })
          .addCase(createleaderOverride.fulfilled, (state, action) => {
            state.isFormSubmitting = false;
            state.isSuccess=true
   ;
            
          })
          .addCase(createleaderOverride.rejected, (state, action) => {
            state.isFormSubmitting = false;
            state.error = action.payload as string;
            toast.error(action.payload as string)
            console.log("error block");
            
          })

          .addCase(updateleaderOverride.pending, (state, action) => {
            state.isFormSubmitting = true;
          })
          .addCase(updateleaderOverride.fulfilled, (state, action) => {
            state.isFormSubmitting = false;
            state.isSuccess=true
            toast.success("Form submission completed")
          })
          .addCase(updateleaderOverride.rejected, (state, action) => {
            state.isFormSubmitting = false;
            state.error = action.payload as string;
            toast.error(action.payload as string)
          })
       
      },
})

export const {resetSuccess} = leaderOverride.actions

export default leaderOverride.reducer