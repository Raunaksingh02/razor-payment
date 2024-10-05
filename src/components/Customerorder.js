import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BuyerContext } from './Buyercontext';
import backarrowlogo from '../images/backarrowlogo.png';
import {  Link } from 'react-router-dom';


const CustomerOrder = () => {
  const { buyer } = useContext(BuyerContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // State to manage the current page
  const ordersPerPage = 10; // Number of orders per page

  useEffect(() => {
    if (buyer?.email) {
      axios.get('https://backendcafe-zqt8.onrender.com/orders', { params: { email: buyer.email } })
        .then(response => {
          setOrders(response.data);
          console.log(response.data);
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to fetch orders');
          setLoading(false);
        });
    }
  }, [buyer]);

  const handleToggleOrder = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Reverse the order array to show the latest order first
  const reversedOrders = [...orders].reverse();

  // Calculate the orders to display based on the current page
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = reversedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total pages
  const totalPages = Math.ceil(reversedOrders.length / ordersPerPage);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-600">{error}</div>;

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-2xl rounded-2xl shadow-gray-100">
        <div className="flex items-center shadow-lg shadow-gray-300 mb-6">
    <div>
      <Link to="/">
        <img src={backarrowlogo} className="h-10 w-10 m-2" />
      </Link>
    </div>
    <div>
      <h1 className="text-3xl font-bold ml-12">Order Detail</h1>
    </div>
  </div>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found</p>
      ) : (
        <>
          <ul className="space-y-4">
            {currentOrders.map(order => (
              <li key={order._id} className="p-4 rounded-2xl shadow-2xl shadow-[#f6931e]">
                <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => handleToggleOrder(order._id)}>
                  <h3 className="text-lg font-semibold">Order ID: {order.orderId}</h3>
                  <button className="text-blue-500">
                    {expandedOrderId === order._id ? 'Close' : 'See Items'}
                  </button>
                </div>
                <p className="text-gray-700 font-bold mb-1">Date: {new Date(order.date).toLocaleDateString()}</p>
                <p className="text-gray-700 font-bold mb-1">Total Amount: {order.amount}</p>
                <p className="text-gray-700 font-bold mb-1">Payment Mode: {order.paymentmode}</p>
                <p className="text-gray-700 font-bold mb-1">Status: {order.status}</p>
                <p className="text-gray-700 font-bold mb-1">Customer Table: {order.customerTable}</p>
                <p className="text-gray-700 font-bold mb-1">Phone Number: {order.customerPhoneNo}</p>
                <p className="text-gray-700 font-bold mb-1">Address: {`${order.address.houseNo}, ${order.address.city}, ${order.address.pincode}, ${order.address.landmark}`}</p>

                {/* Dropdown for cart items */}
                {expandedOrderId === order._id && (
                  <ul className="mt-2 space-y-2 border-t border-gray-300 pt-2">
                    {order.cartforpayment.map(item => (
                      <li key={item.id} className="flex justify-between bg-gray-50 p-2 rounded-md">
                        <span className="font-semibold">{item.name}</span>
                        <span className="text-gray-600">Qty: {item.quantity}</span>
                        <span className="text-gray-600">Price: {item.price}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 rounded-lg ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerOrder;
