import React, { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga';
import axios from 'axios';

const Barcode = ({ addToCart }) => {
  const scannerRef = useRef(null);
  const [scannedCode, setScannedCode] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [price, setPrice] = useState(0);
  const [costPrice, setCostPrice] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

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
          readers: ['code_128_reader', 'ean_reader', 'upc_reader'],
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
        fetchProductDetails(code);
      }
    });

    return () => {
      Quagga.stop();
      Quagga.offDetected();
    };
  }, [isScanning]);

  const fetchProductDetails = async (barcode) => {
    setError('');
    if (!barcode) {
      setError('Barcode is empty.');
      return;
    }
  
    try {
      console.log(`Fetching details for barcode: ${barcode}`);
      const response = await axios.get(
        `https://backendcafe-nefw.onrender.com/barcodeitem?barcode=${barcode}`
      );
      console.log('API Response:', response.data);
  
      if (response.data) {
        setProduct(response.data);
        setIsModalOpen(true);
        if (response.data.sizes && response.data.sizes.length > 0) {
          setSelectedSize(response.data.sizes[0].size);
          setPrice(response.data.sizes[0].price);
          setCostPrice(response.data.sizes[0].costPrice);
        }
      } else {
        setError('Product not found.');
      }
    } catch (error) {
      setError('Error fetching product details.');
      console.error('API Error:', error);
    }
  };
  

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, selectedSize, price, costPrice);
      setIsModalOpen(false);
    }
  };

  const handleSizeChange = (sizeObj) => {
    setSelectedSize(sizeObj.size);
    setPrice(sizeObj.price);
    setCostPrice(sizeObj.costPrice);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
        Web-based Barcode Scanner
      </h1>

      {/* Scanner Container */}
      <div className="relative w-full max-w-lg h-72 bg-gray-900 mb-6 overflow-hidden rounded-xl shadow-lg">
        <div ref={scannerRef} className="absolute inset-0 z-0" />
        <div className="absolute z-10 flex flex-col items-start top-4 left-4 space-y-2">
          <button
            onClick={() => setIsScanning(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          >
            Start Scanning
          </button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
      </div>

      {/* Manual Input */}
      <div className="w-full max-w-lg">
        <input
          type="text"
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          placeholder="Enter Barcode Manually"
          className="border border-gray-300 rounded-lg w-full p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => fetchProductDetails(manualCode)}
          className="w-full bg-green-600 text-white px-4 py-3 rounded shadow hover:bg-green-700"
        >
          Fetch Product
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      {/* Product Modal */}
      {isModalOpen && product && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              {product.name}
            </h2>
            <img
              src={product.image}
              alt={product.name}
              className="w-32 h-32 mb-4 mx-auto rounded-full shadow-lg"
            />
            <div className="flex flex-wrap justify-center mb-4 space-x-2">
              {product.sizes.map((sizeObj, index) => (
                <button
                  key={index}
                  onClick={() => handleSizeChange(sizeObj)}
                  className={`px-4 py-2 rounded-lg shadow ${
                    sizeObj.size === selectedSize
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {sizeObj.size}
                </button>
              ))}
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded shadow hover:bg-blue-700"
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Barcode;
