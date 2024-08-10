import React, {  useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GrCafeteria } from "react-icons/gr";
import deliverylogo from './images/delivery.gif';


export default function Splash() {

     const go= useNavigate();
    useEffect(() => {
        setTimeout(()=>{
         go("/table")
        },2000)
   
      }, [])
      
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-yellow-300 to-yellow-200">
    <h1 className="font-extrabold text-2xl text-center mb-4">Loading the menu...</h1>
    <GrCafeteria  className="h-10  w-10" />
    <img
        src={deliverylogo}
        className='h-auto w-auto max-h-full max-w-full'
        alt="Loading"
    />
</div>
  )
}
























