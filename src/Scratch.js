import React, { useState, useEffect, useContext } from 'react';
import ScratchCard from 'react-scratchcard';
import Confetti from 'react-confetti';
import { useParams, useNavigate } from 'react-router-dom';
import scratchImage from './images/scratchcard.png'; // Update to correct path
import { BuyerContext } from './components/Buyercontext.js';
import Walletgif from './Walletgif.js';

const Scratch = () => {
  const { qrid, reward } = useParams(); // Extract reward from URL
  const { isAuthenticated, buyer } = useContext(BuyerContext);
  const navigate = useNavigate();

  const [isScratched, setIsScratched] = useState(false);
  const [isRedeemed, setIsRedeemed] = useState(false);
  const [isValidQR, setIsValidQR] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (qrid) {
      validateQRCode(qrid);
    }
  }, [qrid]);

  const validateQRCode = async (qrid) => {
    try {
      const response = await fetch(`https://backendcafe-nefw.onrender.com/validateqr/${qrid}`);
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

  const handleComplete = () => {
    setIsScratched(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const claimReward = async () => {
    if (isAuthenticated) {
      try {
        const addWalletResponse = await fetch(`https://backendcafe-nefw.onrender.com/addwallet`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reward: parseInt(reward), email: buyer.email }),
        });
        const walletData = await addWalletResponse.json();

        if (!walletData.success) {
          alert('Use this QR on shop to get reward');
          return;
        }

        const redeemResponse = await fetch(`https://backendcafe-nefw.onrender.com/updateredeemed/${qrid}`, { method: 'POST' });
        const redeemData = await redeemResponse.json();

        if (redeemData.success) {
          alert(`Reward of Rs ${reward} added to your wallet!`);
          setIsRedeemed(true);
        } else {
          alert('Use this QR on shop to get reward');
        }
      } catch (error) {
        console.error('Error redeeming reward:', error);
      }
    } else {
      alert('Please log in to claim your reward.');
      navigate('/web/signup');
    }
  };

  if (showSplash) {
    return (
      <Walletgif
        videoSrc="https://easypay.in/images/slide2.mp4"
        duration={5000}
        onComplete={() => setShowSplash(false)}
      />
    );
  }

  if (loading) {
    return <div className="text-center mt-20">Validating Scratch code...</div>;
  }

  if (!isValidQR) {
    return (
      <div className="text-center mt-20">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 via-blue-300 to-blue-500">
      <h1 className="text-4xl font-bold mb-6 text-white">Scratch and Win!</h1>

      <div className="rounded-2xl shadow-2xl shadow-gray-300 animate-slideInFromBottom p-4 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
        {isRedeemed ? (
          <p className="text-red-500 font-semibold text-center mb-4">
            This QR code has already been redeemed.
          </p>
        ) : (
          <ScratchCard
            className="rounded-xl"
            width={300}
            height={300}
            image={scratchImage}
            finishPercent={80}
            onComplete={handleComplete}
          >
            <div className="text-center mr-6 mt-6 text-2xl font-bold">
              <p>
                Congrats!
                <br />
                <h2 className="text-md">You've won {reward}.</h2>
              </p>
            </div>
          </ScratchCard>
        )}
      </div>

      {isScratched && !isRedeemed && (
        <button
          onClick={claimReward}
          className="mt-8 px-6 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-all duration-300 shadow-md"
        >
          Claim Reward
        </button>
      )}

      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
    </div>
  );
};

export default Scratch;
