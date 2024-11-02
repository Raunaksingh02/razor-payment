import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { BuyerContext } from './Buyercontext.js'; // Adjust path as necessary

const Customerlogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { login } = useContext(BuyerContext); // Get the login function from context
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:1000/login', formData);
      if (response.data.success) {
        login(response.data.customer); // Update BuyerContext with customer data
        alert('Login successful');
        navigate('/');
      } else {
        alert(response.data.message || 'Login failed');
      }
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl text-center font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-[#f6931e] focus:ring focus:ring-[#f6931e] focus:ring-opacity-50"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-[#f6931e] focus:ring focus:ring-[#f6931e] focus:ring-opacity-50"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#f6931e] text-white py-2 px-4 rounded-md shadow-sm hover:bg-[#f6931e] focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        >
          Login
        </button>
      </form>

      <div className="mt-4 text-center">
        <span className="text-sm text-gray-700">Don't have an account?</span>
        <Link
          to="/web/signup"
          className="text-sm text-[#f6931e] hover:text-[#f6931e] ml-1"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Customerlogin;
