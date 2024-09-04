import React from 'react';
import { useAppSelector } from '../../../redux/hooks';
import { Navigate } from 'react-router-dom';
import useAuth, { AuthData } from '../../../hooks/useAuth';

const NotFound = () => {
  const { authData, saveAuthData } = useAuth();

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const change = authData?.isPasswordChangeRequired?.toString() === 'true';
  return (
    <div>
      {isAuthenticated ? (
        <div className="text-center h5">Page Not Found</div>
      ) : (
        !change && <Navigate to="/" />
      )}
    </div>
  );
};

export default NotFound;
