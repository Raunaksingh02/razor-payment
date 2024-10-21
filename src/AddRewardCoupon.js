import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddRewardCoupon = () => {
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');
  const [rewards, setRewards] = useState([]); // State to hold the list of rewards
  const [numLinks, setNumLinks] = useState(''); // Number of links to generate
  const [generatedLinks, setGeneratedLinks] = useState([]); // State for generated links

  // Fetch existing rewards when the component mounts
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await axios.get('https://backendcafe-zqt8.onrender.com/rewards'); // Adjust the endpoint as needed
        setRewards(response.data); // Assuming the response contains the array of rewards
      } catch (error) {
        console.error('Error fetching rewards:', error);
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
      const response = await axios.post('https://backendcafe-zqt8.onrender.com/rewards', rewardData);
      setRewards((prevRewards) => [...prevRewards, response.data]); // Update rewards state with the new reward
      setMessage('Reward added successfully!');
      setLabel('');
      setValue('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleDelete = async (rewardId) => {
    try {
      await axios.delete(`https://backendcafe-zqt8.onrender.com/rewards/${rewardId}`);
      setRewards((prevRewards) => prevRewards.filter((reward) => reward._id !== rewardId));
      setMessage('Reward deleted successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred while deleting the reward');
    }
  };

  // Handle generating links and saving to the backend
  const handleGenerateLinks = async () => {
    const numberOfLinks = parseInt(numLinks);
    if (!numberOfLinks || numberOfLinks <= 0) {
      setMessage('Please enter a valid number of links.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:1000/generate-links', { numLinks: numberOfLinks });
      setGeneratedLinks(response.data.links); // Assuming response contains an array of links
      setMessage('Links generated successfully!');
      setNumLinks('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error generating links.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
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

        {/* Render the list of rewards */}
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

        {/* Link Generator Section */}
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
          <button
            onClick={handleGenerateLinks}
            className="w-full mt-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
          >
            Generate Links
          </button>
        </div>

        {/* Render generated links */}
        {generatedLinks.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-800">Generated Links</h3>
            <ul className="mt-2 space-y-2">
              {generatedLinks.map((link, index) => (
                <li key={index} className="p-2 border border-gray-300 rounded-md">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {link.url}
                  </a>
                  <span className="ml-2 text-gray-500">(QR ID: {link.qrId})</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddRewardCoupon;
