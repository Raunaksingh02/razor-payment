import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Chart from 'react-apexcharts';
import backarrowlogo from "./images/backarrowlogo.png";
import { Link } from 'react-router-dom';
import './App.css';

export default function Profitpage() {
  const [dailyProfit, setDailyProfit] = useState(null);
  const [monthlyProfit, setMonthlyProfit] = useState(null);
  const [monthlyProfitData, setMonthlyProfitData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const fetchDailyProfit = async (date) => {
    try {
      const response = await axios.get('https://backendcafe-ceaj.onrender.com/profit/daily', {
        params: { date: date.toISOString() }
      });
      console.log('Daily Profit Response:', response.data);
      setDailyProfit(response.data.dailyProfit);
    } catch (error) {
      console.error('Error fetching daily profit:', error);
    }
  };

  const fetchMonthlyProfit = async (date) => {
    try {
      const response = await axios.get('https://backendcafe-ceaj.onrender.com/profit/monthly', {
        params: { date: date.toISOString() }
      });
      console.log('Monthly Profit Response:', response.data);
      setMonthlyProfit(response.data.monthlyProfit);
      setMonthlyProfitData(response.data.dailyProfits || []); // Use an empty array if dailyProfits is undefined
    } catch (error) {
      console.error('Error fetching monthly profit:', error);
    }
  };

  useEffect(() => {
    fetchDailyProfit(selectedDate);
    fetchMonthlyProfit(selectedMonth);
  }, [selectedDate, selectedMonth]);


  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="flex items-center bg-gray-400 text-white p-4">
        <Link to="/Owner">
          <img
            src={backarrowlogo}
            className='h-10 w-10'
          />
        </Link>
        <h1 className="text-2xl font-bold ml-10">Profit Analysis</h1>
      </header>
      <main className="flex-grow p-4">
        <div className="bg-white shadow-md rounded-lg p-6 mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">Select Date for Daily Profit</h2>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy/MM/dd"
            className="block w-full mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
          <p className="text-lg text-gray-600 mt-4 font-bold">Daily Profit: {dailyProfit !== null ? dailyProfit.toFixed(2) : 'Loading...'}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">Select Month for Monthly Profit</h2>
          <DatePicker
            selected={selectedMonth}
            onChange={(date) => setSelectedMonth(date)}
            dateFormat="yyyy/MM"
            showMonthYearPicker
            className="block w-full mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
          <p className="text-lg text-gray-600 mt-4 font-bold">Monthly Profit: {monthlyProfit !== null ? monthlyProfit.toFixed(2) : 'Loading...'}</p>
        </div>
       
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>© 2024 Cafehouse Pvt ltd. All rights reserved.</p>
      </footer>
    </div>
  );
}
