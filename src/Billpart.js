import React,{useState,useContext,useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {  emptyCart } from './redux/cartSlice';
import { Link ,useNavigate} from 'react-router-dom';
import backarrowlogo from './images/backarrowlogo.png';
import deletelogo from "./images/deletelogo.png";
import Modal from 'react-modal';
import closebutton from './images/closebutton.png';
import { CustomerContext } from './CustomerContext';

import axios from 'axios';

Modal.setAppElement('#root');

function Billpart() {
  
  const direct = useNavigate();

  const [orderId, setOrderId] = useState('');
  const [paymentId,setpaymentId]= useState('');
//  const {customerName,customerTable, customerPhone} = useContext(CustomerContext);
   
   const dispatch = useDispatch();

   const cartforpayment = useSelector((state) => state.cart.cart);
   console.log("cart item for payment",cartforpayment
  );
 
   const totalforpayment = cartforpayment.map((item) => item.price * item.quantity).reduce((prev, curr) => prev + curr, 0);
   const grandTotalforpayment = totalforpayment + 50;
   
   const totalquantity = cartforpayment.map((item)=>item.quantity).reduce((prev,curr) => prev + curr, 0);

   console.log(totalquantity,"total quantity");

   useEffect(() => {
   const fetchOrder = async () => {
     try {
       const response = await axios.post('http://localhost:1000/api/orders');
       const { orderId } = response.data;
       console.log('Order ID:', orderId); // Debug log
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
     console.log('Razorpay script loaded');
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
     handler: response => {
       console.log('Payment successful:', response);
       setpaymentId(response.razorpay_payment_id);
       console.log(response.razorpay_payment_id) 
        console.log(customerTable);
       savePaymentDetails(orderId,response,customerName,grandTotalforpayment,customerPhone,customerTable,cartforpayment);
       alert("payment successfull");
       direct('/Invoice');
      
      
     },
     prefill: {
       name:"Anchal",
       email: 'rs3297275@gmail.com',
       contact:customerPhone,
     },
     theme: {
       color: '#F37254',
     },
   };

   console.log('Razorpay options:', options); // Debug log
   const razorpay = new window.Razorpay(options);
   razorpay.open();

   const savePaymentDetails = async ( orderId,response,customerName,grandTotalforpayment,customerPhone,customerTable,cartforpayment) => {
       console.log(response);
       
     try {
       await axios.post('https://backendcafe-ceaj.onrender.com/api/payments', { 
         orderId,
          paymentId:response.razorpay_payment_id ,  
         cartforpayment:cartforpayment,
         name : customerName,       
         amount: grandTotalforpayment, 
         customerTable:customerTable,
         customerPhoneNo:customerPhone,
       });
       console.log('Payment details saved'); // Debug log
     } catch (error) {
       console.error('Error saving payment details:', error);
     }
   };
 };
  
const  {setCustomerName,setCustomerTable,setCustomerPhone,customerPhone,customerName,customerTable}= useContext(CustomerContext);

const handlename=(event)=>{
    setCustomerName(event.target.value);
    console.log(customerName);
  }

const handlePhoneNo=(event)=>{
    setCustomerPhone(event.target.value);
    console.log(customerPhone);
  }

  const handleTableNo=(event)=>{
    setCustomerTable(event.target.value);
    console.log(customerTable);
  }

  const [modalIsOpen, setModalIsOpen] = useState(false);
    const openModal = () => {
      setModalIsOpen(true);
    };
  
    const closeModal = () => {
      setModalIsOpen(false);
    };


   
    const emptycartbutton=()=>{
      dispatch(emptyCart());
    }
   
    return (
           <div>
            <div className=' flex m-3 '>

            <div className='mr-14' >
            <Link to="/">
               <img
                src={backarrowlogo}
               className='h-10 w-10 '
             />
           </Link>
            </div >

              <div className=' ml-23'>
                <h1 className='font-bold text-2xl '>Bill Generated</h1>
              </div>
              <div className="ml-12">
              <button onClick={emptycartbutton}>
              <img
                src={deletelogo}
                className='h-10 w-10 '
               />
              </button>
                </div>/

                <div>
                 
                </div>
            </div>
             {
            cartforpayment.map((item, index) => (
                <div className='flex flex-row m-3 ' key={index}>
                   <div>
                   <img
                        src={item.image}
                        alt={`Product ${index}`}
                        className='h-30 w-60'
                    />
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
                ))   
              }
                 <div>
                    <h1 className='font-bold text-2xl text-center'>Total Amount ={grandTotalforpayment}</h1>
                    <button 
                     onClick={openModal}
                    className='h-12 w-34 ml-32 p-3 mt-2  bg-black text-white font-bold rounded-lg'>
                     Pay Now
                    </button>
                    </div> 
                    <div>
    
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
       <div className='flex justify-end'>
     <button 
      onClick={closeModal}>
        <img
        src={closebutton}
        className='h-6 w-8 rounded-2xl '
        />
      </button>
     </div>

    <div className="m-3 p-3  ">
     <div className='flex-col '> 
    

       <div>
       <h1 className='font-bold m-2 text-lg'>Enter name</h1>
        <input
        type="text"
        value={customerName}
        className='h-10 w-60 border-2 border-black rounded-xl'
        required={true}
        onChange={handlename}

        />
       </div>
        <div>
        <h1 className='font-bold text-lg m-2'>Enter mobile no</h1>
        <input
        type="text"
        required={true}
        className='h-10 w-60 border-2 border-black rounded-xl'
        onChange={handlePhoneNo}
        value={customerPhone}
        />
        </div>

        <div className='flex ml-3 mt-4'>
        <div>
        <h1 className="font-bold text-lg">Choose table:</h1>
        </div>
        <div>
        <select required="true" 
        onChange={handleTableNo}
        className="font-bold text-lg" 
        name="table" value={customerTable}>
        <option value="table 1">table 1</option>
        <option value="table 2">table 2</option>
        <option value="table 3">table 3</option>
        <option value="table 4">table 4</option>
        </select>
        </div>
        </div>

        <div>
          <button
          onClick={loadRazorpay}
          className='h-12 w-30 bg-black font-bold text-xl p-3 ml-16 mt-5 text-white rounded-xl '>
            Pay Now
          </button  >
         
        </div>
         
    </div>
     </div>
     {/*   <button onClick={loadRazorpay}>Pay Now</button>
         */}
      </Modal>
     
    </div>
               </div>
    );
}

export default Billpart;
















