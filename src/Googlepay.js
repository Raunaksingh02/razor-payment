// components/UPIDetails.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backarrowlogo from './images/backarrowlogo.png';
import { Link } from 'react-router-dom';


const Googlepay = () => {
  const [upinumber, setUpinumber] = useState('');
  const [upiname, setUpiname] = useState('');
  const [message, setMessage] = useState('');

  // Fetch UPI details when the component is mounted
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

  // Handle form submission to update UPI details
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('https://backendcafe-ceaj.onrender.com/upi-details', { upinumber, upiname });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Failed to update UPI details');
      console.error('Error updating UPI details:', error);
    }
  };

  return (


    <div>
   <div className="flex items-center shadow-lg shadow-gray-300 mb-6">
    <div>
      <Link to="/owner">
        <img src={backarrowlogo} className="h-10 w-10 m-2" />
      </Link>
    </div>
    <div>
      <h1 className="text-3xl font-bold ml-12">UPI Details</h1>
    </div>
  </div>
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            UPI Number:
          </label>
          <input
            type="text"
            value={upinumber}
            onChange={(e) => setUpinumber(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter UPI Number"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            UPI Name:
          </label>
          <input
            type="text"
            value={upiname}
            onChange={(e) => setUpiname(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter UPI Name"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update UPI Details
        </button>
      </form>
      {message && <p className="mt-4 text-green-500">{message}</p>}
    </div>
    </div>
  );
};

export default Googlepay;













































































































