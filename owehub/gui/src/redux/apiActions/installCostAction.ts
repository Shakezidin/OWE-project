import { createAsyncThunk } from "@reduxjs/toolkit";
import { postCaller } from "../../infrastructure/web_api/services/apiUrl";
interface Ipaginate {
  page_number: number;
  page_size: number;
}

export interface ICostCreateparam {
  unique_id: string;
  cost: number;
  start_date: string;
  end_date: string;
}

export interface ICost extends ICostCreateparam {
  record_id: string;
}

export const getInstallCost = createAsyncThunk(
  "fetch/installCost",
  async (param: Ipaginate, { rejectWithValue }) => {
    try {
      const data = await postCaller("get_installcost", param);
      return data.data.install_cost_list || ([] as ICost[]);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createInstallCost = createAsyncThunk(
  "create/installCost",
  async (params: ICostCreateparam, { rejectWithValue }) => {
    try {
      const data = await postCaller("create_installCost", params);
      if (data instanceof Error) {
        return rejectWithValue((data as Error).message);
      }
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// update_installcost

export const updateInstallCost = createAsyncThunk(
  "update/installCost",
  async (params: ICost, { rejectWithValue }) => {
    try {
      const data = await postCaller("update_installcost", params);
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
