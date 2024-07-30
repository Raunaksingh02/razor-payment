import React from 'react';
import { useNavigate} from 'react-router-dom';

const Googlepay = () => {
  const history = useNavigate();

  const upiId = '9266148949@ybl';
  const payeeName = 'Raunak';
  const transactionId = '123456';
  const transactionNote = 'this is my order page';
  const amount = '1';
  const currency = 'INR';
  const callbackUrl = 'https://cafehouse.vercel.app/Success';

  const handleRedirect = () => {
    const upiIntentUrl = `phonepe://pay?pa=${upiId}&pn=${payeeName}&tr=${transactionId}&tn=${transactionNote}&am=${amount}&cu=${currency}&url=${callbackUrl}`;

    const fallbackUrl = `https://cafehouse.vercel.app/Fail`;

    const redirectTimeout = setTimeout(() => {
      history(fallbackUrl);
    }, 5000);

    window.location.href = upiIntentUrl;

    window.addEventListener('blur', () => {
      clearTimeout(redirectTimeout);
      window.location.href = `https://cafehouse.vercel.app/Success`;
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
