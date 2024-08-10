import React, { useEffect, useState ,useContext}  from  'react';
import { Link ,useNavigate} from 'react-router-dom';
import { MdOutlinePayments } from "react-icons/md";
import backarrowlogo from "./images/backarrowlogo.png";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { TbReport } from "react-icons/tb";
import { IoFastFoodOutline } from "react-icons/io5";
import { GiCook } from "react-icons/gi";
import { TbTruckDelivery } from "react-icons/tb";
import { FaChartLine } from "react-icons/fa6";
import Calling from "./Calling.js"
import { FaFileInvoiceDollar } from "react-icons/fa";
import OrderPopup from "./OrderPopup.js"
import { IoIosLogOut } from "react-icons/io";
import axios from "axios"
import { AuthContext } from './AuthContext';
import Heartbeat from "./Heartbeat.js"

function Owner() {
 
   const [dataofdish, setdataofdish] = useState("")
   const [showModal, setShowModal] = useState(false);
   const { logout } = useContext(AuthContext); // Access the logout function from AuthContext
   const navigate = useNavigate();

  
  useEffect(() => {
    axios.get('https://backendcafe-ceaj.onrender.com/getdish')
        .then(response => {
           setdataofdish(response.data);
           console.log(response.data);
        })
        .catch(error => console.error('Error fetching data:', error));
}, []);

const handleLogout = () => {
  logout(); // Call the logout function from AuthContext
  navigate('/login'); // Redirect to login page
};

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Calling />
      <OrderPopup />
      <Heartbeat/>
      <div style={{ flex: "1" }}>
        <div className='flex justify-between items-center  '>
          <Link to="/">
            <img src={backarrowlogo} className='h-10 w-10 m-2' alt="Back" />
          </Link>
          <div>
          <h1 className="font-extrabold text-3xl text-center text-[#18196c] ml-6">Admin Panel</h1>
          </div>
          <div>
          <button onClick={() => setShowModal(true)}>
              <IoIosLogOut className='h-8 w-8' />
            </button>
          </div>
        </div>
        <div>

              
        <div className="grid grid-cols-2 shadow-xl animate-slideInFromBottom shadow-blue-400">
          <Link to="/Order">
          <div className='m-3 p-3 h-56 rounded-3xl  transition duration-150 ease-in-out  bg-[#18196c] flex flex-col items-center justify-center'>
          <h1 className='text-center text-lg font-mono font-extrabold text-white'>Order Details</h1>
 
            <GiCook  fill='white'  className="h-12 w-12 mt-4" />
            </div>
          </Link>
          <Link to="/Takeaway">
          <div className='m-3 p-3 h-56  rounded-3xl transition duration-150 ease-in-out  bg-[#18196c] flex flex-col items-center justify-center'>
         <h1 className='text-center text-lg font-mono font-extrabold text-white'>Create Bill</h1>
         <FaFileInvoiceDollar  fill='white'  className="h-12 w-12 mt-4" />
            </div>
          </Link>
          <Link to="/Website">
         <div className='m-3 p-3 h-56 rounded-3xl transition duration-150 ease-in-out bg-[#18196c] flex flex-col items-center justify-center'>
         <h1 className='text-center text-lg font-mono font-extrabold text-white'>Website Order</h1>
         <TbTruckDelivery fill='white' className="h-12 w-12 mt-4  text-white"  />
       </div>
        </Link>
          <Link to="/Dishmanage">
         <div className='m-3 p-3 h-56 rounded-3xl transition duration-150 ease-in-out bg-[#18196c] flex flex-col items-center justify-center'>
         <h1 className='text-center text-lg font-mono font-extrabold text-white'>Dish Management</h1>
         <IoFastFoodOutline fill='white' className="h-12 w-12 mt-4  text-white"  />
       </div>
        </Link>
          <Link to="/Waiter">
          
          <div className='m-3 p-3 h-56 rounded-3xl transition duration-150 ease-in-out bg-[#18196c] flex flex-col items-center justify-center'>
         <h1 className='text-center text-lg font-mono font-extrabold text-white'>Cost Price</h1>
           <MdOutlinePayments  fill='white' className="h-12 w-12 mt-4" />
            </div>
          </Link>
          <Link to="/Profit">
        <div className='m-3 p-3 h-56 rounded-3xl transition duration-150 ease-in-out bg-[#18196c] flex flex-col items-center justify-center'>
         <h1 className='text-center text-lg font-mono font-extrabold text-white'>Profit Data</h1>
             <FaMoneyCheckDollar  fill="white" className="h-12 w-12 mt-4 "  />
            </div>
          </Link>
          <Link to="/Chart">
        <div className='m-3 p-3 h-56 rounded-3xl transition duration-150 ease-in-out bg-[#18196c] flex flex-col items-center justify-center'>
         <h1 className='text-center text-lg font-mono font-extrabold text-white'>Analysis</h1>
         <FaChartLine fill="white" className="h-12 w-12 mt-4"/>
            </div>
          </Link>
          <Link to="/Month">
        <div className='m-3 p-3 h-56 rounded-3xl transition duration-150 ease-in-out bg-[#18196c] flex flex-col items-center justify-center'>
         <h1 className='text-center text-lg font-mono font-extrabold text-white'>Customer Report</h1>
         <TbReport fill="white" className="h-12 w-12 mt-4" />
            </div>
          </Link>
      </div>
      <footer className="bg-gray-700 text-white p-4 text-center">
        <p>© 2024 Cafehouse Pvt ltd. All rights reserved.</p>
      </footer>
    </div>
    </div>
    {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirm Logout</h2>
            <p className="mb-4">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-4">
              <button 
                className="px-4 py-2 bg-gray-500 text-white rounded" 
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-red-500 text-white rounded" 
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default Owner;
