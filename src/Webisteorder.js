import React, { useState, useEffect } from 'react';
import backarrowlogo from './images/backarrowlogo.png';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

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
        console.log(paymentId);
        const response = await axios.delete(`https://backendcafe-ceaj.onrender.com/${paymentId}`);
        console.log('Delete response:', response);
        setPayments(payments.filter(payment => payment._id !== paymentId));
    } catch (error) {
        console.error('There was an error deleting the payment!', error);
        if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
        } else if (error.request) {
            console.error('Error request data:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
    }
};

const move1 = useNavigate();

const handleMove = (_id) => {
    console.log(_id);
    move1(`/update/${_id}`);
};




  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div className="my-4">
        <div className='flex items-center mb-4'>
        <div className='mr-4'>
          <Link to="/">
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
          <div key={payment.id} className="p-4 border rounded shadow-lg">
            <p className="text-lg font-bold">Customer Name: {payment.name}</p>
            <p className="text-lg font-semibold">Customer status: {payment.status}</p>
            <p className="mt-2 text-gray-700"><strong>Address:</strong></p>
            <ul className="ml-4 list-disc text-gray-700">
              <li><strong>House No:</strong> {payment.address.houseNo}</li>
              <li><strong>City:</strong> {payment.address.city}</li>
              <li><strong>Pincode:</strong> {payment.address.pincode}</li>
              <li><strong>Landmark:</strong> {payment.address.landmark}</li>
            </ul>
            <p className="mt-2 text-gray-700"><strong>Date:</strong> {formatDate(payment.date)}</p>
            <p className="mt-2 text-gray-700"><strong>Amount:</strong> ${payment.amount}</p>
            {payment.cartforpayment && payment.cartforpayment.length > 0 ? (
              <div className="mt-2">
                <p className="text-gray-700"><strong>Cart:</strong></p>
                <ul className="ml-4 list-disc text-gray-700">
                  {payment.cartforpayment.map((item, index) => (
                    <li key={index} className="mt-1">
                      <p><strong>Item Name:</strong> {item.name}</p>
                      <p><strong>Quantity:</strong> {item.quantity}</p>
                      <p><strong>Price:</strong> ${item.price}</p>
                    </li>
                  ))}
                </ul>
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
            ) : (
              <p className="mt-2 text-gray-700"><strong>Cart:</strong> No items</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebsiteOrder;
