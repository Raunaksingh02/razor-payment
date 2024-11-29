import React, { useState, useEffect } from 'react';
import axios from 'axios';
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";

const AddRewardCoupon = () => {
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');
  const [rewards, setRewards] = useState([]);
  const [numLinks, setNumLinks] = useState('');
  const [type, setType] = useState('wheel'); // Type of link (wheel/card)
  const [prizeName, setPrizeName] = useState(''); // Prize name for card type
  const [generatedLinks, setGeneratedLinks] = useState([]);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await axios.get('https://backendcafe-nefw.onrender.com/rewards');
        setRewards(response.data);
      } catch (error) {
        console.error('Error fetching rewards:', error);
        setMessage('Failed to fetch rewards');
      }
    };

    fetchRewards();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rewardData = {
      label,
      value: parseInt(value),
    };

    try {
      const response = await axios.post('https://backendcafe-nefw.onrender.com/rewards', rewardData);
      setRewards((prevRewards) => [...prevRewards, response.data]);
      setMessage('Reward added successfully!');
      setLabel('');
      setValue('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleDelete = async (rewardId) => {
    try {
      await axios.delete(`https://backendcafe-nefw.onrender.com/rewards/${rewardId}`);
      setRewards((prevRewards) => prevRewards.filter((reward) => reward._id !== rewardId));
      setMessage('Reward deleted successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred while deleting the reward');
    }
  };

  const handleGenerateLinks = async () => {
    const numberOfLinks = parseInt(numLinks);
    if (!numberOfLinks || numberOfLinks <= 0) {
      setMessage('Please enter a valid number of links.');
      return;
    }
    if (type === 'card' && !prizeName) {
      setMessage('Please enter a prize name for Card type links.');
      return;
    }

    try {
      const response = await axios.post('https://backendcafe-nefw.onrender.com/generate-links', {
        numOfLinks: numberOfLinks,
        type,
        prizeName,
      });
      setGeneratedLinks(response.data.links);
      setMessage('Links generated successfully!');
      setNumLinks('');
      setPrizeName('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error generating links.');
    }
  };


  const downloadQRWithText = (index) => {
    const qrContainer = document.getElementById(`qr-container-${index}`);
    html2canvas(qrContainer, {
      scale: 2, // High-resolution download
      useCORS: true, // To handle potential cross-origin issues
    }).then((canvas) => {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");

      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `qr-with-text-${index}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Add Reward Coupon</h2>

        {message && (
          <div className={`text-center mb-4 p-2 ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Reward Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              placeholder="Enter reward label"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Reward Value</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              placeholder="Enter reward value"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            Add Reward
          </button>
        </form>

        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-800">Existing Rewards</h3>
          {rewards.length === 0 ? (
            <p className="text-gray-500">No rewards available.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {rewards.map((reward) => (
                <li key={reward._id} className="flex justify-between p-2 border border-gray-300 rounded-md">
                  <span>{reward.label}</span>
                  <span>{reward.value} Points</span>
                  <button
                    onClick={() => handleDelete(reward._id)}
                    className="ml-4 text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-800">Generate Reward Links</h3>
          <div className="mt-4">
            <label className="block text-gray-700 font-medium">Number of Links</label>
            <input
              type="number"
              value={numLinks}
              onChange={(e) => setNumLinks(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              placeholder="Enter number of links"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700 font-medium">Link Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            >
              <option value="wheel">Wheel</option>
              <option value="card">Card</option>
            </select>
          </div>
          {type === 'card' && (
            <div className="mt-4">
              <label className="block text-gray-700 font-medium">Prize Name (for Card)</label>
              <input
                type="text"
                value={prizeName}
                onChange={(e) => setPrizeName(e.target.value)}
                className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                placeholder="Enter prize name"
              />
            </div>
          )}
          <button
            onClick={handleGenerateLinks}
            className="w-full mt-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
          >
            Generate Links
          </button>
        </div>
     
        {generatedLinks.length > 0 && (
        <>
          <h3 className="text-lg font-bold text-gray-800">Generated Links</h3>
          <ul className="mt-2 space-y-6">
            {generatedLinks.map((link, index) => (
              <li
                key={index}
                className="p-4 border border-gray-300 rounded-md bg-gray-50 sm:p-6"
              >
                <div
                  id={`qr-container-${index}`}
                  className="flex flex-col items-center bg-white p-3 sm:p-4 rounded-md"
                  style={{ paddingBottom: "16px" }}
                >
                  <p className="text-center font-semibold text-lg text-[#f6931e] leading-tight mb-3 sm:mb-4">
                    Scan this QR <br /> and get your assured gift
                  </p>
                  <div className="mt-2">
                    <QRCodeCanvas
                      value={link}
                      size={150}
                      bgColor={"#ffffff"}
                      fgColor={"#000000"}
                      level={"H"}
                    />
                  </div>
                </div>
                <button
                  onClick={() => downloadQRWithText(index)}
                  className="mt-4 w-full bg-[#f6931e] text-white font-semibold py-2 rounded-md hover:bg-[#d67f19] sm:py-3"
                >
                  Download QR with Text
                </button>
                <div className="mt-4 text-center">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline break-words"
                  >
                    {link}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      
      </div>
    </div>
  );
};

export default AddRewardCoupon;
