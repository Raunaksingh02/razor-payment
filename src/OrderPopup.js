// src/components/OrderPopup.js

import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("https://backendcafe-ceaj.onrender.com");

const OrderPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    socket.on("newOrder", (data) => {
      setOrder(data);
      setShowPopup(true);
    });

    return () => { 
       socket.off("newOrder");
    };
  }, []);

  if (!showPopup || !order) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">New Order Received</h2>
        <p><strong>Order ID:</strong> {order.orderId}</p>
        <p><strong>Name:</strong> {order.name}</p>
        <p><strong>Amount:</strong> ${order.amount}</p>
        <p><strong>Customer Table:</strong> {order.customerTable}</p>
        <p><strong>Payment Mode:</strong> {order.paymentmode}</p>
        <p><strong>Phone Number:</strong> {order.customerPhoneNo}</p>
        <p><strong>Address:</strong> {`${order.address.houseNo}, ${order.address.city}, ${order.address.pincode}, ${order.address.landmark}`}</p>
        <button
          onClick={() => setShowPopup(false)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OrderPopup;
