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
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none">
      {requests.map((request, index) => (
        <div 
          key={index} 
          className="bg-white border border-red-300 text-red-800 px-6 py-4 rounded-lg shadow-lg relative mb-4 pointer-events-auto max-w-sm mx-auto transition-transform transform duration-300 ease-in-out hover:scale-105"
          role="alert"
        >
          <div className="flex justify-between items-start">
            <div>
              <strong className="font-semibold text-lg text-gray-800">Incoming Call from {request.table}</strong>
              <span className="block text-gray-600">Query: {request.query} at {request.time}</span>
            </div>
            <button
              onClick={() => removeRequest(index)}
              className="text-gray-800 hover:text-red-500 transition-colors duration-300"
            >
              <GiCancel className='h-6 w-6' />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Calling;
