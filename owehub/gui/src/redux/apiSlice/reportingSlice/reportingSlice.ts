import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
    fetchSpeedSummaryReport,
    fetchInstallReportData
} from '../../apiActions/reportingAction/reportingAction';

interface SpeedSummaryParams {
    year: string;
    week: string;
    batteryincluded: string;
    office: string[];
}

interface ReportingState {
    isLoading: boolean;
    isFormSubmitting: boolean;
    installData: {
        created: any[];
        completed: any[];
    };
    speedSummaryData: {
        data: any;
        loading: boolean;
        error: string | null;
    };
    loading: boolean;
    error: string | null;
}

const initialState: ReportingState = {
    isLoading: false,
    isFormSubmitting: false,
    installData: {
        created: [],
        completed: []
    },
    speedSummaryData: {
        data: null,
        loading: false,
        error: null
    },
    loading: false,
    error: null
};

const reportingSlice = createSlice({
    name: 'reporting',
    initialState,
    reducers: {
        clearReportingData: (state) => {
            state.installData = { created: [], completed: [] };
            state.error = null;
        },
        clearSpeedSummaryData: (state) => {
            state.speedSummaryData = {
                data: null,
                loading: false,
                error: null
            };
        }
    },
    extraReducers: (builder) => {
        builder
            // Install report cases
            .addCase(fetchInstallReportData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInstallReportData.fulfilled, (state, action) => {
                state.loading = false;
                state.installData = action.payload;
            })
            .addCase(fetchInstallReportData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                toast.error(action.payload as string);

                
            })
            // Speed summary cases
            .addCase(fetchSpeedSummaryReport.pending, (state) => {
                state.speedSummaryData.loading = true;
                state.speedSummaryData.error = null;
            })
            .addCase(fetchSpeedSummaryReport.fulfilled, (state, action) => {
                state.speedSummaryData.loading = false;
                state.speedSummaryData.data = action.payload;
                toast.success(action.payload.message)

            })
            .addCase(fetchSpeedSummaryReport.rejected, (state, action) => {
                state.speedSummaryData.loading = false;
                state.speedSummaryData.error = action.payload as string;
                toast.error(action.payload as string);

            });
    }
});

export const { clearReportingData, clearSpeedSummaryData } = reportingSlice.actions;
export default reportingSlice.reducer; 