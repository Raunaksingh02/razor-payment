// src/components/OrderPopup.js

import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("https://backendcafe-ceaj.onrender.com");

const OrderPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    socket.on("newOrder", () => {
      setShowPopup(true);

      // Hide the popup after a few seconds
      setTimeout(() => {
        setShowPopup(false);
      }, 5000); // Change this duration as needed
    });

    return () => {
      socket.off("newOrder");
    };
  }, []);

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">New Order Received</h2>
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
