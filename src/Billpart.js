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
import {MinOrderContext} from "./components/MinOrderContext.js"
import {UPIDetailsContext} from "./components/UPIDetailsContext.js";
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
   const { upinumber , upiname } = useContext(UPIDetailsContext);
   console.log(upinumber);
   console.log(upiname);

  const cartforpayment = useSelector((state) => state.cart.cart);
  const totalforpayment = cartforpayment
    .map((item) => item.price * item.quantity)
    .reduce((prev, curr) => prev + curr, 0);

    
     // Check if tableQueryParam is null or explicitly set to "undefined"
  const isTableParamMissing = tableQueryParam === null || tableQueryParam === 'undefined';

  // Calculate grand total
  const grandTotalforpayment =
    isTableParamMissing && totalforpayment < minOrderValue
      ? totalforpayment + deliveryCharge
      : totalforpayment;

  

  
  const [buyeraddress, setBuyerAddress] = useState([]);
  const { setCustomerName, setCustomerTable, setCustomerPhone, customerPhone, customerName, customerTable } = useContext(CustomerContext);
  const { buyer } = useContext(BuyerContext);

  const buyerEmail = buyer?.email || "";
  console.log("the buyer email is ", buyerEmail);

  // Fetch buyer addresses when component mounts or buyerEmail changes
  useEffect(() => {
    if (buyerEmail) {
      axios.get(`https://backendcafe-ceaj.onrender.com/addresses?email=${buyerEmail}`)
        .then(response => {
          setBuyerAddress(response.data);
          if (response.data.length > 0) {
            setSelectedAddress(response.data[0]); // Set the first address as default
          }
        })
        .catch(error => console.error(error));
    }
  }, [buyerEmail]);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [validationMessage, setValidationMessage] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Set customer table when tableQueryParam changes
  useEffect(() => {
    if (buyer) {
      setCustomerName(buyer.name || '');
      setCustomerPhone(buyer.phoneNo  || '');
    }
  }, [buyer, setCustomerName, setCustomerPhone]);

  useEffect(() => {
    // Check if tableQueryParam is defined and not an empty string
    if (tableQueryParam && tableQueryParam !== "undefined") {
      setCustomerTable(tableQueryParam);
    } else {
      setCustomerTable("Website");
    }
  }, [tableQueryParam]);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const savePaymentDetails2 = async () => {
    try {
      const response = await axios.post('https://backendcafe-ceaj.onrender.com/api/payments', {
        cartforpayment,
        name: customerName,
        amount:grandTotalforpayment,
        email: buyerEmail || "",
        customerTable,
        paymentmode: "Cash-Not Received",
        address: selectedAddress || "",
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
    if (!customerName || !customerPhone) {
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
    // Default values as fallback in case UPI details are missing
    const payAddress = upinumber || '9971299049@ibl'; // Example fallback UPI address
    const payName = upiname || 'Default Name';        // Example fallback UPI name
    
    // Constructing the UPI payment string using the context values
    return `upi://pay?pa=${payAddress}&pn=${payName}&am=${grandTotalforpayment}&cu=INR`;
  };

  const handleCashPayment = () => {
    if (!customerName || !customerPhone) {
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
  const backLinkUrl = tableQueryParam && tableQueryParam !== 'undefined' && tableQueryParam.trim() !== ''
    ? `/${tableQueryParam}`
    : '/'; 

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
            <Link to= {backLinkUrl}>
              <img src={backarrowlogo} className='h-10 w-10' alt="Back" />
            </Link>
          )}
        </div>
        <div className='flex-1 text-center'>
          <h1 className='font-bold text-2xl mb-2'>Bill  Generated</h1>
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
              <h1 className="font-bold text-lg mb-2">Enter name</h1>
              <input
                type="text"
                value={customerName}
                className="h-10 w-full border border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
                required
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <div>
              <h1 className="font-bold text-lg mb-2">Enter Mobile No.</h1>
              <input
                type="number"
                value={customerPhone}
                className="h-10 w-full border border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
                required
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>
            {tableQueryParam === "undefined" && buyeraddress.length > 0 && (
              <div>
                <h1 className="font-bold text-lg mb-2">Select an Address</h1>
                <select
                  value={selectedAddress ? JSON.stringify(selectedAddress) : ""}
                  onChange={(e) => setSelectedAddress(JSON.parse(e.target.value))}
                  className="h-10 w-full border border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
                >
                  {buyeraddress.map((address, index) => (
                    <option key={index} value={JSON.stringify(address)}>
                      {`${address.houseNo}, ${address.streetNo}, ${address.city}, ${address.state}, ${address.pincode}, ${address.landmark}`}
                    </option>
                  ))}
                </select>
                <div className="mt-4">
                  <Link to="/Address">
                    <button className="h-10 w-full bg-green-500 text-white font-bold rounded-lg">
                      Add New Address
                    </button>
                  </Link>
                </div>
              </div>
            )}
            {validationMessage && (
              <div className="text-red-500 font-bold mb-2">
                {validationMessage}
              </div>
            )}
            <div className="flex justify-center space-x-4">
              <button onClick={handleValidation} className="h-10 w-full bg-blue-500 text-white font-bold rounded-lg">
                Pay with UPI
              </button>
              <button onClick={handleCashPayment} className="h-10 w-full bg-blue-500 text-white font-bold rounded-lg">
                Cash Payment
              </button>
            </div>
          </div>
          {tableQueryParam==="Takeaway" && (
          
                <div ref={qrCodeRef} className="text-center mt-6">
                <QRCode value={generateQRCodeValue()} size={256} />
                <button onClick={handleDownloadQRCode} className="mt-4 bg-green-500 text-white p-2 rounded-lg">
                  Download QR Code
                </button>
              </div>
          )
          }
        
        </div>
      </Modal>
      <Footer/>
    </div>
  );
}

export default Billpart;