import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BuyerContext } from './Buyercontext'; // Adjust the import path as needed

function Customerprofile() {
  const { buyer } = useContext(BuyerContext);
  const [buyerDetails, setBuyerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedPhone, setUpdatedPhone] = useState('');
  const buyerEmail = buyer?.email || undefined;
    console.log( buyerEmail);

  useEffect(() => {
    
    const fetchBuyerDetails = async () => {
      try {
        const response = await axios.get(`https://backendcafe-ceaj.onrender.com/buyerdata?email=${buyerEmail}`);
        setBuyerDetails(response.data);
        setUpdatedName(response.data.name);
        setUpdatedPhone(response.data.phoneNo);
      } catch (error) {
        setError('Error fetching buyer details.');
        console.error('Error fetching buyer details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuyerDetails();
  }, [buyerEmail]);

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:1000/updatebuyer`, {
        email: buyerEmail, // Email remains unchanged
        name: updatedName,
        phoneNo: updatedPhone,
      });
      setBuyerDetails(response.data);
      setEditMode(false);
    } catch (error) {
      setError('Error updating buyer details.');
      console.error('Error updating buyer details:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!buyerDetails) return <p>No details found.</p>;

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Customer Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        {editMode ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={updatedPhone}
                onChange={(e) => setUpdatedPhone(e.target.value)}
              />
            </div>
            <div className="flex justify-between items-center">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="mb-2"><strong>Name:</strong> {buyerDetails.name}</p>
            <p className="mb-2"><strong>Email:</strong> {buyerDetails.email}</p>
            <p className="mb-2"><strong>Phone:</strong> {buyerDetails.phoneNo}</p>
            <button
              onClick={() => setEditMode(true)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full"
            >
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Customerprofile;
