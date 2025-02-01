import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {getDatAddersInfo, getDatGeneralInfo, getDatProjectList} from '../../apiActions/DatToolAction/datToolAction'
import { toast } from 'react-toastify';



// Define the interface for the initial state
interface DatToolState {
  loading: boolean;
  data: any[]; // Adjust 'any' if you have more specific data structure
  count: number;
  error: string;
  generalData:GeneralData | null;
  addersData:AddersData | null;
}

interface GeneralData {
  project_name: string;
  project_id: string;
  project_address: string;
  phone_number: string;
  email_id: string;
  pv_module: string;
  inverters: string;
  battery: string;
  dc_system_size: number;
  ac_system_size: number;
  battery_capacity: number;
  ahj: string;
  utility: string;
  branch: string;
  lender: string;
  aurora_link: string;
  tape_link: string;
  site_capture_url: string;
  contract_date: string;
  module_qty: number;
  module_type: number;
  inverter_type: string;
  battery_type: string;
  ac_dc_system_size: string;
  total_production: number;
  dat_module_qty: number;
  dat_module_type: string;
  dat_design_version: number;
  dat_designer_name: string;
  dat_aurora_id: string;
  dat_system_size_ac: string;
  dat_system_size_dc: string;
  dat_changes: string;
  dat_change_order: string;
}

interface Component {
  name: string;
  quantity: number;
  cost: number;
}

interface AddersData {
  adders: string;
  interconnection_cost: number;
  electrical_cost: number;
  site_adders_cost: number;
  structural_cost: number;
  upgrades_cost: number;
  trenching_cost: number;
  battery_cost: number;
  other_cost: number;
  total_cost: number;
  components: Component[];
}

// Initialize the state with type safety
const initialState: DatToolState = {
  loading: false,
  data: [],
  count: 0,
  error: '',
  generalData:null,
  addersData:null,
};



const datSlice = createSlice({
  name: 'datToolSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDatProjectList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getDatProjectList.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload?.data?.project_data;
    });
    builder.addCase(getDatProjectList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });
 


    builder.addCase(getDatGeneralInfo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getDatGeneralInfo.fulfilled, (state, action) => {
      state.loading = false;
      state.generalData = action.payload?.data;
    });
    builder.addCase(getDatGeneralInfo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });



    builder.addCase(getDatAddersInfo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getDatAddersInfo.fulfilled, (state, action) => {
      state.loading = false;
      state.addersData = action.payload?.data;
    });
    builder.addCase(getDatAddersInfo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });
 
  },
});

export default datSlice.reducer;
