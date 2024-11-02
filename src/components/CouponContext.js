import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const CouponContext = createContext();

export const CouponProvider = ({ children }) => {
  const [coupons, setCoupons] = useState([]); // Initial state as an empty array
  const [isModalOpen, setModalOpen] = useState(false);

  // Fetch coupons from API or backend
  useEffect(() => {
    // Example: Fetch coupons from backend (replace with your API endpoint)
    fetch('http://localhost:1000/coupons')
      .then((response) => response.json())
      .then((data) => {
        setCoupons(data.coupons);
        console.log(data.coupons);
      })
      .catch((error) => console.error('Error fetching coupons:', error));
  }, []); // Ensure this useEffect only runs once on mount

  // Other functions...

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  return (
    <CouponContext.Provider
      value={{
        coupons,
       
        isModalOpen,
        toggleModal,
      }}
    >
      {children}
    </CouponContext.Provider>
  );
};
