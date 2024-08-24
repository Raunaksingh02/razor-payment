import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import waiter from "./images/waiter.png";
import waiterphoto from "./images/waiterphoto.jpg";
import backarrowlogo from "./images/backarrowlogo.png";
import { io } from 'socket.io-client';

const socket = io("https://backendcafe-ceaj.onrender.com");

export default function Callwaiter() {
  const [table, setTable] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    });

    socket.on("welcome", (data) => {
      console.log(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (table && query) {
      socket.emit('waiterRequest', { table, query });
      setTable('');
      setQuery('');
    }
  };

  const handleTableSelect = (selectedTable) => {
    setTable(selectedTable);
  };

  const handleQuerySelect = (selectedQuery) => {
    setQuery(selectedQuery);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      <div className="flex items-center mb-4">
        <Link to="/table">
          <img src={backarrowlogo} alt="Back" className="h-8 w-8" />
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <div className="flex justify-center mb-4">
            <img src={waiterphoto} alt="Waiter" className="h-44 w-40 animate-slideInFromBottom rounded-full object-cover" />
          </div>
          <h1 className="text-center text-2xl font-extrabold mb-6">Call Service</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2 text-center">Select Your Table</label>
              <div className="flex flex-wrap justify-center gap-2">
                {['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Table 6', 'Table 7', 'Table 8', 'Table 9', 'Table 10'].map((tableOption) => (
                  <button
                    key={tableOption}
                    type="button"
                    onClick={() => handleTableSelect(tableOption)}
                    className={`px-4 py-2 rounded-full text-white font-semibold focus:outline-none ${table === tableOption ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
                  >
                    {tableOption}
                  </button>
                ))}
              </div>
            </div>
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

