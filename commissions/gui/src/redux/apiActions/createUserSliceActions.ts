import { createAsyncThunk } from "@reduxjs/toolkit";
import { postCaller } from "../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../infrastructure/web_api/api_client/EndPoints";
import { HTTP_STATUS } from "../../core/models/api_models/RequestModel";
import {
  CreateUserParamModel,
  DealerOwner,
  UserDropdownModel,
} from "../../core/models/api_models/UserManagementModel";
import { isAxiosError } from "axios";

/** get dealer */
export const fetchDealerOwner = createAsyncThunk(
  "user/get_dealer_owner",
  async (data: DealerOwner) => {
    const response = await postCaller(
      EndPoints.get_user_by_role,
      JSON.stringify(data)
    );
    if (response.status !== HTTP_STATUS.OK) {
      throw new Error(response.message);
    }

    const { users_name_list } = response.data;
    const mapList: UserDropdownModel[] = users_name_list.map(
      (el: { name: string }) => {
        return {
          label: el.name,
          value: el.name,
        };
      }
    );
    return mapList;
  }
);

/** get region list */
export const fetchRegionList = createAsyncThunk(
  "user/get_region",
  async (data: DealerOwner) => {
    const response = await postCaller(
      EndPoints.get_user_by_role,
      JSON.stringify(data)
    );
    if (response.status !== HTTP_STATUS.OK) {
      throw new Error(response.message);
    }

    const { users_name_list } = response.data;
    const mapList: UserDropdownModel[] = users_name_list.map(
      (el: { name: string }) => {
        return {
          label: el.name,
          value: el.name,
        };
      }
    );
    return mapList;
  }
);
/**cretae user */
// export const createUserOnboarding = createAsyncThunk(
//   "user/create_onboarding_user",
//   async (data: CreateUserParamModel) => {
//     const response = await postCaller(EndPoints.create_user, data);
//     // if (response.status !== HTTP_STATUS.OK) {
//     //   throw new Error(response.message);
//     // }
//     console.log(response);
//     return response;
//   }
// );

export const createUserOnboarding = createAsyncThunk(
  "user/create_onboarding_users",
  async (data: CreateUserParamModel, { rejectWithValue }): Promise<any> => {
    try {
      const response = await postCaller(EndPoints.create_user, data);
      console.log(response);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
