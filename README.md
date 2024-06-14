# razor-payment
 for ordering system

 code for orderdetails main div
 
 <div>
            <div>
                {payments.map(payment => (
                    <div key={payment.paymentId} className='grid grid-cols-1 border-2 border-black m-4 p-4 text-center'>
                        <h1>PaymentId: {payment.paymentId}</h1>
                        <h1>Name: {payment.name}</h1>
                        <h1>CustomerTable: {payment.customerTable}</h1>
                        <h1>Amount: {payment.amount}</h1>
                        <h1>Contact No: {payment.customerPhoneNo}</h1>
                        <h1>Status:{payment.status}</h1>
                        {payment.cartforpayment.map(item => (
                            <div key={item.id} className='grid grid-col-1 border-2 border-black m-3 p-3'>
                                <h2>Item Name: {item.name}</h2>
                                <h3>Category: {item.category}</h3>
                                <h3>Rating: {item.rating}</h3>
                                <h4>Price: {item.price}</h4>
                            </div>
                        ))}
                       <div clasName="flex justify-center ">
                       <div>
                       <button onClick={() => handleDelete(payment.paymentId)} className="mt-4 ">
                           Delete
                        </button>
                        </div>
                          <div>
                          <button  onClick={()=>handlemove(payment._id)} className="mt-4">
                             Update
                        </button>
                            </div>


                        </div>
                    </div>
                ))}
            </div>
        </div>
 



 Homepage componenet

 import React, { useState } from 'react';
import cafes from './Cafedata';
import { Link } from 'react-router-dom';
import {  useDispatch ,useSelector} from 'react-redux';
import cartlogo from "./images/cartlogo.png"
import user from "./images/user.png";
import { addToCart ,removeToCart} from './redux/cartSlice.js'



function Homepage(props) {
    // State to store quantities for each cafe item
    const [type,settype]=useState("");

    const [quantities, setQuantities] = useState(Array(cafes.length).fill(0));  
    const cartfortotal = useSelector((state) => state.cart.cart);
    const totalquantityforhome = cartfortotal.map((item)=>item.quantity).reduce((prev,curr) => prev + curr, 0);
         
    const dispatch = useDispatch();
    const additemtocart=(item)=>{
    dispatch(addToCart(item));
     
      console.log(item);
     }

     const removeitemtocart=(item)=>{
        dispatch(removeToCart(item));
       
        console.log(item);
       }

  
    // Function to increase quantity for a specific cafe item
    const increase = (index) => {
        const newQuantities = [...quantities];
        newQuantities[index] += 1;
        setQuantities(newQuantities);
    }
   

  

    // Function to decrease quantity for a specific cafe item
    const decrease = (index) => {
        if (quantities[index] > 0) {
            const newQuantities = [...quantities];
            newQuantities[index] -= 1;
            setQuantities(newQuantities);
        }
    }


   

    return (
        <div>
          <div className='flex item-center justify-center  '>
          <h1 className="text-3xl font-bold text-center m-2">Cafe Coffee</h1>
        
          <Link to="/bill">
            <img
            src={cartlogo}
             className='h-12 w-12 '
            />
          </Link>
          <h1 className="font-bold text-red text-2xl"> {totalquantityforhome}</h1>
          <Link to="/Owner">
            <img
            src={user}
             className='h-10 w-10 ml-8 mt-1'
            />
          </Link>
          </div>
           <div>
           {cafes.map((item, index) => (
               <div className='flex flex-row m-3 p-3' key={index} >
                       <div>
                       <img className='m-2' src={item.image} alt={item.name} />
                       </div>
                       <div className='ml-4'>   
                
                       <h2 className="font-bold">{item.name}</h2>
                       <p>Category: {item.category}</p>
                       <p>Rating: {item.rating} stars</p>
                       <p>Price:{item.price}</p>
                      
                       <p>{item.description}</p>
                       <div className='flex m-2'>
                       <button onClick={() => { increase(index); additemtocart(item); }} className="h-10 w-10 bg-black text-white">+</button>

                               <h1 className='font-bold text-2xl m-2 '>{quantities[index]}</h1>
                           <button onClick={() => {decrease(index); removeitemtocart(item);}} className="h-10 w-10 bg-black text-white">-</button>
                       </div>
                   </div>
               </div>
           ))}
           </div>
          
        </div>
      
    );
}

