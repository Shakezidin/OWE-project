import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  getLeadById,
  getLeads,
  auroraCreateProject,
  auroraCreateDesign,
  auroraCreateProposal,
  getProjectByLeadId,
  auroraWebProposal
} from '../../apiActions/leadManagement/LeadManagementAction';

interface IState {
  isLoading: boolean;
  isFormSubmitting: boolean;
  error: string;
  leadsData: any[];
  leadDetail: any;
  isSuccess: boolean;
  totalcount: number;
  proposalData: any;
  projectData: any;
  designData: any;
  webProposalData: any;
}

const initialState: IState = {
  isLoading: false,
  isFormSubmitting: false,
  error: '',
  leadsData: [],
  leadDetail: {},
  isSuccess: false,
  totalcount: 0,
  proposalData: {},
  projectData: {},
  designData: {},
  webProposalData: {}
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

      // New cases for auroraCreateProject
      .addCase(auroraCreateProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(auroraCreateProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projectData = action.payload.data || {};
      })
      .addCase(auroraCreateProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      // New cases for auroraCreateDesign
      .addCase(auroraCreateDesign.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(auroraCreateDesign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.designData = action.payload.data || {};
      })
      .addCase(auroraCreateDesign.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      // New cases for auroraCreateProposal
      .addCase(auroraCreateProposal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(auroraCreateProposal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.proposalData = action.payload.data || {};
      })
      .addCase(auroraCreateProposal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      // Existing cases for getProjectByLeadId
      .addCase(getProjectByLeadId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProjectByLeadId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projectData = action.payload.data || {};
        toast.success(action.payload.message);
      })
      .addCase(getProjectByLeadId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      // New cases for auroraWebProposal
      .addCase(auroraWebProposal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(auroraWebProposal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.webProposalData = action.payload.data || {};
      })
      .addCase(auroraWebProposal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export const { resetSuccess } = leadManagementSlice.actions;

export default leadManagementSlice.reducer;
