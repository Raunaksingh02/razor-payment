import React, { useEffect, useState, useRef } from 'react';

import { io } from 'socket.io-client';

const socket = io("https://backendcafe-ceaj.onrender.com");

function Calling(props) {
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
          <div key={index} className="bg-red-100 border  border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
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

  )
}


export default Calling;




























