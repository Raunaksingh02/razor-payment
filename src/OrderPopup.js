import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("https://backendcafe-ceaj.onrender.com");

const OrderPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const audioRef = useRef(new Audio('/alertsound.mp3'));

  useEffect(() => {
    const audioElement = audioRef.current;

    // Load the audio element
    const loadAudio = () => {
      return new Promise((resolve) => {
        audioElement.addEventListener('canplaythrough', resolve, { once: true });
        audioElement.load();
      });
    };

    loadAudio().then(() => {
      socket.on("newOrder", (data) => {
        setOrderDetails(data);
        setShowPopup(true);
        playAlertSound();
        console.log(data);
      });
    });

    return () => {
      socket.off("newOrder");
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Reset the audio
        audioRef.current = null;
      }
    };
  }, []);

  const playAlertSound = () => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.currentTime = 0; // Ensure the sound plays from the start
      audioElement.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0; // Reset the audio
    }
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">New Order Received</h2>
        {orderDetails && (
          <div className="mb-4">
            <p>Name: {orderDetails.name}</p>
            <p>Amount: {orderDetails.amount}</p>
            <p>Location: {orderDetails.customerTable}</p>
            <p>Payment Mode: {orderDetails.paymentmode}</p>
            <p>PhoneNo: {orderDetails.customerPhoneNo}</p>
          </div>
        )}
        <button
          onClick={handleClosePopup}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OrderPopup;
