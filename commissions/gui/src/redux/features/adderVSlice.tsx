import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postCaller } from "../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../infrastructure/web_api/api_client/EndPoints";

export interface commissionData{
    data:any | null,
    loading:boolean,
    error : string | null,
}

export const getAdderV = createAsyncThunk('adderV',async(data:any)=>{
const response  = await postCaller(EndPoints.adderV,data)
return response.data
})
const initialState:commissionData={
    data:[],
    loading:false,
    error:""
}
export const adderVSlice = createSlice({
    name:"adderV",
    initialState,
    reducers:{},
    extraReducers(builder){
        builder
        .addCase(getAdderV.pending,(state)=>{
            state.loading = true
        })
        .addCase(getAdderV.fulfilled,(state,action)=>{
            state.loading = false;
            state.error = null;
            state.data = action.payload;
            
        })
        .addCase(getAdderV.rejected,(state,action:PayloadAction<any>)=>{
            state.loading = false;
            state.error = action.payload;
            state.data = []
        })

    }
})
export default adderVSlice.reducer