import React from 'react';

const Googlepay = () => {
  const receiver = "8800835834@paytm"; // Replace with actual receiver
  const amount = "10.00"; // Replace with actual amount
  const transactionId = "123456789"; // Replace with actual transaction ID

  const handleGooglePayRedirect = () => {
    const googlePayUrl = `googlepay://pay?recipient=${encodeURIComponent(receiver)}&amount=${encodeURIComponent(amount)}&transactionId=${encodeURIComponent(transactionId)}`;
    window.location.href = googlePayUrl;
  };

  return (
    <div>
      <h1>Payment</h1>
      <button onClick={handleGooglePayRedirect}>
        Pay with Google Pay
      </button>
    </div>
  );
};

export default Googlepay;
