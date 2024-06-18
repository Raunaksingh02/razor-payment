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
                                <label htmlFor={`size-select-${index}`} className="block text-sm font-medium font-bold text-gray-700">Size:</label>
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














