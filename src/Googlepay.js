import React from 'react';

const Googlepay = () => {
  const upiId = '9136441516@ybl';  // Receiver's UPI ID
  const payeeName = 'Receiver Name';      // Receiver's Name
  const amount = '2.00';                 // Amount to be paid
  const currency = 'INR';                 // Currency Code
  const transactionId = '123456789';      // Transaction ID (Optional)
  const transactionNote = 'Payment for Order';  // Transaction Note (Optional)

  const handleGooglePayRedirect = () => {
    const upiIntentUrl = `intent://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&mc=&tid=${encodeURIComponent(transactionId)}&tn=${encodeURIComponent(transactionNote)}&am=${encodeURIComponent(amount)}&cu=${encodeURIComponent(currency)}&url=#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`;

    console.log('UPI Intent URL:', upiIntentUrl);

    window.location.href = upiIntentUrl;
  };

  return (
    <div>
      <h1>Payment</h1>
      <button className='bg-red-400' onClick={handleGooglePayRedirect}>
         Google Pay
      </button>
    </div>
  );
};

export default Googlepay;
