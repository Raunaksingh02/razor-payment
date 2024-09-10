import React, { useState, useEffect, useMemo, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { format } from 'date-fns';

const RevenueProfitDashboard = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loadingDaily, setLoadingDaily] = useState(false);
  const [loadingMonthly, setLoadingMonthly] = useState(false);
  const [error, setError] = useState(null);

  // Fetch daily revenue and profit data
  const fetchDailyData = useCallback(async () => {
    setLoadingDaily(true);
    setError(null);
    try {
      const month = format(startDate, 'M');
      const year = format(startDate, 'yyyy');
      const response = await axios.get(`https://backendcafe-ceaj.onrender.com/daily-revenue-profit`, {
        params: { month, year },
      });
      setDailyData(response.data);
    } catch (err) {
      console.error('Error fetching daily data:', err);
      setError('Failed to fetch daily data. Please try again later.');
    } finally {
      setLoadingDaily(false);
    }
  }, [startDate]);

  // Fetch monthly revenue and profit data
  const fetchMonthlyData = useCallback(async () => {
    setLoadingMonthly(true);
    setError(null);
    try {
      const year = format(startDate, 'yyyy');
      const response = await axios.get(`https://backendcafe-ceaj.onrender.com/monthly-revenue-profit`, {
        params: { year },
      });
      setMonthlyData(response.data);
    } catch (err) {
      console.error('Error fetching monthly data:', err);
      setError('Failed to fetch monthly data. Please try again later.');
    } finally {
      setLoadingMonthly(false);
    }
  }, [startDate]);

  // Fetch both daily and monthly data when the date is changed
  useEffect(() => {
    fetchDailyData();
    fetchMonthlyData();
  }, [fetchDailyData, fetchMonthlyData]);

  // Render table data dynamically
  const renderTableData = (data) => {
    return data.map((item) => (
      <tr key={item._id}>
        <td className="border px-4 py-2 text-center">
          {/* Convert the day or month to a readable format */}
          {item._id.day ? `Day ${item._id}` : `Month ${item._id}`} 
        </td>
        <td className="border px-4 py-2 text-center">{item.revenue || item.totalRevenue}</td>
        <td className="border px-4 py-2 text-center">{item.cost || item.totalCost}</td>
        <td className="border px-4 py-2 text-center font-bold text-green-500">{item.profit || item.totalProfit}</td>
      </tr>
    ));
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Revenue and Profit Dashboard</h1>

      <div className="mb-6 flex justify-center items-center space-x-4">
        <div>
          <label className="block text-gray-700 mb-2 text-center">Select Month and Year</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          onClick={() => {
            fetchDailyData();
            fetchMonthlyData();
          }}
          className="mt-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-800"
        >
          Fetch Data
        </button>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Daily Revenue and Profit */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-center">Daily Revenue and Profit</h2>
        {loadingDaily ? (
          <p className="text-center text-gray-700">Loading Daily Data...</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="border px-4 py-2">Day</th>
                <th className="border px-4 py-2">Revenue</th>
                <th className="border px-4 py-2">Cost</th>
                <th className="border px-4 py-2">Profit</th>
              </tr>
            </thead>
            <tbody>{renderTableData(dailyData)}</tbody>
          </table>
        )}
      </div>

      {/* Monthly Revenue and Profit */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-center">Monthly Revenue and Profit</h2>
        {loadingMonthly ? (
          <p className="text-center text-gray-700">Loading Monthly Data...</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="border px-4 py-2">Month</th>
                <th className="border px-4 py-2">Revenue</th>
                <th className="border px-4 py-2">Cost</th>
                <th className="border px-4 py-2">Profit</th>
              </tr>
            </thead>
            <tbody>{renderTableData(monthlyData)}</tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RevenueProfitDashboard;
