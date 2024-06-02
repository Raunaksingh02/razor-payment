import React, { createContext, useState } from 'react';

const CustomerContext = createContext();

const CustomerProvider = ({ children }) => {
    
    
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerTable, setCustomerTable] = useState('');
  

  return (
    <CustomerContext.Provider value={{ customerName, setCustomerName ,customerPhone, customerTable,setCustomerPhone,setCustomerTable}}>
      {children}
    </CustomerContext.Provider>
  );
};

export  {CustomerContext,CustomerProvider};
