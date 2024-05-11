import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getAR } from "../../apiActions/arAction";
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

const ArData = createSlice({
    name: "AR DATA",
    initialState,
    reducers: { resetSuccess:(state)=>{
        state.isSuccess = 0
      }},
    extraReducers: builder => {
        builder.addCase(getAR.pending, (state) => {
            state.isLoading = true
        })
            .addCase(getAR.fulfilled, (state, action: PayloadAction<any | null>) => {
                state.isLoading = false
                state.data = action.payload ? action.payload :[]
            })
            .addCase(getAR.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
         
    }
})

export const {resetSuccess} =  ArData.actions
export default ArData.reducer