// get_dlr_oth_data
import { createAsyncThunk } from '@reduxjs/toolkit';
import { postCaller, reportingCaller } from '../../../infrastructure/web_api/services/apiUrl';



export const getDatProjectList = createAsyncThunk(
  'dataTool/getDatProjectList',
  async (payload: { search: string;page_number:number;page_size:number;sort:string }, { rejectWithValue }) => {
    try {
      const response = await reportingCaller('get_project_list', {
        search: payload.search,
        page_number: payload.page_number,
        page_size: payload.page_size,
        sort: payload.sort
      });
      
      return response;
    } catch (error) {
      return rejectWithValue('Failed to fetch Project List');
    }
  }
);
export const getDatGeneralInfo = createAsyncThunk(
  'dataTool/getDatGeneralInfo',
  async (payload: { project_id: string; }, { rejectWithValue }) => {
    try {
      const response = await reportingCaller('get_tab_general_info', {
        project_id: payload.project_id
      });
      
      return response;
    } catch (error) {
      return rejectWithValue('Failed to fetch General Info');
    }
  }
);
export const getDatAddersInfo = createAsyncThunk(
  'dataTool/getDatAddersInfo',
  async (payload: { project_id: string; }, { rejectWithValue }) => {
    try {
      const response = await reportingCaller('get_tab_adders_info', {
        project_id: payload.project_id
      });
      
      return response;
    } catch (error) {
      return rejectWithValue('Failed to fetch Adders Info');
    }
  }
);

export const getStructuralInfo = createAsyncThunk(
  'dataTool/getStructuralInfo',
  async (payload: { project_id: string; }, { rejectWithValue }) => {
    try {
      const response = await reportingCaller('get_tab_structural_info', {
        project_id: payload.project_id
      });
      return response;
    } catch (error) {
      console.error('API Error:', error);
      return rejectWithValue('Failed to fetch structural information');
    }
  }
);

export const getNotesInfo = createAsyncThunk(
  'dataTool/getNotesInfo',
  async (payload: { project_id: string; }, { rejectWithValue }) => {
    try {
      const response = await reportingCaller('get_tab_notes_info', {
        project_id: payload.project_id
      });
      return response;
    } catch (error) {
      console.error('API Error:', error);
      return rejectWithValue('Failed to fetch Notes information');
    }
  }
);
export const getOtherInfo = createAsyncThunk(
  'dataTool/getOtherInfo',
  async (payload: { project_id: string; }, { rejectWithValue }) => {
    try {
      const response = await reportingCaller('get_tab_other_info', {
        project_id: payload.project_id
      });
      return response;
    } catch (error) {
      console.error('API Error:', error);
      return rejectWithValue('Failed to fetch DAT other information');
    }
  }
);

export const getDropdownList = createAsyncThunk(
  'dataTool/getDropdownList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await reportingCaller('owe-reports-service/v1/get_drop_down_list', {
        drop_down_list: [
          "structure", "roof_type", "sheathing_type", "framing_size", "framing_type_1", 
          "framing_type_2", "framing_spacing", "attachment", "racking", "pattern", "mount", 
          "structural_upgrades", "gm_support_type", "reroof_required", "attachment_type", 
          "attachment_pattern", "attachment_spacing", "racking_mount_type", "racking_max_rail_cantilever", 
          "new_or_existing", "panel_brand", "busbar_rating", "main_breaker_rating", "system_phase", 
          "system_voltage", "service_entrance", "service_rating", "meter_enclosure_type", 
          "pv_conduct_run", "drywall_cut_needed", "number_of_stories", "trenching_required", 
          "points_of_interconnection", "inverter"
        ]
      });
      
      return response.data.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch dropdown list');
    }
  }
);