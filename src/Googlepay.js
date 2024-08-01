import React from 'react';
import { useNavigate } from 'react-router-dom';

const Googlepay = () => {
  const navigate = useNavigate();

  const upiId = '8800835834@paytm';  // Receiver's UPI ID
  const payeeName = 'Raunak';        // Receiver's Name
  const amount = '1';                // Amount to be paid
  const currency = 'INR';            // Currency Code

  const handleRedirect = () => {
    const upiIntentUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${encodeURIComponent(amount)}&cu=${encodeURIComponent(currency)}`;

    console.log('UPI Intent URL:', upiIntentUrl);

    const redirectTimeout = setTimeout(() => {
      console.log('Navigating to fallback URL');
      navigate('/fail');
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
