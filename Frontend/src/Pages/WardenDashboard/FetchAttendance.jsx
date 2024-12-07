import React, { useState } from 'react';
import MiniVariantDrawer from '../../components/MiniVariantDrawer';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Card from '@/components/Card'; // Assuming you have the Card component

const FetchAttendance = () => {
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [students, setStudents] = useState([]);

  // Sample hosteler data
  const hostelOptions = [
    { value: "Aryabhatt", label: "Aryabhatt" },
    { value: "Sarojini", label: "Sarojini" },
    { value: "RN Tagore", label: "RN Tagore" },
  ];

  // Function to simulate fetching student data based on selected hostel and date
  const fetchAttendance = () => {
    if (!selectedHostel || !selectedDate) return;

    // Sample data fetch based on selected hostel and date
    const fetchedStudents = [
      {
        name: "Anamika Tiwari",
        rollNo: "2200461540015",
        hostelName: selectedHostel.label,
        roomNumber: "301",
        phone: "9876543210",
      },
      {
        name: "Ananya Singh",
        rollNo: "2200461540017",
        hostelName: selectedHostel.label,
        roomNumber: "202",
        phone: "9876543210",
      },
    ];

    setStudents(fetchedStudents);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-700 to-black p-6 relative">
      <MiniVariantDrawer title="Attendance" />

      <div className="mx-14 mt-20">
        {/* Date Picker */}
        <div className="mb-6">
          <label className="text-white font-bold block mb-2">Select Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className=" bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg rounded-lg p-3 text-white relative"
            dateFormat="yyyy-MM-dd"
            placeholderText="Select Date"
          />
        </div>

        {/* Dropdown for Hostel Selection */}
        <div className="mb-6">
          <label className="text-white font-bold block mb-2">Select Hostel:</label>
          <Select
            options={hostelOptions}
            value={selectedHostel}
            onChange={setSelectedHostel}
            placeholder="All Hostels"
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(8px)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                padding: "4px",
              }),
              singleValue: (base) => ({
                ...base,
                color: "white",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused
                  ? "rgba(255, 255, 255, 0.4)"
                  : "transparent",
                color: "black",
                cursor: "pointer",
              }),
            }}
          />
        </div>

        {/* Fetch Button */}
        <div className="mb-6">
          <button
            onClick={fetchAttendance}
            className="text-white bg-teal-600 px-4 py-2 rounded-md"
          >
            Fetch Attendance
          </button>
        </div>

        {/* Displaying Student Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {students.length === 0 ? (
            <p className="text-white col-span-full text-center text-lg font-bold">
              No students found for the selected date and hostel.
            </p>
          ) : (
            students.map((student, index) => (
              <Card key={index}>
                <h2 className="text-xl font-bold text-teal-300 mb-4">Student Details</h2>
                <p className="text-white">Name: {student.name}</p>
                <p className="text-white">Roll No: {student.rollNo}</p>
                <p className="text-white">Phone: {student.phone}</p>
                <p className="text-white">Hostel Name: {student.hostelName}</p>
                <p className="text-white">Room Number: {student.roomNumber}</p>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FetchAttendance;
