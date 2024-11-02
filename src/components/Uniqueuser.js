import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal'; // Ensure you have react-modal installed
import backarrowlogo from '../images/backarrowlogo.png';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const Uniqueuser = () => {
  const [phoneNo, setPhoneNo] = useState('');
  const [analysisData, setAnalysisData] = useState(null);
  const [uniqueUsers, setUniqueUsers] = useState([]);
  const [error, setError] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  useEffect(() => {
    const fetchUniqueUsers = async () => {
      try {
        const response = await axios.get('http://localhost:1000/unique-users');
        setUniqueUsers(response.data);
      } catch (err) {
        console.error('Error fetching unique users:', err);
      }
    };

    fetchUniqueUsers();
  }, []);

  const handleSearch = async () => {
    if (!phoneNo) {
      setError('Please enter a valid phone number');
      return;
    }
    try {
      setError('');
      const response = await axios.get(`http://localhost:1000/analysis/${phoneNo}`);
      setAnalysisData(response.data);
      setShowAnalysis(true);
    } catch (err) {
      setError('No records found for this phone number.');
      setAnalysisData(null);
      setShowAnalysis(false);
    }
  };

  const handleOpenModal = (bill) => {
    setSelectedBill(bill);
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setSelectedBill(null);
  };

  const dishQuantities = analysisData?.dishQuantities || [];
  const allBills = analysisData?.allBills || [];

  return (

    <div>
    <div className="flex items-center shadow-lg shadow-gray-300 mb-6">
    <div>
      <Link to="/owner">
        <img src={backarrowlogo} className="h-10 w-10 m-2" />
      </Link>
    </div>
    <div>
      <h1 className="text-3xl font-bold ml-12">User History</h1>
    </div>
  </div>
    <div className="p-6 max-w-4xl mx-auto">
   
      <div className="mb-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0">
         <h1 className="text-center font-bold text-2xl m-2">Enter Phone Number</h1>
       
        <input
          type="text"
          placeholder="Enter Phone Number"
          value={phoneNo}
          onChange={(e) => setPhoneNo(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md flex-1 sm:mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </div>

      {!showAnalysis && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Unique Users</h2>
          <ul className="space-y-4">
            {uniqueUsers.map(user => (
              <li key={user._id} className="p-4 bg-white shadow-md rounded-lg border border-gray-200">
                <div className="flex flex-col text-gray-800">
                  <div><strong>Name:</strong> {user.name}</div>
                  <div><strong>Phone No:</strong> {user._id}</div>
                  <div><strong>Total Amount:</strong> ₹{user.totalOrderValue}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showAnalysis && analysisData && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Analysis Results</h2>
          <div className="p-4 bg-white shadow-md rounded-lg border border-gray-200">
            <p className="mb-2"><strong>Total Orders:</strong> {analysisData.totalOrders}</p>
            <p className="mb-2"><strong>Total Revenue:</strong> ₹{analysisData.totalRevenue}</p>
            <p className="mb-2"><strong>Total Profit:</strong> ₹{analysisData.totalProfit}</p>
            <p className="mb-4"><strong>Average Order Value:</strong> ₹{(analysisData.totalRevenue / analysisData.totalOrders).toFixed(2)}</p>

            <h3 className="text-lg font-semibold mb-2 text-gray-700">All Bills:</h3>
            <div className="space-y-4">
              {allBills.map(bill => (
                <div key={bill._id} className="p-4 bg-gray-100 rounded-lg border border-gray-200">
                  <div className="flex flex-col mb-4">
                    <div><strong>Name:</strong> {bill.customerName || '-'}</div>
                    <div><strong>Amount:</strong> ₹{bill.amount}</div>
                    <div><strong>Date:</strong> {new Date(bill.date).toLocaleDateString()}</div>
                    <div><strong>Payment Mode:</strong> {bill.paymentMode || '-'}</div>
                    <div><strong>Customer Table:</strong> {bill.customerTable || '-'}</div>
                    <div><strong>Order Profit:</strong> ₹{bill.profit || '-'}</div>
                    <div><strong>Order Revenue:</strong> ₹{bill.revenue || '-'}</div>
                  </div>
                  <button
                    onClick={() => handleOpenModal(bill)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Show Cart Details
                  </button>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-2 text-gray-700">Dish Quantities</h3>
            <div className="space-y-4">
              {dishQuantities.length > 0 ? (
                dishQuantities.map((dish) => (
                  <div key={dish.name} className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
                    <div className="flex flex-col text-gray-800">
                      <div><strong>Name:</strong> {dish.name}</div>
                      <div><strong>Total Price:</strong> ₹{dish.price}</div>
                      <div><strong>Total Quantity:</strong> {dish.quantity}</div>
                      <div><strong>Size:</strong> {dish.size}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div>No dish quantity data available</div>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 text-red-500 text-center">
          <p>{error}</p>
        </div>
      )}

      {/* Modal for Cart Details */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Cart Details"
        className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        ariaHideApp={false}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Cart Details</h2>
          {selectedBill ? (
            <div>
              <div className="space-y-4 mb-4">
                {selectedBill.cartItems.map(item => (
                  <div key={item.name} className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
                    <div className="flex flex-col text-gray-800">
                      <div><strong>Name:</strong> {item.name}</div>
                      <div><strong>Quantity:</strong> {item.quantity}</div>
                      <div><strong>Price:</strong> ₹{item.price}</div>
                      <div><strong>Cost Price:</strong> ₹{item.costPrice}</div>
                      <div><strong>Size:</strong> {item.size}</div>
                      <div><strong>Total Cost:</strong> ₹{item.totalItemCost}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>No cart details available</div>
          )}
          <button
            onClick={handleCloseModal}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
    </div>
  );
};

export default Uniqueuser;
