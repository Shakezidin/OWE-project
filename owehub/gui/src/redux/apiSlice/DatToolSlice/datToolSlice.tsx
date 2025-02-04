import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {getDatAddersInfo, getDatGeneralInfo, getDatProjectList, getNotesInfo, getOtherInfo, getStructuralInfo} from '../../apiActions/DatToolAction/datToolAction'
import { toast } from 'react-toastify';



// Define the interface for the initial state
interface DatToolState {
  loading: boolean;
  sideLoading: boolean;
  data: any[]; // Adjust 'any' if you have more specific data structure
  count: number;
  error: string;
  generalData:GeneralData | null;
  addersData:AddersData | null;
  structuralData: StructuralData | null;
  notesData: any | null;
  othersData: OthersData | null;
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

interface OthersData {
  equipment: {
    new_or_existing: string;
    panel_brand: string;
    busbar_rating: number;
    main_breaker_rating: number;
    available_backfeed: number;
    required_backfeed: string;
  };
  system: {
    system_phase: string;
    system_voltage: string;
    service_entrance: string;
    service_rating: string;
    meter_enclosure_type: string;
  };
  siteInfo: {
    pv_conduct_run: string;
    drywall_cut_needed: string;
    number_of_stories: number;
    trenching_required: string;
    points_of_interconnection: number;
  };
  pvInterconnection: {
    type: string;
    supply_load_side: string;
    location: string;
    sub_location_tap_details: string;
  };
  essInterconnection: {
    backup_type: string;
    transfer_switch: string;
    fed_by: string;
  };
  inverterConfigParent: {
    inverter: string;
    max: number;
    mppt1: { s1: string; s2: string };
    mppt2: { s1: string; s2: string };
    mppt3: { s1: string; s2: string };
    mppt4: { s1: string; s2: string };
    mppt5: { s1: string; s2: string };
    mppt6: { s1: string; s2: string };
    mppt7: { s1: string; s2: string };
    mppt8: { s1: string; s2: string };
  };
  roofCoverage: {
    total_roof_area: string;
    area_of_new_modules: string;
    area_of_exst_modules: string;
    coverage_percentage: string;
  };
  measurement: {
    length: string;
    width: string;
    height: string;
    other: string;
  };
  existingPV: {
    module_quantity: number;
    model_number: string;
    wattage: string;
    module_area: string;
    inverter1_info: {
      quantity: number;
      model_number: string;
      output_a: string;
    };
    inverter2_info: {
      quantity: number;
      model_number: string;
      output_a: string;
    };
    existing_calculated_backfeed_without_125: number;
  };
}

interface Component {
  name: string;
  quantity: number;
  cost: number;
}



interface Item {
  name: string;
  quantity: number;
  cost: number;
}

interface Category {
  title: string;
  cost: number;
  items: Item[];
}

interface AddersData {
  categories: Category[];
  total_cost: number;
}

interface StructuralData {
  structure: string;
  roof_type: string;
  sheathing_type: string;
  framing_size: string;
  framing_type_1: string;
  framing_type_2: string;
  framing_spacing: number;
  attachment: string;
  racking: string;
  pattern: string;
  mount: string;
  structural_upgrades: string;
  gm_support_type: string;
  reroof_required: string;
  quantity: number;
  pitch: number;
  area_sqft: string;
  azimuth: number;
  tsrf: number;
  kw_dc: number;
  spacing_p: number;
  spacing_l: number;
  attachment_type: string;
  attachment_pattern: string;
  attachment_quantity: number;
  attachment_spacing: string;
  racking_type: string;
  racking_mount_type: string;
  racking_title_info: string;
  racking_max_rail_cantilever: string;
  roof_framing_type: string;
  roof_size: string;
  roof_spacing: number;
  roof_sheathing_type: string;
  roof_material: string;
  roof_structural_upgrade: string;
}

// Initialize the state with type safety
const initialState: DatToolState = {
  loading: false,
  data: [],
  count: 0,
  error: '',
  generalData:null,
  addersData:null,
  structuralData: null,
  notesData: null,
  sideLoading:false,
  othersData: null,
};




const datSlice = createSlice({
  name: 'datToolSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDatProjectList.pending, (state) => {
      state.sideLoading = true;
    });
    builder.addCase(getDatProjectList.fulfilled, (state, action) => {
      state.sideLoading = false;
      state.data = action.payload?.data;
    });
    builder.addCase(getDatProjectList.rejected, (state, action) => {
      state.sideLoading = false;
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


    builder.addCase(getStructuralInfo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getStructuralInfo.fulfilled, (state, action) => {
      state.loading = false;
      state.structuralData = action.payload?.data;
    });
    builder.addCase(getStructuralInfo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });
    

    builder.addCase(getNotesInfo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getNotesInfo.fulfilled, (state, action) => {
      state.loading = false;
      state.notesData = action.payload?.data;
    });
    builder.addCase(getNotesInfo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });
    

    builder.addCase(getOtherInfo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getOtherInfo.fulfilled, (state, action) => {
      state.loading = false;
      state.othersData = action.payload?.data;
    });
    builder.addCase(getOtherInfo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });
 
  },
});

export default datSlice.reducer;
