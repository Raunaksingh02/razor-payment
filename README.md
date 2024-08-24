
create a schema in mongodb with name of customer with name,phone no, email ,password, timestamp,array of addreess with house no,street no,city ,state,oin code ,and landmark,  ,,,,create a login component full, and signup component , and Address input component with apis and also update password ,,,the signup should be done through nodemailer otp ,,,also user context functionality to manage the context of login customer so that he should enter the data again and again



password = uljt vkgm wdtj cask



watercalling ui component

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

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex items-center p-4">
        <Link to="/table">
          <img src={backarrowlogo} alt="Back" className="h-8 w-8" />
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <div className="flex justify-center mb-4">
            <img src={waiterphoto} alt="Waiter" className="h-44 w-40 animate-slideInFromBottom  rounded-full object-cover" />
          </div>
          <h1 className="text-center text-2xl font-extrabold mb-6">Call Service</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="table" className="block text-gray-700 font-bold mb-2">Select Table</label>
              <select
                id="table"
                value={table}
                onChange={(e) => setTable(e.target.value)}
                className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="" disabled>Select your table</option>
                <option value="Table 1">Table 1</option>
                <option value="Table 2">Table 2</option>
                <option value="Table 3">Table 3</option>
                <option value="Table 4">Table 4</option>
                <option value="Table 5">Table 5</option>
                <option value="Table 6">Table 6</option>
                <option value="Table 7">Table 7</option>
                <option value="Table 8">Table 8</option>
                <option value="Table 9">Table 9</option>
                <option value="Table 10">Table 10</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="query" className="block text-gray-700 font-bold mb-2">Select Request</label>
              <select
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="" disabled>Select your request</option>
                <option value="Call the waiter">Call the waiter</option>
                <option value="Clean the table">Clean the table</option>
                <option value="Give me water">Give me water</option>
                <option value="Bring the menu">Bring the menu</option>
                <option value="Bring the bill">Bring the bill</option>
              </select>
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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












