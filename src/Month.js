import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backarrowlogo from './images/backarrowlogo.png';
import { Link } from 'react-router-dom';

const Month = () => {
  const [totals, setTotals] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const fetchTotals = async () => {
    try {
      const response = await axios.get(`https://backendcafe-ceaj.onrender.com/api/monthly-totals/${year}/${month}`);
      setTotals(response.data);
    } catch (error) {
      console.error('Error fetching monthly totals:', error);
    }
  };

  useEffect(() => {
    fetchTotals();
  }, [year, month]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <Link to="/Owner" className="mr-4">
          <img src={backarrowlogo} alt="Back" className="h-10 w-10" />
        </Link>
        <h1 className="font-bold text-2xl">Customer Sales</h1>
      </div>
      <div className="flex flex-wrap mb-6">
        <div className="mr-4">
          <label className="block font-medium text-gray-700">
            Year:
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </label>
        </div>
        <div>
          <label className="block font-medium text-gray-700">
            Month:
            <input
              type="number"
              value={month}
              min="1"
              max="12"
              onChange={(e) => setMonth(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </label>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone Number
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Order Value
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {totals.map((total, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{total.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{total.phoneNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{total.totalAmount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Month;
