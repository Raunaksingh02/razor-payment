import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Webuser = () => {
  const [customers, setCustomers] = useState([]);
  const [expandedAddress, setExpandedAddress] = useState({});

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('https://backendcafe-nefw.onrender.com/api/customers');
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers', error);
      }
    };

    fetchCustomers();
  }, []);

  const toggleAddress = (index) => {
    setExpandedAddress((prevState) => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-center mb-4">Customer Details</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Phone No</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Wallet</th>
              <th className="py-2 px-4">Addresses</th>
              <th className="py-2 px-4">OTP Verified</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, customerIndex) => (
              <tr key={customer._id} className="border-b hover:bg-gray-100">
                <td className="py-2 px-4">{customer.name}</td>
                <td className="py-2 px-4">{customer.phoneNo}</td>
                <td className="py-2 px-4">{customer.email}</td>
                <td className="py-2 px-4">{customer.wallet}</td>
                <td className="py-2 px-4">
                  <button
                    className="text-blue-500 underline"
                    onClick={() => toggleAddress(customerIndex)}
                  >
                    {expandedAddress[customerIndex] ? 'Hide Address' : 'Show Address'}
                  </button>
                  {expandedAddress[customerIndex] && (
                    <div className="mt-2">
                      {customer.addresses.map((address, index) => (
                        <div key={index} className="mb-2 p-2 bg-gray-100 rounded-lg">
                          <p>{`${address.houseNo}, ${address.streetNo}, ${address.city}, ${address.state}, ${address.pincode}`}</p>
                          {address.landmark && <p>Landmark: {address.landmark}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </td>
                <td className="py-2 px-4">{customer.otpVerified ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Webuser;
