import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io("http://localhost:1000");

export default function Waiterpage() {
  const [requests, setRequests] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    socket.on('Request', (data) => {
      console.log("Received data:", data);
      const newRequest = { ...data, time: new Date().toLocaleTimeString() };
      setRequests(prevRequests => [...prevRequests, newRequest]);
      if (soundEnabled) {
        playAlertSound();
      }
    });
  }, [soundEnabled]);

  const playAlertSound = () => {
    const audio = new Audio('/alertsound.mp3'); // Make sure to have an alertsound.mp3 file in your public directory
    audio.play();
  };

  const enableSound = () => {
    setSoundEnabled(true);
    const audio = new Audio('/silent.mp3'); // A silent.mp3 file should be in your public directory
    audio.play();
    
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md max-w-4xl mx-auto">
        <h1 className="text-center text-2xl font-bold mb-6">Waiter Requests</h1>
        <button
          onClick={enableSound}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Enable Sound Alerts
        </button>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Table</th>
                <th className="px-4 py-2 border-b">Query</th>
                <th className="px-4 py-2 border-b">Time</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border-b">{request.table}</td>
                  <td className="px-4 py-2 border-b">{request.query}</td>
                  <td className="px-4 py-2 border-b">{request.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
