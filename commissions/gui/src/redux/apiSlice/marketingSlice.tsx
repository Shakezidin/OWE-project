import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postCaller } from "../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../infrastructure/web_api/api_client/EndPoints";


interface MarketingFees {
    source: string,
    dba: string,
    state: string,
    fee_rate: string,
    chg_dlr: number,
    pay_src: number,
    description: string,
    start_date: string,
    end_date: string
}

interface MarketingState {
    marketing_fees_list: MarketingFees[];
    loading: boolean;
    error: string | null;
}
const initialState: MarketingState = {
    marketing_fees_list: [],
    loading: false,
    error: null,
};

export const fetchmarketingFees = createAsyncThunk(
    'marketing/fetchmarketingFees',
    async (data: any) => {
        const response = await postCaller(EndPoints.marketing, data);
        return response;
    }
);

const marketingSlice = createSlice({
    name: 'marketing',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchmarketingFees.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchmarketingFees.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.marketing_fees_list = action.payload.data.marketing_fees_list;
            })
            .addCase(fetchmarketingFees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Failed to fetch marketing data';
            });
    },
});

export default marketingSlice.reducer;
