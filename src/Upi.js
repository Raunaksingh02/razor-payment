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
    const intentLink = `intent://pay?pa=${payAddress}&pn=${payName}&am=${amount}&cu=INR&tid=Bill%No:${verificationCode}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`;
  
    window.location.href = intentLink; // Redirect to Google Pay app
  };

  // Function to handle payment redirection specifically to PhonePe
  const handleOpenPhonePeApp = () => {
    const verificationCode = generatedCode;
    const payAddress = upinumber || '9971299049@ibl';
    const payName = upiname || 'Default Name';
    const amount = grandTotalforpayment || 1; // Use actual payment amount
  
    // Construct the deep link URL specifically for PhonePe
    const intentLink = `intent://pay?pa=${payAddress}&pn=${payName}&am=${amount}&cu=INR&tid=Bill%No:${verificationCode}#Intent;scheme=upi;package=com.phonepe.app;end`;
  
    window.location.href = intentLink; // Redirect to PhonePe app
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
          <div className="text-center">
            <QRCode
              ref={qrCodeRef}
              value={generateQRCodeValue()}
              size={256}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"L"}
              includeMargin={true}
            />
            <div className="mt-4">
              <button
                onClick={handleDownloadQRCode}
                className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
              >
                <IoMdDownload className='mr-2' />
                Download QR Code
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <button
              onClick={handleOpenGooglePayApp}
              className="bg-[#4285F4] text-white px-4 py-2 rounded shadow mt-4"
            >
              <img src={gpaylogo} className="h-8 w-8 inline mr-2" alt="Google Pay" />
              Pay with Google Pay
            </button>
            <button
              onClick={handleOpenPhonePeApp}
              className="bg-[#1d3c6b] text-white px-4 py-2 rounded shadow mt-4"
            >
              <img src={phonepelogo} className="h-8 w-8 inline mr-2" alt="PhonePe" />
              Pay with PhonePe
            </button>
            <button
              onClick={() => handleOpenUPIApp(generateQRCodeValue())}
              className="bg-[#f6931e] text-white px-4 py-2 rounded shadow mt-4"
            >
              Pay with UPI
            </button>
          </div>
        </div>
      </div>
      {isModal && (
        <Modal
          title="Enter Verification Code"
          message={`Please enter the verification code sent to your email.`}
          onConfirm={handleSubmit}
          onClose={handleCloseModal}
        >
          <input
            type="text"
            value={enteredCode}
            onChange={handleCodeChange}
            className="border rounded p-2 w-full mt-4"
            placeholder="Enter code here"
          />
          {validationMessage && <p className="text-red-500 mt-2">{validationMessage}</p>}
        </Modal>
      )}
      <Footer />
    </div>
  );
}

export default Upi;
