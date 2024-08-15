import React, { useState, useRef, useEffect } from 'react';
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
import Stepmodal from "./images/Stepmodal.js";

function Upi() {
  const location = useLocation();
  const { state } = location;
  const {
    customerName,
    customerPhone,
    customerTable,
    grandTotalforpayment,
    houseNo,
    city,
    pincode,
    landmark,
    cartforpayment
  } = state || {};
  const navigate = useNavigate();
  console.log(cartforpayment);

  const [validationMessage, setValidationMessage] = useState('');
  const [isModal, setIsModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');

  const qrCodeRef = useRef();

  useEffect(() => {
    generateRandomCode();
  }, []);

  const generateRandomCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
  };

  const generateQRCodeValue = () => {
    return `upi://pay?pa=9971299049@ibl&pn=Cafe-House&am=${grandTotalforpayment}&cu=INR&tn=VerificationCode:${generatedCode}`;
  };

  const handleCloseModal = () => {
    setIsModal(false);
  };

  const handleDownloadQRCode = () => {
    if (qrCodeRef.current) {
      toPng(qrCodeRef.current)
        .then((dataUrl) => {
          const byteString = atob(dataUrl.split(',')[1]);
          const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
          const u8arr = new Uint8Array(byteString.length);
          for (let i = 0; i < byteString.length; i++) {
            u8arr[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([u8arr], { type: mimeString });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'QRCode.png';
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
      const res = await axios.post('https://backendcafe-ceaj.onrender.com/api/payments', {
        paymentId: generatedCode,
        cartforpayment,
        name: customerName,
        amount: grandTotalforpayment,
        customerTable,
        paymentmode: "online",
        address: {
          houseNo,
          city,
          pincode,
          landmark
        },
        customerPhoneNo: customerPhone,
        
      });

      const paymentId = res.data._id;
      console.log('Payment details saved:', paymentId);
      navigate(`/Invoice/${paymentId}`);
    } catch (error) {
      console.error('Error saving payment details:', error);
    }
  };

  const handleSubmit = () => {
    if (enteredCode !== generatedCode) {
      setValidationMessage('Invalid verification code.');
    } else {
      setValidationMessage('');
      setIsModal(true);
    }
  };

  const handleConfirm = () => {
    setIsModal(false);
    savePaymentDetails();
    alert("The order is placed");
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

  return (
    <div>
      <div className="flex items-center shadow-lg shadow-gray-300">
        <div>
          <Link to="/bill">
            <img src={backarrowlogo} className="h-10 w-10 m-2" />
          </Link>
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
            <div className="relative p-4 bg-white shadow-lg shadow-[#f6931e] mb-4  animate-slideInFromBottom" ref={qrCodeRef}>
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
            <button onClick={handleDownloadQRCode} className="mt-2 px-4 py-2 bg-black animate-slideInFromBottom  text-white rounded-lg">
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
            <input type="text" value={enteredCode} onChange={handleCodeChange} className="w-full h-10 border border-gray-500 rounded-lg p-2 focus:outline-[#f6931e]  focus:outline-none" />
          </div>
          {
            validationMessage && (
              <p className="text-red-500 font-bold mb-2">{validationMessage}</p>
            )
          }
          <button onClick={handleSubmit} className="h-12 w-40 bg-[#f6931e]  animate-slideInFromBottom hover:bg-green-700 font-bold text-xl text-white rounded-lg transition duration-300">Submit</button>

          <div className="mt-4 animate-slideInFromBottom">
          </div>
        </div>
        <Stepmodal isOpen={isModal} onClose={handleCloseModal} />
        {isModal && (
          <Modal
            title="Confirm Transaction"
            message="Are you sure the payment is done?"
            onConfirm={handleConfirm}
            onClose={() => setIsModal(false)}
          />
        )}
      </div>
      <Stepmodal />
      <Footer />
    </div>
  );
}


export default Upi;





