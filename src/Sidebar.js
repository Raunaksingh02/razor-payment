import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { BuyerContext } from "./components/Buyercontext";

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useContext(BuyerContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { buyer } = useContext(BuyerContext);
  
  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const confirmLogout = () => {
    logout();
    setIsModalOpen(false);
    window.location.reload(); 
  };

  return (
    <>
      {/* Sidebar for Laptop (Horizontal) */}
      <div className="hidden lg:flex items-center justify-evenly w-full ml-4 px-4 py-2 z-20 ">
        <Link to="/profile" className="hover:bg-black bg-white px-2 py-1 font-bold text-black hover:text-white shadow-md shadow-gray-200 rounded-lg ml-3 ">Profile</Link>
        <Link to="/orders" className="hover:bg-black bg-white px-2 py-1 font-bold text-black hover:text-white shadow-md shadow-gray-200 rounded-lg ml-3" >Orders</Link>
        <Link to="/wallet" className="hover:bg-black bg-white px-2 py-1 font-bold text-black hover:text-white shadow-md shadow-gray-200 rounded-lg ml-3">Wallet</Link>
        <Link to="/address" className="hover:bg-black bg-white px-2 py-1 font-bold text-black hover:text-white shadow-md shadow-gray-200 rounded-lg ml-3">Address</Link>
        <button onClick={handleLogoutClick} className="hover:bg-black bg-white px-2 py-1 font-bold text-black hover:text-white shadow-md shadow-gray-200 rounded-lg ml-3">Logout</button>
      </div>

      {/* Sidebar for Mobile (Vertical) */}
      <div className={`fixed inset-0 z-30 transition-transform transform lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="relative bg-white w-64 h-full shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold">My Account</h2>
            <button onClick={onClose} className="text-black font-bold">&times;</button>
          </div>
          <nav className="p-4">
            <ul>
              <li className="mb-4">
                <Link to="/profile" className="block hover:bg-gray-200 px-3 py-2 font-bold rounded-md">
                  Profile
                </Link>
              </li>
              <li className="mb-4">
                <Link to="/orders" className="block hover:bg-gray-200 px-3 py-2 font-bold rounded-md">
                  Orders
                </Link>
              </li>
              <li className="mb-4">
                <Link to="/address" className="block hover:bg-gray-200 px-3 py-2 font-bold rounded-md">
                  Address
                </Link>
              </li>
              <li className="mb-4">
                <Link to="/wallet" className="block hover:bg-gray-200 px-3 py-2 font-bold rounded-md">
                  Wallet
                </Link>
              </li>
              <li className="mb-4">
                <button onClick={handleLogoutClick} className="w-full text-left hover:bg-gray-200 px-3 py-2  font-bold  rounded-md">
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto">
            <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
            <p className="mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="mr-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
