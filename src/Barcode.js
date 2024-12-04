import React, { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga';
import axios from 'axios';

const Barcode = () => {
  const scannerRef = useRef(null);
  const [scannedCode, setScannedCode] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isScanning) return;

    Quagga.init(
      {
        inputStream: {
          type: 'LiveStream',
          target: scannerRef.current,
          constraints: {
            facingMode: 'environment',
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
        locate: true,
        frequency: 10,
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
        fetchProductDetails(code);
      }
    });

    return () => {
      Quagga.stop();
      Quagga.offDetected();
    };
  }, [isScanning]);

  const fetchProductDetails = async (barcode) => {
    try {
      const response = await axios.get(`https://backendcafe-nefw.onrender.com/barcodeitem?barcode=${barcode}`);
      setProduct(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const handleManualFetch = () => {
    if (manualCode.trim()) {
      setScannedCode(manualCode);
      fetchProductDetails(manualCode);
    }
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
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

      <div className="mt-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Enter Barcode Manually"
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <button
          onClick={handleManualFetch}
          className="w-full px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 transition"
        >
          Fetch Product
        </button>
      </div>

      {isModalOpen && product && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg">
            <h2 className="text-xl font-bold mb-4">{product.name}</h2>
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-4" />
            <p className="mb-4">{product.description}</p>
            <div className="flex items-center gap-4">
              <button
                onClick={decrementQuantity}
                className="px-4 py-2 bg-gray-300 rounded shadow hover:bg-gray-400 transition"
              >
                -
              </button>
              <span className="text-xl font-semibold">{quantity}</span>
              <button
                onClick={incrementQuantity}
                className="px-4 py-2 bg-gray-300 rounded shadow hover:bg-gray-400 transition"
              >
                +
              </button>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 transition"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {scannedCode && (
        <div className="mt-4 bg-white p-4 rounded shadow w-full text-center">
          <p className="text-lg">
            Scanned Barcode: <span className="font-semibold">{scannedCode}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Barcode;
