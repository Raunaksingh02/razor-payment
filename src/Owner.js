import React, { useEffect, useState, useCallback, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlinePayments } from "react-icons/md";
import { IoFastFoodSharp } from "react-icons/io5";
import { FaMoneyCheckDollar, FaUserTie, FaChartLine } from "react-icons/fa6";
import { TbReport, TbTruckDelivery } from "react-icons/tb";
import { BiSolidUserDetail } from "react-icons/bi";
import { FaFileInvoiceDollar, FaHistory } from "react-icons/fa";
import { MdElectricMoped } from "react-icons/md";
import { CiDiscount1 } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import { BsBank } from "react-icons/bs";
import { GiCook } from "react-icons/gi";
import axios from "axios";
import { AuthContext } from './AuthContext';
import Calling from "./Calling";
import OrderPopup from "./OrderPopup";
import OrderDetails from './OrderDetails';
import Billingpage from './Billingpage';
import Dishmanage from './Dishmanage';
import Salechart from './Salechart';
import Webisteorder from './Webisteorder';
import Homepage from './Homepage';
import Upi from './Upi';
import Deliverydetail from './components/Deliverydetail';
import Chart from 'react-apexcharts';

function Owner() {
  const [stats, setStats] = useState({});
  const [showModal, setShowModal] = useState(false);
  const { logout } = useContext(AuthContext);
  const [currentDate, setCurrentDate] = useState('');
  const [selectedTab, setSelectedTab] = useState('Dashboard'); // Default to Dashboard
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);

  const navigate = useNavigate();

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get('https://backendcafe-ceaj.onrender.com/todays-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats', error);
    }
  }, []);


  useEffect(() => {
    if (selectedTab === 'Create Bill') {
      navigate('/Takeaway'); // Redirect to /takeaway when the 'Create Bill' tab is selected
    }
  }, [selectedTab, navigate]);

  useEffect(() => {
    fetchStats();
    const date = new Date();
    const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    setCurrentDate(formattedDate);

    // Setup Chart
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
      {/* Welcome Note */}
      <div className="bg-white p-6 rounded-lg shadow-2xl  mb-6">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Admin Dashboard!</h1>
        <p className="text-lg">Here are your today's stats.</p>
      </div>

      {/* Today's Stats Grid */}
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

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">Today's Performance</h2>
        <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
      </div>
    </div>
  );

  const tabs = [
    { name: 'Dashboard', icon: <FaChartLine />, component: renderDashboard },
    { name: 'OrderDetails', icon: <IoFastFoodSharp />, component: <OrderDetails /> },
    { name: 'Create Bill', icon: <FaFileInvoiceDollar />, component: null },
    { name: 'Website Order', icon: <MdElectricMoped />, component: <Webisteorder /> },
    { name: 'Menu-Items', icon: <GiCook />, component: <Dishmanage /> },
    { name: 'Cost Price', icon: <MdOutlinePayments />, component: null },
    { name: 'Item Analysis', icon: <FaMoneyCheckDollar />, component: null },
    { name: 'Sales Chart', icon: <FaChartLine />, component: <Salechart /> },
    { name: 'Total Report', icon: <TbReport />, component: null },
    { name: 'Web User', icon: <BiSolidUserDetail />, component: null },
    { name: 'Delivery', icon: <TbTruckDelivery />, component: <Deliverydetail /> },
    { name: 'History', icon: <FaHistory />, component: null },
    { name: 'Coupons', icon: <CiDiscount1 />, component: <Link to="/coupon" /> },
    { name: 'Logout', icon: <IoIosLogOut />, component: handleLogout },
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
      <Calling />
      <OrderPopup />

      {/* Sidebar */}
      <div className="w-1/6 bg-[#18196c] text-white p-4 flex flex-col items-start shadow-lg min-h-screen">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Panel</h1>

        {/* Navigation Tabs */}
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`w-full py-3 px-2 rounded-lg mb-2 flex items-center space-x-4 transition-all ${
              selectedTab === tab.name ? 'bg-[#f6931e]' : 'hover:bg-[#374785]'
            }`}
            onClick={() => setSelectedTab(tab.name)}
          >
            <span className="h-6 w-6 ml-1">{tab.icon}</span> {/* Adjust icon size */}
            <span className="text-lg">{tab.name}</span> {/* Adjust text spacing */}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="w-5/6 p-8 overflow-x-auto">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          {renderSelectedTab()}
        </div>
      </div>

      {/* Logout Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-lg font-bold mb-4">Confirm Logout</h2>
            <p className="mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-end">
              <button className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded mr-2" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded" onClick={handleLogout}>
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
