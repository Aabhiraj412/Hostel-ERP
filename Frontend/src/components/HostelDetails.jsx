import React, { useState } from "react";


const HostelDetails = ({ hosteler, closeModal }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
      <div className="w-[500px] p-6 bg-gray-700 backdrop-blur-lg rounded-lg shadow-lg">
        <button
          onClick={closeModal}
          className="text-white bg-red-500 rounded-full px-4 py-2 mb-4"
        >
          Close
        </button>
        <h2 className="text-2xl text-white font-bold mb-4">Hosteler Details</h2>
        <div className="text-white">
          <p><strong>Name:</strong> {hosteler.name}</p>
          <p><strong>Roll No.:</strong> {hosteler.rollNumber}</p>
          <p><strong>Aadhar No.:</strong> {hosteler.aadharNo}</p>
          <p><strong>Gender:</strong> {hosteler.gender}</p>
          <p><strong>Father's Name:</strong> {hosteler.fathersName}</p>
          <p><strong>Mother's Name:</strong> {hosteler.mothersName}</p>
          <p><strong>Phone No.:</strong> {hosteler.phone}</p>
          <p><strong>Email:</strong> {hosteler.email}</p>
          <p><strong>Address:</strong> {hosteler.address}</p>
          <p><strong>Year:</strong> {hosteler.year}</p>
          <p><strong>College:</strong> {hosteler.college}</p>
          <p><strong>Hostel:</strong> {hosteler.hostel}</p>
          <p><strong>Room No.:</strong> {hosteler.roomNumber}</p>
          <p><strong>Date of Birth:</strong> {hosteler.dob}</p>
          <p><strong>Blood Group:</strong> {hosteler.bloodGroup}</p>
          <p><strong>Local Guardian:</strong> {hosteler.localGuardian}</p>
          <p><strong>Local Guardian Phone:</strong> {hosteler.localGuardianPhone}</p>
          <p><strong>Local Guardian Address:</strong> {hosteler.localGuardianAddress}</p>
          <p><strong>Father's Phone No.:</strong> {hosteler.fathersPhone}</p>
          <p><strong>Mother's Phone No.:</strong> {hosteler.mothersPhone}</p>
          <p><strong>Father's Email:</strong> {hosteler.fathersEmail}</p>
          <p><strong>Mother's Email:</strong> {hosteler.mothersEmail}</p>
          <p><strong>Course:</strong> {hosteler.course}</p>
          <p><strong>Branch:</strong> {hosteler.branch}</p>
        </div>
      </div>
    </div>
  );
};

export default HostelDetails;
