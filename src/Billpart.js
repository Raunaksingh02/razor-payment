import React, { useState, useContext, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import backarrowlogo from './images/backarrowlogo.png';
import deletelogo from './images/deletelogo.png';
import Modal from 'react-modal';
import { toPng } from 'html-to-image';
import { IoLogoWhatsapp } from "react-icons/io";
import QRCode from 'qrcode.react';
import closebutton from './images/closebutton.png';
import { CustomerContext } from './CustomerContext';
import { BuyerContext } from './components/Buyercontext.js';
import {MinOrderContext} from "./components/MinOrderContext.js"
import {UPIDetailsContext} from "./components/UPIDetailsContext.js";
import {CouponContext} from "./components/CouponContext.js";
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
   const { coupons } = useContext(CouponContext);
  

  console.log("the coupon in billpart is ", coupons);
  
  const [finalprice,setfinalprice]= useState(0);


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
  const { setCustomerName, setCustomerTable, setCustomerPhone, customerPhone, customerName, customerTable ,paymentmode1,setpaymentmode1} = useContext(CustomerContext);
  const { buyer } = useContext(BuyerContext);
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false); 


  const buyerEmail = buyer?.email || "";
  console.log("the buyer email is ", buyerEmail);




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


  const openConfirmModal = () => setConfirmModalIsOpen(true); // Open confirmation modal
  const closeConfirmModal = () => setConfirmModalIsOpen(false); // Close confirmation modal


  const savePaymentDetails2 = async () => {
    try {
      const response = await axios.post('https://backendcafe-ceaj.onrender.com/api/payments', {
        cartforpayment,
        name: customerName,
        amount: finalprice,
        email: buyerEmail || "",
        customerTable,
        paymentmode: paymentmode1,
        discountamount: discountAmount,
        address: selectedAddress || "",
        customerPhoneNo: customerPhone,
      });
      const paymentId = response.data._id;
      navigate(`/Invoice/${paymentId}?paymentmode=${paymentmode1}&discountAmount=${discountAmount}`);
    } catch (error) {
      console.error('Error saving payment details:', error);
    }
};


  const handleValidation = () => {
    const phoneRegex = /^\d{10}$/; // Regular expression to check for exactly 10 digits
  
    if (!customerName || !customerPhone) {
      setValidationMessage('All input fields are required.');
    } else if (!phoneRegex.test(customerPhone)) {
      setValidationMessage('Customer Phone Number must be exactly 10 digits.');
    } else {
      setValidationMessage('');
      navigate('/Upi', {
        state: {
          buyerEmail,
          customerName,
          customerPhone,
          customerTable,
          finalprice,
          discountAmount,
          selectedAddress,
          cartforpayment,
        },
      });
    }
  };
  

  const generateQRCodeValue = () => {
    const payAddress = upinumber || '9971299049@ibl'; 
    const payName = upiname || 'Default Name';       
    return `upi://pay?pa=${payAddress}&pn=${payName}&am=${grandTotalforpayment}&cu=INR`;
  };

  const handleCashPayment = () => {
    const phoneRegex = /^\d{10}$/; // Regular expression to check for exactly 10 digits
  
    if (!customerName || !customerPhone) {
      setValidationMessage('All input fields are required.');
    } else if (!phoneRegex.test(customerPhone)) {
      setValidationMessage('Customer Phone Number must be exactly 10 digits.');
    } else {
      setValidationMessage('');
      openConfirmModal(); 
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


    const [selectedCoupon, setSelectedCoupon] = useState(null); // State for selected coupon
    const [discountAmount, setDiscountAmount] = useState(0); // State for calculated discount
  
    const calculateDiscount = () => {
      if (selectedCoupon &&  grandTotalforpayment >= (selectedCoupon.minOrderValue || 0)) {
        let discount = ( grandTotalforpayment * selectedCoupon.discountPercentage) / 100;
        discount = selectedCoupon.maxDiscountAmount ? Math.min(discount, selectedCoupon.maxDiscountAmount) : discount;
        
        setDiscountAmount(discount);
      } else {
        setDiscountAmount(0);
      }
    };
  
    useEffect(() => {
      calculateDiscount();
    }, [selectedCoupon, grandTotalforpayment]);

    useEffect(() => {
      setfinalprice(grandTotalforpayment - discountAmount);
    }, [discountAmount, grandTotalforpayment]);
  

    
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
        {isTableParamMissing && totalforpayment < minOrderValue && (
        <div className='flex flex-col items-center'>
          <h2 className='font-bold text-red-700 text-center mt-2'>
            Delivery Charge Added: ₹{deliveryCharge}
          </h2>
        </div>
      )}
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
              <h1 className="font-bold text-lg mb-2">Enter Whatsapp No for Invoice</h1>
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
        {coupons.length > 0 && (
         <div>
          <h2 className='font-bold text-lg mb-2'>Select a Coupon:</h2>
          <select
            value={selectedCoupon ? selectedCoupon._id : ''}
            onChange={(e) => {
                const coupon = coupons.find((coupon) => coupon._id === e.target.value);
                setSelectedCoupon(coupon || null);
            }}
            className='h-10 w-full border border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:outline-none'
             >
            <option value="" >
               Select Coupon
            </option>
            {coupons.map((coupon) => (
                <option key={coupon._id} value={coupon._id}>
                    {coupon.name} - {coupon.discountPercentage}% off -- (Minimun Order Value: ₹{coupon.minOrderValue})
                </option>
            ))}
              </select>
             {selectedCoupon && discountAmount > 0 && (
            <div>
                <p className='text-green-500 font-bold mt-2'>Discount Applied: ₹{discountAmount.toFixed(2)}</p>
                <p className='text-green-500 font-bold mt-2'>Grand Total: ₹{finalprice}</p>
            </div>
               )}
           </div>
             )}

            {validationMessage && (
              <div className="text-red-500 font-bold mb-2">
                {validationMessage}
              </div>
            )}
            <div className="flex justify-center space-x-4">
              <button onClick={handleValidation} className="h-10 w-full bg-[#f6931e] text-white font-bold rounded-lg">
                Pay with UPI
              </button>
              <button onClick={handleCashPayment} className="h-10 w-full bg-[#f6931e] text-white font-bold rounded-lg">
                Cash Payment
              </button>
            </div>
          </div>
      {tableQueryParam === "Takeaway" && (
       <div 
       ref={qrCodeRef} 
      className="flex flex-col items-center justify-center mt-6 mx-auto p-4 max-w-xs"
      >
      <QRCode 
      value={generateQRCodeValue()} 
      size={256} 
      className="mb-4 w-full max-w-[256px] h-auto"
     />
       <button 
      onClick={handleDownloadQRCode} 
      className="mt-4 bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg w-full max-w-xs"
       >
      Download QR Code
        </button>
       </div>
            )}

        
        </div>
      </Modal>
      <Modal
  isOpen={confirmModalIsOpen}
  onRequestClose={closeConfirmModal}
  className="fixed inset-0 flex items-center justify-center px-4"
>
  <div className="bg-white w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl p-8 md:p-10 lg:p-12 rounded shadow-lg text-center">
    <h2 className="text-2xl md:text-3xl font-extrabold mb-6">Confirm Order?</h2>
    <div className="flex justify-center m-2">
     <div className='ml-2' >
          <button
        className="bg-red-500 text-white p-3 md:px-8 md:py-4 rounded-2xl  font-bold hover:bg-red-700"
        onClick={closeConfirmModal}

      >
        Cancel
      </button>
      </div>
      <div className='ml-3'>
        <button
        className="bg-[#f6931e] text-white p-3 md:px-8 md:py-4 rounded-2xl font-bold hover:bg-green-700 mr-4"
        onClick={savePaymentDetails2}
      >
      Submit
      </button>
      </div>
      </div>
      </div>
      </Modal>

      
      <Footer/>
       </div>
     );
}

export default Billpart;