import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import Chart from 'react-apexcharts';

const Profitpage = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [products, setProducts] = useState([]);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: 'pie',
    },
    labels: [],
    colors: ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33A1', '#33FFF4', '#FF9633', '#8CFF33', '#FF338F', '#33FF8C'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  });
  const [chartSeries, setChartSeries] = useState([]);

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      const month = startDate.getMonth() + 1;
      const year = startDate.getFullYear();
      
      try {
        const response = await axios.get(`https://backendcafe-nefw.onrender.com/top-selling-products`, {
          params: { month, year },
        });
        const data = response.data;
        setProducts(data);

        // Update chart data
        const labels = data.map(product => product._id || 'Unknown');
        const series = data.map(product => product.totalUnits || 0);
        setChartOptions(prevOptions => ({
          ...prevOptions,
          labels: labels,
        }));
        setChartSeries(series);

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
      <div className="overflow-x-auto mb-6">
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
            {products.length > 0 ? (
              products
                .filter(product => product._id) // Filter out products with null or undefined _id
                .map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product._id || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.totalUnits || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-500">
                      {product.totalRevenue?.toFixed(2) || '0.00'}
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Product Distribution</h2>
        <div className="chart-container mx-auto" style={{ maxWidth: '600px' }}>
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="pie"
            width="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default Profitpage;
