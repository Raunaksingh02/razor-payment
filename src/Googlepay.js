import React from 'react';

const Googlepay = () => {
  const handleUpiPayment = () => {
    const upiId = "9971299049@ibl"; // Replace with your UPI ID
    const name = encodeURIComponent("Next");
    const amount = "10.00";
    const currency = "INR";
    const transactionRef = encodeURIComponent("TID12345");
    const note = encodeURIComponent("Payment for order");

    const upiUrl = `upi://pay?pa=${upiId}&pn=${name}&tr=${transactionRef}&tn=${note}&am=${amount}&cu=${currency}`;

    window.location.href = upiUrl;
  };

  return (
    <button onClick={handleUpiPayment}>
      Pay with UPI
    </button>
  );
};

export default Googlepay;
