import React from 'react';

const GrievanceCard = ({ grievance, updateGrievanceStatus }) => {
  return (
    <div className="p-6 rounded-lg shadow-lg bg-opacity-20 border border-white/30 backdrop-blur-lg bg-gray-800/30">
      <h3 className="text-lg font-semibold text-teal-400">{grievance.title}</h3>
      <p className="mt-2 text-gray-300">{grievance.description}</p>
      <p className="mt-1 text-sm text-gray-500">{grievance.date}</p>
      <p
        className={`mt-2 ${
          grievance.status === 'Resolved' ? 'text-green-500' : 'text-yellow-500'
        }`}
      >
        {grievance.status}
      </p>
      <div className="mt-4 space-x-4">
        <button
          onClick={() => updateGrievanceStatus(grievance.id, 'Resolved')}
          className="px-4 py-2 rounded-lg shadow-lg backdrop-blur-md bg-green-400/60 hover:bg-green-500/20 text-white font-semibold border border-white/30 transition-all duration-300"
        >
          Mark Resolved
        </button>
        <button
          onClick={() => updateGrievanceStatus(grievance.id, 'Cancelled')}
          className="px-4 py-2 rounded-lg shadow-lg backdrop-blur-md bg-red-500/60 hover:bg-red-500/30 text-white font-semibold border border-white/30 transition-all duration-300"
        >
          Cancel Grievance
        </button>
      </div>
    </div>
  );
};

export default GrievanceCard;
