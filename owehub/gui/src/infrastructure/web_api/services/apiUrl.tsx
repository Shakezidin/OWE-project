// api.ts
import axios, { AxiosRequestConfig, AxiosResponse, isAxiosError } from 'axios';
import {
  HTTP_METHOD,
  HTTP_STATUS,
} from '../../../core/models/api_models/RequestModel';
import { Credentials } from '../../../core/models/api_models/AuthModel';
import { EndPoints } from '../api_client/EndPoints';
import { toast } from 'react-toastify';
import api from './axiosInterceptor';

const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;
const LEADS_BASE_URL = `${process.env.REACT_APP_LEADS_URL}`;
const REPORT_BASE_URL = `${process.env.REACT_APP_REPORT_URL}`;
const CONFIG_URL = `https://staging.owe-hub.com/api/owe-calc-service/v1`;
const test_url = `http://155.138.239.170:31024/owe-reports-service/v1/`;
const TAPE_URL = `http://66.42.90.20:80/api`;

// authService.ts
export interface LoginResponse {
  email_id: string;
  role_name: string;
  user_name: string;
  access_token: string;
  status: number;
  message: string;
}

// Logout utility function
const logoutUser = () => {
  localStorage.removeItem('token'); // Clear the token
  localStorage.removeItem('userName');
  localStorage.removeItem('role');
  window.location.href = '/login'; // Redirect to the login page
};

export const login = async (
  credentials: Credentials
): Promise<{ data: LoginResponse }> => {
  try {
    const response = await axios.post<{ data: LoginResponse }>(
      `${BASE_URL}${EndPoints.login}`,
      credentials
    );
    if (response.status === HTTP_STATUS.OK) {
      console.log('Login Successfully');
    }
    return response.data;
  } catch (error) {
    throw new Error('Login failed. Please check your credentials.');
  }
};
export const postCaller = async (
  endpoint: string,
  postData: any,
  hasChangedBaseUrl: boolean = false
): Promise<any> => {
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `${localStorage.getItem('token')}`,
      // 'Content-Type': 'application/json',
    },
  };
  try {
    const response: AxiosResponse = await api.post(
      `${hasChangedBaseUrl ? LEADS_BASE_URL : BASE_URL}/${endpoint}`,
      postData,
      config
    );
    return response.data; // Return the data from the response
  } catch (error) {
    console.log('axios error', error);

    if (isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401) {
          setTimeout(() => {
            logoutUser();
          }, 2000);
          return;
        }

        return error.response.data;
      }

      // handle network error
      if (error.message) return new Error(JSON.stringify(error.message));
      console.log(error);
    }

    throw new Error('Failed to fetch data');
  }
};
export const configPostCaller = async (
  endpoint: string,
  postData: any,
  hasChangedBaseUrl: boolean = false
): Promise<any> => {
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `${localStorage.getItem('token')}`,
      // 'Content-Type': 'application/json',
    },
  };
  try {
    const response: AxiosResponse = await axios.post(
      `${CONFIG_URL}/${endpoint}`,
      postData,
      config
    );
    return response.data; // Return the data from the response
  } catch (error) {
    console.log('axios error', error);

    if (isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401) {
          setTimeout(() => {
            logoutUser();
          }, 2000);
          return;
        }
        return error.response.data;
      }

      // handle network error
      if (error.message === 'Network Error')
        return new Error('No internet connection');
    }
    throw new Error('Failed to fetch data');
  }
};
export const reportingCaller = async (
  endpoint: string,
  postData: any,
  hasChangedBaseUrl: boolean = false
): Promise<any> => {
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `${localStorage.getItem('token')}`,
      // 'Content-Type': 'application/json',
    },
  };
  try {
    // Fix the URL construction by ensuring no double slashes
    const baseUrl = hasChangedBaseUrl ? test_url : REPORT_BASE_URL;
    const cleanEndpoint = endpoint.startsWith('/')
      ? endpoint.substring(1)
      : endpoint;

    const response: AxiosResponse = await api.post(
      `${baseUrl}${baseUrl.endsWith('/') ? '' : '/'}${cleanEndpoint}`,
      postData,
      config
    );
    return response.data; // Return the data from the response
  } catch (error) {
    console.log('axios error', error);

    if (isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401) {
          setTimeout(() => {
            logoutUser();
          }, 2000);
          return { error: 'Authentication failed' }; // Add a return value
        }
        return error.response.data;
      }
      // handle network error
      if (error.message === 'Network Error')
        return new Error('No internet connection');
    }
    throw new Error('Failed to fetch data');
  }
};

export const tapeCaller = async (
  endpoint: string,
  postData: any,
  hasChangedBaseUrl: boolean = false
): Promise<any> => {
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `${localStorage.getItem('token')}`,
      // 'Content-Type': 'application/json',
    },
  };
  try {
    const response: AxiosResponse = await axios.post(
      `${TAPE_URL}/${endpoint}`,
      postData,
      config
    );
    return response.data; // Return the data from the response
  } catch (error) {
    console.log('axios error', error);

    if (isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401) {
          setTimeout(() => {
            logoutUser();
          }, 2000);
          return;
        }

        return error.response.data;
      }

      // handle network error
      if (error.message) return new Error(JSON.stringify(error.message));
      console.log(error);
    }

    throw new Error('Failed to fetch data');
  }
};
