
create a schema in mongodb with name of customer with name,phone no, email ,password, timestamp,array of addreess with house no,street no,city ,state,oin code ,and landmark,  ,,,,create a login component full, and signup component , and Address input component with apis and also update password ,,,the signup should be done through nodemailer otp ,,,also user context functionality to manage the context of login customer so that he should enter the data again and again



password = uljt vkgm wdtj cask




import React, { useState, useContext, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import backarrowlogo from './images/backarrowlogo.png';
import deletelogo from './images/deletelogo.png';
import Modal from 'react-modal';
import { toPng } from 'html-to-image';
import QRCode from 'qrcode.react';
import closebutton from './images/closebutton.png';
import { CustomerContext } from './CustomerContext';
import { BuyerContext } from './components/Buyercontext.js';
import { MinOrderContext } from "./components/MinOrderContext.js";
import axios from 'axios';
import { removeToCart } from './redux/cartSlice.js';
import Calling from './Calling.js';
import Footer from './Footer.js';

Modal.setAppElement('#root');


function Billpart() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tableQueryParam = queryParams.get('table');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { minOrderValue, deliveryCharge } = useContext(MinOrderContext);

  const cartforpayment = useSelector((state) => state.cart.cart);
  const totalforpayment = cartforpayment
    .map((item) => item.price * item.quantity)
    .reduce((prev, curr) => prev + curr, 0);

  const grandTotalforpayment = totalforpayment < minOrderValue
    ? totalforpayment + deliveryCharge
    : totalforpayment;
  console.log(grandTotalforpayment);

  const [buyeraddress, setBuyerAddress] = useState([]);
  const { setCustomerName, setCustomerTable, setCustomerPhone, customerPhone, customerName, customerTable } = useContext(CustomerContext);
  const { buyer } = useContext(BuyerContext);
  
  const buyerEmail = buyer?.email || ""; // Default to empty string if buyer or email is undefined
console.log("The buyer email is ", buyerEmail);

  useEffect(() => {
    if (buyer) {
      setCustomerName(buyer.name || '');
      setCustomerPhone(buyer.phoneNo  || '');
    }
  }, [buyer, setCustomerName, setCustomerPhone]);

  useEffect(() => {
    if (buyerEmail) {
      axios.get(`https://backendcafe-ceaj.onrender.com/addresses?email=${buyerEmail}`)
        .then(response => {
          setBuyerAddress(response.data);
          if (response.data.length > 0) {
            setSelectedAddress(response.data[0]);
          }
        })
        .catch(error => console.error(error));
    }
  }, [buyerEmail]);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [validationMessage, setValidationMessage] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    if (tableQueryParam) {
      setCustomerTable(tableQueryParam);
    }
  }, [tableQueryParam, setCustomerTable]);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const savePaymentDetails2 = async () => {
    try {
      const response = await axios.post('http://localhost:1000/api/payments', {
        cartforpayment,
        name: customerName,
        amount: grandTotalforpayment,
        email: buyerEmail || "",
        customerTable: tableQueryParam ,
        paymentmode: "Cash-Not Received",
        address: selectedAddress,
        customerPhoneNo: customerPhone,
      });

      console.log(response.data);
      const paymentId = response.data._id;
      navigate(`/Invoice/${paymentId}`);
    } catch (error) {
      console.error('Error saving payment details:', error);
    }

  };

  const handleValidation = () => {
    if (!customerName || !customerPhone ) {
      setValidationMessage('All input fields are required.');
    } else {
      setValidationMessage('');
      navigate('/Upi', {
        state: {
          buyerEmail,
          customerName,
          customerPhone,
          customerTable,
          grandTotalforpayment,
          selectedAddress,
          cartforpayment,
        },
      });
    }
  };

  const generateQRCodeValue = () => {
    return `upi://pay?pa=9971299049@ibl&pn=${customerName}&am=${grandTotalforpayment}&cu=INR`;
  };

  const handleCashPayment = () => {
    if (!customerName || !customerPhone ) {
      setValidationMessage('All input fields are required.');
    } else {
      setValidationMessage('');
      savePaymentDetails2();
    }
  };

  const qrCodeRef = useRef();

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

  return (
    <div className='container mx-auto p-4'>
      {tableQueryParam === "Takeaway" && (
        <div>
          <h2 className='font-bold text-red-700 text-center'>In Billing mode, Select items for customer</h2>
          <Calling />
        </div>
      )}
      <div className='flex items-center mb-4'>
        <div className='mr-4'>
          {tableQueryParam && (
            <Link to={tableQueryParam === "table" ? "/table" : "/"}>
              <img src={backarrowlogo} className='h-10 w-10' alt="Back" />
            </Link>
          )}
        </div>
        <div className='flex-1 text-center'>
          <h1 className='font-bold text-2xl mb-2'>Bill Generated</h1>
        </div>
      </div>

      {cartforpayment.map((item, index) => (
        <div className='flex flex-row md:flex-row items-center bg-gray-200 shadow-xl shadow-gray-500 animate-slideInFromBottom rounded-2xl mb-4 p-4' key={index}>
          <div>
            <img src={item.image} alt={`Product ${index}`} className='h-20 w-20 rounded-2xl mb-4 md:mb-0' />
          </div>
          <div className='ml-2 md:ml-4 flex-1 p-2'>
            <p className='font-bold'>{item.name} (Size: {item.size})</p>
            <p>Price: {item.price}</p>
            <p>Rating: {item.rating}</p>
            <p>Quantity: {item.quantity}</p>
          </div>
          <div className="mb-12">
            <button onClick={() => dispatch(removeToCart(item))} className='ml-auto'>
              <img src={deletelogo} alt="Remove from Cart" className='h-10 w-10' />
            </button>
          </div>
        </div>
      ))}
      <div className='mt-4 text-center'>
        <h1 className='font-bold text-2xl'>Total Amount = {totalforpayment}</h1>
        <h1 className='font-bold text-2xl'>Grand Total = {grandTotalforpayment}</h1>
      </div>
      <div className='text-center mt-4'>
        <button onClick={openModal} className='h-12 w-60 bg-black text-white text-lg font-bold rounded-2xl'>
          Pay Now
        </button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center p-4 z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto p-6 rounded-lg shadow-lg relative max-h-full overflow-y-auto">
          <div className="flex justify-end items-start mb-4">
            <button onClick={closeModal}>
              <img src={closebutton} className="h-8 w-8 rounded-2xl" alt="Close" />
            </button>
          </div>
          <div className="space-y-6">
            <div>
              <h1 className="font-bold text-2xl text-center">Customer Details</h1>
              <label className="block text-sm font-bold mb-2">Customer Name:</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter Customer Name"
              />
              <label className="block text-sm font-bold mb-2">Customer Phone Number:</label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter Customer Phone"
              />
              {tableQueryParam==="undefined" && (
                <>
                  <label className="block text-sm font-bold mb-2">Select Address:</label>
                  <select
                    value={selectedAddress ? selectedAddress._id : ''}
                    onChange={(e) => {
                      const selected = buyeraddress.find((address) => address._id === e.target.value);
                      setSelectedAddress(selected);
                    }}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    {buyeraddress.map((address) => (
                      <option key={address._id} value={address._id}>
                        {address.houseNo}, {address.city}, {address.landmark}
                      </option>
                    ))}
                  </select>
                  <div className='mt-4'>
                    <button onClick={() => navigate("/Address")} className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-lg">
                      Add New Address
                    </button>
                  </div>
                </>
              )}
            </div>
            <div>
              <button
                onClick={handleValidation}
                className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-lg"
              >
                Pay with UPI
              </button>
            </div>
            <div>
              <button
                onClick={handleCashPayment}
                className="w-full px-4 py-2 bg-green-500 text-white font-bold rounded-lg"
              >
                Pay with Cash
              </button>
            </div>
            <div className="text-center mt-4">
              <div ref={qrCodeRef}>
                <QRCode value={generateQRCodeValue()} size={200} />
              </div>
              <button onClick={handleDownloadQRCode} className="mt-4 px-4 py-2 bg-purple-500 text-white font-bold rounded-lg">
                Download QR Code
              </button>
            </div>
          </div>
          {validationMessage && <div className="text-red-500 text-center mt-4">{validationMessage}</div>}
        </div>
      </Modal>
    </div>
  );
}

export default Billpart;
