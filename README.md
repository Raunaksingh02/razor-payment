

PASSWORD OF TWILIO = HOTLAUNDA123456,HOTLAUNDA



  const invoiceLink = `https://cafehouse.vercel.app/invoice/${_id}`;
        const message = `Here is your invoice: ${invoiceLink}`;
        const whatsappLink = `https://api.whatsapp.com/send?phone=91${paymentDetails.customerPhoneNo}&text=${encodeURIComponent(message)}`;       
    
    <div>
                <button onClick={() => window.open(whatsappLink, '_blank')} className="btn btn-primary">
                    Send via WhatsApp
                </button>
            </div>




import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io("https://backendcafe-ceaj.onrender.com");

function Calling(props) {
  const [requests, setRequests] = useState([]);
  const audioRef = useRef(new Audio('/alertsound.mp3'));

  useEffect(() => {
    const audioElement = audioRef.current;
    audioElement.load(); // Preload the audio

    socket.on('Request', (data) => {
      const newRequest = { ...data, time: new Date().toLocaleTimeString() };
      setRequests(prevRequests => [...prevRequests, newRequest]);
      playAlertSound();
    });

    return () => {
      socket.off('Request');
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playAlertSound = () => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.currentTime = 0; // Ensure the sound plays from the start
      audioElement.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  };

  const removeRequest = (index) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setRequests(requests.filter((_, i) => i !== index));
  };

  return (
    <div>
      {requests.map((request, index) => (
        <div key={index} className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-extrabold">Incoming Call from {request.table}!</strong>
          <span className="block sm:inline"> {request.query} at {request.time}</span>
          <button
            onClick={() => removeRequest(index)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
      ))}
    </div>
  );
}

export default Calling;






























