import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Deliverydetail = () => {
  const [minOrderValue, setMinOrderValue] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('https://backendcafe-ceaj.onrender.com/min-order-delivery');
        setMinOrderValue(response.data.minOrderValue);
        setDeliveryCharge(response.data.deliveryCharge);
      } catch (error) {
        console.error('Error fetching settings', error);
      }
    };

    fetchSettings();
  }, []);

  const handleUpdate = async () => {
    try {
      await axios.put('https://backendcafe-ceaj.onrender.com/min-order-delivery', {
        minOrderValue,
        deliveryCharge,
      });
      alert('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings', error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-center mb-4">Order Settings</h2>
      <div className="max-w-md mx-auto bg-white p-4 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700">Minimum Order Value</label>
          <input
            type="number"
            value={minOrderValue}
            onChange={(e) => setMinOrderValue(e.target.value)}
            className="w-full mt-2 p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Delivery Charge</label>
          <input
            type="number"
            value={deliveryCharge}
            onChange={(e) => setDeliveryCharge(e.target.value)}
            className="w-full mt-2 p-2 border rounded"
          />
        </div>
        <button
          onClick={handleUpdate}
          className="w-full bg-blue-500 text-white p-2 rounded mt-4"
        >
          Update Settings
        </button>
      </div>
    </div>
  );
};

export default Deliverydetail;



































