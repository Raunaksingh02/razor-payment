import React, { useState, useRef } from 'react';
import QRCode from 'qrcode.react';

const Googlepay = () => {
  const [inputValue, setInputValue] = useState('');
  const [qrValue, setQrValue] = useState('');
  const qrRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleGenerateQR = () => {
    setQrValue(inputValue);
  };

  const handleDownload = () => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector('canvas');
      const dataURL = canvas.toDataURL('image/png');
      
      // Create an anchor element and simulate a click to download the image
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'qrcode.png'; // Specify the download file name
      document.body.appendChild(link); // Append the link to the body
      link.click(); // Simulate a click on the link
      document.body.removeChild(link); // Remove the link after downloading
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">QR Code Maker</h2>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter text or URL"
        className="p-2 border border-gray-300 rounded mb-4 w-full"
      />
      <button
        onClick={handleGenerateQR}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-2"
      >
        Generate QR Code
      </button>
      <button
        onClick={handleDownload}
        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        disabled={!qrValue}
      >
        Download QR Code
      </button>
      {qrValue && (
        <div className="mt-4" ref={qrRef}>
          <QRCode
            value={qrValue}
            size={256}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
          />
        </div>
      )}
    </div>
  );
};

export default Googlepay;
