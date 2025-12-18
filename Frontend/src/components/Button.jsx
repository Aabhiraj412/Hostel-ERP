import React from "react";

const Button = ({ label, onClick, className = "", ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-black text-white font-semibold px-6 py-3 rounded-lg shadow-white hover:bg-gradient-to-r hover:from-teal-500 hover:to-slate-600 hover:text-black transition-all duration-300 ${className}`}
      {...props}
    >
      {label}
    </button>
  );
};

export default Button;
