// src/components/OrderPopup.js

import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("https://backendcafe-ceaj.onrender.com");

const OrderPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const audio = new Audio("/alertsound.mp3");

    socket.on("newOrder", (data) => {
      setOrderDetails(data);
      setShowPopup(true);
      audio.play();
      console.log(data);
    });

    return () => {
      socket.off("newOrder");
    };
  }, []);

  if (!showPopup) return null;

  const isWebsiteOrder = orderDetails?.address.houseNo;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">New Order Received</h2>
        {orderDetails && (
          <div className="mb-4">
            <p>Name: {orderDetails.name}</p>
            <p>Amount: {orderDetails.amount}</p>
            {isWebsiteOrder ? (
              <>
                 <p>From:Webiste</p>
                <p>Payment Mode: {orderDetails.paymentmode}</p>
              </>
            ) : (
              <>
                <p>From:Restaurant</p>
                <p>Location: {orderDetails.customerTable}</p>
                <p>Payment Mode: {orderDetails.paymentmode}</p>
              </>
            )}
          </div>
        )}
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
