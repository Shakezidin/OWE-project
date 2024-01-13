import React from 'react';
import { Navigate } from 'react-router-dom';
import Auth from './Auth';

const PublicRoute = ({ component: Component, ...rest }) => {
 
    return (Auth.authenticate()) ? <Navigate to="/dashboard" />:<Component /> 
};

export default PublicRoute;