import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io("https://backendcafe-ceaj.onrender.com");

function Calling(props) {
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
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {requests.map((request, index) => (
        <div key={index} className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 animate-bounce shadow-lg max-w-xs mx-auto">
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
  );
}

export default Calling;



