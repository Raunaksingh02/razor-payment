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
    try {
      const response = await axios.get(`https://backendcafe-nefw.onrender.com/barcodeitem?barcode=${barcode}`);
      setProduct(response.data);
      setIsModalOpen(true);
      if (response.data.sizes && response.data.sizes.length > 0) {
        setSelectedSize(response.data.sizes[0].size);
        setPrice(response.data.sizes[0].price);
        setCostPrice(response.data.sizes[0].costPrice);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, selectedSize, price, costPrice); // Use the addToCart function
      setIsModalOpen(false);
    }
  };

  const handleSizeChange = (sizeObj) => {
    setSelectedSize(sizeObj.size);
    setPrice(sizeObj.price);
    setCostPrice(sizeObj.costPrice);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Web-based Barcode Scanner</h1>
      <div ref={scannerRef} className="w-full h-60 bg-black mb-4"></div>
      <button onClick={() => setIsScanning(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
        Start Scanning
      </button>

      <input
        type="text"
        value={manualCode}
        onChange={(e) => setManualCode(e.target.value)}
        placeholder="Enter Barcode Manually"
        className="border rounded p-2 mt-4"
      />
      <button onClick={() => fetchProductDetails(manualCode)} className="bg-green-500 text-white px-4 py-2 rounded mt-2">
        Fetch Product
      </button>

      {isModalOpen && product && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold">{product.name}</h2>
            <img src={product.image} alt={product.name} className="w-32 h-32 mb-4" />
            <div>
              {product.sizes.map((sizeObj, index) => (
                <button
                  key={index}
                  onClick={() => handleSizeChange(sizeObj)}
                  className={`px-2 py-1 m-1 ${
                    sizeObj.size === selectedSize ? 'bg-green-500 text-white' : 'bg-gray-200'
                  }`}
                >
                  {sizeObj.size}
                </button>
              ))}
            </div>
            <button onClick={handleAddToCart} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Barcode;
