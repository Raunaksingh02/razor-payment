import React from 'react';

const UpiPaymentIntent = () => {
  const upiId = '8800835834@paytm';  // Receiver's UPI ID
  const payeeName = 'Raunak';        // Receiver's Name
  const transactionNote = 'Order payment';  // Transaction Note
  const amount = '1';                // Amount to be paid
  const currency = 'INR';            // Currency Code

  const handleRedirect = () => {
    const upiIntentUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&tn=${encodeURIComponent(transactionNote)}&am=${encodeURIComponent(amount)}&cu=${encodeURIComponent(currency)}`;
    window.location.href = upiIntentUrl;
  };

  return (
    <button
      onClick={handleRedirect}
      className="bg-blue-500 text-white p-4 rounded-lg"
    >
      Pay with UPI Now
    </button>
  );
};

export default UpiPaymentIntent;
