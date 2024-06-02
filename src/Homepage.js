import React, { useState } from 'react';
import cafes from './Cafedata';
import { Link } from 'react-router-dom';
import {  useDispatch ,useSelector} from 'react-redux';
import cartlogo from "./images/cartlogo.png"
import user from "./images/user.png";
import Admin from "./Admin.js"
import Owner from "./Owner.js"
import Invoicecompo from './Invoicecompo.js';
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
                       <p>Price: {item.price}</p>
                       
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
           <button  className=' h-12 w-30 bg-black font-bold text-xl p-3 ml-16 mt-5 text-white rounded-xl' >
            invoice
          <Link to='/Invoice'>
        </Link>
          </button>
        </div>
      
    );
}

export default Homepage;
