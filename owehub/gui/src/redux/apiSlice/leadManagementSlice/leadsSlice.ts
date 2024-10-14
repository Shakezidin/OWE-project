import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  getLeadById,
  getLeads,
  createProposal
} from '../../apiActions/leadManagement/LeadManagementAction';

interface IState {
  isLoading: boolean;
  isFormSubmitting: boolean;
  error: string;
  leadsData: any[];
  leadDetail: any;
  isSuccess: boolean;
  totalcount: number;
}

const initialState: IState = {
  isLoading: false,
  isFormSubmitting: false,
  error: '',
  leadsData: [],
  leadDetail: {},
  isSuccess: false,
  totalcount: 0,
};

const leadManagementSlice = createSlice({
  name: 'leadManagmentSlice',
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLeads.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLeads.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leadsData = action.payload.data || [];
        state.totalcount = action.payload.dbRecCount || 0;
      })
      .addCase(getLeads.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      .addCase(getLeadById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLeadById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leadsData = action.payload.data || {};
        state.totalcount = action.payload.dbRecCount || 0;
        toast.success(action.payload.message)
      })
      .addCase(getLeadById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
//----------------Create Proposal---------------------------
      .addCase(createProposal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProposal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leadsData = action.payload.data || {};
        state.totalcount = action.payload.dbRecCount || 0;
        // state.loading = false;
        // state.projectId = action.payload;
      })
      .addCase(createProposal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export const { resetSuccess } = leadManagementSlice.actions;

export default leadManagementSlice.reducer;
