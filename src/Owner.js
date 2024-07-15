import React, { useEffect, useState, useRef }  from  'react';
import { Link } from 'react-router-dom';
import { MdOutlinePayments } from "react-icons/md";
import backarrowlogo from "./images/backarrowlogo.png";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { TbReport } from "react-icons/tb";
import { IoFastFoodOutline } from "react-icons/io5";
import { GiCook } from "react-icons/gi";
import { TbTruckDelivery } from "react-icons/tb";
import { FaChartLine } from "react-icons/fa6";
import Calling from "./Calling";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { io } from 'socket.io-client';

const socket = io("https://backendcafe-ceaj.onrender.com");


function Owner(props) {
  const [requests, setRequests] = useState([]);
  const audioRef = useRef(new Audio('/alertsound.mp3'));

  useEffect(() => {
    const audioElement = audioRef.current;
    audioElement.load(); // Preload the audio

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
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.currentTime = 0; // Ensure the sound plays from the start
      audioElement.play().catch(error => {
        console.error('Error playing audio:', error);
      });
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
          <strong className="font-extrabold">Incoming Call from {request.table}!</strong>
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
        <div className='flex items-center '>
          <Link to="/">
            <img src={backarrowlogo} className='h-10 w-10 m-2' alt="Back" />
          </Link>
          <h1 className="font-extrabold text-3xl text-center text-[#18196c] ml-10">Admin Panel</h1>
        </div>
      
        <div className="grid grid-cols-1 shadow-xl shadow-blue-400">
          <Link to="/Order">
          <div className='m-3 p-3 h-56 rounded-2xl transition duration-150 ease-in-out  bg-[#18196c] flex flex-col items-center justify-center'>
         <h1 className='text-center text-4xl font-mono font-extrabold text-white'>Order Details</h1>
            <GiCook  fill='white'  className="h-12 w-12 mt-4" />
            </div>
          </Link>
          <Link to="/Takeaway">
          <div className='m-3 p-3 h-56 rounded-2xl transition duration-150 ease-in-out  bg-[#18196c] flex flex-col items-center justify-center'>
         <h1 className='text-center text-4xl font-mono font-extrabold text-white'>Create Bill</h1>
         <FaFileInvoiceDollar  fill='white'  className="h-12 w-12 mt-4" />
            </div>
          </Link>
          <Link to="/Website">
         <div className='m-3 p-3 h-56 rounded-2xl transition duration-150 ease-in-out bg-[#18196c] flex flex-col items-center justify-center'>
         <h1 className='text-center text-4xl font-mono font-extrabold text-white'>Website Order</h1>
         <TbTruckDelivery fill='white' className="h-12 w-12 mt-4  text-white"  />
       </div>
        </Link>
          <Link to="/Dishmanage">
         <div className='m-3 p-3 h-56 rounded-2xl transition duration-150 ease-in-out bg-[#18196c] flex flex-col items-center justify-center'>
         <h1 className='text-center text-4xl font-mono font-extrabold text-white'>Dish Management</h1>
         <IoFastFoodOutline fill='white' className="h-12 w-12 mt-4  text-white"  />
       </div>
        </Link>
          <Link to="/Waiter">
          
          <div className='m-3 p-3 h-56 rounded-2xl transition duration-150 ease-in-out bg-[#18196c] flex flex-col items-center justify-center'>
         <h1 className='text-center text-4xl font-mono font-extrabold text-white'>Cost Price</h1>
           <MdOutlinePayments  fill='white' className="h-12 w-12 mt-4" />
            </div>
          </Link>
          <Link to="/Profit">
        <div className='m-3 p-3 h-56 rounded-2xl transition duration-150 ease-in-out bg-[#18196c] flex flex-col items-center justify-center'>
         <h1 className='text-center text-4xl font-mono font-extrabold text-white'>Profit Data</h1>
             <FaMoneyCheckDollar  fill="white" className="h-12 w-12 mt-4 "  />
            </div>
          </Link>
          <Link to="/Chart">
        <div className='m-3 p-3 h-56 rounded-2xl transition duration-150 ease-in-out bg-[#18196c] flex flex-col items-center justify-center'>
         <h1 className='text-center text-4xl font-mono font-extrabold text-white'>Analysis</h1>
         <FaChartLine fill="white" className="h-12 w-12 mt-4"/>
            </div>
          </Link>
          <Link to="/Month">
        <div className='m-3 p-3 h-56 rounded-2xl transition duration-150 ease-in-out bg-[#18196c] flex flex-col items-center justify-center'>
         <h1 className='text-center text-4xl font-mono font-extrabold text-white'>Customer Report</h1>
         <TbReport fill="white" className="h-12 w-12 mt-4" />
            </div>
          </Link>
      </div>
      <footer className="bg-gray-700 text-white p-4 text-center">
        <p>© 2024 Cafehouse Pvt ltd. All rights reserved.</p>
      </footer>
    </div>
    </div>
  );
}

export default Owner;
