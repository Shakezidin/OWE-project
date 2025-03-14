import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
    fetchSpeedSummaryReport,
    fetchInstallReportData,
    getTimelineInstallToFinData,
    getDropDownData,
    fetchSummaryData
} from '../../apiActions/reportingAction/reportingAction';

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
    installToFinData:{
        data: any,
        loading: boolean,
        error: string | null;
    };
    dropdownData:{
        data: any,
        loading: boolean,
        error: string | null;
    };
    summaryData:{
        data: any,
        loading: boolean,
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
    installToFinData:{
        data: null,
        loading: false,
        error: null,
    },
    dropdownData:{
        data: null,
        loading: false,
        error: null,
    },
    summaryData:{
        data: null,
        loading: true,
        error: null,
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
        },
        clearInstallToFinData: (state) => {
            state.installToFinData = {
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

            })

            // Install to FIN cases
            .addCase(getTimelineInstallToFinData.pending, (state) => {
                state.installToFinData.loading = true;
                state.installToFinData.error = null;
              })
              .addCase(getTimelineInstallToFinData.fulfilled, (state, action) => {
                state.installToFinData.loading = false;
                state.installToFinData.data = action.payload;
                toast.success(action.payload.message)
              })
              .addCase(getTimelineInstallToFinData.rejected, (state, action) => {
                state.installToFinData.loading = false;
                state.installToFinData.error = action.payload as string;
                toast.error(action.payload as string);
              })

               // Dropdown cases
               .addCase(getDropDownData.pending, (state) => {
                state.dropdownData.loading = true;
                state.dropdownData.error = null;
              })
              .addCase(getDropDownData.fulfilled, (state, action) => {
                state.dropdownData.loading = false;
                state.dropdownData.data = action.payload;
                toast.success(action.payload.message);
              })
              .addCase(getDropDownData.rejected, (state, action) => {
                state.dropdownData.loading = false;
                state.dropdownData.error = action.payload as string;
                toast.error(action.payload as string);
              })


              .addCase(fetchSummaryData.pending, (state) => {
                state.summaryData.loading = true;
                state.summaryData.error = null;
              })
              .addCase(fetchSummaryData.fulfilled, (state, action) => {
                state.summaryData.loading = false;
                state.summaryData.data = action.payload;
              })
              .addCase(fetchSummaryData.rejected, (state, action) => {
                state.summaryData.loading = false;
                state.summaryData.error = action.payload as string;
                toast.error(action.payload as string);
              });
    }
});

export const { clearReportingData, clearSpeedSummaryData, clearInstallToFinData } = reportingSlice.actions;
export default reportingSlice.reducer; 