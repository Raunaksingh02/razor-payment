import React from 'react';
import { Link } from 'react-router-dom';
import backarrowlogo from "./images/backarrowlogo.png"


function Owner(props) {   
    return (
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
             <div className='m-3 p-3 border-2 border-black h-56 rounded-xl bg-black '>
                <h1 className='mt-14 text-center text-4xl font-mono font-bold text-white'>Shop Details</h1>
             </div>
              </div>
        </div>
    );
}

export default Owner;













