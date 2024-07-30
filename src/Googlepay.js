import React from 'react';
import { useNavigate } from 'react-router-dom';

const Googlepay = () => {
  const history = useNavigate();

  const upiId = '8800835834@paytm';
  const payeeName = 'Raunak';
  const transactionId = '123456';
  const transactionNote = 'this is my order page';
  const amount = '1';
  const currency = 'INR';
  const callbackUrl = 'https://cafehouse.vercel.app/Success';

  const handleRedirect = () => {
    const upiIntentUrl = `phonepe://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&tr=${encodeURIComponent(transactionId)}&tn=${encodeURIComponent(transactionNote)}&am=${encodeURIComponent(amount)}&cu=${encodeURIComponent(currency)}&url=${encodeURIComponent(callbackUrl)}`;

    const fallbackUrl = `https://cafehouse.vercel.app/Failure`;

    const redirectTimeout = setTimeout(() => {
      history(fallbackUrl);
    }, 5000);

    window.location.href = upiIntentUrl;

    window.addEventListener('blur', () => {
      clearTimeout(redirectTimeout);
      window.location.href = callbackUrl;
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
      Pay with PhonePe
    </button>
  );
};

export default Googlepay;
