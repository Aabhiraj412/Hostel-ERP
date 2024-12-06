import React, { useState, useEffect } from 'react';
import MiniVariantDrawer from '../../components/MiniVariantDrawer';
import OutingDetailsCard from '../../components/OutingDetailsCard';
import Card from '@/components/Card.jsx';

const OutRegister = () => {
  const [outingDetailsList, setOutingDetailsList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null); 

  useEffect(() => {

    const savedOutingDetails = [
      {
        id: 1,
        purpose: 'Kitchyum',
        inTime: '6:00 PM',
        outTime: '4:00 PM',
        studentDetails: {
          name: 'Anant Pratap Singh',
          rollNo: '2200461540016',
          phone: '9369348849',
          hostelName: 'Hostel AryaBhatt',
          roomNumber: '101',
        },
      },
      {
        id: 2,
        purpose: 'FootBall',
        inTime: '8:00 PM',
        outTime: '5:00 PM',
        studentDetails: {
          name: 'Abhiraj Dixit',
          rollNo: '2200461540005',
          phone: '9118894999',
          hostelName: 'Hostel Aryabhatt',
          roomNumber: '202',
        },
      },
    ];
    setOutingDetailsList(savedOutingDetails);
  }, []);

  const handleCardClick = (studentDetails) => {
    setSelectedStudent(studentDetails);
  };

  
  const handleOverlayClick = (e) => {
    if (e.target.id === 'popup-overlay') {
      setSelectedStudent(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-700 to-black p-6">
      <MiniVariantDrawer title="Hostel Out Register"/>
      <h1 className="mt-20 text-4xl font-bold text-teal-300 mx-14">Hostel Out Register</h1>
      <div className="grid gap-6 mx-14 mt-10">
        {outingDetailsList.length === 0 ? (
          <p className="text-white text-center font-bold text-xl">No outing details available.</p>
        ) : (
          outingDetailsList.map((details) => (
            <div
              key={details.id}
              onClick={() => handleCardClick(details.studentDetails)} // Pass student details to popup
              className="cursor-pointer"
            >
              <OutingDetailsCard outingDetails={details} />
            </div>
          ))
        )}
      </div>

      {/* Popup Card */}
      {selectedStudent && (
        <div
          id="popup-overlay"
          onClick={handleOverlayClick}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <Card>
            <h2 className="text-xl font-bold text-teal-300 mb-4">Student Details</h2>
            <p className="text-white">Name: {selectedStudent.name}</p>
            <p className="text-white">Roll No: {selectedStudent.rollNo}</p>
            <p className="text-white">Phone: {selectedStudent.phone}</p>
            <p className="text-white">Hostel Name: {selectedStudent.hostelName}</p>
            <p className="text-white">Room Number: {selectedStudent.roomNumber}</p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default OutRegister;
