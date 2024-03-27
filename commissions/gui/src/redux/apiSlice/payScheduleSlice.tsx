import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postCaller } from "../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../infrastructure/web_api/api_client/EndPoints";


interface payScheduleData {
    partner:string,
    partner_name:string,
    installer_name: string,
    sale_type: string,
    state: string,
    rl: string,
    draw:string,
    draw_max: string,
    rep_draw: string,
    rep_draw_max:string,
    rep_pay: string,
    start_date: string,
    end_date: string
}

interface payScheduleState {
    payment_schedule_list: payScheduleData[];
    loading: boolean;
    error: string | null;
}
const initialState: payScheduleState = {
    payment_schedule_list: [],
    loading: false,
    error: null,
};

export const fetchPaySchedule = createAsyncThunk(
    'paySchedule/fetchPaySchedule',
    async (data: any) => {
        const response = await postCaller(EndPoints.paySchedule, data);
        return response;
    }
);

const payScheduleSlice = createSlice({
    name: 'paySchedule',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPaySchedule.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPaySchedule.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.payment_schedule_list = action.payload.data.payment_schedule_list;
            })
            .addCase(fetchPaySchedule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Failed to fetch payScheduleData data';
            });
    },
});

export default payScheduleSlice.reducer;
