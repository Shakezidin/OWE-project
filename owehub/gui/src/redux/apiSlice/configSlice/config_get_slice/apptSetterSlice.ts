import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { fetchApptSetters, updateApptSetters, createApttSetters} from "../../../apiActions/apptSetterAction"
import { RateAdjustment } from "../../../../core/models/api_models/RateAdjustmentModel";
import { toast } from "react-toastify";

interface IState {
    data: any,
    error: string,
    isLoading: boolean,
    isFormSubmitting:boolean 
    isSuccess:boolean
}

const initialState: IState = {
    data: [],
    error: "",
    isLoading: false,
    isFormSubmitting:false,
    isSuccess:false,
}

const apptSetters = createSlice({
    name: "Appt Setters",
    initialState,
    reducers: {    resetSuccess:(state)=>{
        state.isSuccess = false
      }},
    extraReducers: builder => {
        builder.addCase(fetchApptSetters.pending, (state) => {
            state.isLoading = true
        })
            .addCase(fetchApptSetters.fulfilled, (state, action: PayloadAction<any | null>) => {
                state.isLoading = false
                state.data = action.payload ? action.payload:[]
            })
            .addCase(fetchApptSetters.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
            .addCase(createApttSetters.pending, (state, action) => {
                state.isFormSubmitting = true
            })
            .addCase(createApttSetters.fulfilled, (state) => {
                state.isFormSubmitting = false
                state.isSuccess=true
            })
            .addCase(createApttSetters.rejected, (state, action) => {
                state.isFormSubmitting = false
                state.error = action.payload as string
            })
            .addCase(updateApptSetters.pending,(state, action) => {
                state.isFormSubmitting = true;
              })
              .addCase(updateApptSetters.fulfilled, (state, action) => {
                state.isFormSubmitting = false;
                state.isSuccess=true
                
              })
              .addCase(updateApptSetters.rejected, (state, action) => {
                state.isFormSubmitting = false;
                state.error = action.payload as string;
              })

    }
})

export const {resetSuccess} =  apptSetters.actions
export default apptSetters.reducer