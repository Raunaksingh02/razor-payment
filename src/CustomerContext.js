import React, { createContext, useState } from 'react';

const CustomerContext = createContext();

const CustomerProvider = ({ children }) => {
        
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerTable, setCustomerTable] = useState('');
  const [paymentmode1,setpaymentmode1]= useState("Cash-Not Received");
  const [paymentmode2,setpaymentmode2]= useState("UPI-Transferred");
  const [customeraddress,setcustomeraddress]= useState([]);

  return (
    <CustomerContext.Provider value={{ customerName, setCustomerName,customeraddress,setcustomeraddress ,customerPhone,paymentmode2,setpaymentmode2, customerTable,paymentmode1,setpaymentmode1,setCustomerPhone,setCustomerTable}}>
      {children}
    </CustomerContext.Provider>
  );
};

export  {CustomerContext,CustomerProvider};
