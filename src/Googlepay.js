import React from 'react';
import { useNavigate } from 'react-router-dom';

const Googlepay = () => {
  const navigate = useNavigate();

  const upiId = '8800835834@paytm';  // Receiver's UPI ID
  const payeeName = 'Raunak';        // Receiver's Name
  const transactionId = '123456';    // Unique Transaction ID
  const transactionNote = 'this is my order page';  // Transaction Note
  const amount = '1';                // Amount to be paid
  const currency = 'INR';            // Currency Code
  const callbackUrl = 'https://cafehouse.vercel.app/success';  // Success Callback URL

  const handleRedirect = () => {
    const upiIntentUrl = `intent://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&tr=${encodeURIComponent(transactionId)}&tn=${encodeURIComponent(transactionNote)}&am=${encodeURIComponent(amount)}&cu=${encodeURIComponent(currency)}&url=${encodeURIComponent(callbackUrl)}#Intent;scheme=upi;package=com.phonepe.app;end`;

    const fallbackUrl = 'https://cafehouse.vercel.app/failure';  // Failure Callback URL

    console.log('UPI Intent URL:', upiIntentUrl);
    console.log('Fallback URL:', fallbackUrl);

    const redirectTimeout = setTimeout(() => {
      console.log('Navigating to fallback URL');
      navigate('/failure');
    }, 5000);

    window.location.href = upiIntentUrl;

    window.addEventListener('blur', () => {
      clearTimeout(redirectTimeout);
      console.log('Navigating to success URL');
      navigate('/success');
    });

    window.addEventListener('focus', () => {
      clearTimeout(redirectTimeout);
    });
  };

  return (
    <button
      onClick={handleRedirect}
      className="bg-blue-500 text-white p-4 rounded-lg"
    >
      Pay with PhonePe Now
    </button>
  );
};

export default Googlepay;
