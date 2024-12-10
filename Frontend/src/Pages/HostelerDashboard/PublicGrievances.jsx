import React, { useState, useEffect } from 'react';
import MiniVariantDrawer from '../../components/MiniVariantDrawer';
import { FaThumbsUp } from 'react-icons/fa';

const PublicGrievances = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [grievances, setGrievances] = useState([]);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const routing = {title:"Public Grievances",Home: '/hosteler-dashboard', Profile: '/profile-hosteler', Notice: '/view-notice', Menu: '/view-mess-menu' }

  
  useEffect(() => {
    const savedGrievances = JSON.parse(localStorage.getItem('grievances')) || [];
    setGrievances(savedGrievances);
  }, []);

  
  useEffect(() => {
    localStorage.setItem('grievances', JSON.stringify(grievances));
  }, [grievances]);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleGrievanceSubmit = (event) => {
    event.preventDefault();
    const title = event.target.title.value;
    const description = event.target.description.value;
    const newGrievance = {
      title,
      description,
      date: new Date().toLocaleString(),
      status: 'Under Progress',
      upvotes: 0,
    };
    setGrievances([newGrievance, ...grievances]);
    toggleDrawer();
  };

  const handleUpvote = (index) => {
    setGrievances((prevGrievances) =>
      prevGrievances.map((grievance, i) =>
        i === index ? { ...grievance, upvotes: grievance.upvotes + 1 } : grievance
      )
    );
  };

  return (
    <>
      <MiniVariantDrawer router={routing} />
      <div className="min-h-screen bg-gradient-to-b from-teal-700 to-black p-6 relative">
        <div className="flex justify-between items-center">
          <h1 className="mt-20 text-4xl font-bold text-teal-300 mx-14">Public Grievances</h1>
          <button
            onClick={toggleDrawer}
            className="mt-20 bg-black text-white font-medium px-6 py-3 rounded-lg shadow-white hover:bg-gradient-to-r hover:from-teal-500 hover:to-slate-600 hover:text-black transition-all duration-300"
          >
            + Add Grievance
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 ml-12">
          {grievances.length === 0 ? (
            <p className="text-white text-center col-span-full font-bold text-xl">No grievances submitted yet.</p>
          ) : (
            grievances.map((grievance, index) => (
              <div
                key={index}
                className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg rounded-lg p-5 text-white relative"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">{grievance.date}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      grievance.status === 'Resolved'
                        ? 'bg-green-500'
                        : grievance.status === 'Under Progress'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
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

                <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                  <button
                    onClick={() => handleUpvote(index)}
                    className="text-teal-300 hover:text-teal-400"
                  >
                    <FaThumbsUp size={24} />
                  </button>
                  <span className="text-white">{grievance.upvotes}</span>
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
                className="w-full mt-4 p-3 rounded-lg bg-white text-black border border-white focus:outline-none resize-none min-h-[100px] max-h-[300px] overflow-auto"
                style={{ minHeight: '150px' }}
              />
              <button
                className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg"
                onClick={() => setSelectedGrievance(null)}>
                Close
              </button>
            </div>
          </div>
        )}

        {isDrawerOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end mr-5">
            <div className="w-96 bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-teal-300 mb-6">Add Grievance</h2>
              <form onSubmit={handleGrievanceSubmit}>
                <label className="block mb-4">
                  <span className="text-white">Title</span>
                  <input
                    type="text"
                    name="title"
                    required
                    className="w-full mt-1 p-3 rounded-lg bg-black text-white border border-white focus:outline-none"
                  />
                </label>
                <label className="block mb-4">
                  <span className="text-white">Description</span>
                  <textarea
                    name="description"
                    required
                    className="w-full mt-1 p-3 rounded-lg bg-black text-white border border-white focus:outline-none"
                  />
                </label>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={toggleDrawer}
                    className="px-6 py-3 rounded-lg bg-red-500 text-white">
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg bg-teal-500 text-white">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PublicGrievances;
