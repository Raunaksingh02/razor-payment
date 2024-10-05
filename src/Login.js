import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import loginlogo1 from "./images/loginlogo1.jpg";

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://backendcafe-zqt8.onrender.com/api/login', { username, password });
      if (response.data.success) {
        login();
        navigate('/Owner'); 
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-3xl font-bold text-center">Cafe House</h2>
        <div className="flex justify-center mb-6">
          <img
            src={loginlogo1}
            alt="Login Logo"
            className="h-50 w-50 "
          />
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-bold text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700 focus:outline-none"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
