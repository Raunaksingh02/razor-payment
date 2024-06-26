import React, { useState, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { emptyCart } from './redux/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import backarrowlogo from './images/backarrowlogo.png';
import deletelogo from './images/deletelogo.png';
import Modal from 'react-modal';
import closebutton from './images/closebutton.png';
import { CustomerContext } from './CustomerContext';
import axios from 'axios';

Modal.setAppElement('#root');

function Billpart() {
  const direct = useNavigate();

  const [orderId, setOrderId] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const dispatch = useDispatch();

  const cartforpayment = useSelector((state) => state.cart.cart);
  const totalforpayment = cartforpayment.map((item) => item.price * item.quantity).reduce((prev, curr) => prev + curr, 0);
  const grandTotalforpayment = totalforpayment + 50;
  const totalquantity = cartforpayment.map((item) => item.quantity).reduce((prev, curr) => prev + curr, 0);

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
        savePaymentDetails(orderId, response, customerName, grandTotalforpayment, customerPhone, customerTable, cartforpayment);
        alert("payment successful");
        direct('/Invoice');
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

  const savePaymentDetails = async (orderId, response, customerName, grandTotalforpayment, customerPhone, customerTable, cartforpayment) => {
    try {
      await axios.post('https://backendcafe-ceaj.onrender.com/api/payments', {
        orderId,
        paymentId: response.razorpay_payment_id,
        cartforpayment,
        name: customerName,
        amount: grandTotalforpayment,
        customerTable,
        paymentmode: "Online - Received",
        customerPhoneNo: customerPhone,
        
      });
    } catch (error) {
      console.error('Error saving payment details:', error);
    }
  };

  const savePaymentDetails2 = async () => {
    try {
      await axios.post('https://backendcafe-ceaj.onrender.com/api/payments', {
        cartforpayment,
        name: customerName,
        amount: grandTotalforpayment,
        customerTable,
        paymentmode: "Cash-Not Received",
        customerPhoneNo: customerPhone,
       
      });
      console.log('Payment details saved');
      alert("Payment details saved successfully");
      direct('/Invoice');
    } catch (error) {
      console.error('Error saving payment details:', error);
    }
  };

  const { setCustomerName, setCustomerTable, setCustomerPhone, customerPhone, customerName, customerTable } = useContext(CustomerContext);

  const handlename = (event) => {
    setCustomerName(event.target.value);
  };

  const handlePhoneNo = (event) => {
    setCustomerPhone(event.target.value);
  };

  const handleTableNo = (event) => {
    setCustomerTable(event.target.value);
  };

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const emptycartbutton = () => {
    dispatch(emptyCart());
  };

  return (
    <div>
      <div className='flex m-3'>
        <div className='mr-14'>
          <Link to="/">
            <img src={backarrowlogo} className='h-10 w-10' />
          </Link>
        </div>
        <div className='ml-23'>
          <h1 className='font-bold text-2xl'>Bill Generated</h1>
        </div>
        <div className="ml-12">
          <button onClick={emptycartbutton}>
            <img src={deletelogo} className='h-10 w-10' />
          </button>
        </div>
      </div>

      {cartforpayment.map((item, index) => (
        <div className='flex flex-row m-4 ml-3 p-4 bg-gray-200 shadow-xl shadow-gray-500 rounded-2xl' key={index}>
          <div>
            <img src={item.image} alt={`Product ${index}`} className='h-30 w-60' />
          </div>
          <div className='ml-4'>
            <p className='font-bold'>{item.name}</p>
            <p>Price: ${item.price}</p>
            <p>Category:{item.category}</p>
            <p>Rating:{item.rating}</p>
            <p>{item.description}</p>
            <p>Quantity: {item.quantity}</p>
          </div>
        </div>
      ))}

      <div className='mt-4'>
        <h1 className='font-bold text-2xl text-center'>Total Amount = {grandTotalforpayment}</h1>
        <button onClick={openModal} className='h-12 w-38 ml-32 p-3 mt-2 bg-black text-white font-bold rounded-lg'>
          Place Order
        </button>
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Example Modal">
        <div className='flex justify-end'>
          <button onClick={closeModal}>
            <img src={closebutton} className='h-6 w-8 rounded-2xl' />
          </button>
        </div>
        <div className="m-3 p-3">
          <div className='flex-col'>
            <div>
              <h1 className='font-bold m-2 text-lg'>Enter name</h1>
              <input type="text" value={customerName} className='h-10 w-60 border-2 border-black rounded-xl' required={true} onChange={handlename} />
            </div>
            <div>
              <h1 className='font-bold text-lg m-2'>Enter mobile no</h1>
              <input type="text" required={true} className='h-10 w-60 border-2 border-black rounded-xl' onChange={handlePhoneNo} value={customerPhone} />
            </div>
            <div className='flex ml-3 mt-4'>
              <div>
                <h1 className="font-bold text-lg">Choose table:</h1>
              </div>
              <div>
                <select required={true} onChange={handleTableNo} className="font-bold text-lg" name="table" value={customerTable}>
                  <option value="table 1">table 1</option>
                  <option value="table 2">table 2</option>
                  <option value="table 3">table 3</option>
                  <option value="table 4">table 4</option>
                </select>
              </div>
            </div>
            <div>
              <button onClick={loadRazorpay} className='h-12 w-30 bg-black font-bold text-xl p-3 ml-16 mt-5 text-white rounded-xl'>
                Pay Now
              </button>
              <button onClick={savePaymentDetails2} className='h-12 w-30 bg-black font-bold text-xl p-3 ml-16 mt-3 text-white rounded-xl'>
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
