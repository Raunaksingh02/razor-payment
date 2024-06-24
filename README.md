home page working page

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import cartlogo from "./images/cartlogo.png";
import user from "./images/user.png";
import { addToCart, removeToCart } from './redux/cartSlice.js';

function Homepage() {
    const [cafes, setCafes] = useState([]);
    const [quantities, setQuantities] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedPrices, setSelectedPrices] = useState([]);
   
    const dispatch = useDispatch();

    

   
    const cartfortotal = useSelector((state) => state.cart.cart);
    const totalquantityforhome = cartfortotal.map((item) => item.quantity).reduce((prev, curr) => prev + curr, 0);

    useEffect(() => {
        axios.get('https://backendcafe-ceaj.onrender.com/getdish')
            .then(response => {
                setCafes(response.data);
                
                setQuantities(Array(response.data.length).fill(0));
                setSelectedSizes(response.data.map(dish => dish.sizes[0]?.size || ''));
                setSelectedPrices(response.data.map(dish => dish.sizes[0]?.price || 0));
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const additemtocart = (item, size, price) => {
        dispatch(addToCart({ ...item, size, price }));
    };

    const removeitemtocart = (item, size, price) => {
        dispatch(removeToCart({ ...item, size, price }));
    };

    const increase = (index) => {
        const newQuantities = [...quantities];
        newQuantities[index] += 1;
        setQuantities(newQuantities);
    };

    const decrease = (index) => {
        if (quantities[index] > 0) {
            const newQuantities = [...quantities];
            newQuantities[index] -= 1;
            setQuantities(newQuantities);
        }
    };

    const handleSizeChange = (index, size) => {
        const newSelectedSizes = [...selectedSizes];
        const newSelectedPrices = [...selectedPrices];
        newSelectedSizes[index] = size;
        newSelectedPrices[index] = cafes[index].sizes.find(s => s.size === size).price;
        setSelectedSizes(newSelectedSizes);
        setSelectedPrices(newSelectedPrices);
    };

    return (
        <div className="container mx-auto p-4">
            <div className='flex items-center justify-between'>
                <h1 className="text-3xl font-bold text-center m-2">Cafe Coffee</h1>
                <div className='flex items-center'>
                    <Link to="/bill">
                        <img src={cartlogo} className='h-12 w-12' alt="cart logo" />
                    </Link>
                    <h1 className="font-bold text-red-500 text-2xl ml-2">{totalquantityforhome}</h1>
                    <Link to="/Owner">
                        <img src={user} className='h-10 w-10 ml-8 mt-1' alt="user icon" />
                    </Link>
                </div>
            </div>
           
            <div className="grid grid-cols-1   mt-3 ">
                {cafes.map((item, index) => (
                    <div className="flex flex-row bg-gray-100 rounded-2xl shadow-lg shadow-gray-400 p-4 mb-4" key={index}>
                        <img
                            className='w-full mt-4 p-2 h-48 object-cover  rounded-3xl'
                            src={item.image}
                            alt={item.name}
                        />
                        <div className='p-2'>
                            <h2 className="font-bold text-xl">{item.name}</h2>
                            <p>Category: {item.category}</p>
                            <p>Rating: {item.rating} stars</p>
                           <p className="font-bold">Price: {selectedPrices[index]}</p>
                            <div className="mt-2">
                                <label htmlFor={`size-select-${index}`} className="block text-sm  font-bold text-gray-700">Size:</label>
                                <select
                                    id={`size-select-${index}`}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    value={selectedSizes[index]}
                                    onChange={(e) => {
                                        const size = e.target.value;
                                        handleSizeChange(index, size);
                                    }}
                                >
                                    {item.sizes.map(size => (
                                        <option key={size.size} value={size.size} className="w-full " >
                                     
                                       <p className='mr-4' > {size.size}</p>
                                        </option>
                                    
                                    ))}
                                </select>
                            </div>
                            <p className="mt-2">{item.description}</p>
                            <div className='flex items-center mt-4'>
                                <button onClick={() => { increase(index); additemtocart(item, selectedSizes[index], selectedPrices[index]); }} className="h-10 w-10 bg-black text-white rounded-l-lg">+</button>
                                <h1 className='font-bold text-2xl mx-4'>{quantities[index]}</h1>
                                <button onClick={() => { decrease(index); removeitemtocart(item, selectedSizes[index], selectedPrices[index]); }} className="h-10 w-10 bg-black text-white rounded-r-lg">-</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Homepage;


working code of onwer file

import React,{useEffect,useState} from 'react';
import { Link } from 'react-router-dom';
import backarrowlogo from "./images/backarrowlogo.png"
import { io } from 'socket.io-client';

const socket = io("https://backendcafe-ceaj.onrender.com");

function Owner(props) {   
   const [requests, setRequests] = useState([]);

   useEffect(() => {
     socket.on('Request', (data) => {
       const newRequest = { ...data, time: new Date().toLocaleTimeString() };
       setRequests(prevRequests => [...prevRequests, newRequest]);
       playAlertSound();
     });
   }, []);
 
   const playAlertSound = () => {
     const audio = new Audio('/alertsound.mp3');
     audio.play();
   };
 
   const removeRequest = (index) => {
     setRequests(requests.filter((_, i) => i !== index));
   };
    
    return (
      <div>
      <div className=" bg-gray-100">
      <div className=" rounded shadow-md ">
        <h1 className="text-center text-2xl font-bold mb-6"></h1>
        {requests.map((request, index) => (
          <div key={index} className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Incoming Call from  {request.table}!</strong>
            <span className="block sm:inline"> {request.query} at {request.time}</span>
            <button
              onClick={() => removeRequest(index)}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>
        ))}
      </div>
    </div>
        <div>   
           <div className='flex items-center'>
         <Link to="/">
         <img
            src={backarrowlogo}
            className='h-10 w-10 m-2'
            />
         </Link>
           <h1 className="font-bold text-3xl text-center ml-10"> Admin Panel </h1>     
           </div>
              <div className="grid grid-cols-1 ">
              <Link to="/Order">
              <div className='m-3 p-3 border-2 border-black h-56 rounded-xl bg-black '>
                <h1 className='mt-14 text-center text-4xl font-mono font-bold text-white'>Order Details</h1>
             </div>
              </Link>
              <Link to="/Dishmanage">
               <div className='m-3 p-3 border-2 border-black h-56 rounded-xl bg-black '>
                <h1 className='mt-14 text-center text-4xl font-mono font-bold text-white'>Dish Management</h1> 
             </div>
             </Link>
             <Link to="/Waiter">            
              <div className='m-3 p-3 border-2 border-black h-56 rounded-xl bg-black '>
                <h1 className='mt-14 text-center text-4xl font-mono font-bold text-white'>Waiter Request</h1>
             </div>
             </Link>

              </div>
        </div>
        </div>
    );
}

export default Owner;


homepage div of dish

<div className="grid grid-cols-1 mt-3 ">
                {filteredCafes.map((item, index) => (
                    <div className="flex flex-row bg-gray-100 rounded-2xl shadow-lg shadow-gray-400 p-4 mb-4" key={index}>
                        <img
                            className='w-full mt-4 p-2 h-48 object-cover rounded-3xl'
                            src={item.image}
                            alt={item.name}
                        />
                        <div className='p-2'>
                            <h2 className="font-bold text-xl">{item.name}</h2>
                            <p>Category: {item.category}</p>
                            <p>Rating: {item.rating} stars</p>
                            <p className="font-bold">Price: {selectedPrices[cafes.indexOf(item)]}</p>
                            <div className="mt-2">
                                <label htmlFor={`size-select-${index}`} className="block text-sm font-bold text-gray-700">Size:</label>
                                <select
                                    id={`size-select-${index}`}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    value={selectedSizes[cafes.indexOf(item)]}
                                    onChange={(e) => {
                                        const size = e.target.value;
                                        handleSizeChange(cafes.indexOf(item), size);
                                    }}
                                >
                                    {item.sizes.map(size => (
                                        <option key={size.size} value={size.size} className="w-full">
                                            {`${size.size} - $${size.price}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <p className="mt-2">{item.description}</p>
                            <div className='flex items-center mt-4'>
                                <button onClick={() => { increase(cafes.indexOf(item)); additemtocart(item, selectedSizes[cafes.indexOf(item)], selectedPrices[cafes.indexOf(item)]); }} className="h-10 w-10 bg-black text-white rounded-l-lg">+</button>
                                <h1 className='font-bold text-2xl mx-4'>{quantities[cafes.indexOf(item)]}</h1>
                                <button onClick={() => { decrease(cafes.indexOf(item)); removeitemtocart(item, selectedSizes[cafes.indexOf(item)], selectedPrices[cafes.indexOf(item)]); }} className="h-10 w-10 bg-black text-white rounded-r-lg">-</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
                </div>



invoice working componet


import React, { useContext ,useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import html2canvas from "html2canvas";
import jsPDF from 'jspdf';
import {CustomerContext} from './CustomerContext.js'; // Import your context here

function Invoicecompo() {

    const pdfRef = useRef();

    const downloadPDF = () => {
        const input = pdfRef.current;
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4', true);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            let imgWidth = canvas.width;
            let imgHeight = canvas.height;
    
            let imgX = 0;
            let imgY = 0;
            let imgRatio = 1;
    
            if (imgWidth > pdfWidth || imgHeight > pdfHeight) {
                imgRatio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
              imgWidth = imgWidth*imgRatio;
               imgHeight = imgHeight*imgRatio;
            }
    
            imgX = (pdfWidth - imgWidth) / 2;
            imgY = (pdfHeight - imgHeight) / 2;
    
            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth, imgHeight);
            pdf.save('invoice.pdf');
        });
    }
    
    
  

    const { customerName, customerTable, customerPhone } = useContext(CustomerContext);
   
    const cartforinvoice = useSelector((state) => state.cart.cart);
    const totalforinvoice = cartforinvoice.map((item) => item.price * item.quantity).reduce((prev, curr) => prev + curr, 0);
    const grandTotalforinvoice = totalforinvoice + 50; // Assuming 50 is some additional charge (like tax or delivery fee)
   
    return (
        <div>
        <div 
        ref={pdfRef}
        className='max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
            <div
            className='text-center mb-4'>
                <h1 className='text-2xl font-extrabold'>Invoice</h1>
                <h1 className='text-2xl font-bold mt-3 '>Cafe House</h1>
            </div>
            <div className='mb-4'>
                <p><strong>Customer Name:</strong> {customerName}</p>
            <p><strong>Customer Table:</strong> {customerTable ? customerTable : 'Table 1'}</p>
                <p><strong>Customer Phone:</strong> {customerPhone}</p>
            </div>
            <table className='w-full mb-4'>
                <thead>
                    <tr>
                        <th className='border px-4 py-2'>Item</th>
                        <th className='border px-4 py-2'>Price</th>
                        <th className='border px-4 py-2'>Quantity</th>
                        <th className='border px-4 py-2'>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {cartforinvoice.map((item, index) => (
                        <tr key={index}>
                            <td className='border px-4 py-2'>{item.name}</td>
                            <td className='border px-4 py-2'>${item.price}</td>
                            <td className='border px-4 py-2'>{item.quantity}</td>
                            <td className='border px-4 py-2'>${(item.price * item.quantity)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan='3' className='border px-4 py-2 text-right'>Subtotal:</td>
                        <td className='border px-4 py-2'>${totalforinvoice}</td>
                    </tr>
                    <tr>
                        <td colSpan='3' className='border px-4 py-2 text-right'>Additional Charges:</td>
                        <td className='border px-4 py-2'>50.00</td>
                    </tr>
                    <tr>
                        <td colSpan='3' className='border px-4 py-2 text-right font-bold'>Grand Total:</td>
                        <td className='border px-4 py-2 font-bold'>{grandTotalforinvoice}</td>
                    </tr>
                   
                </tfoot>
            </table>
        </div>
       <div>
<button 
 onClick={downloadPDF} 
 className='h-16 w-28 p-3 m-3 ml-24 pb-1 border-2 border-black bg-black text-white rounded-xl font-bold  '>
 Download Bill
</button>
    </div>
     </div>

    );
}

export default Invoicecompo;


payment component


import React, { useEffect, useState ,useRef} from 'react';
import axios from 'axios';
import { useNavigate ,Link} from 'react-router-dom';
import backarrowlogo from './images/backarrowlogo.png';
import { io } from 'socket.io-client';

const socket = io("https://backendcafe-ceaj.onrender.com");


const PaymentDetails = () => {


    const [payments, setPayments] = useState([]); 
    const [loading, setLoading] = useState(true);

    const [requests, setRequests] = useState([]);
  const audioRef = useRef(new Audio('/alertsound.mp3'));

  useEffect(() => {
    socket.on('Request', (data) => {
      const newRequest = { ...data, time: new Date().toLocaleTimeString() };
      setRequests(prevRequests => [...prevRequests, newRequest]);
      playAlertSound();
    });

    return () => {
      socket.off('Request');
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playAlertSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Ensure the sound plays from the start
      audioRef.current.play();
    }
  };

  const removeRequest = (index) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setRequests(requests.filter((_, i) => i !== index));
  };

    
    const move= useNavigate();
    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await axios.get('https://backendcafe-ceaj.onrender.com/api/payments');
                setPayments(response.data);
            } catch (error) {
                console.error("There was an error fetching the payments!", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, [payments]);

    const handleDelete = async (paymentId) => {
      try {
          console.log(paymentId);
          const response = await axios.delete(`https://backendcafe-ceaj.onrender.com/${paymentId}`);
          console.log('Delete response:', response);
          // Filter out the deleted payment from the state
          setPayments(payments.filter(payment => payment._id !== paymentId));
      } catch (error) {
          console.error('There was an error deleting the payment!', error);
          if (error.response) {
              console.error('Error response data:', error.response.data);
              console.error('Error response status:', error.response.status);
              console.error('Error response headers:', error.response.headers);
          } else if (error.request) {
              console.error('Error request data:', error.request);
          } else {
              console.error('Error message:', error.message);
          }
      }
  };

    if (loading) {
        return <div className="font-bold text-center">Loading the data..... please wait</div>
    }
    const handlemove=(_id)=>{
        console.log(_id);
        move(`/update/${_id}`);

    }

    return (
        <div>
             <div>
        {requests.map((request, index) => (
          <div key={index} className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Incoming Call from {request.table}!</strong>
            <span className="block sm:inline"> {request.query} at {request.time}</span>
            <button
              onClick={() => removeRequest(index)}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>
        ))}
      </div>
            <div className="flex items-center" >
              <div>
              <Link to="/Owner">
              <img
            src={backarrowlogo}
            className='h-10 w-10 m-2'
            />
            </Link>
                        </div>

                        <div >
                      <h1 className=" text-3xl font-bold ml-12" >Order Details</h1>
                    </div>
                </div>
        <div className="container mx-auto p-6">
        <div>
            {payments.map(payment => (
                <div key={payment.paymentId} className='border-2 border-gray-300 rounded-lg shadow-lg m-4 p-6'>
                    <h1 className="text-xl font-semibold">PaymentId: {payment.paymentId}</h1>
                    <h1 className="text-lg font-semibold">Name: {payment.name}</h1>
                    <h1 className="text-lg">Customer Table: {payment.customerTable}</h1>
                    <h1 className="text-lg">Amount: {payment.amount}</h1>
                    <h1 className="text-lg">Contact No: {payment.customerPhoneNo}</h1>
                    <h1 className="text-lg">Date: {new Date(payment.date).toLocaleDateString()}</h1>
                    <h1 className="text-lg">Time: {new Date(payment.date).toLocaleTimeString()}</h1>
                    
                    <h1 className={`text-lg ${payment.status === 'pending' ? 'text-red-400' : 'text-green-500'}`}>
                        Status: {payment.status}
                    </h1>
                    <div className="mt-4">
                        {payment.cartforpayment.map(item => (
                            <div key={item.id} className='border-2 border-gray-200 rounded-md shadow-md m-3 p-3'>
                                <h2 className="text-md font-medium">Item Name: {item.name}</h2>
                                <h3 className="text-sm">Category: {item.category}</h3>
                                <h3 className="text-sm">Rating: {item.rating}</h3>
                                <h4 className="text-sm font-semibold">Price: {item.price}</h4>
                                <h4 className="text-sm font-semibold">Size: {item.size}</h4>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-around mt-4">
                        <button
                            onClick={() => handleDelete(payment.paymentId)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => handlemove(payment._id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                        >
                            Update
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
    </div>
    );
};

export default PaymentDetails;





















