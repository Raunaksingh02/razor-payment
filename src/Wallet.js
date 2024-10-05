import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { BuyerContext } from './components/Buyercontext.js';// Adjust the path as necessary
import { useNavigate } from 'react-router-dom'; // Assuming you use React Router for navigation

const Wallet = () => {
  const { buyer } = useContext(BuyerContext);
  const [wallet, setWallet] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const buyerEmail = buyer?.email || "";


  useEffect(() => {
    if (buyerEmail) {
      axios.get(`https://backendcafe-zqt8.onrender.com/addresses?email=${buyerEmail}`)
        .then(response => {
          setWallet(response.data.wallet); // Assuming wallet is part of the response
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching wallet data: ", error);
          setLoading(false);
        });
    }
  }, [buyerEmail]);

  if (loading) {
    return <p className="text-center text-lg">Loading...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with back button */}
      <div className="bg-gray-100 py-3 px-4 flex rounded-xl items-center shadow-md">
        <button onClick={() => navigate('/')} className="text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-center flex-grow text-gray-800">My Wallet</h2>
      </div>

      {/* Wallet Balance */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="bg-gradient-to-r from-[#f6931e] to-[#f79f35] p-6 rounded-lg shadow-lg text-center">
          <span className="text-white font-semibold text-lg block">Wallet Balance</span>
          <span className="text-white font-bold text-5xl mt-2">
            ₹{wallet.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Add Money Button */}
      <div className="p-4 text-center">
        <button 
          className="bg-[#f6931e] text-white px-6 py-3 rounded-full hover:bg-[#df953c] transition duration-300"
          onClick={() => navigate('/')}
        >
        Homepage
        </button>
      </div>
    </div>
  );
};

export default Wallet;
