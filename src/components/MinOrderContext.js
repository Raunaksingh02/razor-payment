import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const MinOrderContext = createContext();

export const MinOrderProvider = ({ children }) => {
  const [minOrderValue, setMinOrderValue] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);

  useEffect(() => {
    const fetchMinOrderDetails = async () => {
      try {
        const response = await axios.get('http://localhost:1000/min-order-delivery');
        setMinOrderValue(response.data.minOrderValue);
        setDeliveryCharge(response.data.deliveryCharge);
      } catch (error) {
        console.error('Error fetching minimum order details', error);
      }
    };

    fetchMinOrderDetails();
  }, []);

  return (
    <MinOrderContext.Provider value={{ minOrderValue, deliveryCharge }}>
      {children}
    </MinOrderContext.Provider>
  );
};
