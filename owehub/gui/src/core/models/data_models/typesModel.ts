// types.ts

export interface ConfigureData {
  id: number;
  name: string;
  email: string;
  // Add more fields as per your API response
}

export interface ApiState {
  data: ConfigureData | null;
  loading: boolean;
  error: string | null;
}
