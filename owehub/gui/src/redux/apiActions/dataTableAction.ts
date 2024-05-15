// get_dlr_oth_data
import { createAsyncThunk } from "@reduxjs/toolkit";
import { postCaller } from "../../infrastructure/web_api/services/apiUrl";

interface Ipaginate {
  page_number: number;
  page_size: number;
  filter:any,

  
   
}

 

export const getDataTableName = createAsyncThunk(
    'fetch/get-table-name',
    async (_, { rejectWithValue }) => {
      try {
        const response = await postCaller('get_app_table_list', ""); // Assuming this is a GET request
        const tableName = response.data.db_tables; // Extract the data from the response
        return tableName;
      } catch (error) {
        return rejectWithValue((error as Error).message);
      }
    }
  );


  export const getAnyTableData = createAsyncThunk(
    'fetch/get-any-table-data',
    async (params:any, { rejectWithValue }) => {
      try {
        const response = await postCaller('get_app_data', params); // Assuming this is a GET request
        const tableData = response.data; // Extract the data from the response
        return tableData;
      } catch (error) {
        return rejectWithValue((error as Error).message);
      }
    }
  );