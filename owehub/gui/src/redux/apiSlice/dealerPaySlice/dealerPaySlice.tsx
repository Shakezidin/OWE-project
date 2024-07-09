import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDealerPay } from "../../apiActions/dealerPayAction";
import { toast } from "react-toastify";


const initialState = {
    loading:false,
    data:[],
    count:0,
    error:""
}

const dealerPaySlice = createSlice({
    name: 'dealerPaySlice',
    initialState,
    reducers: {},
    extraReducers:builder=>{
        builder.addCase(getDealerPay.pending,(state,)=>{
            state.loading = true
        })
        builder.addCase(getDealerPay.fulfilled,(state,action)=>{
            state.loading = false
            state.data = action.payload?.list 
            state.count = action.payload?.count 
        })
        builder.addCase(getDealerPay.rejected,(state,action)=>{
            state.loading = false
            state.error = action.payload as string
            toast.error(action.payload as string)
        })
        
    }
})

export default dealerPaySlice.reducer