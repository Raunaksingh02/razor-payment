import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Wheel } from 'react-custom-roulette';
import Confetti from 'react-confetti';
import { BuyerContext } from './components/Buyercontext.js';

const WheelComponent = () => {
  const location = useLocation();
  const { isAuthenticated, buyer } = useContext(BuyerContext);
  const [rewards, setRewards] = useState([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [rewardWon, setRewardWon] = useState(null);
  const [hasSpun, setHasSpun] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isValidQR, setIsValidQR] = useState(null);
  const [isRedeemed, setIsRedeemed] = useState(false); // Track if QR is already redeemed
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qrid, setQrId] = useState('');

  // Parse the query string to get the qrId
  const query = new URLSearchParams(location.search);
  
  useEffect(() => {
    const qrIdFromURL = query.get('qrId');
    if (qrIdFromURL) {
      setQrId(qrIdFromURL);
      fetchRewards(); // Fetch rewards when component mounts
      validateQRCode(qrIdFromURL); // Validate QR ID
    }
  }, [location.search]);

  const fetchRewards = async () => {
    try {
      const response = await fetch('http://localhost:1000/REWARDS');
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

  const validateQRCode = async (qrId) => {
    try {
      const response = await fetch(`http://localhost:1000/validateqr/${qrId}`);
      const data = await response.json();
      if (data.success) {
        setIsValidQR(true); // Valid QR Code
        setIsRedeemed(data.redeemed); // Check if already redeemed
      } else {
        setIsValidQR(false); // Invalid or already used QR code
        setError(data.message); // Show error message
        setIsRedeemed(data.redeemed); // Set the redeemed status
      }
    } catch (error) {
      console.error('Error validating QR code:', error);
      setError('Server error, please try again later.');
      setIsValidQR(false);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  const getRandomColor = () => {
    const colors = ['#ff9999', '#ffcc66', '#99ff99', '#66ccff', '#ff66ff'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const spinWheel = async () => {
    if (isSpinning || hasSpun || rewards.length === 0 || isRedeemed) return;

    try {
      const response = await fetch(`http://localhost:1000/spin/${qrid}`, { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        setMustSpin(true);
        setIsSpinning(true);
        const randomPrizeNumber = Math.floor(Math.random() * rewards.length);
        setPrizeNumber(randomPrizeNumber);

        setTimeout(() => {
          setRewardWon(rewards[randomPrizeNumber].option);
          setIsSpinning(false);
          setMustSpin(false);
          setHasSpun(true);
          setShowConfetti(true);

          localStorage.setItem('spinReward', rewards[randomPrizeNumber].option);

          setTimeout(() => {
            setShowConfetti(false);
          }, 5000);
        }, 4000);
      } else {
        setError('Failed to spin the wheel. QR code might already be spinned.');
      }
    } catch (error) {
      console.error('Error spinning the wheel:', error);
    }
  };

  const claimReward = async () => {
    if (isAuthenticated) {
      try {
        const response = await fetch(`http://localhost:1000/redeem/${qrid}`, { method: 'POST' });
        const data = await response.json();
        if (data.success) {
          alert(`Reward of ${rewardWon} Points added to your wallet!`);
        } else {
          alert('Failed to redeem reward.');
        }
      } catch (error) {
        console.error('Error redeeming reward:', error);
      }
    } else {
      alert('Please log in to claim your reward.');
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Validating QR code...</div>;
  }

  if (!isValidQR) {
    return (
      <div className="text-center mt-20">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-center mb-10">Spin the Reward Wheel</h1>

      {isRedeemed ? (
        <p className="text-red-500 font-semibold mb-6">This QR code has already been redeemed.</p>
      ) : (
        <>
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
            />
          ) : (
            <p>Loading rewards...</p>
          )}

          <div className="mt-6">
            {!hasSpun ? (
              <button
                onClick={spinWheel}
                className={`px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors ${isRedeemed ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isRedeemed}
              >
                Spin Now
              </button>
            ) : (
              <button
                onClick={claimReward}
                className="px-6 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors"
              >
                Claim Reward
              </button>
            )}
          </div>

          {showConfetti && <Confetti />}
        </>
      )}
    </div>
  );
};

export default WheelComponent;
