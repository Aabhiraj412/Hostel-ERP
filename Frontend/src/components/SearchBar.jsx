import React from "react";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="mb-4">
      <label className="text-white font-bold block mb-2">
        Search by Name or Roll Number:
      </label>
      <input
        type="text"
        className="w-full px-4 py-2 rounded-lg bg-white/20 text-white backdrop-blur-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-teal-400"
        placeholder="Enter name or roll number..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
