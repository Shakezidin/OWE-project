import { createAsyncThunk } from "@reduxjs/toolkit";
import { postCaller } from "../../infrastructure/web_api/services/apiUrl";
interface Ipaginate {
  page_number: number;
  page_size: number;
}

export interface ILeader {
  unique_id: string;
  team_name: string;
  leader_name: string;
  type: string;
  term: string;
  qual: string;
  sales_q: number;
  team_kw_q: number;
  pay_rate: string;
  start_date: string;
  end_date: string;
}

export interface ILeaderRow extends ILeader {
  record_id: string;
}

export const getleaderOverride = createAsyncThunk(
  "fetch/leaderOverride",
  async (param: Ipaginate, { rejectWithValue }) => {
    try {
      const data = await postCaller("get_leaderoverride", param);
      return data.data.leader_override_list || ([] as ILeaderRow[]);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createleaderOverride = createAsyncThunk(
  "create/leader-override",
  async (params: ILeader, { rejectWithValue, dispatch }) => {
    try {
      const data = await postCaller("create_leaderoverride", params);
      if (data.status === 500) {
        return rejectWithValue((data as Error).message);
      }
      await dispatch(getleaderOverride({ page_number: 1, page_size: 10 }));
      return data;
    } catch (error) {
      console.error(error, "error blocking create_leaderoverride");
      return rejectWithValue((error as Error).message);
    }
  }
);

// update_leaderOverride

export const updateleaderOverride = createAsyncThunk(
  "update/leaderOverride",
  async (params: ILeaderRow, { rejectWithValue, dispatch }) => {
    try {
      const data = await postCaller("update_leaderoverride", params);
      console.log(data,"rejectttt");
      
      if (data.status === 500 || data instanceof Error) {
        return rejectWithValue((data as Error).message);
      }
      await dispatch(getleaderOverride({ page_number: 1, page_size: 10 }));
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
