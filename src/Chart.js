import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import backarrowlogo from "./images/backarrowlogo.png"
import { Link } from 'react-router-dom';

const OrdersChart = () => {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState(new Date()); // Default to current month

  useEffect(() => {
    fetchData(month);
  }, [month]);

  const fetchData = async (selectedMonth) => {
    const monthStr = selectedMonth.toISOString().split('T')[0].slice(0, 7); // Get month in YYYY-MM format
    try {
      const response = await axios.get(`http://localhost:1000/api/payments1?month=${monthStr}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const processData = (data) => {
    const ordersPerDay = {};

    data.forEach(payment => {
      const date = new Date(payment.date).toISOString().split('T')[0]; // Get date in YYYY-MM-DD format
      if (!ordersPerDay[date]) {
        ordersPerDay[date] = 0;
      }
      ordersPerDay[date]++;
    });

    const seriesData = Object.entries(ordersPerDay).map(([date, count]) => ({
      x: date,
      y: count,
    }));

    return seriesData;
  };

  const series = [{
    name: 'Orders',
    data: processData(data)
  }];

  const options = {
    chart: {
      type: 'bar'
    },
    xaxis: {
      type: 'datetime'
    },
    title: {
      text: `Orders in ${month.toISOString().split('T')[0].slice(0, 7)}`
    }
  };

  const handleMonthChange = (date) => {
    setMonth(date);
  };

  return (
    
     
       <div>
        <div className='flex m-3'>
        <div className='mr-14'>
         <Link to="/Owner">
         <img src={backarrowlogo} className='h-10 w-10' />
         </Link>
        </div>
        <div className='ml-23'>
        <h1 className='font-bold text-2xl'>Order Analysis</h1>
        </div>
        </div>
        <div className='text-center mb-4 font-bold'>
        <DatePicker
          selected={month}
          onChange={handleMonthChange}
          dateFormat="yyyy-MM"
          showMonthYearPicker
          className="border border-gray-300 rounded-md py-2 px-4"
        />
      </div>
      <div className="w-full">
        <Chart options={options} series={series} type="bar" height={500} />
      </div>
    </div>
  );
};

export default OrdersChart;
