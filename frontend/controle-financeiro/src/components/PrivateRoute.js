import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const usuario = sessionStorage.getItem('usuario');

    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;