import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import backarrowlogo from "./images/backarrowlogo.png";
import { io } from 'socket.io-client';

const socket = io("https://backendcafe-ceaj.onrender.com");

function Owner(props) {
  const [requests, setRequests] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    socket.on('Request', (data) => {
      const newRequest = { ...data, time: new Date().toLocaleTimeString() };
      setRequests(prevRequests => [...prevRequests, newRequest]);
      playAlertSound();
    });

    return () => {
      socket.off('Request');
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playAlertSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio('/alertsound.mp3');
    audioRef.current.play();
  };

  const removeRequest = (index) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setRequests(requests.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="bg-gray-100">
        <div className="rounded shadow-md">
          <h1 className="text-center text-2xl font-bold mb-6">Waiter Requests</h1>
          {requests.map((request, index) => (
            <div key={index} className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Incoming Call from {request.table}!</strong>
              <span className="block sm:inline"> {request.query} at {request.time}</span>
              <button
                onClick={() => removeRequest(index)}
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className='flex items-center'>
          <Link to="/">
            <img src={backarrowlogo} className='h-10 w-10 m-2' alt="Back" />
          </Link>
          <h1 className="font-bold text-3xl text-center ml-10">Admin Panel</h1>
        </div>
        <div className="grid grid-cols-1">
          <Link to="/Order">
            <div className='m-3 p-3 border-2 border-black h-56 rounded-xl bg-black'>
              <h1 className='mt-14 text-center text-4xl font-mono font-bold text-white'>Order Details</h1>
            </div>
          </Link>
          <Link to="/Dishmanage">
            <div className='m-3 p-3 border-2 border-black h-56 rounded-xl bg-black'>
              <h1 className='mt-14 text-center text-4xl font-mono font-bold text-white'>Dish Management</h1>
            </div>
          </Link>
          <Link to="/Waiter">
            <div className='m-3 p-3 border-2 border-black h-56 rounded-xl bg-black'>
              <h1 className='mt-14 text-center text-4xl font-mono font-bold text-white'>Waiter Request</h1>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Owner;
