import React, { useState, useEffect } from 'react';

const Walletgif = ({ videoSrc, duration = 5000, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        onComplete();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <video
        src={videoSrc}
        autoPlay
        muted
        className="w-full h-full object-cover"
        loop={false}
        onEnded={() => {
          setIsVisible(false);
          if (onComplete) {
            onComplete();
          }
        }}
      />
    </div>
  );
};

export default Walletgif;