export default Homepage;



// updated code of homepage.js for the size entry system

import React, { useState } from 'react';
import cafes from './Cafedata';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import cartlogo from "./images/cartlogo.png";
import user from "./images/user.png";
import { addToCart, removeToCart } from './redux/cartSlice.js';

function Homepage(props) {
    // State to store quantities for each cafe item
    const [quantities, setQuantities] = useState(Array(cafes.length).fill(0));
    // State to store selected size for each cafe item
    const [selectedSizes, setSelectedSizes] = useState(Array(cafes.length).fill('medium'));

    const cartfortotal = useSelector((state) => state.cart.cart);
    const totalquantityforhome = cartfortotal.map((item) => item.quantity).reduce((prev, curr) => prev + curr, 0);

    const dispatch = useDispatch();

    const additemtocart = (item, size) => {
        const itemWithSize = { ...item, size, price: item.sizes.find(s => s.size === size).price };
        dispatch(addToCart(itemWithSize));
        console.log(itemWithSize);
    }

    const removeitemtocart = (item, size) => {
        const itemWithSize = { ...item, size, price: item.sizes.find(s => s.size === size).price };
        dispatch(removeToCart(itemWithSize));
        console.log(itemWithSize);
    }

    // Function to increase quantity for a specific cafe item
    const increase = (index) => {
        const newQuantities = [...quantities];
        newQuantities[index] += 1;
        setQuantities(newQuantities);
    }

    // Function to decrease quantity for a specific cafe item
    const decrease = (index) => {
        if (quantities[index] > 0) {
            const newQuantities = [...quantities];
            newQuantities[index] -= 1;
            setQuantities(newQuantities);
        }
    }

    // Function to handle size selection change
    const handleSizeChange = (index, size) => {
        const newSelectedSizes = [...selectedSizes];
        newSelectedSizes[index] = size;
        setSelectedSizes(newSelectedSizes);
    }

    return (
        <div>
            <div className='flex item-center justify-center'>
                <h1 className="text-3xl font-bold text-center m-2">Cafe Coffee</h1>

                <Link to="/bill">
                    <img
                        src={cartlogo}
                        className='h-12 w-12'
                    />
                </Link>
                <h1 className="font-bold text-red text-2xl"> {totalquantityforhome}</h1>
                <Link to="/Owner">
                    <img
                        src={user}
                        className='h-10 w-10 ml-8 mt-1'
                    />
                </Link>
            </div>
            <div>
                {cafes.map((item, index) => (
                    <div className='flex flex-row m-3 p-3' key={index}>
                        <div>
                            <img className='m-2' src={item.image} alt={item.name} />
                        </div>
                        <div className='ml-4'>
                            <h2 className="font-bold">{item.name}</h2>
                            <p>Category: {item.category}</p>
                            <p>Rating: {item.rating} stars</p>
                            <p>Price: {item.sizes.find(s => s.size === selectedSizes[index]).price}</p>
                            <p>{item.description}</p>
                            <div className='flex m-2'>
                                <label className='mr-2 font-bold '>Size:</label>
                                <select
                                    value={selectedSizes[index]}
                                    onChange={(e) => handleSizeChange(index, e.target.value)}
                                >
                                    {item.sizes.map(size => (
                                        <option key={size.size} value={size.size}>
                                            {size.size}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='flex m-2'>
                                <button onClick={() => { increase(index); additemtocart(item, selectedSizes[index]); }} className="h-10 w-10 bg-black text-white">+</button>
                                <h1 className='font-bold text-2xl m-2'>{quantities[index]}</h1>
                                <button onClick={() => { decrease(index); removeitemtocart(item, selectedSizes[index]); }} className="h-10 w-10 bg-black text-white">-</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Homepage;
