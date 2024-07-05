import React from 'react';
import { useAppSelector } from '../../../redux/hooks';
import { Navigate } from 'react-router-dom';

const NotFound = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  return (
    <div>
      {isAuthenticated ? (
        <div className="text-center h5">Page Not Found</div>
      ) : (
        <Navigate to="/login" />
      )}
    </div>
  );
};

export default NotFound;
