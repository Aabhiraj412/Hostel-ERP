import React from 'react';

const HomePage = () => {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background: 'radial-gradient(circle, rgba(0, 128, 128, 0.8) 0%, rgba(0, 0, 0, 0.8) 100%)',
      }}
    >
      <h1 className="text-4xl font-bold text-white mb-10">Hostel-ERP</h1>
      <div className="flex space-x-6">
        {/* Admin Card */}
        <div className="w-[300px] p-6 bg-white/30 backdrop-blur-lg rounded-lg shadow-lg hover:scale-105 transform transition duration-300">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">Login as Warden</h2>
          <p className="text-gray-700 text-center mb-4">Manage hostel operations, rooms, and facilities.</p>
          <a
            href="/admin-login"
            className="block w-full bg-teal-600 text-white text-center py-2 rounded-lg hover:bg-teal-700"
          >
            Continue
            
          </a>
        </div>

        {/* Hosteler Card */}
        <div className="w-[300px] p-6 bg-white/30 backdrop-blur-lg rounded-lg shadow-lg hover:scale-105 transform transition duration-300">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">Login as Hosteler</h2>
          <p className="text-gray-700 text-center mb-4">Access personal details, room info, and complaints.</p>
          <a
            href="/hosteler-login"
            className="block w-full bg-teal-600 text-white text-center py-2 rounded-lg hover:bg-teal-700"
          >
            Continue
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
