import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postCaller } from "../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../infrastructure/web_api/api_client/EndPoints";


interface loanTypeData {
    product_code:string,
    active:number,
    adder:number,
    description:string,
}

interface loanTypeState {
    loantype_list: loanTypeData[];
    loading: boolean;
    error: string | null;
}
const initialState: loanTypeState = {
    loantype_list: [],
    loading: false,
    error: null,
};

export const fetchLoanType = createAsyncThunk(
    'loanType/fetchLoanType',
    async (data: any) => {
        const response = await postCaller(EndPoints.loanType, data);
        return response;
    }
);

const loanTypeSlice = createSlice({
    name: 'loanType',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLoanType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLoanType.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.loantype_list = action.payload.data.loantype_list;
            })
            .addCase(fetchLoanType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Failed to fetch loanTypeData data';
            });
    },
});

export default loanTypeSlice.reducer;
