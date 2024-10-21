import React, { useState, useEffect, useContext } from 'react';
import ScratchCard from 'react-scratchcard';
import Confetti from 'react-confetti';
import { useLocation } from 'react-router-dom';
import scratchImage from './images/scratchcard.png'; // Ensure the path is correct
import { BuyerContext } from './components/Buyercontext.js';

const Scratch = () => {
  const location = useLocation();
  const { isAuthenticated, buyer } = useContext(BuyerContext);
  const [isScratched, setIsScratched] = useState(false);
  const [isRedeemed, setIsRedeemed] = useState(false); // Track if QR is already redeemed
  const [isValidQR, setIsValidQR] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qrid, setQrId] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  // Parse the query string to get the qrId
  const query = new URLSearchParams(location.search);

  useEffect(() => {
    const qrIdFromURL = query.get('qrId');
    if (qrIdFromURL) {
      setQrId(qrIdFromURL);
      validateQRCode(qrIdFromURL); // Validate QR ID
    }
  }, [location.search]);

  const validateQRCode = async (qrId) => {
    try {
      const response = await fetch(`https://backendcafe-zqt8.onrender.com/validateqr/${qrId}`);
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

  // Function to send two WhatsApp messages
  const sendWhatsAppMessages = () => {
    const phone1 = '911234567890'; // Replace with first phone number (country code included)
    const phone2 = '919876543210'; // Replace with second phone number (country code included)
    const message1 = encodeURIComponent('Hello, this is your first message from the Scratch and Win!');
    const message2 = encodeURIComponent('Hello, this is your second message from the Scratch and Win!');

    // Open WhatsApp chats for both numbers
    window.open(`https://api.whatsapp.com/send?phone=${phone1}&text=${message1}`, '_blank');
    window.open(`https://api.whatsapp.com/send?phone=${phone2}&text=${message2}`, '_blank');
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

      {/* WhatsApp Button */}
      <button
        onClick={sendWhatsAppMessages}
        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors mt-4"
      >
        Send WhatsApp Messages
      </button>
    </div>
  );
};

export default Scratch;
