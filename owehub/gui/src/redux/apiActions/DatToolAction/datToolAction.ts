// get_dlr_oth_data
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  postCaller,
  reportingCaller,
} from '../../../infrastructure/web_api/services/apiUrl';
import { toast } from 'react-toastify';

export const getDatProjectList = createAsyncThunk(
  'dataTool/getDatProjectList',
  async (
    payload: {
      search: string;
      page_number: number;
      page_size: number;
      sort: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await reportingCaller('get_project_list', {
        search: payload.search,
        page_number: payload.page_number,
        page_size: payload.page_size,
        sort: payload.sort,
      });

      return response;
    } catch (error) {
      return rejectWithValue('Failed to fetch Project List');
    }
  }
);
export const getDatGeneralInfo = createAsyncThunk(
  'dataTool/getDatGeneralInfo',
  async (payload: { project_id: string; id: string }, { rejectWithValue }) => {
    try {
      const response = await reportingCaller(
        'get_tab_general_info',
        {
          project_id: payload.project_id,
          id: payload.id,
        },
        true
      );

      return response;
    } catch (error) {
      return rejectWithValue('Failed to fetch General Info');
    }
  }
);
export const getDatAddersInfo = createAsyncThunk(
  'dataTool/getDatAddersInfo',
  async (payload: { project_id: string }, { rejectWithValue }) => {
    try {
      const response = await reportingCaller('get_tab_adders_info', {
        project_id: payload.project_id,
      });

      console.log(response, 'response.................');
      return response;
    } catch (error) {
      return rejectWithValue('Failed to fetch Adders Info');
    }
  }
);

export const getStructuralInfo = createAsyncThunk(
  'dataTool/getStructuralInfo',
  async (payload: { project_id: string; id: string }, { rejectWithValue }) => {
    try {
      const response = await reportingCaller('get_tab_structural_info', {
        project_id: payload.project_id,
        id: payload.id,
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
  async (payload: { project_id: string }, { rejectWithValue }) => {
    try {
      const response = await reportingCaller('get_tab_notes_info', {
        project_id: payload.project_id,
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
  async (payload: { project_id: string }, { rejectWithValue }) => {
    try {
      const response = await reportingCaller('get_tab_other_info', {
        project_id: payload.project_id,
      });
      console.log(response, 'response in my action dat.................');
      return response;
    } catch (error) {
      console.error('API Error:', error);
      return rejectWithValue('Failed to fetch DAT other information');
    }
  }
);

export const getDropdownList = createAsyncThunk(
  'dataTool/getDropdownList',
  async (
    { drop_down_list }: { drop_down_list: string[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await reportingCaller('get_drop_down_list', {
        drop_down_list,
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch dropdown list');
    }
  }
);
export const updateDatTool = createAsyncThunk(
  'dataTool/updateDatTool',
  async (param: any, { rejectWithValue }) => {
    try {
      const response = await reportingCaller('update_dat_tool_info', param);

      if (response.status > 201) {
        return rejectWithValue(response.message);
      }
      return response;
    } catch (error) {
      return rejectWithValue('Failed to fetch updateDatTool');
    }
  }
);

export const deleteDatState = createAsyncThunk(
  'dataTool/deleteDatState',
  async (
    payload: { project_id: string; state: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await reportingCaller('delete_dat_state', {
        project_id: payload.project_id,
        state: payload.state,
      });

      return response;
    } catch (error) {
      // Extract message from error for serialization
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete DAT state';

      return rejectWithValue(errorMessage);
    }
  }
);
