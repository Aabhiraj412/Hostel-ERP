import React, { useState, useEffect } from 'react';
import MiniVariantDrawer from '../../components/MiniVariantDrawer';
import OutingDetailsCard from '../../components/OutingDetailsCard';

const OutRegister = () => {
  const [outingDetailsList, setOutingDetailsList] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [purpose, setPurpose] = useState("");
  const routing = {title:"Out Register",Home: '/hosteler-dashboard', Profile: '/profile-hosteler', Notice: '/view-notice', Menu: '/view-mess-menu' }

  useEffect(() => {
    const savedOutingDetails = JSON.parse(localStorage.getItem('outingDetails')) || [];
    setOutingDetailsList(savedOutingDetails);
  }, []);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  const handleSubmit = () => {
    if (purpose.trim() === "") {
      alert("Please enter a valid purpose.");
      return;
    }

    const newEntry = {
      id: Date.now(),
      purpose,
      inTime: "Pending",
      outTime: new Date().toLocaleTimeString(),
    };

    const updatedList = [...outingDetailsList, newEntry];
    setOutingDetailsList(updatedList);
    localStorage.setItem("outingDetails", JSON.stringify(updatedList));
    setPurpose("");
    toggleDrawer();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-700 to-black p-6 relative">
      <MiniVariantDrawer router={routing} />
      <div className="flex justify-between items-center">
        <h1 className="mt-20 text-4xl font-bold text-teal-300 mx-14">Out Register</h1>
        <button
          onClick={toggleDrawer}
          className="mt-20 bg-black text-white font-medium px-6 py-3 rounded-lg shadow-white hover:bg-gradient-to-r hover:from-teal-500 hover:to-slate-600 hover:text-black transition-all duration-300"
        >
          + Open Entry
        </button>
      </div>

      <div className="grid gap-6 mx-14 mt-10">
        {outingDetailsList.length === 0 ? (
          <p className="text-white text-center font-bold text-xl">No outing details available.</p>
        ) : (
          outingDetailsList.map((details) => (
            <OutingDetailsCard key={details.id} outingDetails={details} />
          ))
        )}
      </div>

      {/* Drawer */}
      {isDrawerOpen && (
        <div className="fixed top-20 right-5 w-80 h-80 bg-black backdrop-blur-lg bg-white/20 border-l border-white/20 shadow-lg transition-transform transform translate-x-0 z-50 rounded-lg">
          <div className="p-6 flex flex-col h-full">
            <h2 className="text-2xl font-bold text-teal-300 mb-4">New Entry</h2>
            <label className="text-teal-200 font-medium mb-2">Purpose of Leave:</label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="mb-4 px-4 py-2 rounded-lg bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter purpose..."
            />
            <div className="mt-auto space-x-4">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white font-semibold transition-all duration-300"
              >
                Submit
              </button>
              <button
                onClick={toggleDrawer}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-all duration-300">
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black/50 z-40"
          onClick={toggleDrawer}
        ></div>
      )}
    </div>
  );
};

export default OutRegister;
