// api.ts

import axios from "axios";
import { HTTP_METHOD } from "../../../core/models/api_models/RequestModel";
import { Credentials } from "../../../core/models/api_models/AuthModel";

const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;
// authService.ts

export interface LoginResponse {
  email_id: string;
  role_name: string;
  access_token: string;
}

export const login = async (credentials: Credentials): Promise<{data: LoginResponse}> => {
  try {
    const response = await axios.post<{ data: LoginResponse }>(`${BASE_URL}/login`, credentials);
 
    return response.data;
  } catch (error) {
    throw new Error('Login failed. Please check your credentials.');
  }
};

export const getCaller = async (endpoint: string) => {
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    method:HTTP_METHOD.GET,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    // body:JSON.stringify(data)
  });
  return response.json();
};

export const postCaller = async (endpoint: string, data: any) => {
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    method:HTTP_METHOD.POST,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const putCaller = async (endpoint: string, data: any) => {
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    method:HTTP_METHOD.PUT,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};
