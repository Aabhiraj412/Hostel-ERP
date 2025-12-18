import React, { useState } from "react";

const CustomDropdown = ({ options, selectedOption, setSelectedOption }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* Selected Option */}
      <div
        className="bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-lg border border-white/30 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption || "Select Hostel"}
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <ul className="absolute top-full left-0 w-full bg-white/20 backdrop-blur-lg border border-white/30 rounded-lg mt-2 shadow-lg z-10">
          <li
            className="px-4 py-2 cursor-pointer hover:bg-white/40 hover:text-black"
            onClick={() => handleOptionClick("")}
          >
            All Hostels
          </li>
          {options.map((option) => (
            <li
              key={option}
              className="px-4 py-2 cursor-pointer hover:bg-white/40 hover:text-black"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
