

http://localhost:3001/billdata/66d6cd075c4c2f19f1392544

import React, { useState, useRef, useEffect,useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toPng } from 'html-to-image';
import QRCode from 'qrcode.react';
import axios from 'axios';
import backarrowlogo from './images/backarrowlogo.png';
import Footer from "./Footer.js";
import gpaylogo from "./images/gpaylogo.png";
import { IoMdDownload } from "react-icons/io";
import paytmlogo from "./images/paytmlogo.png";
import phonepelogo from "./images/phonepelogo.png";
import Stepmodal from "./Stepmodal.js";
import { BuyerContext } from './components/Buyercontext.js';
import {UPIDetailsContext} from "./components/UPIDetailsContext.js";
import { CustomerContext } from './CustomerContext';


function Upi() {
  const location = useLocation();

 
  const navigate = useNavigate();

  const {  paymentmode2,setpaymentmode2} = useContext(CustomerContext);
  console.log(paymentmode2);


  const { buyer } = useContext(BuyerContext);

  const { upinumber , upiname } = useContext(UPIDetailsContext);
  const { state } = location;
  const {
    buyerEmail ,
    customerName,
    customerPhone,
    customerTable,
    grandTotalforpayment,
    selectedAddress,
    cartforpayment
  } = state || {};
  console.log("the location of customer =",customerTable);
  console.log("the address of customer =",selectedAddress);
  console.log("the customer emial is ",buyerEmail);
  
  const [validationMessage, setValidationMessage] = useState('');
  const [isModal, setIsModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');

  const qrCodeRef = useRef();

  useEffect(() => {
    generateRandomCode();
    setIsModal(true);
  }, []);

  const generateRandomCode = () => {
    const hexDigits = '0123456789ABCDEF';
    const numDigits = 5;
    let codeArray = [];

    // Generate random hex digits and wrap them in quotes
    while (codeArray.length < numDigits) {
      const randomChar = hexDigits[Math.floor(Math.random() * hexDigits.length)];
      codeArray.push(`"${randomChar}"`); // Enclose each character in quotes
    }

  
    const positions = [];
    while (positions.length < 2) {
      const randomPosition = Math.floor(Math.random() * (codeArray.length + 1));
      if (!positions.includes(randomPosition)) {
        positions.push(randomPosition);
      }
    }

    // Insert the '%' symbolsc
    positions.forEach((pos) => {
      codeArray.splice(pos, 0, `"%""`); // Add "%" enclosed in quotes
    });

    const finalCode = `["${codeArray.join('","')}"]`; // Format with brackets and commas
    setGeneratedCode(finalCode);
    console.log(finalCode);
  };

  const encodeData = (data) => {
    return encodeURIComponent(data);
  };

  const extractPlainCode = (obfuscatedCode) => {
    return obfuscatedCode
      .replace(/[\[\]"]/g, '') // Remove brackets and quotes
      .split(',').join(''); // Remove commas
  };
  

  const generateQRCodeValue = () => {
    const plainCode = extractPlainCode(generatedCode);
    const obfuscatedVerificationCode = `VerificationCode:-${generatedCode}`;
    const encodedVerificationCode = encodeData(obfuscatedVerificationCode);

    const payAddress = upinumber || '9971299049@ibl'; // Example fallback UPI address
    const payName = upiname || 'Default Name';        // Example fallback UPI name
    
    return `upi://pay?pa=${payAddress}&pn=${payName}&am=${grandTotalforpayment}&cu=INR&tn=${encodedVerificationCode}`;
  };

 
  const handleCloseModal = () => {
    setIsModal(false);
  };

  const handleDownloadQRCode = () => {
    if (qrCodeRef.current) {
      toPng(qrCodeRef.current)
        .then((dataUrl) => {
          // Generate a random name with a 6-digit number
          const randomName = `QR_${Math.random().toString(36).substring(2, 8)}_${Math.floor(100000 + Math.random() * 900000)}`;
  
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `${randomName}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((error) => {
          console.error('Failed to generate image:', error);
        });
    }
  };
  

  const handleCodeChange = (e) => {
    setEnteredCode(e.target.value);
  };

  const savePaymentDetails = async () => {
    try {
      console.log('Saving payment details with the following data:', {
        paymentId: enteredCode,
        cartforpayment,
        name: customerName,
        amount: grandTotalforpayment,
        customerTable,
        email: buyerEmail,
        paymentmode: paymentmode2,
        address: selectedAddress || "",
        customerPhoneNo: customerPhone,
      });
  
      const res = await axios.post('https://backendcafe-ceaj.onrender.com/api/payments', {
        paymentId: enteredCode,
        cartforpayment,
        name: customerName,
        amount: grandTotalforpayment,
        customerTable,
        email: buyerEmail,
        paymentmode: paymentmode2,
        address: selectedAddress || "",
        customerPhoneNo: customerPhone,
      });
  
      console.log('Payment details saved successfully:', res.data);
      const paymentId = res.data._id;
      navigate(`/Invoice/${paymentId}?paymentmode=${paymentmode2}`);
    } catch (error) {
      console.error('Error saving payment details:', error.message || error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  };
  
  const handleSubmit = () => {
    const plainEnteredCode = extractPlainCode(enteredCode);
    if (plainEnteredCode !== extractPlainCode(generatedCode)) {
      setValidationMessage('Invalid verification code.');
    } else {
      setValidationMessage('');
      handleConfirm();
    }
  };

  const handleConfirm = () => {
    setIsModal(false); // Close the modal
    savePaymentDetails(); // Save payment detail
   
  };
  

  function Modal({ title, message, onConfirm, onClose }) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          <p className="mb-4">{message}</p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="bg-[#f6931e] hover:bg-[#f6931e] text-white font-bold py-2 px-4 rounded"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleBackNavigation = () => {
    if (customerTable === "Website") {
      navigate("/bill?table=undefined"); // Navigate to empty table
    } else {
      navigate(`/bill?table=${customerTable}`); // Navigate with query parameter
    }
  };

  return (
    <div>
      <div className="flex items-center shadow-lg shadow-gray-300">
        <div>
         <button onClick={handleBackNavigation} >
 
              <img src={backarrowlogo} className="h-10 w-10 m-2" />
         </button>
        </div>
        <div>
          <h1 className="text-3xl font-bold ml-12">UPI Payment</h1>
        </div>
      </div>
      <div className="container mx-auto p-2">
        <div className="flex flex-col items-center">
          <div className="flex flex-row gap-3 m-1 p-1 items-center">
            <div>
              <img src={phonepelogo} className="h-12 w-12" />
            </div>
            <div>
              <img src={gpaylogo} className="h-12 w-12" />
            </div>
            <div>
              <img src={paytmlogo} className="h-12 w-12" />
            </div>
          </div>
          <div className="mb-4 flex flex-col items-center justify-center">
            <h2 className="text-lg font-bold text-center mb-2">Download QR Code to Pay</h2>
            <div className="relative p-4 bg-white shadow-lg shadow-[#f6931e] mb-4 animate-slideInFromBottom" ref={qrCodeRef}>
              <QRCode value={generateQRCodeValue()} />
            </div>
            <div className="flex flex-row justify-evenly">
              <div>
                <h3>Name-{customerName}</h3>
              </div>
              <div className="ml-2">
                <h3>Amount-{grandTotalforpayment}</h3>
              </div>
            </div>
            <button onClick={handleDownloadQRCode} className="mt-2 px-4 py-2 bg-black animate-slideInFromBottom text-white rounded-lg">
              <div className="flex flex-row">
                <div>
                  Download QR
                </div>
                <div>
                  <IoMdDownload fill="white" className="h-6 w-6 ml-2" />
                </div>
              </div>
            </button>
          </div>
          <div className="mb-4 w-full max-w-md">
            <label className="block text-lg font-bold mb-2 text-center">Enter Verification Code</label>
            <input type="text" value={enteredCode} onChange={handleCodeChange} className="w-full h-10 border border-gray-500 rounded-lg p-2 focus:outline-[#f6931e] focus:outline-none" />
          </div>
          {
            validationMessage && (
              <p className="text-red-500 font-bold mb-2">{validationMessage}</p>
            )
          }
          <button onClick={handleSubmit} className="h-12 w-40 bg-[#f6931e] animate-slideInFromBottom hover:bg-green-700 font-bold text-xl text-white rounded-lg transition duration-300">Submit</button>

          <div className="mt-4 animate-slideInFromBottom">
          </div>
        </div>
        <Stepmodal isOpen={isModal} onClose={handleCloseModal} />
     
      </div>
      <div className="bg-white p-5 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl mb-4 font-semibold">Upi Payment Steps :</h2>
        <ol className="list-decimal list-inside font-bold">
              <li>Download the QR code or take screenshot on your phone.</li>
              <li>Scan it through any UPI app like Paytm, Google Pay, or PhonePe, etc.</li>
             <li>Enter the verification code after the payment completion from transcation history of UPI app.</li>
              <li>It is 100% safe and secure gateway through SSL and bank partners.</li>
            </ol>
      </div>
      <Footer />
    </div>
  );
}

export default Upi;












