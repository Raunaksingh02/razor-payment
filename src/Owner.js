import React, { useEffect, useState, useContext, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlinePayments } from "react-icons/md";
import backarrowlogo from "./images/backarrowlogo.png";
import { IoFastFoodSharp } from "react-icons/io5";
import { FaMoneyCheckDollar, FaUserTie, FaChartLine } from "react-icons/fa6";
import { TbReport, TbTruckDelivery } from "react-icons/tb";
import { IoFastFoodOutline } from "react-icons/io5";
import { FaShopLock } from "react-icons/fa6";
import { GiCook } from "react-icons/gi";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import axios from "axios";
import { AuthContext } from './AuthContext';
import Calling from "./Calling";
import OrderPopup from "./OrderPopup";
import Heartbeat from "./Heartbeat";

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
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;
    setCurrentDate(formattedDate);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const memoizedStats = useMemo(() => stats, [stats]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Calling />
      <OrderPopup />
      <Heartbeat />
      <div className="flex-1 shadow-2xl shadow-gray-800">
        <div className="flex justify-between items-center p-4">
          <Link to="/table">
            <FaShopLock className="h-10 w-10" />
          </Link>
          <h1 className="font-extrabold text-3xl text-center text-[#18196c] ml-6">Admin Panel</h1>
          <button onClick={() => setShowModal(true)}>
            <IoIosLogOut className="h-8 w-8" />
          </button>
        </div>

        <div className="m-2 mb-1 mt-2">
          <div className="w-full h-auto p-6 md:h-56 rounded-3xl bg-[#18196c] flex flex-col items-center justify-center transition duration-150 ease-in-out">
            <div className="flex flex-row items-center justify-between w-full px-8">
              <div className="text-white font-serif">
                <h1 className="text-2xl font-mono font-extrabold text-white mr-1 mb-4">{currentDate}</h1>
                {showStats ? (
                  <>
                    <h1 className="text-lg font-bold">Orders: <span className="font-bold">{memoizedStats.todaysOrders || 'N/A'}</span></h1>
                    <h1 className="text-lg font-bold">Profit: <span className="font-bold">{memoizedStats.todaysProfit || 'N/A'}</span></h1>
                    <h1 className="text-lg font-bold">Revenue: <span className="font-bold">{memoizedStats.todaysRevenue || 'N/A'}</span></h1>
                    <h1 className="text-lg font-bold">Units: <span className="font-bold">{memoizedStats.totalDishesSold || 'N/A'}</span></h1>
                  </>
                ) : (
                  <>
                    <h1 className="text-lg font-bold">Orders: N/A</h1>
                    <h1 className="text-lg font-bold">Profit: N/A</h1>
                    <h1 className="text-lg font-bold">Revenue: N/A</h1>
                    <h1 className="text-lg font-bold">Units: N/A</h1>
                  </>
                )}
              </div>
              <div className="shadow-inner shadow-white">
                <FaUserTie fill="white" className="h-16 w-16 m-4" />
                <label className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600"
                    checked={showStats}
                    onChange={() => setShowStats(!showStats)}
                  />
                  <span className="ml-2 text-white">Show Stats</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-3 shadow-xl animate-slideInFromBottom shadow-blue-400">
          <Link to="/Order">
            <div className="p-3 h-56 rounded-3xl transition duration-150 ease-in-out bg-[#18196c] flex flex-col items-center justify-center">
              <h1 className="text-lg font-mono font-extrabold text-white">Order Details</h1>
              <GiCook fill="white" className="h-12 w-12 mt-4 shadow-2xl shadow-white" />
            </div>
          </Link>
          <Link to="/Takeaway">
            <div className="p-3 h-56 rounded-3xl transition duration-150 ease-in-out bg-[#18196c] flex flex-col items-center justify-center">
              <h1 className="text-lg font-mono font-extrabold text-white">Create Bill</h1>
              <FaFileInvoiceDollar fill="white" className="h-12 w-12 mt-4 shadow-2xl shadow-white" />
            </div>
          </Link>
          <Link to="/Website">
            <div className="p-3 h-56 rounded-3xl transition duration-150 ease-in-out bg-[#18196c] flex flex-col items-center justify-center">
              <h1 className="text-lg font-mono font-extrabold text-white">Website Order</h1>
              <TbTruckDelivery fill="white" className="h-12 w-12 mt-4 shadow-2xl shadow-white" />
            </div>
          </Link>
          <Link to="/Dishmanage">
            <div className="p-3 h-56 rounded-3xl transition duration-150 ease-in-out bg-[#18196c] flex flex-col items-center justify-center">
              <h1 className="text-lg font-mono font-extrabold text-white">Dish Management</h1>
              <IoFastFoodSharp className="h-12 w-12 mt-4 shadow-2xl shadow-white" fill="white" />
            </div>
          </Link>
          <Link to="/Waiter">
            <div className="p-3 h-56 rounded-3xl transition duration-150 ease-in-out bg-[#18196c] flex flex-col items-center justify-center">
              <h1 className="text-lg font-mono font-extrabold text-white">Cost Price</h1>
              <MdOutlinePayments fill="white" className="h-12 w-12 mt-4 shadow-2xl shadow-white" />
            </div>
          </Link>
          <Link to="/Profit">
            <div className="p-3 h-56 rounded-3xl transition duration-150 ease-in-out bg-[#18196c] flex flex-col items-center justify-center">
              <h1 className="text-lg font-mono font-extrabold text-white">Item Analysis</h1>
              <FaMoneyCheckDollar fill="white" className="h-12 w-12 mt-4 shadow-2xl shadow-white" />
            </div>
          </Link>
          <Link to="/Chart">
            <div className="p-3 h-56 rounded-3xl transition duration-150 ease-in-out bg-[#18196c] flex flex-col items-center justify-center">
              <h1 className="text-lg font-mono font-extrabold text-white">Sales Chart</h1>
              <FaChartLine fill="white" className="h-12 w-12 mt-4 shadow-2xl shadow-white" />
            </div>
          </Link>
          <Link to="/Order">
            <div className="p-3 h-56 rounded-3xl transition duration-150 ease-in-out bg-[#18196c] flex flex-col items-center justify-center">
              <h1 className="text-lg font-mono font-extrabold text-white">Total Report</h1>
              <TbReport fill="white" className="h-12 w-12 mt-4 shadow-2xl shadow-white" />
            </div>
          </Link>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg">
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
