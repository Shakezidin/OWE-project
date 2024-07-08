import React from 'react';
import { useAppSelector } from '../../../redux/hooks';
import { Navigate } from 'react-router-dom';

const NotFound = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
 const change =  localStorage.getItem('is_password_change_required') === 'true'
  return (
    <div>
      {isAuthenticated ? (
        <div className="text-center h5">Page Not Found</div>
      ) : !change && (
        <Navigate to="/" />
      )}
    </div>
  );
};

export default NotFound;
