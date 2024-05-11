import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { toast } from "react-toastify";
import { postCaller } from "../../infrastructure/web_api/services/apiUrl";
import { stat } from "fs";
export interface IPerfomanceSale {
  Type: string;
  sales: number;
  sales_kw: number;
}

export interface IProjectStatus {
  record_id:                 number;
  unqiue_id:                 string;
  contract_date:             Date;
  permit_approved_date:      Date;
  insatll_completed_date:    Date;
  pro_date:                  Date;
  site_survey_complete_date: Date;
  install_ready_date:        Date;
}


export interface ICommision {
  SalesPeriod: number;
  cancellation_period: number;
  installation_period: number;
}
export const getPerfomance = createAsyncThunk(
  "get/perfomance",
  async (
    params: { start_date: string; end_date: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await postCaller("get_perfomancemetrics", params);
      if (data.status > 201) {
        return rejectWithValue((data as Error).message);
      }
      const perfomaceSaleMetrics = (data?.data?.perfomance_sales_metrics ||
        []) as IPerfomanceSale[];
      const perfomaceCommisionMetrics = (data?.data
        ?.perfomance_commission_metrics || {}) as ICommision;
      return { perfomaceSaleMetrics, perfomaceCommisionMetrics };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getPerfomanceStatus = createAsyncThunk(
  "get/perfomancestatus",
  async (params: { filters: [] }, { rejectWithValue }) => {
    try {
      // get_perfomanceprojectstatus
      const data = await postCaller("get_perfomanceprojectstatus", params);
      if (data.status > 201) {
        return rejectWithValue((data as Error).message);
      }
      const list = (data.data.perfomance_response_list || []) as IProjectStatus[];
      return { list, count: data.dbRecCount };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

interface IState {
  perfomaceSale: IPerfomanceSale[];
  error: string;
  isLoading: boolean;
  isSuccess: number;
  commisionMetrics:ICommision ;
  projectStatus:IProjectStatus[]
}

const initialState: IState = {
  perfomaceSale: [],
  error: "",
  isLoading: false,
  isSuccess: 0,
  commisionMetrics:{} as ICommision,
  projectStatus:[]
};

const perfomanceSlice = createSlice({
  name: "perfomanceSlice",
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.isSuccess = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPerfomance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPerfomance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.perfomaceSale = action.payload.perfomaceSaleMetrics;
        state.commisionMetrics = action.payload.perfomaceCommisionMetrics
      })
      .addCase(getPerfomance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      .addCase(getPerfomanceStatus.pending, (state, action) => {
        state.isLoading = false;
      })
      .addCase(getPerfomanceStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projectStatus = action.payload.list;
        
      })
      .addCase(getPerfomanceStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export const { resetSuccess } = perfomanceSlice.actions;
export default perfomanceSlice.reducer;
