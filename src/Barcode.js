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
            width: 640,
            height: 480,
          },
        },
        decoder: {
          readers: [
            'code_128_reader',
            'ean_reader',
            'upc_reader',
            'ean_8_reader',
            'code_39_reader',
            'code_39_vin_reader',
            'codabar_reader',
            'upc_e_reader',
            'i2of5_reader',
            '2of5_reader',
            'code_93_reader',
          ],
          debug: {
            drawBoundingBox: true,
            showFrequency: true,
            drawScanline: true,
            showPattern: true,
          },
        },
        locate: true, // Improves detection of small or partially visible barcodes
        frequency: 10, // Process frames more frequently for quicker results
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 text-center">Web-based Barcode Scanner</h1>

        <div
          ref={scannerRef}
          style={{ width: '100%', height: '300px', backgroundColor: '#000' }}
          className="flex items-center justify-center rounded-lg"
        >
          {!isScanning && <p className="text-white text-center">Tap "Start Scanning"</p>}
        </div>

        <button
          onClick={() => setIsScanning(true)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
        >
          Start Scanning
        </button>

        {scannedCode && (
          <div className="mt-4 bg-white p-4 rounded shadow w-full text-center">
            <p className="text-lg">
              Scanned Barcode: <span className="font-semibold">{scannedCode}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Barcode;
