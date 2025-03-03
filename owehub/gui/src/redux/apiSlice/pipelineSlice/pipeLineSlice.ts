import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getPipeLineData } from '../../apiActions/pipelineAction/pipelineAction';


interface ReportingState {
    isLoading: boolean;
    isFormSubmitting: boolean;

    pipelineData: {
        data: any,
        loading: boolean,
        error: string | null;
        list: any[];
    };
    loading: boolean;
    error: string | null;
}

const initialState: ReportingState = {
    isLoading: false,
    isFormSubmitting: false,

    pipelineData: {
        data: null,
        loading: true,
        error: null,
        list: [],
    },
    loading: false,
    error: null
};

const pipelineSlice = createSlice({
    name: 'pipeline',
    initialState,
    reducers: {

        clearPipelineData: (state) => {
            state.pipelineData = {
                data: null,
                loading: false,
                error: null,
                list: []
            };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPipeLineData.pending, (state) => {
                state.pipelineData.loading = true;
                state.pipelineData.error = null;
                state.pipelineData.data = null;  // Reset data on new request
                state.pipelineData.list = [];
            })
            .addCase(getPipeLineData.fulfilled, (state, action) => {
                state.pipelineData.loading = false;
                state.pipelineData.data = action.payload;
                state.pipelineData.list = action.payload?.list?.data?.pipeline_dealer_data_list;
            })
            .addCase(getPipeLineData.rejected, (state, action) => {
                state.pipelineData.loading = false;
                state.pipelineData.error = action.payload as string;
                state.pipelineData.data = null;  // Clear old data on failure
                state.pipelineData.list = [];
            });
    }

});

export const { clearPipelineData } = pipelineSlice.actions;
export default pipelineSlice.reducer; 