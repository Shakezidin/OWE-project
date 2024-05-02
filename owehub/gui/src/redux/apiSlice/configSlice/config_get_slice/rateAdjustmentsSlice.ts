import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { createRateAdjustments , fetchRateAdjustments} from "../../../apiActions/RateAdjustmentsAction";
import { RateAdjustment } from "../../../../core/models/api_models/RateAdjustmentModel";

interface IState {
    data: RateAdjustment[],
    error: string,
    isLoading: boolean,
    isFormSubmitting:boolean
}

const initialState: IState = {
    data: [],
    error: "",
    isLoading: false,
    isFormSubmitting:false
}

const rateAdjustments = createSlice({
    name: "arAdjustments",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchRateAdjustments.pending, (state) => {
            state.isLoading = true
        })
            .addCase(fetchRateAdjustments.fulfilled, (state, action: PayloadAction<RateAdjustment[] | null>) => {
                state.isLoading = false
                state.data = action.payload ? action.payload:[]
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
            })
            .addCase(createRateAdjustments.rejected, (state, action) => {
                state.isFormSubmitting = false
                state.error = action.payload as string
            })

    }
})


export default rateAdjustments.reducer