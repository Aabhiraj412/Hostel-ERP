
import React from 'react';
import Card from '@/components/Card';
import { useNavigate } from 'react-router-dom';


const HostelerLogin = () => {

  const navigate = useNavigate(); 

  const handleSubmit = (e) => {
    e.preventDefault(); 
    // Add any form validation or login logic here if necessary
    navigate('/hosteler-dashboard'); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
        background: 'radial-gradient(circle, rgba(0, 128, 128, 0.8) 0%, rgba(0, 0, 0, 0.8) 100%)',
      }}>
      <Card>
        <h1 className="text-center text-2xl font-bold text-white mb-4">HOSTELER LOGIN</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-white mb-1">Username:</label>
            <input
              type="text"
              placeholder="Enter Email or Phone Number or Aadhar"
              className="w-full p-2 bg-gray-800 text-white rounded-lg outline-none"
            />
          </div>
          <div>
            <label className="block text-white mb-1">Password:</label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full p-2 bg-gray-800 text-white rounded-lg outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold"
          >
            LOGIN
          </button>
        </form>
      </Card>
    </div>
  );
};

export default HostelerLogin;
