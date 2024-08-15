import React from 'react';

const Stepmodal = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl mb-4 font-semibold">Upi Payment Steps :</h2>
        <ol className="list-decimal list-inside font-bold">
              <li>Download the QR code or take screenshot on your phone.</li>
              <li>Scan it through any UPI app like Paytm, Google Pay, or PhonePe, etc.</li>
              <li>Enter the verification code after the payment completion.</li>
              <li>It is 100% safe and secure gateway through SSL and bank partners.</li>
            </ol>
        <button
          onClick={onClose} 
          className="bg-[#f6931e] hover:bg-[rgb(246,147,30)] text-white font-bold py-2 mt-2 px-4 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Stepmodal;


















