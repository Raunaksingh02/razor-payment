import React, { useEffect, useState, memo } from 'react';
import axios from 'axios';
import { IoTimer } from "react-icons/io5";

const Heartbeat = memo(() => {
  const [heartbeatCount, setHeartbeatCount] = useState(0); // State to track heartbeat count

  useEffect(() => {
    const sendHeartbeat = async () => {
      try {
        const response = await axios.get('https://backendcafe-ceaj.onrender.com/getdish');
        console.log('Server response:', response.data);

        // Increment heartbeat count
        setHeartbeatCount(prevCount => prevCount + 1);
      } catch (error) {
        console.error('Error sending heartbeat:', error);
      }
    };

    // Send heartbeat immediately and then every 30 seconds
    sendHeartbeat();
    const intervalId = setInterval(sendHeartbeat, 20000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className='flex items-center'>
      <div>
      <IoTimer  className="h-8 w-8"/>
      </div>
      <div>
      <p className="  text-2xl font-bold ml-1 text-black">{heartbeatCount}</p>
      </div>
    </div>
  );
});

export default Heartbeat;
