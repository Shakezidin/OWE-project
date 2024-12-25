import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reportingCaller } from '../../../infrastructure/web_api/services/apiUrl';


interface SpeedSummaryParams {
    year: string;
    week: string;
    batteryincluded: string;
    office: string[];
  }

// Async thunk for fetching reporting data
export const fetchInstallReportData = createAsyncThunk(
    'reporting/fetchInstallReport',
    async (payload: { startDate: string; endDate: string }, { rejectWithValue }) => {
      try {
        const response = await reportingCaller('pv-install-report', {
          startDate: payload.startDate,
          endDate: payload.endDate
        });
        return response;
      } catch (error) {
        return rejectWithValue('Failed to fetch reporting data');
      }
    }
  );
  
  // New thunk for speed summary
  export const fetchSpeedSummaryReport = createAsyncThunk(
    'reporting/fetchSpeedSummary',
    async (params: SpeedSummaryParams, { rejectWithValue }) => {
      try {
        const response = await reportingCaller('get_overallspeedsummaryreport', params);
        if (response.status > 200) {
          return rejectWithValue('Failed to fetch speed summary data');
        }
        return response.data;
      } catch (error) {
        return rejectWithValue('Failed to fetch speed summary data');
      }
    }
  );