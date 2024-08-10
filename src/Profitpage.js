// src/components/TopSellingProducts.jsx
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const Profitpage = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      const month = startDate.getMonth() + 1;
      const year = startDate.getFullYear();
      
      try {
        const response = await axios.get(`https://backendcafe-ceaj.onrender.com/top-selling-products`, {
          params: { month, year },
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching top-selling products:', error);
      }
    };

    fetchTopSellingProducts();
  }, [startDate]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Top Selling Products</h1>
      <div className="mb-6">
        <label htmlFor="date-picker" className="block text-sm font-medium text-gray-700 mb-2">
          Select Month and Year:
        </label>
        <DatePicker
          id="date-picker"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Units Sold
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Revenue
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products
              .filter(product => product._id) // Filter out products with null or undefined _id
              .map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.totalUnits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.totalRevenue.toFixed(2)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Profitpage;
