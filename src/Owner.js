import React from  'react';
import { Link } from 'react-router-dom';
import { MdOutlinePayments } from "react-icons/md";
import backarrowlogo from "./images/backarrowlogo.png";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { TbReport } from "react-icons/tb";
import { IoFastFoodOutline } from "react-icons/io5";
import { GiCook } from "react-icons/gi";
import { FaChartLine } from "react-icons/fa6";
import Calling from "./Calling";


function Owner(props) {

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
    <div>
    <Calling/>
    </div>
      <div style={{ flex: "1" }}>
        <div className='flex items-center '>
          <Link to="/">
            <img src={backarrowlogo} className='h-10 w-10 m-2' alt="Back" />
          </Link>
          <h1 className="font-extrabold text-3xl text-center text-[#18196c] ml-10">Admin Panel</h1>
        </div>
      
        <div className="grid grid-cols-1 shadow-xl shadow-blue-400">
          <Link to="/Order">
          <div className='m-3 p-3 h-56 rounded-2xl transition duration-150 ease-in-out  bg-[#18196c] flex flex-col items-center justify-center'>
         <h1 className='text-center text-4xl font-mono font-extrabold text-white'>Order Details</h1>
            <GiCook  fill='white'  className="h-12 w-12 mt-4" />
            </div>
          </Link>
          <Link to="/Dishmanage">
         <div className='m-3 p-3 h-56 rounded-2xl transition duration-150 ease-in-out bg-[#18196c] flex flex-col items-center justify-center'>
         <h1 className='text-center text-4xl font-mono font-extrabold text-white'>Dish Management</h1>
         <IoFastFoodOutline fill='white' className="h-12 w-12 mt-4  text-white"  />
       </div>
        </Link>
          <Link to="/Waiter">
          
          <div className='m-3 p-3 h-56 rounded-2xl transition duration-150 ease-in-out bg-[#18196c] flex flex-col items-center justify-center'>
         <h1 className='text-center text-4xl font-mono font-extrabold text-white'>Cost Price</h1>
           <MdOutlinePayments  fill='white' className="h-12 w-12 mt-4" />
            </div>
          </Link>
          <Link to="/Profit">
        <div className='m-3 p-3 h-56 rounded-2xl transition duration-150 ease-in-out bg-[#18196c] flex flex-col items-center justify-center'>
         <h1 className='text-center text-4xl font-mono font-extrabold text-white'>Profit Data</h1>
             <FaMoneyCheckDollar  fill="white" className="h-12 w-12 mt-4 "  />
            </div>
          </Link>
          <Link to="/Chart">
        <div className='m-3 p-3 h-56 rounded-2xl transition duration-150 ease-in-out bg-[#18196c] flex flex-col items-center justify-center'>
         <h1 className='text-center text-4xl font-mono font-extrabold text-white'>Analysis</h1>
         <FaChartLine fill="white" className="h-12 w-12 mt-4"/>
            </div>
          </Link>
          <Link to="/Month">
        <div className='m-3 p-3 h-56 rounded-2xl transition duration-150 ease-in-out bg-[#18196c] flex flex-col items-center justify-center'>
         <h1 className='text-center text-4xl font-mono font-extrabold text-white'>Customer Report</h1>
         <TbReport fill="white" className="h-12 w-12 mt-4" />
            </div>
          </Link>
      </div>
      <footer className="bg-gray-700 text-white p-4 text-center">
        <p>© 2024 Cafehouse Pvt ltd. All rights reserved.</p>
      </footer>
    </div>
    </div>
  );
}

export default Owner;
