import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Googlepay = () => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [enteredTransactionId, setEnteredTransactionId] = useState('');

  const upiId = '8800835834@paytm';  // Receiver's UPI ID
  const payeeName = 'Raunak';        // Receiver's Name
  const transactionId = '123456';    // Unique Transaction ID
  const transactionNote = 'this is my order page';  // Transaction Note
  const amount = '1';                // Amount to be paid
  const currency = 'INR';            // Currency Code

  const handleRedirect = () => {
    const upiIntentUrl = `intent://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&tr=${encodeURIComponent(transactionId)}&tn=${encodeURIComponent(transactionNote)}&am=${encodeURIComponent(amount)}&cu=${encodeURIComponent(currency)}#Intent;scheme=upi;package=com.phonepe.app;end`;

    window.location.href = upiIntentUrl;

    // Show confirmation modal after redirecting to the UPI app
    setShowConfirmation(true);
  };

  const handleUserConfirmation = (confirmed) => {
    if (confirmed && enteredTransactionId) {
      // Simulate verifying the transaction ID
      // For now, just check if the enteredTransactionId matches a predefined value
      if (enteredTransactionId === transactionId) {
        navigate('/success');
      } else {
        navigate('/failure');
      }
    } else {
      navigate('/failure');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <button
        onClick={handleRedirect}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mb-4"
      >
        PhonePe 
      </button>

      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Payment Confirmation</h2>
            <p className="mb-4">Please confirm if you completed the payment by entering the transaction ID/UTR below:</p>
            <input
              type="text"
              placeholder="Enter Transaction ID/UTR"
              value={enteredTransactionId}
              onChange={(e) => setEnteredTransactionId(e.target.value)}
              className="border p-2 rounded w-full mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleUserConfirmation(true)}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                Confirm
              </button>
              <button
                onClick={() => handleUserConfirmation(false)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Googlepay;
