import React from 'react';

const OutingDetailsCard = ({ outingDetails }) => {
  const { purpose, inTime, outTime } = outingDetails;

  return (
    <div className="p-6 rounded-lg shadow-lg bg-opacity-20 border border-white/30 backdrop-blur-lg bg-gray-800/30">
      <h3 className="text-lg font-semibold text-teal-400">Purpose of Going Out</h3>
      <p className="mt-2 text-gray-300">{purpose}</p>
      <div className="mt-4">
        <p className="text-sm text-gray-500">
          <span className="font-bold text-teal-400">Out Time: </span>
          {outTime}
        </p>
        <p className="text-sm text-gray-500">
          <span className="font-bold text-teal-400">In Time: </span>
          {inTime}
        </p>
      </div>
    </div>
  );
};

export default OutingDetailsCard;
