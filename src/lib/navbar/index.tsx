import React, { useState } from "react";
import { FiList, FiSearch } from "react-icons/fi";
import { FaPaw } from "react-icons/fa";

interface NavbarProps {
  filter: string;
  setFilter: (filter: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ filter, setFilter }) => {
  const [showSearch, setShowSearch] = useState(false);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!(e.target as HTMLElement).closest(".search-container")) {
      setShowSearch(false);
    }
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white mb-4 relative" onClick={handleOutsideClick} >
      <div className="text-2xl sm:inline-block hidden bg-gradient-to-b from-red-400 to-pink-500 px-2 rotate-[357deg] transform origin-center m-1 clip-triangle">
        🐾Status Paw🐾
      </div>
      <FaPaw className="text-2xl sm:hidden" />
      
      <div className="hidden sm:block w-1/3 ml-auto mr-4">
        <input
          type="text"
          placeholder="Search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded w-full text-white cursor-text"
        />
      </div>
      
      <FiSearch 
        className="text-2xl cursor-pointer sm:hidden ml-auto mr-4" 
        onClick={(e) => {
          e.stopPropagation();
          setShowSearch(!showSearch);
        }}
      />
      
      {showSearch && (
        <div className="absolute top-14 right-4 bg-gray-800 p-4 flex justify-center w-4/5 max-w-md mx-auto rounded-lg shadow-lg search-container">
          <input
            type="text"
            placeholder="Search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-2 rounded w-full text-white"
          />
        </div>
      )}
      
      <FiList className="text-2xl cursor-pointer" />
    </nav>
  );
};

export default Navbar;