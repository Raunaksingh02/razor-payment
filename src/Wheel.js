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
  const [prizeAmount, setPrizeAmount] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { isAuthenticated, buyer } = useContext(BuyerContext);

  useEffect(() => {
    validateQRCode(qrid);
    fetchRewards();
  }, [qrid]);

  const validateQRCode = async (qrid) => {
    try {
      const response = await fetch(`https://backendcafe-nefw.onrender.com/validateqr/${qrid}`);
      const data = await response.json();

      if (data.success) {
        setIsValidQR(true);
        if (data.spinned) {
          setHasSpun(true);
          setPrizeAmount(data.prizeAmount);
        }
      } else {
        setIsValidQR(false);
      }
    } catch (error) {
      console.error('Error validating QR code:', error);
      setIsValidQR(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchRewards = async () => {
    try {
      const response = await fetch('https://backendcafe-nefw.onrender.com/REWARDS');
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
    if (!hasSpun && isValidQR && rewards.length > 0) {
      const randomPrizeNumber = Math.floor(Math.random() * rewards.length);
      setPrizeNumber(randomPrizeNumber);
      setMustSpin(true);
    }
  };

  const handleSpinEnd = async () => {
    setMustSpin(false);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    setHasSpun(true);

    const rewardAmount = rewards[prizeNumber].option;
    setPrizeAmount(rewardAmount);

    try {
      const response = await fetch(`https://backendcafe-nefw.onrender.com/updatespinned/${qrid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prizeAmount: rewardAmount, spinned: true }),
      });
      const data = await response.json();

      if (!data.success) {
        console.error('Error updating spin status:', data.message);
        alert('Failed to update spin status on the server.');
      }
    } catch (error) {
      console.error('Error updating spin status:', error);
    }
  };

  const redeemReward = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
  
    try {
      // Step 1: Add reward to wallet
      const addWalletResponse = await fetch(`https://backendcafe-nefw.onrender.com/addwallet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reward: prizeAmount, email: buyer.email }),
      });
      const walletData = await addWalletResponse.json();
  
      if (!walletData.success) {
        alert('Failed to add reward to wallet.');
        return;
      }
  
      // Step 2: Update the QR code as redeemed
      const updateRedeemedResponse = await fetch(`https://backendcafe-nefw.onrender.com/updateredeemed/${qrid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const redeemData = await updateRedeemedResponse.json();
  
      if (redeemData.success) {
        alert('Reward added to wallet and QR code marked as redeemed!');
        // Optional: Redirect or refresh page
        navigate('/'); // Replace '/some-page' with the page you want to redirect to after redemption
      } else {
        alert('Reward added to wallet, but failed to mark QR code as redeemed.');
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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 relative overflow-hidden">
    {/* Background Animation */}
    <div
      className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 opacity-80"
      style={{
        animation: 'pulse 4s infinite ease-in-out',
      }}
    ></div>
    <div className="absolute inset-0">
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[#f6931e] rounded-full opacity-50"
        style={{
          animation: 'pulseSlow 5s infinite alternate',
          background: 'radial-gradient(circle, #f6931e, transparent)',
        }}
      ></div>
    </div>

    <h1 className="text-center mb-10 text-4xl font-bold animate-slideInFromBottom text-white relative z-10">Spin the Reward Wheel</h1>

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
      <p className="text-white z-10">Loading rewards...</p>
    )}

    <div className="mt-6 z-10">
      {hasSpun ? (
        <>
          <p className="mb-4 ml-4 font-bold text-white">Prize: {prizeAmount}</p>
          <button
            onClick={redeemReward}
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors"
          >
            Redeem
          </button>
        </>
      ) : (
        <button
          onClick={spinWheel}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
        >
          Spin Now
        </button>
      )}
    </div>

    {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

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



