import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { createAr, fetchAr,updateAr} from "../../../apiActions/arConfigAction";
import { RateAdjustment } from "../../../../core/models/api_models/RateAdjustmentModel";
import { toast } from "react-toastify";

interface IState {
    data: any,
    error: string,
    isLoading: boolean,
    isFormSubmitting:boolean
   
    isSuccess:number,
}

const initialState: IState = {
    data: [],
    error: "",
    isLoading: false,
    isFormSubmitting:false,
    isSuccess:0,
}

const ar = createSlice({
    name: "AR",
    initialState,
    reducers: { resetSuccess:(state)=>{
        state.isSuccess = 0
      }},
    extraReducers: builder => {
        builder.addCase(fetchAr.pending, (state) => {
            state.isLoading = true
        })
            .addCase(fetchAr.fulfilled, (state, action: PayloadAction<any | null>) => {
                state.isLoading = false
                state.data = action.payload ? action.payload :[]
            })
            .addCase(fetchAr.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
            .addCase(createAr.pending, (state, action) => {
                state.isFormSubmitting = true
            })
            .addCase(createAr.fulfilled, (state) => {
                state.isFormSubmitting = false
                state.isSuccess=1
            })
            .addCase(createAr.rejected, (state, action) => {
                state.isFormSubmitting = false
                state.error = action.payload as string
            })
            .addCase(updateAr.pending,(state, action) => {
                state.isFormSubmitting = true;
              })
              .addCase(updateAr.fulfilled, (state, action) => {
                state.isFormSubmitting = false;
                state.isSuccess=1
                
              })
              .addCase(updateAr.rejected, (state, action) => {
                state.isFormSubmitting = false;
                state.error = action.payload as string;
              })

    }
})

export const {resetSuccess} =  ar.actions
export default ar.reducer