import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { BuyerContext } from './Buyercontext.js';

export const UserProtectedRoute = ({ children }) => {
    const { buyer } = useContext(BuyerContext);
    const location = useLocation();

    // Check if the user is authenticated
    const isBuyerAuthenticated = localStorage.getItem('buyerauth') === 'true';
    const table = new URLSearchParams(location.search).get('table');

    if (isBuyerAuthenticated && !table) {
        // Navigate to the bill screen if the user is authenticated and table is undefined
        return <Navigate to="/bill" />;
    }

    // If buyer is not authenticated, redirect to the login page
 

    return children;
};
