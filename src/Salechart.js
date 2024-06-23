
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Salechart= () => {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState(new Date()); 

  useEffect(() => {
    fetchData(month);
  }, [month]);

  const fetchData = async (selectedMonth) => {
    const monthStr = selectedMonth.toISOString().split('T')[0].slice(0, 7); // Get month in YYYY-MM format
    try {
      const response = await axios.get(`https://backendcafe-ceaj.onrender.com/api/sales?month=${monthStr}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const processData = (data) => {
    const salesData = data.map(({ _id, totalSales }) => ({
      x: _id,
      y: totalSales
    }));

    return salesData;
  };

  const series = [{
    name: 'Sales',
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
      text: `Sales in ${month.toISOString().split('T')[0].slice(0, 7)}`
    }
  };

  const handleMonthChange = (date) => {
    setMonth(date);
  };

  return (
    <div>
      <DatePicker
        selected={month}
        onChange={handleMonthChange}
        dateFormat="yyyy-MM"
        showMonthYearPicker
      />
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default Salechart;

