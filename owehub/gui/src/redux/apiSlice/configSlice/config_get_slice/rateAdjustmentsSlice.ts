import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { createRateAdjustments , fetchRateAdjustments, updateRateAdjustment} from "../../../apiActions/RateAdjustmentsAction";
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

const rateAdjustments = createSlice({
    name: "RateAdjustments",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchRateAdjustments.pending, (state) => {
            state.isLoading = true
        })
            .addCase(fetchRateAdjustments.fulfilled, (state, action: PayloadAction<any | null>) => {
                state.isLoading = false
                state.data = action.payload ? action.payload.data.rate_adjustments_list
                :[]
            })
            .addCase(fetchRateAdjustments.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
            .addCase(createRateAdjustments.pending, (state, action) => {
                state.isFormSubmitting = true
            })
            .addCase(createRateAdjustments.fulfilled, (state) => {
                state.isFormSubmitting = false
                state.isSuccess=1
            })
            .addCase(createRateAdjustments.rejected, (state, action) => {
                state.isFormSubmitting = false
                state.error = action.payload as string
            })
            .addCase(updateRateAdjustment.pending,(state, action) => {
                state.isFormSubmitting = true;
              })
              .addCase(updateRateAdjustment.fulfilled, (state, action) => {
                state.isFormSubmitting = false;
                state.isSuccess=1
                toast.success("Details updated successfully")
              })
              .addCase(updateRateAdjustment.rejected, (state, action) => {
                state.isFormSubmitting = false;
                state.error = action.payload as string;
              })

    }
})


export default rateAdjustments.reducer