import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postCaller } from "../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../infrastructure/web_api/api_client/EndPoints";


interface timeLineData {
    type_m2m:string,
    state:string,
    days:string,
    start_date: string,
    end_date: string
}

interface timeLineState {
    timelinesla_list: timeLineData[];
    loading: boolean;
    error: string | null;
}
const initialState: timeLineState = {
    timelinesla_list: [],
    loading: false,
    error: null,
};

export const fetchTimeLineSla = createAsyncThunk(
    'timeLineSla/fetchTimeLineSla',
    async (data: any) => {
        const response = await postCaller(EndPoints.timeLineSla, data);
  
        return response;
    }
);

const timeLineSlice = createSlice({
    name: 'timeLineSla',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTimeLineSla.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTimeLineSla.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                if (action.payload && action.payload.data && action.payload.data.timelinesla_list) {
                    state.timelinesla_list = action.payload.data.timelinesla_list;
                  } else {
                    state.timelinesla_list = [];
                  }
            })
            .addCase(fetchTimeLineSla.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Failed to fetch timeLineData data';
            });
    },
});

export default timeLineSlice.reducer;
