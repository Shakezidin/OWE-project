import React from 'react';
import { Navigate } from 'react-router-dom';
import Auth from './Auth';

const ProtectedRoute = ({ component: Component, ...rest }) => {

    return (Auth.authenticate()) ? <Component /> : <Navigate to="/" />
};

export default ProtectedRoute