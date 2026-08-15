import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const usuario = localStorage.getItem('usuario');

    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;