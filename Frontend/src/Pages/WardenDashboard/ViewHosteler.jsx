import React, { useState } from "react";
import MiniVariantDrawer from "../../components/MiniVariantDrawer";
import Select from "react-select";
import SearchBar from "../../components/SearchBar";
import HostelerCard from "../../components/HostelerCard";
import Card from "@/components/Card"; 

const ViewHosteler = () => {
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHosteler, setSelectedHosteler] = useState(null); 
  const routing = {title:"View Hostelers",Home: '/warden-dashboard', Profile: '/profile-warden', Attendence:'/fetch-attendance', Notice: '/view-notice', Menu: '/view-mess-menu' }
  
  const hostelers = [
    {
      id: 1,
      name: "Anamika Tiwari",
      rollNumber: "2200461540015",
      hostel: "Sarojini",
      roomNumber: "301",
      aadharNo: "XXXX",
      gender: "Female",
      fathersName: "Mr. JS Tiwari",
      mothersName: "Mrs. Rekha Tiwari",
      phone: "7317448853",
      email: "anamika@gmail.com",
      address: "Kanpur",
      year: "3rd",
      college: "MPEC",
      bloodGroup: "B+",
      dob: "2000-03-14",
      localGuardian: "Mr. JS Tiwari",
      localGuardianPhone: "1234567890",
      localGuardianAddress: "Local Address",
      fathersPhone: "9876543210",
      mothersPhone: "9876543210",
      fathersEmail: "father@xyz.com",
      mothersEmail: "mother@xyz.com",
      course: "B.Tech",
      branch: "CSE",
    },
   
  ];

  const hostelOptions = [
    { value: "Aryabhatt", label: "Aryabhatt" },
    { value: "Sarojini", label: "Sarojini" },
    { value: "RN Tagore", label: "RN Tagore" },
  ];

  // Filtered list based on dropdown and search input
  const filteredHostelers = hostelers.filter(
    (hosteler) =>
      (selectedHostel === null || hosteler.hostel === selectedHostel.value) &&
      (hosteler.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hosteler.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Close the modal when clicking the overlay
  const handleOverlayClick = (e) => {
    if (e.target.id === "popup-overlay") {
      setSelectedHosteler(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-700 to-black p-6">
      <MiniVariantDrawer router={routing} />
      <h1 className="mt-20 text-4xl font-bold text-teal-300 mx-14">
        Hostelers Details
      </h1>
      <div className="mx-14 mt-10">
        {/* Dropdown */}
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

        {/* Search Bar */}
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Hosteler Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredHostelers.length === 0 ? (
            <p className="text-white col-span-full text-center text-lg font-bold">
              No hostelers found.
            </p>
          ) : (
            filteredHostelers.map((hosteler) => (
              <Card
                key={hosteler.id}
                onClick={() => setSelectedHosteler(hosteler)}
              >
                <HostelerCard hosteler={hosteler} />
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Popup Card */}
      {selectedHosteler && (
        <div
          id="popup-overlay"
          onClick={handleOverlayClick}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 mt-20 mb-8"
        >
          <Card >
            <h2 className="text-xl font-bold text-teal-300 mb-4">Student Details</h2>
            <p className="text-white"><strong>Name:</strong> {selectedHosteler.name}</p>
            <p className="text-white"><strong>Roll No:</strong> {selectedHosteler.rollNumber}</p>
            <p className="text-white"><strong>Phone:</strong> {selectedHosteler.phone}</p>
            <p className="text-white"><strong>Hostel Name:</strong> {selectedHosteler.hostel}</p>
            <p className="text-white"><strong>Room Number:</strong> {selectedHosteler.roomNumber}</p>
            <p className="text-white"><strong>Aadhar No:</strong> {selectedHosteler.aadharNo}</p>
            <p className="text-white"><strong>Gender:</strong> {selectedHosteler.gender}</p>
            <p className="text-white"><strong>Father's Name:</strong> {selectedHosteler.fathersName}</p>
            <p className="text-white"><strong>Mother's Name:</strong> {selectedHosteler.mothersName}</p>
            <p className="text-white"><strong>Email:</strong> {selectedHosteler.email}</p>
            <p className="text-white"><strong>Address:</strong> {selectedHosteler.address}</p>
            <p className="text-white"><strong>Year:</strong> {selectedHosteler.year}</p>
            <p className="text-white"><strong>College:</strong> {selectedHosteler.college}</p>
            <p className="text-white"><strong>Blood Group:</strong> {selectedHosteler.bloodGroup}</p>
            <p className="text-white"><strong>DOB:</strong> {selectedHosteler.dob}</p>
            <p className="text-white"><strong>Local Guardian:</strong> {selectedHosteler.localGuardian}</p>
            <p className="text-white"><strong>Local Guardian Phone:</strong> {selectedHosteler.localGuardianPhone}</p>
            <p className="text-white"><strong>Local Guardian Address:</strong> {selectedHosteler.localGuardianAddress}</p>
            <p className="text-white"><strong>Father's Phone:</strong> {selectedHosteler.fathersPhone}</p>
            <p className="text-white"><strong>Mother's Phone:</strong> {selectedHosteler.mothersPhone}</p>
            <p className="text-white"><strong>Father's Email:</strong> {selectedHosteler.fathersEmail}</p>
            <p className="text-white"><strong>Mother's Email:</strong> {selectedHosteler.mothersEmail}</p>
            <p className="text-white"><strong>Course:</strong> {selectedHosteler.course}</p>
            <p className="text-white"><strong>Branch:</strong> {selectedHosteler.branch}</p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ViewHosteler;
