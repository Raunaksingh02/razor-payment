// contexts/UPIDetailsContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create UPI Details Context
export const UPIDetailsContext = createContext();

export const UPIDetailsProvider = ({ children }) => {
  const [upinumber, setUpinumber] = useState('');
  const [upiname, setUpiname] = useState('');

  // Fetch UPI details on component mount
  useEffect(() => {
    const fetchUPIDetails = async () => {
      try {
        const response = await axios.get('https://backendcafe-ceaj.onrender.com/upi-details');
        setUpinumber(response.data.upinumber || '');
        setUpiname(response.data.upiname || '');
      } catch (error) {
        console.error('Error fetching UPI details:', error);
      }
    };

    fetchUPIDetails();
  }, []);

  // Function to update UPI details
  const updateUPIDetails = async (newUPINumber, newUPIName) => {
    try {
      const response = await axios.put('https://backendcafe-ceaj.onrender.com/upi-details', {
        upinumber: newUPINumber,
        upiname: newUPIName,
      });
      setUpinumber(response.data.user.upinumber);
      setUpiname(response.data.user.upiname);
      console.log('UPI details updated successfully');
    } catch (error) {
      console.error('Failed to update UPI details:', error);
    }
  };

  return (
    <UPIDetailsContext.Provider value={{ upinumber, upiname, updateUPIDetails }}>
      {children}
    </UPIDetailsContext.Provider>
  );
};
