import React, { useEffect, memo } from 'react';
import axios from 'axios';

const Heartbeat = memo(() => {
  useEffect(() => {
    const sendHeartbeat = async () => {
      try {
        const response = await axios.get('https://backendcafe-ceaj.onrender.com/getdish');
        console.log('Server response:', response.data);
      } catch (error) {
        console.error('Error sending heartbeat:', error);
      }
    };

    // Send heartbeat immediately and then every 30 seconds
    sendHeartbeat();
    const intervalId = setInterval(sendHeartbeat, 30000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return null; // This component does not render anything
});

export default Heartbeat;







