import React, { useState, useEffect } from 'react';
import { useLocation, Link ,useNavigate} from 'react-router-dom';
import waiterphoto from "./images/waiterphoto.jpg";
import backarrowlogo from "./images/backarrowlogo.png";
import { io } from 'socket.io-client';

const socket = io("https://backendcafe-ceaj.onrender.com");

export default function Callwaiter() {
  const [table, setTable] = useState('');
  const [query, setQuery] = useState('');

  // Use the useLocation hook to get the URL query string
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    // Extract the table number from the query string
    const queryParams = new URLSearchParams(location.search);
    const tableFromUrl = queryParams.get('table');

    if (tableFromUrl) {
      setTable(tableFromUrl); // Set the table state from the URL parameter
      console.log("the number of table is ",tableFromUrl);
    }


    socket.on("connect", () => {
      console.log("connected", socket.id);
    });

    socket.on("welcome", (data) => {
      console.log(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (table && query) {
      socket.emit('waiterRequest', { table, query });
      setQuery('');
    }
  };

  const handleQuerySelect = (selectedQuery) => {
    setQuery(selectedQuery);
  };

  
  const handleBackButtonClick = () => {
    navigate(`/${table}`);
  };
 
 
 

  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      <div className="flex items-center mb-4">
        <button onClick={handleBackButtonClick}>
          <img src={backarrowlogo} alt="Back" className="h-8 w-8" />
          </button>
      </div>
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <div className="flex justify-center mb-4">
            <img src={waiterphoto} alt="Waiter" className="h-44 w-40 animate-slideInFromBottom rounded-full object-cover" />
          </div>
          <h1 className="text-center text-2xl font-extrabold mb-6">Call Service for {table}</h1> {/* Display selected table */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2 text-center">Select Your Request</label>
              <div className="flex flex-wrap justify-center gap-2">
                {['Call the waiter', 'Clean the table', 'Give me water', 'Bring the menu', 'Bring the bill'].map((queryOption) => (
                  <button
                    key={queryOption}
                    type="button"
                    onClick={() => handleQuerySelect(queryOption)}
                    className={`px-4 py-2 rounded-full text-white font-semibold focus:outline-none ${query === queryOption ? 'bg-green-700' : 'bg-green-500 hover:bg-green-600'}`}
                  >
                    {queryOption}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Send Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}







































import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { GiCancel } from "react-icons/gi";

const socket = io("https://backendcafe-ceaj.onrender.com");

function Calling() {
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
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center  pointer-events-none">
      {requests.map((request, index) => (
        <div 
          key={index} 
          className="bg-white border border-red-400 text-red-700 px-6 py-4 rounded shadow-lg shadow-red-400 relative mb-4 pointer-events-auto animate-bounce-in-down max-w-sm mx-auto"
          role="alert"
        >
          <div className="flex   justify-between items-start ">
            <div>
              <strong className="font-extrabold text-lg">Incoming Call from {request.table}!</strong>
              <span className="block font-bold  sm:inline"> {request.query} at {request.time}</span>
            </div>
            <button
              onClick={() => removeRequest(index)}
              className="text-black"
            >
            {/* <span className="text-2xl">&times;</span> */}
            <GiCancel fill="black" className='h-6 w-6' />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Calling;
