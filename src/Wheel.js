import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // For redirecting to login
import { BuyerContext } from './components/Buyercontext.js';
import batchlogo from './images/batchlogo.jpg';// Ensure the correct path to the image

const Wheel = () => {
  const { isAuthenticated, buyer } = useContext(BuyerContext);
  const [isSpinning, setIsSpinning] = useState(false);
  const [reward, setReward] = useState(null);
  const [rotationDegree, setRotationDegree] = useState(0);
  const [showSplash, setShowSplash] = useState(true); // State for splash screen
  const [showCoins, setShowCoins] = useState(false); // New state for coin blast
  const [hasSpun, setHasSpun] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [rewards, setRewards] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the unique QR ID from the query params
  const searchParams = new URLSearchParams(location.search);
  const qrId = searchParams.get('qrId');

  // Fetch rewards from the backend
  const fetchRewards = async () => {
    try {
      const response = await fetch('https://backendcafe-zqt8.onrender.com/REWARDS');
      const data = await response.json();
      if (response.ok) {
        setRewards(data); // Set the rewards array with data fetched from backend
      } else {
        console.error('Failed to fetch rewards:', data);
      }
    } catch (error) {
      console.error('Error fetching rewards:', error);
    }
  };

  // Handle the splash screen timing
  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      setShowSplash(false); // Hide the splash screen after 2 seconds
    }, 2000);

    return () => clearTimeout(splashTimeout); // Clean up the timeout when component unmounts
  }, []);

  useEffect(() => {
    fetchRewards();
    const savedReward = localStorage.getItem(`spinReward-${qrId}`);
    const rewardClaimed = localStorage.getItem(`rewardClaimed-${qrId}`);
    if (savedReward) {
      setReward(savedReward);
      setHasSpun(true);
    }
    if (rewardClaimed) {
      setHasClaimed(true);
    }
  }, [qrId]);

  const spinWheel = () => {
    if (isSpinning || hasSpun || hasClaimed || rewards.length === 0) return;

    setIsSpinning(true);
    setShowCoins(false); // Reset coins

    const randomIndex = Math.floor(Math.random() * rewards.length);
    const chosenReward = rewards[randomIndex];
    const newSpinDegrees = 360 * 5 + randomIndex * (360 / rewards.length);
    setRotationDegree(newSpinDegrees);

    setTimeout(() => {
      setReward(chosenReward.value);
      setIsSpinning(false);
      setShowCoins(true); // Trigger coin blast after spin
      localStorage.setItem(`spinReward-${qrId}`, chosenReward.value);
      setHasSpun(true);
      setTimeout(() => setShowCoins(false), 3000); // Coins disappear after 3 seconds
    }, 4000);
  };

  const updateWallet = async () => {
    try {
      const response = await fetch(`https://backendcafe-zqt8.onrender.com/addwallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reward, email: buyer?.email }),
      });
      const data = await response.json();
      if (data.success) {
        alert(`Reward of ${reward} Points added to your wallet!`);
        localStorage.setItem(`rewardClaimed-${qrId}`, 'true');
        setHasClaimed(true);
      } else {
        alert('Failed to add reward to wallet.');
      }
    } catch (error) {
      console.error('Error updating wallet:', error);
    }
  };

  const claimReward = () => {
    if (isAuthenticated) {
      updateWallet();
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    navigate('/web/login');
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gray-100 overflow-hidden">
      {showSplash ? (
        // Splash Screen
        <div className="flex flex-col items-center justify-center">
          <img src="https://as1.ftcdn.net/v2/jpg/01/57/34/36/1000_F_157343659_AAoqxJk3YhUtOasJ2XQsOpmhkE5p5gz5.jpg" alt="Reward Logo" className="w-30 h-30" />
          <p className="mt-4 text-xl font-bold">Welcome to the Reward Wheel!</p>
        </div>
      ) : (
        // Main Wheel Component
        <div className="relative z-10 mt-10 flex flex-col items-center justify-center">
          <h1 className="text-center mb-10">REWARD WHEEL</h1>

          {/* Wheel with Needle */}
          <div className="relative">
            <div
              id="wheel"
              className={`w-64 h-64 rounded-full border-8 border-yellow-500 shadow-lg relative ${hasClaimed ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{
                background: `conic-gradient(
                  #ff9999 0% 20%, 
                  #ffcc66 20% 40%, 
                  #99ff99 40% 60%, 
                  #66ccff 60% 80%, 
                  #ff66ff 80% 100%
                )`,
                transform: `rotate(${rotationDegree}deg)`,
                transition: 'transform 4s ease-out',
              }}
            >
              {/* Prize labels */}
              {rewards.map((reward, index) => {
                const angle = (360 / rewards.length) * index;
                return (
                  <div
                    key={index}
                    className="absolute w-full h-full flex items-center justify-center"
                    style={{
                      transform: `rotate(${angle}deg)`,
                    }}
                  >
                    <div
                      className="absolute text-sm p-2 font-bold text-white"
                      style={{
                        transform: `rotate(${360 / rewards.length / 2}deg) translateY(-120px)`,
                      }}
                    >
                      {reward.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Needle */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-16 border-transparent border-b-black z-20"></div>
          </div>

          {/* Spin or Claim Button */}
          <div className="mt-6 flex flex-col items-center">
            {!hasSpun && !hasClaimed ? (
              <button
                onClick={spinWheel}
                className="mt-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600"
                disabled={isSpinning || hasClaimed}
              >
                {isSpinning ? 'Spinning...' : 'Spin'}
              </button>
            ) : hasSpun && !hasClaimed ? (
              <button
                onClick={claimReward}
                className="mt-4 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600"
                disabled={hasClaimed}
              >
                {hasClaimed ? 'Reward Claimed' : 'Claim Reward'}
              </button>
            ) : (
              <button
                className="mt-4 px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-lg cursor-not-allowed"
                disabled
              >
                Redeemed
              </button>
            )}

            {/* Display reward */}
            {reward && (
              <div className="mt-4 text-xl font-bold text-green-700 text-center z-10">
                Congratulations! You won: {reward} Points!
              </div>
            )}
          </div>

          {/* Coin Blast Animation */}
          {showCoins && (
            <div className="absolute inset-0 z-30 coin-blast-animation">
              <div className="coin">💰</div>
              <div className="coin">💰</div>
              <div className="coin">💰</div>
            </div>
          )}
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-4">Login Required</h2>
            <p className="mb-4">You need to be logged in to claim your reward.</p>
            <button
              onClick={handleLoginRedirect}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wheel;
