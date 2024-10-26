import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Wheel } from 'react-custom-roulette';
import Confetti from 'react-confetti';
import { BuyerContext } from './components/Buyercontext.js';

const WheelComponent = () => {
  const { qrid } = useParams();
  const { isAuthenticated, buyer } = useContext(BuyerContext);

  const [rewards, setRewards] = useState([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [rewardWon, setRewardWon] = useState(null);
  const [hasSpun, setHasSpun] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isValidQR, setIsValidQR] = useState(null);
  const [isRedeemed, setIsRedeemed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (qrid) {
      fetchRewards();
      validateQRCode(qrid);
    }
  }, [qrid]);

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

  const validateQRCode = async (qrid) => {
    try {
      const response = await fetch(`https://backendcafe-zqt8.onrender.com/validateqr/${qrid}`);
      const data = await response.json();
      if (data.success) {
        setIsValidQR(true);
        setIsRedeemed(data.redeemed);
      } else {
        setIsValidQR(false);
        setError(data.message);
        setIsRedeemed(data.redeemed);
      }
    } catch (error) {
      console.error('Error validating QR code:', error);
      setError('Server error, please try again later.');
      setIsValidQR(false);
    } finally {
      setLoading(false);
    }
  };

  const getRandomColor = () => {
    const colors = ['#ff9999', '#ffcc66', '#99ff99', '#66ccff', '#ff66ff'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const spinWheel = async () => {
    if (isSpinning || hasSpun || rewards.length === 0 || isRedeemed) return;

    try {
      const response = await fetch(`https://backendcafe-zqt8.onrender.com/spin/${qrid}`, { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        const randomPrizeNumber = Math.floor(Math.random() * rewards.length);
        console.log("Prize number selected:", randomPrizeNumber); // Debugging
        setPrizeNumber(randomPrizeNumber);
        setMustSpin(true); // Start spinning
        setIsSpinning(true);

        setTimeout(() => {
          setRewardWon(rewards[randomPrizeNumber].option);
          setMustSpin(false); // Stop spinning
          setIsSpinning(false);
          setHasSpun(true);
          setShowConfetti(true);

          // Store the reward locally
          localStorage.setItem('spinReward', rewards[randomPrizeNumber].option);

          setTimeout(() => {
            setShowConfetti(false);
          }, 5000);
        }, 4000); // Adjust this delay if needed
      } else {
        setError('Failed to spin the wheel. QR code might already be spun.');
      }
    } catch (error) {
      console.error('Error spinning the wheel:', error);
      setError('Spin failed. Please try again.');
    }
  };

  const claimReward = async () => {
    if (isAuthenticated) {
      try {
        const response = await fetch(`https://backendcafe-zqt8.onrender.com/redeem/${qrid}`, { method: 'POST' });
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
