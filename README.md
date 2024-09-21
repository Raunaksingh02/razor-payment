import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { GiCancel } from "react-icons/gi";

const socket = io("https://backendcafe-ceaj.onrender.com");

function Calling() {
  const [requests, setRequests] = useState([]);
  const audioRef = useRef(new Audio('/alertsound.mp3'));

  useEffect(() => {
    const audioElement = audioRef.current;
    audioElement.load(); // Preload the audio

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
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.currentTime = 0; // Ensure the sound plays from the start
      audioElement.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  };

  const removeRequest = (index) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setRequests(requests.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center  pointer-events-none transition-transform transform duration-300 ease-in-out hover:scale-105 z-50">
      {requests.map((request, index) => (
        <div 
          key={index} 
          className="bg-white border border-red-400 text-red-700 px-6 py-4 rounded shadow-lg shadow-red-400 relative mb-4 pointer-events-auto animate-bounce-in-down max-w-sm mx-auto"
          role="alert"
        >
          <div className="flex   justify-between items-start ">
            <div>
              <strong className="font-extrabold text-xl">Incoming Call from {request.table}!</strong>
              <span className="block font-extrabold  sm:inline"> {request.query} at {request.time}</span>
            </div>
            <button
              onClick={() => removeRequest(index)}
              className="text-black"
            >
              
            {/* <span className="text-2xl">&times;</span> */}
            <GiCancel fill="black" className='h-6 w-6' />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Calling;






















owner js component


import React, { useEffect, useState, useContext, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlinePayments } from "react-icons/md";
import { IoFastFoodSharp } from "react-icons/io5";
import { FaMoneyCheckDollar, FaUserTie, FaChartLine } from "react-icons/fa6";
import { TbReport, TbTruckDelivery } from "react-icons/tb";
import { BiSolidUserDetail } from "react-icons/bi";
import { IoFastFoodOutline} from "react-icons/io5";
import { FaShopLock } from "react-icons/fa6";
import { GiCook } from "react-icons/gi";
import { BsBank } from "react-icons/bs";
import { IoIosLogOut } from "react-icons/io";
import { CiDiscount1 } from "react-icons/ci";
import { FaFileInvoiceDollar, FaHistory } from "react-icons/fa";
import { MdElectricMoped } from "react-icons/md";
import axios from "axios";
import { AuthContext } from './AuthContext';
import Calling from "./Calling";
import OrderPopup from "./OrderPopup";

function Owner() {
  const [stats, setStats] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState('');

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get('https://backendcafe-ceaj.onrender.com/todays-stats');
      setStats(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching stats', error);
      // Optionally set an error state to display an error message
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    const date = new Date();
    const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    setCurrentDate(formattedDate);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const memoizedStats = useMemo(() => stats, [stats]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Calling />
      <OrderPopup />

      <div className="flex-1 shadow-2xl bg-white rounded-xl mx-4 my-6 p-4">
        <div className="flex justify-between items-center p-2 mb-4 border-b border-gray-200">
          <Link to="/coupon">
            <div className='flex items-center text-[#f6931e]'>
              <CiDiscount1 className="h-8 w-8" />
            </div>
          </Link>
          <h1 className="font-bold text-2xl text-center text-[#18196c]">Admin Panel</h1>
          <button onClick={() => setShowModal(true)} className="text-red-500">
            <IoIosLogOut className="h-8 w-8" />
          </button>
        </div>
        
        <div className="w-full h-auto p-6 md:h-56 rounded-2xl bg-[#18196c] flex flex-col items-center justify-center mb-6 shadow-lg">
          <div className="flex flex-row items-center justify-between w-full px-4">
            <div className="text-white">
              <h1 className="text-xl font-bold text-white mb-2">{currentDate}</h1>
              {showStats ? (
                <>
                  <p className="text-md font-medium">Orders: <span className="font-bold">{memoizedStats.todaysOrders || 'N/A'}</span></p>
                  <p className="text-md font-medium">Profit: <span className="font-bold">{memoizedStats.todaysProfit || 'N/A'}</span></p>
                  <p className="text-md font-medium">Revenue: <span className="font-bold">{memoizedStats.todaysRevenue || 'N/A'}</span></p>
                  <p className="text-md font-medium">Units: <span className="font-bold">{memoizedStats.totalDishesSold || 'N/A'}</span></p>
                </>
              ) : (
                <p className="text-md font-medium">Stats not available</p>
              )}
            </div>
            <div className="shadow-inner p-2 rounded-lg bg-[#2c2c54]">
              <FaUserTie fill="white" className="h-10 w-10" />
              <label className="flex items-center mt-2">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-500"
                  checked={showStats}
                  onChange={() => setShowStats(!showStats)}
                />
                <span className="ml-2 text-white">Stats</span>
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-2">
          {[
            { to: "/Order", title: "Order Details", Icon: GiCook },
            { to: "/Takeaway", title: "Create Bill", Icon: FaFileInvoiceDollar },
            { to: "/Website", title: "Website Order", Icon: TbTruckDelivery },
            { to: "/Dishmanage", title: "Menu-Items", Icon: IoFastFoodSharp },
            { to: "/Waiter", title: "Cost Price", Icon: MdOutlinePayments },
            { to: "/Profit", title: "Item Analysis", Icon: FaMoneyCheckDollar },
            { to: "/Chart", title: "Sales Chart", Icon: FaChartLine },
            { to: "/Month", title: "Total Report", Icon: TbReport },
            { to: "/Web/user", title: "Web User", Icon: BiSolidUserDetail },
            { to: "/delivery", title: "Delivery", Icon: MdElectricMoped },
            { to: "/pay", title: "Add UPI", Icon: BsBank },
            { to: "/unique", title: "History", Icon: FaHistory }
          ].map(({ to, title, Icon }, index) => (
            <Link key={index} to={to} className="p-3 h-44 rounded-xl bg-[#18196c] text-center text-white flex flex-col items-center justify-center transition duration-150 ease-in-out transform hover:scale-105 shadow-md">
              <h2 className="text-sm font-bold">{title}</h2>
              <Icon className="h-10 w-10 mt-2" />
            </Link>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-lg font-bold mb-4">Confirm Logout</h2>
            <p className="mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 px-4 py-2 rounded mr-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
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
