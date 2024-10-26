import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Wheel } from 'react-custom-roulette';
import Confetti from 'react-confetti';

const WheelComponent = () => {
  const { qrid } = useParams();
  const [rewards, setRewards] = useState([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [isValidQR, setIsValidQR] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  // Validate the QR code on component mount
  useEffect(() => {
    validateQRCode(qrid);
    fetchRewards();
  }, [qrid]);

  const validateQRCode = async (qrid) => {
    try {
      const response = await fetch(`https://backendcafe-zqt8.onrender.com/validateqr/${qrid}`);
      const data = await response.json();
      if (data.success) {
        setIsValidQR(true);
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

  // Spin the wheel when the button is clicked
  const spinWheel = () => {
    if (isValidQR && rewards.length > 0) {
      const randomPrizeNumber = Math.floor(Math.random() * rewards.length);
      setPrizeNumber(randomPrizeNumber);
      setMustSpin(true);
    }
  };

  // Trigger confetti when the wheel stops spinning
  const handleSpinEnd = () => {
    setMustSpin(false);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000); // Confetti lasts for 3 seconds
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
        <button
          onClick={spinWheel}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
        >
          Spin Now
        </button>
      </div>

      {/* Confetti component - Only shows if showConfetti is true */}
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
    </div>
  );
};

export default WheelComponent;
