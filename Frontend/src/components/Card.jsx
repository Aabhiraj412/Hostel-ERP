import React from "react";

const Card = ({ children, onClick }) => {
  return (
    <div
      className="w-[400px] p-6 bg-gray-600 bg-opacity-50 backdrop-blur-lg rounded-lg shadow-lg cursor-pointer"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
