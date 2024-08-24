import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CustomerSign = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNo: '',
    email: '',
    password: ''
  });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState('');
  const [submitDisabled, setSubmitDisabled] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const sendOtp = async () => {
    try {
      const response = await axios.post('https://backendcafe-ceaj.onrender.com/send-otp', formData);
      if (response.data.success) {
        setOtpSent(true);
        setSubmitDisabled(true);
        setError('');
      } else {
        setError('Failed to send OTP');
      }
    } catch (error) {
      setError('Failed to send OTP');
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post('https://backendcafe-ceaj.onrender.com/verify-otp', { email: formData.email, otp });
      if (response.data.success) {
        setOtpVerified(true);
        setSubmitDisabled(false);
        setError('');
        navigate('/web/login'); // Redirect to login screen
      } else {
        setError('Invalid OTP');
      }
    } catch (error) {
      setError('Invalid OTP');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-center text-2xl font-bold">Sign Up</h1>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNo">
            Phone Number
          </label>
          <input
            type="text"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <button
          type="button"
          onClick={sendOtp}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={submitDisabled}
        >
          Send OTP
        </button>

        {otpSent && (
          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otp">
              Enter OTP
            </label>
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={handleOtpChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
            <button
              type="button"
              onClick={verifyOtp}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
            >
              Submit
            </button>
          </div>
        )}
      </form>

      {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}
    </div>
  );
};

export default CustomerSign;
