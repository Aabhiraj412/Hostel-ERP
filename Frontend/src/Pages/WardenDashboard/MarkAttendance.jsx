

import { useState, useEffect } from "react";
import MiniVariantDrawer from "../../components/MiniVariantDrawer";
import Select from "react-select";
import useStore from "../../../Store/Store";

export default function AttendancePage() {
  const { localhost } = useStore();
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const studentsPerPage = 24;

  const getHostelOptions = () => {
    const uniqueHostels = [...new Set(students.map(student => student.hostel))];
    return [
      { label: "All Hostels", value: null },
      ...uniqueHostels.map(hostel => ({ label: hostel, value: hostel }))
    ];
  };

  const selectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      borderRadius: "10px",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      color: "black",
      padding: "2px",
      boxShadow: "none",
      "&:hover": {
        border: "1px solid rgba(0, 0, 0, 0.5)",
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected 
        ? "rgb(19 78 74)"
        : state.isFocused 
          ? "rgb(19 78 74 / 0.8)"
          : "transparent",
      color: "white",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "rgb(19 78 74 / 0.9)",
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      backdropFilter: "blur(8px)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      borderRadius: "10px",
    }),
    singleValue: (base) => ({
      ...base,
      color: "black",
    }),
  };
  
  const filteredStudents = selectedHostel?.value
    ? students.filter((s) => s.hostel === selectedHostel.value)
    : students;

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, startIndex + studentsPerPage);

  const toggleAttendance = (id) => {
    setStudents((prev) =>
      prev.map((student) =>
        student._id === id ? { ...student, present: !student.present } : student
      )
    );
  };

  const fetchAttendance = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `${localhost}/api/warden/gethostlers`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch attendance data.");
      }

      const fetchedStudents = await response.json();
      setStudents(fetchedStudents.map(student => ({
        ...student,
        present: false
      })));
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveAttendance = async () => {
    setLoading(true);
    try {
      const presentStudents = students.filter(student => student.present).map(student => student._id);
      
      const saveResponse = await fetch(`${localhost}/api/warden/saveattendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          students: presentStudents
        })
      });

      if (!saveResponse.ok) {
        throw new Error("Failed to save attendance");
      }

      const markResponse = await fetch(`${localhost}/api/warden/markattendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      });

      if (!markResponse.ok) {
        throw new Error("Failed to mark attendance");
      }

      setSuccessMessage("Attendance marked successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage(error.message);
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const routing = {
    title: "Mark Attendance",
    Home: "/warden-dashboard",
    Profile: "/profile-warden",
    Attendance: "/mark-attendance",
    Notice: "/view-notice",
    Menu: "/view-mess-menu",
  };

  return (
    <>
      <MiniVariantDrawer router={routing} />
      <div className="min-h-screen bg-gradient-to-b from-teal-700 to-black p-2 sm:p-6">
        <div className="mx-2 ml-20 sm:mx-14 mt-16 sm:mt-20">
          <h2 className="text-2xl sm:text-4xl font-bold text-teal-300 mb-3 sm:mb-5">
            Mark Attendance
          </h2>
          
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded mb-3 sm:mb-4 text-sm sm:text-base">
              {errorMessage}
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 sm:px-4 sm:py-3 rounded mb-3 sm:mb-4 text-sm sm:text-base">
              {successMessage}
            </div>
          )}

          <div className="mb-4 sm:mb-6">
            <label className="text-white font-bold text-sm sm:text-base">Select Hostel:</label>
            <Select
              options={getHostelOptions()}
              value={selectedHostel}
              onChange={setSelectedHostel}
              className="mt-1 sm:mt-2 text-black text-sm sm:text-base"
              styles={selectStyles}
            />
          </div>

          <div className="rounded-xl shadow-lg bg-white/10 overflow-hidden">
  <table className="w-full border-collapse">
    <thead>
      <tr className="bg-teal-700 text-white">
        <th className="p-2 sm:p-3 text-sm sm:text-base font-semibold first:rounded-tl-xl">
          Name
        </th>
        <th className="hidden sm:table-cell p-2 sm:p-3 text-xs sm:text-base font-semibold">
          Room
        </th>
        <th className="hidden sm:table-cell p-2 sm:p-3 text-xs sm:text-base font-semibold">
          Hostel
        </th>
        <th className="p-2 sm:p-3 text-sm sm:text-base font-semibold last:rounded-tr-xl">
          Present
        </th>
      </tr>
    </thead>
    <tbody>
      {currentStudents.map((student, index) => (
        <tr key={student._id} 
            className={`bg-white/30 text-black hover:bg-white/40 transition-colors
              ${index === currentStudents.length - 1 ? 'last-row' : ''}`}>
          <td className="p-2 sm:p-3 text-xs sm:text-base">
            <div className="flex flex-col sm:block">
              <span>{student.name}</span>
              <span className="text-xs text-gray-700 sm:hidden">
                Room: {student.room_no} | {student.hostel}
              </span>
            </div>
          </td>
          <td className="hidden sm:table-cell p-2 sm:p-3 text-xs sm:text-base text-center">
            {student.room_no}
          </td>
          <td className="hidden sm:table-cell p-2 sm:p-3 text-xs sm:text-base text-center">
            {student.hostel}
          </td>
          <td className="p-2 sm:p-3 text-center">
            <input
              type="checkbox"
              checked={student.present}
              onChange={() => toggleAttendance(student._id)}
              className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer accent-teal-900"
            />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 sm:mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-full sm:w-auto bg-black text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg shadow-lg disabled:opacity-50 hover:bg-gray-800 transition-colors"
            >
              Previous
            </button>
            
            <button
              onClick={saveAttendance}
              disabled={loading}
              className="w-full sm:w-auto bg-teal-600 text-white px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base rounded-lg shadow-lg hover:bg-teal-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Marking..." : "Mark Attendance"}
            </button>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-full sm:w-auto bg-black text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg shadow-lg disabled:opacity-50 hover:bg-gray-800 transition-colors"
            >
              Next
            </button>
          </div>

          <div className="text-center text-white text-sm mt-4">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      </div>
    </>
);
}