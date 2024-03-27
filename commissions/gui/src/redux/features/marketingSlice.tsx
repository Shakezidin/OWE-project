import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postCaller } from "../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../infrastructure/web_api/api_client/EndPoints";

export interface dealerData{
    data:any | null,
    loading:boolean,
    error : string | null,
}

export const getMarketingFees = createAsyncThunk('marketing',async(data:any)=>{
const response  = await postCaller(EndPoints.marketing,data)
return response.data
})
const initialState:dealerData={
    data:[],
    loading:false,
    error:""
}
export const marketingSlice = createSlice({
    name:"marketing",
    initialState,
    reducers:{},
    extraReducers(builder){
        builder
        .addCase(getMarketingFees.pending,(state)=>{
            state.loading = true
        })
        .addCase(getMarketingFees.fulfilled,(state,action)=>{
            state.loading = false;
            state.error = null;
            state.data = action.payload;
            
        })
        .addCase(getMarketingFees.rejected,(state,action:PayloadAction<any>)=>{
            state.loading = false;
            state.error = action.payload;
            state.data = []
        })

    }
})
export default marketingSlice.reducer