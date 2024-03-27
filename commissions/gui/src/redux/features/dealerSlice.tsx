import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postCaller } from "../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../infrastructure/web_api/api_client/EndPoints";

export interface dealerData{
    data:any | null,
    loading:boolean,
    error : string | null,
}

export const getDealer = createAsyncThunk('dealer',async(data:any)=>{
const response  = await postCaller(EndPoints.dealer,data)
return response.data
})
const initialState:dealerData={
    data:[],
    loading:false,
    error:""
}
export const dealerSlice = createSlice({
    name:"dealer",
    initialState,
    reducers:{},
    extraReducers(builder){
        builder
        .addCase(getDealer.pending,(state)=>{
            state.loading = true
        })
        .addCase(getDealer.fulfilled,(state,action)=>{
            state.loading = false;
            state.error = null;
            state.data = action.payload;
            
        })
        .addCase(getDealer.rejected,(state,action:PayloadAction<any>)=>{
            state.loading = false;
            state.error = action.payload;
            state.data = []
        })

    }
})
export default dealerSlice.reducer