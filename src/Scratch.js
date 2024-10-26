import React, { useState, useEffect, useContext } from 'react';
import ScratchCard from 'react-scratchcard';
import Confetti from 'react-confetti';
import { useParams } from 'react-router-dom'; // Import useParams
import scratchImage from './images/scratchcard.png'; // Ensure the path is correct
import { BuyerContext } from './components/Buyercontext.js';

const Scratch = () => {
  const { qrid } = useParams(); // Get qrid directly from the URL parameters
  const { isAuthenticated, buyer } = useContext(BuyerContext);
  const [isScratched, setIsScratched] = useState(false);
  const [isRedeemed, setIsRedeemed] = useState(false); // Track if QR is already redeemed
  const [isValidQR, setIsValidQR] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (qrid) {
      validateQRCode(qrid); // Validate QR ID if available
    }
  }, [qrid]);

  const validateQRCode = async (qrid) => {
    try {
      const response = await fetch(`https://backendcafe-zqt8.onrender.com/validateqr/${qrid}`);
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
      setLoading(false);
    }
  };

  const handleComplete = () => {
    setIsScratched(true);
    setShowConfetti(true);

    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  const claimReward = async () => {
    if (isAuthenticated) {
      try {
        const response = await fetch(`https://backendcafe-zqt8.onrender.com/updateredeemed/${qrid}`, { method: 'POST' });
        const data = await response.json();
        if (data.success) {
          alert(`Reward of Rs 10 added to your wallet!`);
          setIsRedeemed(true); // Mark the reward as redeemed
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Heading */}
      <h1 className="text-2xl font-bold mb-4  mr-6 text-center text-gray-800">
        Scratch and Win!
      </h1>

      {/* Scratch Card Container */}
      {isRedeemed ? (
        <p className="text-red-500 font-semibold mb-6">This QR code has already been redeemed.</p>
      ) : (
        <>
          <div className="animate-slideInFromBottom ml-6">
            <ScratchCard
              width={320}
              height={200}
              image={scratchImage} // Image for the scratch card background
              finishPercent={50} // The percentage required to complete scratching
              onComplete={handleComplete}
            >
              {/* Scratch Card Inner Content */}
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-xl font-semibold text-green-500">
                  Rs 10 Gift!
                </h2>
              </div>
            </ScratchCard>
          </div>

          {/* Confetti and Congratulations Message */}
          {isScratched && (
            <div className="flex flex-col items-center justify-center mt-6">
              <Confetti numberOfPieces={400} recycle={false} /> {/* Confetti effect */}
              <h2 className="text-3xl font-bold text-orange-500 text-center">
                Congratulations!
              </h2>
              <p className="text-lg text-gray-700 text-center">
                You won Rs 10 Gift!
              </p>
              <button
                onClick={claimReward}
                className="px-6 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors mt-4"
              >
                Claim Reward
              </button>
            </div>
          )}
        </>
      )}

   
    </div>
  );
};

export default Scratch;



















