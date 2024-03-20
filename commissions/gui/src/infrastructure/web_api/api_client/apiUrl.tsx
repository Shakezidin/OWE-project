// api.ts
import axios, { AxiosResponse } from 'axios';

// Define a base URL for your API
const BASE_URL = 'https://jsonplaceholder.typicode.com';

// Define types for different HTTP methods
type Method = 'get' | 'post' | 'put' | 'delete';

// Define a generic function to make API calls
async function apiCaller<T>(
  method: Method,
  path: string,
  data?: any
): Promise<AxiosResponse<T>> {
  const url = `${BASE_URL}${path}`;
  try {
    switch (method) {
      case 'get':
        return await axios.get<T>(url);
      case 'post':
        return await axios.post<T>(url, data);
      case 'put':
        return await axios.put<T>(url, data);
      case 'delete':
        return await axios.delete<T>(url);
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  } catch (error:any) {
    throw new Error(`Error making ${method.toUpperCase()} request to ${url}: ${error.message}`);
  }
}

export default apiCaller;
