import React, { useState, useEffect } from 'react';
import MiniVariantDrawer from '../../components/MiniVariantDrawer';

const ViewPrivateGrievances = () => {
  const initialGrievances = [
    {
      id: 1,
      title: 'Water Leakage in Room',
      description: 'There is a water leakage issue in room 101 that needs immediate attention.',
      date: '2024-12-06',
      status: 'Under Progress',
    },
    {
      id: 2,
      title: 'Food Quality',
      description: 'The quality of food in the mess has declined significantly.',
      date: '2024-12-05',
      status: 'Rejected',
    },
  ];

  const [grievances, setGrievances] = useState(initialGrievances);
  const [selectedGrievance, setSelectedGrievance] = useState(null);

  // Clear storage and reset grievances when the component mounts
  useEffect(() => {
    localStorage.clear(); // Clear any saved state
    sessionStorage.clear(); // Clear session storage
    setGrievances(initialGrievances); // Reset grievances to initial data
  }, []);

  // Update grievance status
  const updateGrievanceStatus = (id, status) => {
    setGrievances((prevGrievances) =>
      prevGrievances.map((grievance) =>
        grievance.id === id ? { ...grievance, status } : grievance
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-700 to-black p-6">
      <MiniVariantDrawer />
      <h1 className="mt-20 text-4xl font-bold text-teal-300 mx-14">Private Grievances</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-14 mt-10">
        {grievances.length === 0 ? (
          <p className="text-white text-center col-span-full font-bold text-xl">No grievances found.</p>
        ) : (
          grievances.map((grievance) => (
            <div
              key={grievance.id}
              className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg rounded-lg p-5 text-white relative"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">{grievance.date}</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    grievance.status === 'Resolved'
                      ? 'bg-green-500'
                      : grievance.status === 'Rejected'
                      ? 'bg-red-500'
                      : 'bg-yellow-500'
                  }`}
                >
                  {grievance.status}
                </span>
              </div>
              <h2 className="text-xl font-bold">{grievance.title}</h2>
              <button
                className="text-teal-300 mt-3 underline"
                onClick={() => setSelectedGrievance(grievance)}
              >
                View More
              </button>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={() => updateGrievanceStatus(grievance.id, 'Resolved')}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-full transition-all"
                  title="Mark as Resolved"
                >
                  ✅
                </button>
                <button
                  onClick={() => updateGrievanceStatus(grievance.id, 'Rejected')}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-full transition-all"
                  title="Mark as Rejected"
                >
                  ❌
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedGrievance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white/90 p-6 rounded-lg shadow-lg max-w-md">
            <h2 className="text-2xl font-bold text-teal-600">{selectedGrievance.title}</h2>
            <textarea
              readOnly
              value={selectedGrievance.description}
              className="w-full mt-4 p-3 rounded-lg bg-white text-black border border-gray-300 focus:outline-none resize-none min-h-[100px]"
            />
            <button
              className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg"
              onClick={() => setSelectedGrievance(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPrivateGrievances;
