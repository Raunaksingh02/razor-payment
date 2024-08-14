import React, { useState, useEffect } from 'react';
import backarrowlogo from './images/backarrowlogo.png';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Calling from "./Calling.js";
import OrderPopup from "./OrderPopup.js";

const WebsiteOrder = () => {
  const [selectedTab, setSelectedTab] = useState('today');
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetch('https://backendcafe-ceaj.onrender.com/api/payments')
      .then((response) => response.json())
      .then((data) => {
        // Filter out payments that have a non-empty address
        console.log(data);
        const paymentsWithAddress = data.filter(payment => {
          const address = payment.address;
          return address && Object.keys(address).some(key => address[key]);
        });
        setPayments(paymentsWithAddress);
      });
  }, []);

  useEffect(() => {
    setFilteredPayments(filterPayments());
  }, [selectedTab, payments, selectedDate]);

  const filterPayments = () => {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    if (selectedTab === 'today') {
      return payments.filter(payment => new Date(payment.date).toISOString().split('T')[0] === today);
    } else if (selectedTab === 'week') {
      return payments.filter(payment => new Date(payment.date) >= weekAgo);
    } else if (selectedTab === 'date' && selectedDate) {
      return payments.filter(payment => new Date(payment.date).toISOString().split('T')[0] === selectedDate);
    } else {
      return payments;
    }
  };

  const handleDelete = async (paymentId) => {
    try {
      const response = await axios.delete(`https://backendcafe-ceaj.onrender.com/${paymentId}`);
      setPayments(payments.filter(payment => payment._id !== paymentId));
    } catch (error) {
      console.error('There was an error deleting the payment!', error);
    }
  };

  const move1 = useNavigate();

  const handleMove = (_id) => {
    move1(`/update/${_id}`);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const getStatusColor = (status, condition) => {
    return status === condition ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="my-4">
      <div className='flex items-center mb-4'>
        <Calling />
        <OrderPopup/>
        <div className='mr-4'>
          <Link to="/owner">
            <img src={backarrowlogo} className='h-10 w-10' alt="Back" />
          </Link>
        </div>
        <div className='flex-1 text-center'>
          <h1 className='font-bold text-2xl'>Website Order</h1>
        </div>
      </div>
      <div className="flex justify-around mb-4">
        <button className={`p-2 ${selectedTab === 'today' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => handleTabClick('today')}>
          Today
        </button>
        <button className={`p-2 ${selectedTab === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => handleTabClick('week')}>
          This Week
        </button>
        <button className={`p-2 ${selectedTab === 'date' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => handleTabClick('date')}>
          Select Date
        </button>
      </div>
      {selectedTab === 'date' && (
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="mb-4 p-2 border"
        />
      )}
      <div className="grid grid-cols-1 gap-4">
        {filteredPayments.map((payment) => (
          <div key={payment._id} className="p-4 border rounded shadow-lg">
            <p className="text-lg font-bold">Customer Name: {payment.name}</p>
            <p className="text-lg font-bold">Contact No: {payment.customerPhoneNo}</p>
           
            <p className={`text-lg font-semibold ${getStatusColor(payment.status, 'delivered')}`}>Customer Status: {payment.status}</p>
            <p className={`text-lg font-semibold ${getStatusColor(payment.paymentmode, 'Received')}`}>Payment Status: {payment.paymentmode}</p>
            <p className="mt-2 text-gray-700"><strong>Address:</strong></p>
            <ul className="ml-4 list-disc text-gray-700">
              <li><strong>House No:</strong> {payment.address.houseNo}</li>
              <li><strong>City:</strong> {payment.address.city}</li>
              <li><strong>Pincode:</strong> {payment.address.pincode}</li>
              <li><strong>Landmark:</strong> {payment.address.landmark}</li>
            </ul>
            <p className="mt-2 text-gray-700"><strong>Date:</strong> {formatDate(payment.date)}</p>
            <p className="mt-2 text-gray-700"><strong>Amount:</strong> {payment.amount}</p>
            {payment.cartforpayment && payment.cartforpayment.length > 0 ? (
               <div className="mt-4">
               {payment.cartforpayment.map(item => (
                   <div key={item.id} className='border-2 border-gray-200 rounded-md shadow-md m-3 p-3'>
                       <h2 className="text-md font-medium">Item Name: {item.name}</h2>
                       <h3 className="text-sm">Category: {item.category}</h3>
                       <h3 className="text-sm">Quantity: {item.quantity}</h3>
                       <h4 className="text-sm font-semibold">Price: {item.price}</h4>
                       <h4 className="text-sm font-semibold">Size: {item.size}</h4>
                   </div>
               ))}
           </div>
            ) : (
              <p className="mt-2 text-gray-700"><strong>Cart:</strong> No items</p>
            )}
            <div className="flex justify-around mt-4">
              <button
                onClick={() => handleDelete(payment._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
              >
                Delete
              </button>
              <button
                onClick={() => handleMove(payment._id)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
              >
                Update
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebsiteOrder;
