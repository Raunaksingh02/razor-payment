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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCartItems, setCurrentCartItems] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    fetch('https://backendcafe-nefw.onrender.com/api/payments')
      .then((response) => response.json())
      .then((data) => {
        // Filter out payments that have a non-empty address and customerTable as 'website'
        const paymentsWithAddress = data.filter(payment => {
          return payment.customerTable === 'Website';
        });
        setPayments(paymentsWithAddress);
        console.log(paymentsWithAddress);
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
      await axios.delete(`https://backendcafe-nefw.onrender.com/${paymentId}`);
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

  const handleViewCart = (cartItems) => {
    setCurrentCartItems(cartItems);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCartItems([]);
  };

  const whatsappInvoice = (payment) => {
    const invoiceLink = `https://cafehouse.vercel.app/billdata/${payment._id}`;
    const message = `Dear ${payment.name}, Here is your bill: ${invoiceLink}`;
    const whatsappLink = `https://api.whatsapp.com/send?phone=91${payment.customerPhoneNo}&text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
  };

  return (
    <div className="my-4">
      <div className='flex items-center mb-4'>
        <Calling />
        <OrderPopup />
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
          className="mb-4 p-2 border rounded"
        />
      )}
      <div className="grid grid-cols-1 gap-4">
        {filteredPayments.map((payment) => (
          <div key={payment._id} className="p-4 border rounded shadow-lg hover:shadow-xl transition duration-200">
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
            <div className="flex justify-around mt-4 ">
              <button
                onClick={() => handleDelete(payment._id)}
                className="bg-red-500 text-white px-4 py-2 mr-1 rounded-xl hover:bg-red-700 transition duration-300"
              >
                Delete
              </button>
              <button
                onClick={() => whatsappInvoice(payment)}
                className="bg-yellow-500 text-white px-4 py-2  rounded-xl hover:bg-yellow-700 transition duration-300"
              >
                Send 
              </button>
              <button
                onClick={() => handleViewCart(payment.cartforpayment)}
                className="bg-green-500 text-white px-4 py-2 mr-1  rounded-xl hover:bg-green-700 transition duration-300"
              >
                 Cart
              </button>
              <button
                onClick={() => handleMove(payment._id)}
                className="bg-blue-500 text-white px-4 py-2 mr-1  rounded-xl hover:bg-blue-700 transition duration-300"
              > 
                Update
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Cart Items */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-2/3 lg:w-1/2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Cart Items</h2>
              <button onClick={handleCloseModal} className="text-red-500 hover:text-red-700">
                Close
              </button>
            </div>
            {currentCartItems.length > 0 ? (
              <div className="space-y-4">
                {currentCartItems.map(item => (
                  <div key={item.id} className='border-2 border-gray-200 rounded-md shadow-md p-3'>
                    <h2 className="text-md font-medium">Item Name: {item.name}</h2>
                    <h3 className="text-sm">Category: {item.category}</h3>
                    <h3 className="text-sm">Quantity: {item.quantity}</h3>
                    <h4 className="text-sm font-semibold">Price: {item.price}</h4>
                    <h4 className="text-sm font-semibold">Size: {item.size}</h4>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-700">No items in the cart.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsiteOrder;
