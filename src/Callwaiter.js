import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import waiterphoto from "./images/waiterphoto.jpg";
import backarrowlogo from "./images/backarrowlogo.png";
import { io } from 'socket.io-client';

const socket = io("https://backendcafe-nefw.onrender.com");

export default function Callwaiter() {
  const [table, setTable] = useState('');
  const [query, setQuery] = useState('');
  const [showFeedback, setShowFeedback] = useState(false); // State to control feedback visibility

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tableFromUrl = queryParams.get('table');

    if (tableFromUrl) {
      setTable(tableFromUrl);
      console.log("The number of table is ", tableFromUrl);
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
      setShowFeedback(true); // Show feedback when request is sent

      // Hide feedback after 2 seconds
      setTimeout(() => {
        setShowFeedback(false);
      }, 2000);
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
          <h1 className="text-center text-2xl font-extrabold mb-6">Call Service for {table}</h1>
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
          {showFeedback && (
            <div className="mt-4 text-center text-green-700 font-bold">Request sent!</div> // Feedback message
          )}
        </div>
      </div>
    </div>
  );
}
