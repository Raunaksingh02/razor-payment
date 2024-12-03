import React, { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga';

const Barcode = () => {
  const scannerRef = useRef(null);
  const [scannedCode, setScannedCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (!isScanning) return;

    Quagga.init(
      {
        inputStream: {
          type: 'LiveStream',
          target: scannerRef.current,
          constraints: {
            facingMode: 'environment', // Rear camera for mobile
          },
        },
        decoder: {
          readers: ['code_128_reader', 'ean_reader', 'upc_reader'], // Add other barcode formats as needed
        },
      },
      (err) => {
        if (err) {
          console.error('Error initializing Quagga:', err);
          return;
        }
        Quagga.start();
      }
    );

    Quagga.onDetected((result) => {
      const code = result.codeResult.code;
      if (code) {
        Quagga.stop();
        setIsScanning(false);
        setScannedCode(code);
      }
    });

    return () => {
      Quagga.stop();
      Quagga.offDetected();
    };
  }, [isScanning]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Web-based Barcode Scanner</h1>

      <div
        ref={scannerRef}
        style={{ width: '100%', height: '300px', backgroundColor: '#000' }}
        className="flex items-center justify-center"
      >
        {!isScanning && <p className="text-white text-center">Tap "Start Scanning"</p>}
      </div>

      <button
        onClick={() => setIsScanning(true)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded shadow"
      >
        Start Scanning
      </button>

      {scannedCode && (
        <div className="mt-4 bg-white p-4 rounded shadow">
          <p className="text-lg">Scanned Barcode: <span className="font-semibold">{scannedCode}</span></p>
        </div>
      )}
    </div>
  );
};

export default Barcode;
