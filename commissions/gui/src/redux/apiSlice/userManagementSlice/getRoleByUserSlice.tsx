import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { postCaller } from "../../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../../infrastructure/web_api/api_client/EndPoints";


 

interface userRole {
    users:  []
      loading?: boolean;
      error?: string | null;
      
  }
const initialState: userRole = {
    users:  [],
      loading: false,
      error:null,
  };


export const getUsersByRole = createAsyncThunk(
    'userManagement/getUsersByRole',
    async (role:any) => {
        console.log(role, "Check")
      try {
        
        const response = await postCaller(EndPoints.get_user_by_role,{ role});
        console.log(response, "rsponsemanagemnt")
        
        return response.data;
      } catch (error) {
         
        throw error;
      }
    }
  );
// Create a slice of the Redux state
const getuserbyRole = createSlice({
  name: 'GETUSERBYROLE',
  initialState,
  reducers: {
   
  },
  extraReducers: (builder) => {
   
    builder
      .addCase(getUsersByRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsersByRole.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload?.users_name_list
        ;
      })
      .addCase(getUsersByRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "something went wrong";
      });
  },
});

 

export default getuserbyRole.reducer;
