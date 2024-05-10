import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { toast } from "react-toastify";
import { postCaller } from "../../infrastructure/web_api/services/apiUrl";


export const getPerfomance = createAsyncThunk("get/perfomance",async(params:{filters:[]},{rejectWithValue})=>{

    try {
        const data = await postCaller("get_perfomancemetrics",params)
        if (data.status>201) {
            return rejectWithValue((data as Error).message)
        }
        return data
    } catch (error) {
        return rejectWithValue((error as Error).message)
    }

})

export const getPerfomanceStatus = createAsyncThunk("get/perfomancestatus",async(params:{filters:[]},{rejectWithValue})=>{
    try {
        // get_perfomanceprojectstatus
        const data = await postCaller("get_perfomanceprojectstatus",params)
        if (data.status>201) {
            return rejectWithValue((data as Error).message)
        }
        const list = data.data.perfomance_response_list || []
        return {list ,count:data.dbRecCount}
    } catch (error) {
        return rejectWithValue((error as Error).message)
    }

})

interface IState {
    data: any,
    error: string,
    isLoading: boolean,
    isSuccess:number,
    perfomanceListCount:number
}

const initialState: IState = {
    data: [],
    error: "",
    isLoading: false,
    isSuccess:0,
    perfomanceListCount:0
}

const perfomanceSlice = createSlice({
    name: "perfomanceSlice",
    initialState,
    reducers: { resetSuccess:(state)=>{
        state.isSuccess = 0
      }},
    extraReducers: builder => {
        builder.addCase(getPerfomance.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getPerfomance.fulfilled,(state,action)=>{
            state.isLoading = false
        })
        .addCase(getPerfomance.rejected,(state,action)=>{
            state.isLoading  = false
            state.error  = action.payload as string
            toast.error(action.payload as string)
        })

        .addCase(getPerfomanceStatus.pending,(state,action)=>{
            state.isLoading  = false
        })
        .addCase(getPerfomanceStatus.fulfilled,(state,action)=>{
            state.isLoading = false
           state.data = action.payload.list
           state.perfomanceListCount = action.payload.count
        //    state.
        })
        .addCase(getPerfomanceStatus.rejected,(state,action)=>{
            state.isLoading  = false
            state.error  = action.payload as string
            toast.error(action.payload as string)
        })
           
         

    }
})

export const {resetSuccess} =  perfomanceSlice.actions
export default perfomanceSlice.reducer