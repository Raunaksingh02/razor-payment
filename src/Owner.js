import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaFileInvoiceDollar, FaMoneyCheckDollar, FaHistory } from 'react-icons/fa';
import { IoFastFoodSharp, IoIosLogOut } from 'react-icons/io5';
import { MdElectricMoped, MdOutlineLoyalty, MdOutlinePayments } from 'react-icons/md';
import { GiCook } from 'react-icons/gi';
import { TbReport, TbTruckDelivery } from 'react-icons/tb';
import { BiSolidUserDetail } from 'react-icons/bi';
import { CiDiscount1 } from 'react-icons/ci';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import Calling from './Calling';
import OrderPopup from './OrderPopup';
import OrderDetails from './OrderDetails';
import Billingpage from './Billingpage';
import Dishmanage from './Dishmanage';
import Salechart from './Salechart';
import Webisteorder from './Webisteorder';
import Pos from './Pos';
import { FaChartBar } from "react-icons/fa";
import Deliverydetail from './components/Deliverydetail';
import CouponManager from './components/CouponManager';
import AddRewardCoupon from './AddRewardCoupon';
import Chart from 'react-apexcharts';
import Month from "./Month";
import Profitpage from './Profitpage';
import { MdCalendarMonth } from "react-icons/md";
import Googlepay from "./Googlepay";
import { MdPayments } from "react-icons/md";
import Webuser from "./components/Webuser";
import Uniqueuser from './components/Uniqueuser';
import { TbBuildingWarehouse } from "react-icons/tb";
import { BsQrCode } from "react-icons/bs";
import Inventory from "./Inventory.js";
import Dynamicqr from './Dynamicqr.js'


function Owner() {

  const [stats, setStats] = useState({});
  const { logout } = useContext(AuthContext);
  const [selectedTab, setSelectedTab] = useState('Dashboard');
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get('https://backendcafe-nefw.onrender.com/todays-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats', error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const date = new Date();
    const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    
    setChartOptions({
      chart: { type: 'bar' },
      xaxis: { categories: ['Orders', 'Profit', 'Revenue', 'Units Sold'] },
    });
    setChartSeries([{ name: 'Today', data: [stats.todaysOrders || 0, stats.todaysProfit || 0, stats.todaysRevenue || 0, stats.totalDishesSold || 0] }]);
  }, [fetchStats, stats]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderDashboard = () => (
    <div>
      <Calling />
      <OrderPopup />
      <div className="bg-white p-6 rounded-lg shadow-2xl mb-6">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Admin Dashboard!</h1>
        <p className="text-lg">Here are your today's stats.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-[#f6931e] to-orange-400 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-white mb-2">Orders</h2>
          <p className="text-3xl font-bold text-white">{stats.todaysOrders || 'N/A'}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-400 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-white mb-2">Profit</h2>
          <p className="text-3xl font-bold text-white">{stats.todaysProfit || 'N/A'}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-400 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-white mb-2">Revenue</h2>
          <p className="text-3xl font-bold text-white">{stats.todaysRevenue || 'N/A'}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-400 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-white mb-2">Units Sold</h2>
          <p className="text-3xl font-bold text-white">{stats.totalDishesSold || 'N/A'}</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">Today's Performance</h2>
        <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
      </div>
    </div>
  );

  const tabs = [
    { name: 'Dashboard', icon: <FaChartLine />, component: renderDashboard },
    { name: 'OrderDetails', icon: <IoFastFoodSharp />, component: <OrderDetails /> },
    { name: 'Create Bill', icon: <FaFileInvoiceDollar />, component: <Pos /> },
    { name: 'Website Order', icon: <MdElectricMoped />, component: <Webisteorder /> },
    { name: 'Menu-Items', icon: <GiCook />, component: <Dishmanage /> },
    { name: 'Inventory', icon: <TbBuildingWarehouse/> ,component: <Inventory/> },
    { name: 'Profit', icon: <TbTruckDelivery />, component: <Profitpage /> },
    { name: 'Reward', icon: <MdOutlineLoyalty />, component: <AddRewardCoupon /> },
    { name: 'Coupons', icon: <CiDiscount1 />, component: <CouponManager /> },
    { name: 'Chart', icon: < FaChartBar/>, component: <Chart /> },
    { name: 'Month', icon: < MdCalendarMonth/>, component: <Month /> },
    { name: 'Upi', icon: < MdPayments />, component: <Googlepay/> },
    { name: 'User', icon: <MdPayments />, component: <Webuser/> },
    { name: 'History', icon: <FaHistory /> ,component: <Uniqueuser/> },
    { name: 'Delivery', icon: <FaHistory /> ,component: <Deliverydetail/> },
    { name: 'Safepay', icon: < BsQrCode /> ,component: <Dynamicqr/> },

   
  ];

  const renderSelectedTab = () => {
    if (selectedTab === 'Dashboard') {
      return renderDashboard();
    }
    const tab = tabs.find(t => t.name === selectedTab);
    return tab ? tab.component : null;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <div className="fixed top-4 right-4 z-50 md:hidden">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white bg-black p-2 rounded-lg">
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 md:relative md:translate-x-0 w-64 bg-[#18196c] text-white p-4 flex flex-col items-start shadow-lg min-h-screen`}>
        <div className="text-2xl font-bold mb-8">Admin Panel</div>
        <button className="text-white absolute top-4 right-4 md:hidden" onClick={() => setIsSidebarOpen(false)}>
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <ul className="flex flex-col w-full">
          {tabs.map(tab => (
            <li
              key={tab.name}
              className={`flex items-center space-x-2 p-3 rounded-lg mb-2 cursor-pointer ${selectedTab === tab.name ? 'bg-[#f6931e] text-white' : 'hover:bg-[#f6931e] hover:text-white'}`}
              onClick={() => setSelectedTab(tab.name)}>
              {tab.icon}
              <span className={`${isSidebarOpen ? '' : 'hidden'} md:inline`}>{tab.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">{renderSelectedTab()}</div>
    </div>
  );
}

export default Owner;
