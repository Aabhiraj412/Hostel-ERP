import React from "react";

const HostelerCard = ({ hosteler }) => {
  return (
    <div className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg rounded-lg p-5 text-white">
      <h2 className="text-xl font-bold">{hosteler.name}</h2>
      <p className="mt-2">
        <span className="font-bold">Roll Number:</span> {hosteler.rollNumber}
      </p>
      <p>
        <span className="font-bold">Hostel:</span> {hosteler.hostel}
      </p>
      <p>
        <span className="font-bold">Room Number:</span> {hosteler.roomNumber}
      </p>
    </div>
  );
};

export default HostelerCard;
