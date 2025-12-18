import React from "react";
import '@/index.css'

const SelectDropdown = ({ options, selectedOption, setSelectedOption }) => {
  return (
    <div className="mb-4">
      <label className="text-white font-bold block mb-2">Select Hostel:</label>
      <select
        className="w-full px-4 py-2 rounded-lg bg-white/20 text-white backdrop-blur-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-teal-400"
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}>
        <option value="" style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(8px)",
            color: "white",
            border: "none",
          }}>All Hostels</option>
        {options.map((option) => (
          <option key={option} value={option} className="dropdown-option">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectDropdown;
