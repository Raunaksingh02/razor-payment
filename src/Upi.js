import React, { useState, useRef, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { UPIDetailsContext } from "./components/UPIDetailsContext.js";
import { CustomerContext } from './CustomerContext';

function Upi() {
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentmode2, setpaymentmode2 } = useContext(CustomerContext);
  const { buyer } = useContext(BuyerContext);
  const { upinumber, upiname } = useContext(UPIDetailsContext);
  const { state } = location;
  const {
    buyerEmail,
    customerName,
    customerPhone,
    customerTable,
    grandTotalforpayment,
    selectedAddress,
    cartforpayment
  } = state || {};

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
    let code = '';
    for (let i = 0; i < 7; i++) {
      code += Math.floor(Math.random() * 10);
    }
    setGeneratedCode(code);
  };

  const generateQRCodeValue = () => {
    const verificationCode = generatedCode;
    const payAddress = upinumber || '9971299049@ibl';
    const payName = upiname || 'Default Name';
    
    return `upi://pay?pa=${payAddress}&pn=${payName}&am=300&cu=INR&tn=Bill%No:${verificationCode}`;
  };

  // Function to handle payment redirection specifically to Google Pay
  const handleOpenGooglePayApp = () => {
    const verificationCode = generatedCode;
    const payAddress = upinumber || '9971299049@ibl';
    const payName = upiname || 'Default Name';
    const amount = grandTotalforpayment || 300; // Use actual payment amount
  
    // Construct the deep link URL specifically for Google Pay
    const googlePayLink = `upi://pay?pa=${payAddress}&pn=${payName}&am=${amount}&cu=INR&tn=Bill%No:${verificationCode}`;
  
    // To ensure it opens only in Google Pay, use intent with package name
    const intentLink = `intent://pay?pa=${payAddress}&pn=${payName}&am=${amount}&cu=INR&tn=Bill%No:${verificationCode}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`;
  
    window.location.href = intentLink; // Redirect to Google Pay app
  };
  

  const handleOpenUPIApp = (upiLink) => {
    window.location.href = upiLink;  // Redirect to the UPI link to open the UPI app
  };
  
  const handleCloseModal = () => {
    setIsModal(false);
  };

  const handleDownloadQRCode = () => {
    if (qrCodeRef.current) {
      toPng(qrCodeRef.current)
        .then((dataUrl) => {
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
    if (enteredCode !== generatedCode) {
      setValidationMessage('Invalid verification code.');
    } else {
      setValidationMessage('');
      handleConfirm();
    }
  };

  const handleConfirm = () => {
    setIsModal(false);
    savePaymentDetails();
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
      navigate("/bill?table=undefined");
    } else {
      navigate(`/bill?table=${customerTable}`);
    }
  };

  return (
    <div>
      <div className='flex items-center mb-4'>
        <div className='mr-4'>
          <button onClick={handleBackNavigation}>
            <img src={backarrowlogo} className='h-10 w-10' alt="Back" />
          </button>
        </div>
        <div className='flex-1 text-center'>
          <h1 className='font-bold text-2xl mb-2 mr-4'>Bill Generated</h1>
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
              <div>
                <h3>Total Amount-{grandTotalforpayment}</h3>
              </div>
            </div>
            <button
              onClick={handleDownloadQRCode}
              className="bg-[#f6931e] hover:bg-[#f6931e] text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <IoMdDownload className="mr-2" />
              Download QR
            </button>
          </div>
          <div>
            <h2 className="text-lg font-bold text-center mb-2">Pay via UPI Apps</h2>
            <button
              onClick={handleOpenGooglePayApp}  // Use the Google Pay specific function here
              className="bg-[#34a853] hover:bg-[#34a853] text-white font-bold py-2 px-4 rounded mb-2"
            >
              Pay with Google Pay
            </button>
          </div>
        </div>
        {isModal && (
          <Modal
            title="Enter Verification Code"
            message={
              <div>
                <input
                  type="text"
                  value={enteredCode}
                  onChange={handleCodeChange}
                  className="border rounded w-full py-2 px-3 text-gray-700"
                />
                {validationMessage && (
                  <p className="text-red-500 text-xs mt-2">{validationMessage}</p>
                )}
              </div>
            }
            onConfirm={handleSubmit}
            onClose={handleCloseModal}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Upi;
