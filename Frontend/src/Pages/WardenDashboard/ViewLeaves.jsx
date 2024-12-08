import React from "react";
import { Card, styled } from "@mui/material";
import MiniVariantDrawer from "../../components/MiniVariantDrawer";
import { FaCheck, FaTimes } from "react-icons/fa";


const GlassCard = styled(Card)`
  width: 350px;
  margin: 15px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.2); /* Glassmorphic effect */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  color: white;
`;

const FetchAttendance = () => {
  
  const studentData = [
    {
      id: 1,
      name: "Abhiraj Dixit",
      rollNo: "2200461540005",
      contact: "9118894999",
      roomNumber: "101",
      from: "AryaBhatt",
      to: "Hardoi",
      fromDate: "2024-12-01",
      toDate: "2024-12-03",
      purpose: "Personal reasons",
      noOfDays: "3",
      status: "Rejected", 
    },
    {
      id: 2,
      name: "Anant Pratap Singh",
      rollNo: "2200461540016",
      contact: "8707838799",
      roomNumber: "202",
      from: "Delhi",
      to: "Banaras",
      fromDate: "2024-12-05",
      toDate: "2024-12-10",
      purpose: "Family function",
      noOfDays: "5",
      status: "Approved",
    },
    {
      id: 3,
      name: "Ananya Singh",
      rollNo: "2200461540017",
      contact: "8887221885",
      roomNumber: "303",
      from: "Delhi",
      to: "Kanpur",
      fromDate: "2024-12-15",
      toDate: "2024-12-16",
      purpose: "Medical emergency",
      noOfDays: "2",
      status: "Pending",
    },
  ];

  
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-green-400"; 
      case "Rejected":
        return "text-red-400"; 
      case "Pending":
      default:
        return "text-yellow-400"; 
    }
  };

  
  const handleAccept = (id) => {
    alert(`Student ID: ${id} attendance marked as accepted.`);
  };

 
  const handleReject = (id) => {
    alert(`Student ID: ${id} attendance marked as rejected.`);
  };

  return (
    <>
      <MiniVariantDrawer title="Leave Applications" />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-700 to-black p-5 pt-20">
        <div className="flex flex-wrap justify-center gap-6 lg:grid lg:grid-cols-2 xl:grid-cols-3">
        {studentData.map((student) => (
          <GlassCard key={student.id}>
            <h2 className="text-xl font-bold text-teal-300 mb-4">Student Details</h2>
            <p><strong>Name:</strong> {student.name}</p>
            <p><strong>Roll No:</strong> {student.rollNo}</p>
            <p><strong>Contact:</strong> {student.contact}</p>
            <p><strong>Room Number:</strong> {student.roomNumber}</p>
            <p><strong>From:</strong> {student.from}</p>
            <p><strong>To:</strong> {student.to}</p>
            <p><strong>From Date:</strong> {student.fromDate}</p>
            <p><strong>To Date:</strong> {student.toDate}</p>
            <p><strong>Purpose:</strong> {student.purpose}</p>
            <p><strong>No. of Days:</strong> {student.noOfDays}</p>
            <p className={`${getStatusColor(student.status)} font-semibold`}>
              <strong>Status:</strong> {student.status}
            </p>

            <div className="flex justify-around items-center mt-6">
              <button
                className="px-4 py-2 rounded-lg text-white bg-green-500/30 backdrop-blur-lg border border-green-400 hover:bg-green-600/50 transition-all flex items-center gap-2"
                onClick={() => handleAccept(student.id)}
              >
                <FaCheck /> Accept
              </button>
              <button
                className="px-4 py-2 rounded-lg text-white bg-red-500/30 backdrop-blur-lg border border-red-400 hover:bg-red-600/50 transition-all flex items-center gap-2"
                onClick={() => handleReject(student.id)}
              >
                <FaTimes /> Reject
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
      </div>
    </>
  );
};

export default FetchAttendance;
