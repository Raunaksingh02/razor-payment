import React, { useState, useContext, useEffect,useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import backarrowlogo from './images/backarrowlogo.png';
import deletelogo from './images/deletelogo.png';
import Modal from 'react-modal';
import { toPng } from 'html-to-image';
import QRCode from 'qrcode.react';
import closebutton from './images/closebutton.png';
import { CustomerContext } from './CustomerContext';
import axios from 'axios';
import { removeToCart } from './redux/cartSlice.js';
import Calling from './Calling.js';
import Footer from './Footer.js';

Modal.setAppElement('#root');

function Billpart() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tableQueryParam = queryParams.get('table');
  console.log("the table query is" , tableQueryParam);
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const dispatch = useDispatch();
  const cartforpayment = useSelector((state) => state.cart.cart);
  const totalforpayment = cartforpayment.map((item) => item.price * item.quantity).reduce((prev, curr) => prev + curr, 0);
  const grandTotalforpayment = totalforpayment + 50;
  const totalquantity = cartforpayment.map((item) => item.quantity).reduce((prev, curr) => prev + curr, 0);

  const { setCustomerName, setCustomerTable, setCustomerPhone, customerPhone, customerName, customerTable } = useContext(CustomerContext);
  const [houseNo, setHouseNo] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.post('http://localhost:1000/api/orders');
        const { orderId } = response.data;
        setOrderId(orderId);
        loadRazorpay();
      } catch (error) {
        console.error('Error creating order:', error);
      }
    };
    fetchOrder();
  }, []);

  useEffect(() => {
    if (tableQueryParam) {
      setCustomerTable(tableQueryParam);
    }
  }, [tableQueryParam]);

  const loadRazorpay = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      displayRazorpay();
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
    };
    document.body.appendChild(script);
  };

  const displayRazorpay = () => {
    const options = {
      key: 'rzp_test_ydI2Bc7GqGrH7b',
      amount: grandTotalforpayment * 100,
      currency: 'INR',
      name: customerName,
      description: 'Test Payment',
      order_id: orderId,
      handler: (response) => {
     setPaymentId(response.razorpay_payment_id);    
     savePaymentDetails(orderId, response, customerName, grandTotalforpayment, customerPhone, customerTable, cartforpayment, houseNo, city, pincode, landmark); 
    },

      prefill: {
        name: customerName,
        email: 'rs3297275@gmail.com',
        contact: customerPhone,
      },
      theme: {
        color: '#F37254',
      },
    };
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const savePaymentDetails = async (orderId, response, customerName, grandTotalforpayment, customerPhone, customerTable, cartforpayment, houseNo, city, pincode, landmark) => {
    try {
      const res = await axios.post('https://backendcafe-ceaj.onrender.com/api/payments', {
        orderId,
        paymentId: response.razorpay_payment_id,
        cartforpayment,
        name: customerName,
        amount: grandTotalforpayment,
        customerTable,
        paymentmode: "Online - Received",
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
      navigate(`/Invoice/${paymentId}`); // Navigate to Invoice page with paymentId in URL
    } catch (error) {
      console.error('Error saving payment details:', error);
    }
  };
  
  const savePaymentDetails2 = async () => {
    try {
      const response = await axios.post('https://backendcafe-ceaj.onrender.com/api/payments', {
        cartforpayment,
        name: customerName,
        amount: grandTotalforpayment,
        customerTable,
        paymentmode: "Cash-Not Received",
        address: {
          houseNo,
          city,
          pincode,
          landmark
        },
        customerPhoneNo: customerPhone,
    
      });
      const paymentId = response.data._id; // Assuming _id is your payment object ID
      console.log('Payment details saved');
      navigate(`/Invoice/${paymentId}`);
    } catch (error) {
      console.error('Error saving payment details:', error);
    }
  };

  const handlename = (event) => {
    setCustomerName(event.target.value);
  };

  const handlePhoneNo = (event) => {
    setCustomerPhone(event.target.value);
  };

  const handleTableNo = (event) => {
    setCustomerTable(event.target.value);
  };

  const handleHouseNo = (event) => {
    setHouseNo(event.target.value);
  };

  const handleCity = (event) => {
    setCity(event.target.value);
  };

  const handlePincode = (event) => {
    setPincode(event.target.value);
  };

  const handleLandmark = (event) => {
    setLandmark(event.target.value);
  };

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setValidationMessage('');
  };

  const handleRemove = (item) => {
    dispatch(removeToCart(item));
  };

  const isFormValid = () => {
    return customerName && customerPhone && (tableQueryParam !== "undefined" || (houseNo && city && pincode && landmark));
  };

  const handleValidation = () => {
    if (!isFormValid()) {
      setValidationMessage('All input fields are required.');
    } else {
      setValidationMessage('');
      navigate('/Upi', {
        state: {
          customerName,
          customerPhone,
          customerTable,
          grandTotalforpayment,
          houseNo,
          city,
          pincode,
          landmark,
          cartforpayment,
        },
      });
    }
  };
   
  const generateQRCodeValue = () => {
    return `upi://pay?pa=9971299049@ibl&pn=${customerName}&am=${grandTotalforpayment}&cu=INR`;
  };

  const handleCashPayment = () => {
    if (!isFormValid()) {
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
    <div className='container  mx-auto p-4'>
       {
                 tableQueryParam==="Takeaway" && (
                    <>
                    <div>
                        <h2 className='font-bold text-red-700 text-center '>In Billing mode ,Select items for customer </h2>
                        <Calling/>
                    </div>
                    
                    </>
                )
            }
      <div className='flex items-center mb-4 shadow-lg  shadow-gray-300'>
        <div className='mr-4'>
        
             {
              tableQueryParam==="table" && (
                 <>
                 <div>                  
                   <Link to="/table">
            <img src={backarrowlogo} className='h-10 w-10' alt="Back" />
          </Link>
          </div>

                 </>
             )
         }
            {
              tableQueryParam==="undefined" && (
                 <>
                 <div>                  
                   <Link to="/">
            <img src={backarrowlogo} className='h-10 w-10' alt="Back" />
          </Link>
          </div>

                 </>
             )
         }
          
          {
              tableQueryParam==="bill" && (
                 <>
                 <div>                  
                   <Link to="/">
            <img src={backarrowlogo} className='h-10 w-10' alt="Back" />
          </Link>
          </div>

                 </>
             )
         }
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
            <p>Price: ${item.price}</p>
            <p>Rating: {item.rating}</p>
            <p>Quantity: {item.quantity}</p>
          </div>
          <div className="mb-12">
            <button onClick={() => handleRemove(item)} className='ml-auto'>
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
          onChange={handlename}
        />
      </div>
      <div>
        <h1 className="font-bold text-lg mb-2">Enter Whatsapp no for invoice </h1>
        <input
          type="text"
          required
          className="h-10 w-full border border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
          onChange={handlePhoneNo}
          value={customerPhone}
        />
      </div>
      {tableQueryParam === "undefined" && (
        <>
          <div>
            <h1 className="font-bold text-lg mb-2">House No</h1>
            <input
              type="text"
              required
              className="h-10 w-full border border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
              onChange={handleHouseNo}
              value={houseNo}
            />
          </div>
          <div>
            <h1 className="font-bold text-lg mb-2">City</h1>
            <input
              type="text"
              required
              className="h-10 w-full border border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
              onChange={handleCity}
              value={city}
            />
          </div>
          <div>
            <h1 className="font-bold text-lg mb-2">Pincode</h1>
            <input
              type="text"
              required
              className="h-10 w-full border border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
              onChange={handlePincode}
              value={pincode}
            />
          </div>
          <div>
            <h1 className="font-bold text-lg mb-2">Landmark</h1>
            <input
              type="text"
              required
              className="h-10 w-full border border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
              onChange={handleLandmark}
              value={landmark}
            />
          </div>
        </>
      )}
      {tableQueryParam === "table" && (
        <div className="flex items-center mt-4">
          <h1 className="font-bold text-lg">Choose table:</h1>
          <select
            required
            onChange={handleTableNo}
            className="font-bold text-lg ml-2 border border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
            name="table"
            value={customerTable}
          >
            <option value="table 1">table 1</option>
            <option value="table 2">table 2</option>
            <option value="table 3">table 3</option>
            <option value="table 4">table 4</option>
            <option value="table 5">table 5</option>
            <option value="table 6">table 6</option>
            <option value="table 7">table 7</option>
            <option value="table 8">table 8</option>
            <option value="table 9">table 9</option> 
            <option value="table 10">table 10</option>
          </select>
        </div>
      )}
    
      {tableQueryParam === "Takeaway" && (
          <div className="mb-4 flex flex-col items-center justify-center">
          <h2 className="text-lg font-bold text-center mb-2">Scan QR Code to Pay</h2>
          <div className="relative p-4 bg-white animate-slideInFromBottom" ref={qrCodeRef}>
            <QRCode value={generateQRCodeValue()} />
          </div>
          <button
            onClick={handleDownloadQRCode}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Download QR Code
          </button>
        </div>
   )}

     
      <div className="flex flex-col items-center mt-5 space-y-3">
        <button
          onClick={handleValidation}
          className="h-12 w-40 bg-blue-600 hover:bg-blue-700 font-bold text-xl text-white rounded-lg transition duration-300"
        >
         Pay Now
        </button>
        <button
          onClick={handleCashPayment}
          className="h-12 w-40 bg-blue-600 hover:bg-blue-700  font-bold text-xl text-white rounded-lg transition duration-300"
        >
          Pay Cash
        </button>
        {validationMessage && (
          <p className="text-red-500 font-bold mt-2">{validationMessage}</p>
        )}
         </div>
          </div>
          </div>
          </Modal> 
          <Footer/>
    </div>
  );
}

export default Billpart;
