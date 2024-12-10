import React, { useState, useEffect } from "react";
import MiniVariantDrawer from "../../components/MiniVariantDrawer";
import { FaCheck, FaTimes } from "react-icons/fa";

const ViewPrivateGrievances = () => {
  // Sample grievances data
  const initialGrievances = [
    {
      id: 1,
      title: "Room Repair Request",
      description:
        "The window in my room is broken and needs urgent repair to avoid inconvenience.",
      date: "2024-12-05",
    },
    {
      id: 2,
      title: "Noise Complaint",
      description:
        "There is a lot of noise late at night from the adjacent room, making it hard to study.",
      date: "2024-12-04",
    },
  ];
  const routing = {title:"View Private Grievances",Home: '/warden-dashboard', Profile: '/profile-warden', Attendence:'/fetch-attendance', Notice: '/view-notice', Menu: '/view-mess-menu' }

  const [grievances, setGrievances] = useState(initialGrievances);

  // Function to resolve a grievance
  const handleResolve = (id) => {
    setGrievances((prevGrievances) =>
      prevGrievances.map((grievance) =>
        grievance.id === id ? { ...grievance, status: "Resolved" } : grievance
      )
    );
  };

  // Function to reject a grievance
  const handleReject = (id) => {
    setGrievances((prevGrievances) =>
      prevGrievances.map((grievance) =>
        grievance.id === id ? { ...grievance, status: "Rejected" } : grievance
      )
    );
  };

  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
    setGrievances(initialGrievances);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-700 to-black p-6">
      <MiniVariantDrawer router={routing} />
      <h1 className="mt-20 text-4xl font-bold text-teal-300 mx-14">
        Private Grievances
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-14 mt-10">
        {grievances.length === 0 ? (
          <p className="text-white text-center col-span-full font-bold text-xl">
            No grievances found.
          </p>
        ) : (
          grievances.map((grievance) => (
            <div
              key={grievance.id}
              className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg rounded-lg p-5 text-white relative"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">{grievance.date}</span>
              </div>
              <h2 className="text-xl font-bold">{grievance.title}</h2>
              <p className="mt-2">{grievance.description}</p>
              <div className="flex justify-around items-center mt-6">
                <button
                  className="px-4 py-2 rounded-lg text-white bg-green-500/30 backdrop-blur-lg border border-green-400 hover:bg-green-600/50 transition-all flex items-center gap-2"
                  onClick={() => handleResolve(grievance.id)}
                >
                  <FaCheck /> Resolve
                </button>
                <button
                  className="px-4 py-2 rounded-lg text-white bg-red-500/30 backdrop-blur-lg border border-red-400 hover:bg-red-600/50 transition-all flex items-center gap-2"
                  onClick={() => handleReject(grievance.id)}
                >
                  <FaTimes /> Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewPrivateGrievances;
