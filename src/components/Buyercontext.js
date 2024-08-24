import React, { createContext, useState, useEffect } from 'react';

// Create context
export const BuyerContext = createContext();

// Create a provider component
export const BuyerProvider = ({ children }) => {
  const [buyer, setBuyer] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load buyer data and auth status from local storage when the component mounts
  useEffect(() => {
    const storedBuyer = localStorage.getItem('buyer');
    const authStatus = localStorage.getItem('buyerauth');
    if (storedBuyer && authStatus === 'true') {
      const buyerData = JSON.parse(storedBuyer);
      setBuyer(buyerData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (customerData) => {
    const { password, ...buyerData } = customerData; // Exclude the password
    setBuyer(buyerData);
    setIsAuthenticated(true);
    localStorage.setItem('buyer', JSON.stringify(buyerData));
    localStorage.setItem('buyerauth', 'true'); // Set auth status to true
  };

  const logout = () => {
    setBuyer(null);
    setIsAuthenticated(false);
    localStorage.removeItem('buyer');
    localStorage.setItem('buyerauth', 'false'); // Set auth status to false
  };

  return (
    <BuyerContext.Provider value={{ buyer, isAuthenticated, login, logout }}>
      {children}
    </BuyerContext.Provider>
  );
};
