import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HTTP_METHOD } from "../../core/models/api_models/RequestModel";

export interface commissionData{
    data:{} | null,
    loading:boolean,
    error : string | null,
}

export const getCommission = createAsyncThunk('commission',async(data:any)=>{
  const response = await fetch(`${process.env.REACT_APP_BASE_URL}/get_commissions`, {
        method:HTTP_METHOD.GET,
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(data)
      });
      const result = await response.json();
        return result;
})
const initialState:commissionData={
    data:{},
    loading:false,
    error:""
}
export const commissionSlice = createSlice({
    name:"commission",
    initialState,
    reducers:{},
    extraReducers(builder){
        builder
        .addCase(getCommission.pending,(state)=>{
            state.loading = true
        })
        .addCase(getCommission.fulfilled,(state,action)=>{
            state.loading = false;
            state.error = null;
            state.data = action.payload
            
        })
        .addCase(getCommission.rejected,(state,action:PayloadAction<any>)=>{
            state.loading = false;
            state.error = action.payload;
            state.data = {}
        })

    }
})
export default commissionSlice.reducer