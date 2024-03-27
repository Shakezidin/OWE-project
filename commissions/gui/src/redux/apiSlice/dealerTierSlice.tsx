import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postCaller } from "../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../infrastructure/web_api/api_client/EndPoints";


interface ApiState {
    dealer_name:string,
    tier: string,
    start_date: string,
    end_date: string
}

interface DealerTierState {
    dealers_tier_list: ApiState[];
    loading: boolean;
    error: string | null;
}
const initialState: DealerTierState = {
    dealers_tier_list: [],
    loading: false,
    error: null,
};

export const fetchDealerTier = createAsyncThunk(
    'dealerTier/fetchDealerTier',
    async (data: any) => {
        const response = await postCaller(EndPoints.dealerTier, data);
        return response;
    }
);

const dealerTierSlice = createSlice({
    name: 'dealerTier',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDealerTier.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDealerTier.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.dealers_tier_list = action.payload.data.dealers_tier_list;
            })
            .addCase(fetchDealerTier.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Failed to fetch ApiState data';
            });
    },
});

export default dealerTierSlice.reducer;
