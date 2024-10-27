import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Wheel } from 'react-custom-roulette';
import Confetti from 'react-confetti';
import { BuyerContext } from './components/Buyercontext.js';

const WheelComponent = () => {
  const { qrid } = useParams();
  const navigate = useNavigate();
  const [rewards, setRewards] = useState([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [isValidQR, setIsValidQR] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { isAuthenticated, buyer } = useContext(BuyerContext);

  useEffect(() => {
    validateQRCode(qrid);
    fetchRewards();
  }, [qrid]);

  const validateQRCode = async (qrid) => {
    try {
      const response = await fetch(`https://backendcafe-zqt8.onrender.com/validateqr/${qrid}`);
      const data = await response.json();
      setIsValidQR(data.success);
    } catch (error) {
      console.error('Error validating QR code:', error);
      setIsValidQR(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchRewards = async () => {
    try {
      const response = await fetch('https://backendcafe-zqt8.onrender.com/REWARDS');
      const data = await response.json();
      if (response.ok) {
        const formattedRewards = data.map((reward) => ({
          option: reward.value,
          style: { backgroundColor: getRandomColor(), textColor: 'white' },
        }));
        setRewards(formattedRewards);
      } else {
        console.error('Failed to fetch rewards:', data);
      }
    } catch (error) {
      console.error('Error fetching rewards:', error);
    }
  };

  const getRandomColor = () => {
    const colors = ['#ff9999', '#ffcc66', '#99ff99', '#66ccff', '#ff66ff'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const spinWheel = () => {
    if (isValidQR && rewards.length > 0) {
      const randomPrizeNumber = Math.floor(Math.random() * rewards.length);
      setPrizeNumber(randomPrizeNumber);
      setMustSpin(true);
    }
  };

  const handleSpinEnd = () => {
    setMustSpin(false);
    setHasSpun(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const redeemReward = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true); // Show login prompt if not authenticated
      return;
    }
  
    try {
      const rewardAmount = rewards[prizeNumber].option;
  
      // Step 1: Add reward to buyer's wallet
      const response = await fetch(`https://backendcafe-zqt8.onrender.com/addwallet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reward: rewardAmount, email: buyer.email }),
      });
      const data = await response.json();
  
      if (data.success) {
        alert('Reward added to wallet successfully!');
  
        // Step 2: Update QR code status as redeemed
        const updateResponse = await fetch(`https://backendcafe-zqt8.onrender.com/updateredeemed/${qrid}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const updateData = await updateResponse.json();
  
        if (updateData.success) {
          alert('QR code marked as redeemed!');
        } else {
          console.error('Failed to mark QR code as redeemed:', updateData.message);
        }
      } else {
        alert('Failed to add reward to wallet.');
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
      alert('Server error while redeeming reward.');
    }
  };
  
  if (loading) {
    return <div className="text-center mt-20">Validating QR code...</div>;
  }

  if (!isValidQR) {
    return (
      <div className="text-center mt-20">
        <p className="text-red-500 font-semibold">Invalid QR code.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-center mb-10">Spin the Reward Wheel</h1>
      {rewards.length > 0 ? (
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={rewards}
          backgroundColors={['#3e3e3e', '#df3428']}
          textColors={['#ffffff']}
          outerBorderColor="#ddd"
          outerBorderWidth={10}
          innerRadius={30}
          innerBorderColor="#fff"
          innerBorderWidth={5}
          radiusLineColor="#eee"
          radiusLineWidth={5}
          fontSize={18}
          onStopSpinning={handleSpinEnd}
        />
      ) : (
        <p>Loading rewards...</p>
      )}
      
      <div className="mt-6">
        {!hasSpun ? (
          <button
            onClick={spinWheel}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
          >
            Spin Now
          </button>
        ) : (
          <button
            onClick={redeemReward}
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors"
          >
            Redeem
          </button>
        )}
      </div>

      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-md shadow-lg text-center">
            <p className="mb-4 font-semibold">Please log in to redeem your reward.</p>
            <button
              onClick={() => navigate('/web/signup')}
              className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WheelComponent;
