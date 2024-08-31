import { useState, useEffect } from 'react';

// Define the structure of the login response
interface AdminTheme {
  BGColor: string;
  dealerLogo: string;
}

export interface AuthData {
  role: string;
  userName: string;
  email: string | null;
  type: string;
  token: string;
  password: string;
  dealer: string;
  expirationTimeInMin: string;
  expirationTime: string;
  isRememberMe: string;
  isPasswordChangeRequired: string;
  adminTheme?: AdminTheme;
}

// Type for the custom hook's return value
type UseAuthReturnType = {
  authData: AuthData | null;
  saveAuthData: (data: AuthData) => void;
  clearAuthData: () => void;
  appendAuthData: (key: keyof AuthData, value: any) => void;
};

const useAuth = (): UseAuthReturnType => {
  const [authData, setAuthData] = useState<AuthData | null>(null);

  useEffect(() => {
    const savedAuthData = localStorage.getItem('authData');
    if (savedAuthData) {
      setAuthData(JSON.parse(savedAuthData));
    }
  }, []);

  const saveAuthData = (data: AuthData) => {
    setAuthData(data);
    localStorage.setItem('authData', JSON.stringify(data));
  };

  const appendAuthData = (key: keyof AuthData, value: any) => {
    if (authData) {
      const updatedAuthData = { ...authData, [key]: value };
      setAuthData(updatedAuthData);
      localStorage.setItem('authData', JSON.stringify(updatedAuthData));
    }
  };

  const clearAuthData = () => {
    setAuthData(null);
    localStorage.removeItem('authData');
  };

  return {
    authData,
    saveAuthData,
    clearAuthData,
    appendAuthData,
  };
};

export default useAuth;
