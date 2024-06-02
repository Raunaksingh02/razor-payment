import React from 'react';
import { Link } from 'react-router-dom';
import backarrowlogo from "./images/backarrowlogo.png"
import Paymentdatauser from './PaymentData.js';

function OrderDetails(props) {

    return (
        <div >
        <div className='flex items-center' >
         <Link to="/Owner">
        <a
          download={"./images/backarrowlogo.png"}
         >
        <img
            src={backarrowlogo}
            className='h-10 w-10 m-2'
            />
        </a>
         </Link>
           <h1 className="font-bold text-3xl text-center ml-10"> Order Details </h1>

           </div>    
      
          <div  >
 
           {
            Paymentdatauser.map((item,index)=>(
                  <div 
                  key={index}
                  className='grid grid-cols-1 font-bold text-xl text-center bg-gray-400  border-2   border-black rounded-xl m-3 p-3  '>
                    <h1>PAYMENT ID-{item.paymentid}</h1>
                    <h1>NAME-{item.name}</h1>
                    <h1>PHONE-{item.Phone}</h1>
                    <h1>DATE-{item.Datenow}</h1>
                    <h1>TIME-{item.time}</h1>
                     {
                        item.cartitems.map((item,index)=>(
                               <div className='border-2 border-gray-600 bg-gray-300 rounded-xl m-3 p-3 '>
                                <h1>Product :{item.name}</h1>
                                <h1>Category :{item.category}</h1>
                                <h1>Rating :{item.rating}</h1>
                                <h1>Price :{item.price}</h1>
                                <h1>description :{item.description}</h1>
                                </div>
                        ))
                     }
                    
                    </div>

            ))
           }
          </div>

          <div className='ml-10'>


</div>
         
        </div>


    );
}



export default {OrderDetails};
































