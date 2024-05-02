import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { createAdjustments, getAdjustments } from "../../../apiActions/arAdjustmentsAction";
import { Adjustment } from "../../../../core/models/api_models/ArAdjustMentsModel";

interface IState {
    data: Adjustment[],
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
        builder.addCase(getAdjustments.pending, (state) => {
            state.isLoading = true
        })
            .addCase(getAdjustments.fulfilled, (state, action: PayloadAction<Adjustment[] | null>) => {
                state.isLoading = false
                state.data = action.payload ? action.payload:[]
            })
            .addCase(getAdjustments.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
            .addCase(createAdjustments.pending, (state, action) => {
                state.isFormSubmitting = true
            })
            .addCase(createAdjustments.fulfilled, (state) => {
                state.isFormSubmitting = false
            })
            .addCase(createAdjustments.rejected, (state, action) => {
                state.isFormSubmitting = false
                state.error = action.payload as string
            })

    }
})


export default rateAdjustments.reducer