import React, { useState, useRef,useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toPng } from 'html-to-image';
import QRCode from 'qrcode.react';
import axios from 'axios';
import backarrowlogo from './images/backarrowlogo.png';
import Footer from "./Footer.js";
import gpaylogo from "./images/gpaylogo.png"
import { IoMdDownload } from "react-icons/io";
import paytmlogo from  "./images/paytmlogo.png";
import phonepelogo from "./images/phonepelogo.png"
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

  const [transactionId, setTransactionId] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const qrCodeRef = useRef();

  const generateQRCodeValue = () => {
    return `upi://pay?pa=9971299049@ibl&pn=${customerName}&am=${grandTotalforpayment}&cu=INR`;
  };

   const [isModal, setIsModal] = useState(false);

  useEffect(() => {
    setIsModal(true);
  }, []);

  const handleCloseModal = () => {
    setIsModal(false);
  };


  const handleDownloadQRCode = () => {
    if (qrCodeRef.current) {
      toPng(qrCodeRef.current)
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.href = dataUrl;
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

  const handleTransactionIdChange = (e) => {
    setTransactionId(e.target.value);
  };

  const savePaymentDetails4 = async () => {
    try {
      const res = await axios.post('https://backendcafe-ceaj.onrender.com/api/payments', {
        paymentId: transactionId,
        cartforpayment,
        name: customerName,
        amount: grandTotalforpayment,
        customerTable,
        paymentmode: "UPI ",
        address: {
          houseNo,
          city,
          pincode,
          landmark
        },
        customerPhoneNo: customerPhone,
      });

      const paymentId = res.data._id; // Assuming _id is your payment object ID
      console.log('Payment details saved:', paymentId);
      navigate(`/Invoice/${paymentId}`);
      // Navigate to Invoice page with paymentId in URL
    } catch (error) {
      console.error('Error saving payment details:', error);
    }
  };

  const handleSubmit = () => {
    if (!transactionId) {
      setValidationMessage('Transaction ID/UTR is required.');
    } else {
      setValidationMessage('');
      setIsModalOpen(true);
    }
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    savePaymentDetails4();
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
    <div  >
      <div className="flex items-center shadow-lg shadow-gray-300">
        <div>
          <Link to="/bill">
            <img
              src={backarrowlogo}
              className='h-10 w-10 m-2'
            />
          </Link>
        </div>
        <div>
          <h1 className="text-3xl font-bold ml-12">UPI Payment</h1>
        </div>
      </div>

      <div className="container mx-auto p-2">
        <div className="flex flex-col items-center">
            <div className='flex flex-row gap-3 m-1 p-1 items-center'>
                <div>
                <img
                src={phonepelogo}
                className="h-12 w-12"
                />
                </div>
                <div>
                <img
                src={gpaylogo}
                className="h-12 w-12"
                />
                </div>
                <div>
                <img
                src={paytmlogo}
                className="h-12 w-12"
                />
                </div>
                
            </div>
          <div className="mb-4 flex flex-col items-center justify-center">
            <h2 className="text-lg font-bold text-center mb-2">Download QR Code to Pay</h2>
            <div className="relative p-4 bg-white shadow-lg shadow-[#f6931e] mb-4  animate-slideInFromBottom" ref={qrCodeRef}>
              <QRCode value={generateQRCodeValue()} />
            </div>
           <div className='flex flex-row justify-evenly'>
          <div>
          <h3>Name-{customerName}</h3>
          </div>
          <div className='ml-2'>
          <h3>Amount-{grandTotalforpayment}</h3>
          </div>
           </div>
            <button onClick={handleDownloadQRCode} className="mt-2 px-4 py-2 bg-black animate-slideInFromBottom  text-white rounded-lg" >
                
               <div className='flex flex-row'>
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
            <label className="block text-lg font-bold mb-2 text-center">Enter Transaction ID/UTR/UPI-ID</label>
            <input type="text" value={transactionId} onChange={handleTransactionIdChange} className="w-full h-10 border border-gray-500 rounded-lg p-2 focus:outline-[#f6931e]  focus:outline-none" />
          </div>
          {
            validationMessage && (
              <p className="text-red-500 font-bold mb-2">{validationMessage}</p>
            )
          }
          <button onClick={handleSubmit} className="h-12 w-40 bg-[#f6931e]  animate-slideInFromBottom hover:bg-green-700 font-bold text-xl text-white rounded-lg transition duration-300">Submit</button>

          <div className="mt-8 w-full max-w-md">
            <ol className="list-decimal list-inside font-bold">
              <li>Download the QR code on your phone.</li>
              <li>Scan it through any UPI app like Paytm, Google Pay, or PhonePe, etc.</li>
              <li>Enter the Transaction ID/UTR for confirmation.</li>
              <li>It is 100% safe and secure gateway through SSL and bank partners.</li>
            </ol>
          </div>
        </div>
      </div>
      <Stepmodal isOpen={isModal} onClose={handleCloseModal} />
      {isModalOpen && (
        <Modal
          title="Confirm Payment"
          message="Are you sure you want to confirm the payment?"
          onConfirm={handleConfirm}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      <Footer/>
    </div>
  );
}

export default Upi;





