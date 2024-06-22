import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import backarrowlogo from "./images/backarrowlogo.png";
import { io } from 'socket.io-client';

const socket = io("https://backendcafe-ceaj.onrender.com");

function Owner(props) {
  const [requests, setRequests] = useState([]);
  const audioRef = useRef(new Audio('/alertsound.mp3'));

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
      audioRef.current.currentTime = 0; // Ensure the sound plays from the start
      audioRef.current.play();
    }
  };

  const removeRequest = (index) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setRequests(requests.filter((_, i) => i !== index));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div>
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
      <div style={{ flex: "1" }}>
        <div className='flex items-center'>
          <Link to="/">
            <img src={backarrowlogo} className='h-10 w-10 m-2' alt="Back" />
          </Link>
          <h1 className="font-extrabold text-3xl text-center ml-10">Admin Panel</h1>
        </div>
        <div className="grid grid-cols-2">
          <Link to="/Order">
            <div className='m-3 p-3  h-56 rounded-2xl bg-[#e34c5c]'>
              <h1 className='mt-14 text-center text-4xl font-mono font-extrabold text-white'>Order Details</h1>
            </div>
          </Link>
          <Link to="/Dishmanage">
            <div className='m-3 p-3  h-56 rounded-2xl bg-[#fbc64d]'>
              <h1 className='mt-14 text-center text-4xl font-mono font-extrabold text-white'>Dish Manage</h1>
            </div>
          </Link>
          <Link to="/Waiter">
            <div className='m-3 p-3  h-56 rounded-2xl bg-[#5391e2]'>
              <h1 className='mt-14 text-center text-4xl font-mono font-extrabold text-white'>Cost Price </h1>
            </div>
          </Link>
          <Link to="/Profit">
            <div className='m-3 p-3  h-56 rounded-2xl bg-[rgba(152,198,0,0.83)]'>
              <h1 className='mt-14 text-center text-4xl font-mono font-extrabold text-white'>Profit Data </h1>
            </div>
          </Link>

         
        </div>

        <Link to="/Profit">
            <div className='m-3 p-3  h-56 mt-4 rounded-2xl bg-[#f78e01]'>
              <h1 className='mt-16 text-center text-4xl font-mono font-extrabold text-white'>Profit Data </h1>
            </div>
          </Link>
      
      </div>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>© 2024 Cafehouse Pvt ltd. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Owner;
