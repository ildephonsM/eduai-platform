import React, { useState } from 'react';
import Button from '../ui/button';
import Input from '../ui/input';
import axios from 'axios';

const LoginModal = ({ setLoggedIn, setIsLoginModal, setIsRegisterModal }) => {
  const [email, setEmail] = useState(''); // State for email
  const [password, setPassword] = useState(''); // State for password

  // New handleLogin function
  const handleLogin = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        email,
        password,
      });
      if (response.status === 200) {
        setLoggedIn(true);
        setIsLoginModal(false);
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h3 className="text-lg font-bold mb-4">Login</h3>
        <Input
          placeholder="Email"
          className="mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Capture email input
        />
        <Input
          type="password"
          placeholder="Password"
          className="mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Capture password input
        />
        <div className="flex justify-between">
          <Button 
            onClick={handleLogin} // Call handleLogin on button click
            className="mr-2"
          >
            Submit
          </Button>
          <Button 
            onClick={() => setIsLoginModal(false)} 
            className="ml-2 bg-gray-500 text-white hover:bg-gray-600"
          >
            Cancel
          </Button>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm">
            Don’t have an account?{' '}
            <span
              onClick={() => {
                setIsLoginModal(false); // Close login modal
                setIsRegisterModal(true); // Open register modal
              }}
              className="text-blue-500 hover:text-blue-700 cursor-pointer"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
