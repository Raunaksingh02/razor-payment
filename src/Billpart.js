import React, { useState, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import backarrowlogo from './images/backarrowlogo.png';
import deletelogo from './images/deletelogo.png';
import Modal from 'react-modal';
import closebutton from './images/closebutton.png';
import { CustomerContext } from './CustomerContext';
import axios from 'axios';
import { removeToCart } from './redux/cartSlice.js';

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
  };

  const handleRemove = (item) => {
    dispatch(removeToCart(item));
  };


  

  return (
    <div className='container mx-auto p-4'>
      <div className='flex items-center mb-4'>
        <div className='mr-4'>
          <Link to="/">
            <img src={backarrowlogo} className='h-10 w-10' alt="Back" />
          </Link>
        </div>
        <div className='flex-1 text-center'>
          <h1 className='font-bold text-2xl'>Bill Generated</h1>
        </div>
      </div>

      {cartforpayment.map((item, index) => (
        <div className='flex flex-row md:flex-row items-center bg-gray-200 shadow-xl shadow-gray-500 rounded-2xl mb-4 p-4' key={index}>
          <div>
            <img src={item.image} alt={`Product ${index}`} className='h-40 w-40 rounded-2xl mb-4 md:mb-0' />
          </div>
          <div className='ml-0 md:ml-4 flex-1 p-2'>
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
        <h1 className='font-bold text-2xl'>Total Amount = {grandTotalforpayment}</h1>
        <button onClick={openModal} className='h-12 w-38 p-3 mt-2 bg-black text-white font-bold rounded-lg'>
          Place Order
        </button>
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Example Modal">
        <div className='flex justify-end'>
          <button onClick={closeModal}>
            <img src={closebutton} className='h-6 w-8 rounded-2xl' alt="Close" />
          </button>
        </div>
        <div className="m-3 p-3">
          <div className='flex-col'>
            <div>
              <h1 className='font-bold m-2 text-lg'>Enter name</h1>
              <input type="text" value={customerName} className='h-10 w-60 border-2 border-black rounded-xl' required onChange={handlename} />
            </div>
            <div>
              <h1 className='font-bold text-lg m-2'>Enter mobile no</h1>
              <input type="text" required className='h-10 w-60 border-2 border-black rounded-xl' onChange={handlePhoneNo} value={customerPhone} />
            </div>
           
            {tableQueryParam === "undefined" && (
              <>
                <div>
                  <h1 className='font-bold text-lg m-2'>House No</h1>
                  <input type="text" required className='h-10 w-60 border-2 border-black rounded-xl' onChange={handleHouseNo} value={houseNo} />
                </div>
                <div>
                  <h1 className='font-bold text-lg m-2'>City</h1>
                  <input type="text" required className='h-10 w-60 border-2 border-black rounded-xl' onChange={handleCity} value={city} />
                </div>
                <div>
                  <h1 className='font-bold text-lg m-2'>Pincode</h1>
                  <input type="text" required className='h-10 w-60 border-2 border-black rounded-xl' onChange={handlePincode} value={pincode} />
                </div>
                <div>
                  <h1 className='font-bold text-lg m-2'>Landmark</h1>
                  <input type="text" required className='h-10 w-60 border-2 border-black rounded-xl' onChange={handleLandmark} value={landmark} />
                </div>
              </>
            )}

            {tableQueryParam === "table" && (
              <div className='flex ml-3 mt-4'>
                <h1 className="font-bold text-lg">Choose table:</h1>
                <select required onChange={handleTableNo} className="font-bold text-lg ml-2" name="table" value={customerTable}>
                  <option value="table 1">table 1</option>
                  <option value="table 2">table 2</option>
                  <option value="table 3">table 3</option>
                  <option value="table 4">table 4</option>
                </select>
              </div>
            )}
   
           

            <div className='flex flex-col items-center mt-5'>
              <button onClick={loadRazorpay} className='h-12 w-30 bg-black font-bold text-xl p-3 mt-3 text-white rounded-xl'>
                Pay Now
              </button>
              <button onClick={savePaymentDetails2} className='h-12 w-30 bg-black font-bold text-xl p-3 mt-3 text-white rounded-xl'>
                Pay Cash
              </button>
              
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Billpart;
