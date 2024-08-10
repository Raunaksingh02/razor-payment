import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { format } from 'date-fns';
import { useMemo } from 'react';

const Month = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(false);
  

  const fetchDailyData = async () => {
    setLoading(true);
    try {
      const month = format(startDate, 'M');
      const year = format(startDate, 'yyyy');
      const response = await axios.get(`https://backendcafe-ceaj.onrender.com/daily-revenue-profit`, {
        params: { month, year }
      });
      setDailyData(response.data);
    } catch (error) {
      console.error('Error fetching daily data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyData = async () => {
    setLoading(true);
    try {
      const year = format(startDate, 'yyyy');
      const response = await axios.get(`https://backendcafe-ceaj.onrender.com/monthly-revenue-profit`, {
        params: { year }
      });
      setMonthlyData(response.data);
    } catch (error) {
      console.error('Error fetching monthly data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyData();
    fetchMonthlyData();
  }, [startDate]);

  const renderTableData = useMemo(() => (data) => {
    return data.map((item) => (
      <tr key={item.day || item.month}>
        <td className="border px-4 py-2">{item.day || item.month}</td>
        <td className="border px-4 py-2">{item.revenue || item.totalRevenue}</td>
        <td className="border px-4 py-2">{item.cost || item.totalCost}</td>
        <td className="border px-4 py-2">{item.profit || item.totalProfit}</td>
      </tr>
    ));
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Revenue and Profit Dashboard</h1>
      <div className="mb-6 flex space-x-4">
        <div className="flex justify-center items-center">
          <label className="block text-gray-700 mb-2">Select Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            className="w-full p-2 border rounded"
          />
        </div>
        <div >
          <button
            onClick={() => {
              fetchDailyData();
              fetchMonthlyData();
            }}
            className="mt-1 bg-blue-500 text-white rounded-2xl hover:bg-blue-800"
          >
            Fetch 
          </button>
        </div>
      </div>

      {loading && <p className="text-gray-700">Loading...</p>}

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Daily Revenue and Profit</h2>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="border px-4 py-2">Day</th>
              <th className="border px-4 py-2">Revenue</th>
              <th className="border px-4 py-2">Cost</th>
              <th className="border px-4 py-2">Profit</th>
            </tr>
          </thead>
          <tbody>
            {renderTableData(dailyData)}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Monthly Revenue and Profit</h2>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="border px-4 py-2">Month</th>
              <th className="border px-4 py-2">Revenue</th>
              <th className="border px-4 py-2">Cost</th>
              <th className="border px-4 py-2">Profit</th>
            </tr>
          </thead>
          <tbody>
            {renderTableData(monthlyData)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Month;
