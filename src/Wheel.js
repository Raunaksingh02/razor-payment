import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // For redirecting to login
import { BuyerContext } from './components/Buyercontext.js';

const Wheel = () => {
  const { isAuthenticated, buyer } = useContext(BuyerContext);
  const [isSpinning, setIsSpinning] = useState(false);
  const [reward, setReward] = useState(null);
  const [rotationDegree, setRotationDegree] = useState(0); 
  const [showSparkle, setShowSparkle] = useState(false); 
  const [showFlowers, setShowFlowers] = useState(false); 
  const [hasSpun, setHasSpun] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false); // Track if the reward has been claimed
  const [rewards, setRewards] = useState([]); // Store fetched rewards

  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the unique QR ID from the query params
  const searchParams = new URLSearchParams(location.search);
  const qrId = searchParams.get('qrId'); 
  console.log(qrId);
  // Example: /wheel?qrId=12345

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

  useEffect(() => {
    fetchRewards(); // Fetch rewards on component mount
    const savedReward = localStorage.getItem(`spinReward-${qrId}`);
    const rewardClaimed = localStorage.getItem(`rewardClaimed-${qrId}`);
    if (savedReward) {
      setReward(savedReward);
      setHasSpun(true);
    }
    if (rewardClaimed) {
      setHasClaimed(true); // User already claimed reward
    }
  }, [qrId]);

  const spinWheel = () => {
    if (isSpinning || hasSpun || hasClaimed || rewards.length === 0) return; // Prevent spin if already spun, claimed, or no rewards

    setIsSpinning(true);
    setShowFlowers(false);

    const randomIndex = Math.floor(Math.random() * rewards.length);
    const chosenReward = rewards[randomIndex];
    const newSpinDegrees = 360 * 5 + randomIndex * (360 / rewards.length);
    setRotationDegree(newSpinDegrees);

    setTimeout(() => {
      setReward(chosenReward.value);
      setIsSpinning(false);
      setShowSparkle(true);
      setShowFlowers(true);

      localStorage.setItem(`spinReward-${qrId}`, chosenReward.value);
      setHasSpun(true);
      setTimeout(() => setShowSparkle(false), 3000);
    }, 4000);
  };

  // Function to update the customer's wallet
  const updateWallet = async () => {
    try {
      const response = await fetch(`https://backendcafe-zqt8.onrender.com/addwallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reward, email: buyer?.email }), // Include buyer email
      });
      const data = await response.json();
      if (data.success) {
        alert(`Reward of ${reward} Points added to your wallet!`);
        localStorage.setItem(`rewardClaimed-${qrId}`, 'true'); // Mark as claimed
        setHasClaimed(true); // Prevent further spins
      } else {
        alert('Failed to add reward to wallet.');
      }
    } catch (error) {
      console.error('Error updating wallet:', error);
    }
  };

  const claimReward = () => {
    if (isAuthenticated) {
      // Add the reward to the wallet
      updateWallet();
    } else {
      // Show login modal if user is not authenticated
      setShowLoginModal(true);
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    navigate('/web/login'); // Redirect to the login page
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gray-100 overflow-hidden">
      <h1 className="text-center mb-10">REWARD WHEEL</h1>

      {/* Sparkle effect */}
      {showSparkle && (
        <div className="absolute inset-0 z-20 pointer-events-none sparkle-overlay"></div>
      )}

      {/* Main Content */}
      <div className="relative z-10 mt-10 flex flex-col items-center justify-center">
        {/* Wheel */}
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

        {/* Buttons and Reward */}
        <div className="mt-6 flex flex-col items-center">
          {/* Spin Button or Claim Reward */}
          {!hasSpun && !hasClaimed ? (
            <button
              onClick={spinWheel}
              className="mt-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600"
              disabled={isSpinning || hasClaimed} // Disable if already claimed
            >
              {isSpinning ? 'Spinning...' : 'Spin'}
            </button>
          ) : hasSpun && !hasClaimed ? (
            <button
              onClick={claimReward}
              className="mt-4 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600"
              disabled={hasClaimed} // Disable if already claimed
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

        {/* Flower animation */}
        {showFlowers && (
          <div className="absolute inset-0 z-30 flowers-animation">
            <div className="flower">🌸</div>
            <div className="flower">🌼</div>
            <div className="flower">🌺</div>
          </div>
        )}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Login Required</h2>
            <p className="mb-4">You need to log in to claim your reward.</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleLoginRedirect}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wheel;
