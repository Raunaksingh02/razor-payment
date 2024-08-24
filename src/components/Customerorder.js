import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BuyerContext } from './Buyercontext';

const CustomerOrder = () => {
  const { buyer } = useContext(BuyerContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    if (buyer?.email) {
      axios.get('https://backendcafe-ceaj.onrender.com/orders', { params: { email: buyer.email } })
        .then(response => {
          setOrders(response.data);
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

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-600">{error}</div>;

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-2xl rounded-2xl shadow-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Orders</h2>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found</p>
      ) : (
        <ul className="space-y-4">
          {orders.map(order => (
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
                      <span>{item.name} (x{item.quantity})</span>
                      <span>{item.price}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomerOrder;
