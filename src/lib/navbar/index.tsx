import React, { useState, useRef, useEffect } from "react";
import { FiList, FiSearch, FiBookmark, FiLogOut, FiHeart, FiHome } from "react-icons/fi";
import { FaPaw } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  filter: string;
  setFilter: (filter: string) => void;
  page: 'home' | 'lists' | 'favorites';
}

const Navbar: React.FC<NavbarProps> = ({ filter, setFilter, page }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (!(event.target as HTMLElement).closest(".search-container")) {
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login"); 
    } catch (error) {
    }
  };

  const getPlaceholder = () => {
    switch(page) {
      case 'home': return 'Search response codes [eg. 202]';
      case 'lists': return 'Search lists names';
      default: return 'Search';
    }
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white mb-4 relative">
      <div className="text-2xl sm:inline-block hidden bg-gradient-to-b from-red-400 to-pink-500 px-2 rotate-[357deg] transform origin-center m-1 clip-triangle">
        🐾Status Paw🐾
      </div>
      <FaPaw className="text-2xl sm:hidden" />

      {/* Desktop Search */}
      {page !== 'favorites' && (
        <div className="hidden sm:block w-1/3 ml-auto mr-4">
          <input
            type="text"
            placeholder={getPlaceholder()}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-2 rounded-lg w-full text-white cursor-text bg-gray-700 border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-400"
          />
        </div>
      )}

      {/* Mobile Search */}
      {page !== 'favorites' && (
        <>
          <FiSearch 
            className="text-2xl cursor-pointer sm:hidden ml-auto mr-4 hover:text-pink-400 transition-colors" 
            onClick={(e) => {
              e.stopPropagation();
              setShowSearch(!showSearch);
            }}
          />
          
          {showSearch && (
            <div className="absolute top-14 right-4 bg-gray-800 p-4 flex justify-center w-4/5 max-w-md mx-auto rounded-lg shadow-lg search-container border border-gray-700">
              <input
                type="text"
                placeholder={getPlaceholder()}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border p-2 rounded-lg w-full text-white bg-gray-700 border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-400"
              />
            </div>
          )}
        </>
      )}

      <div className="relative" ref={dropdownRef}>
        <button 
          className="p-1 rounded-full hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500"
          onClick={(e) => {
            e.stopPropagation();
            setShowDropdown(!showDropdown);
          }}
          aria-label="Menu"
        >
          <FiList className="text-2xl" />
        </button>
        
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-700 overflow-hidden transform transition-all duration-200 scale-95 hover:scale-100">
            <div className="py-1">
              <div className="px-4 py-3 border-b border-gray-700">
                <p className="text-sm font-medium text-pink-400">User Menu</p>
              </div>

              <button
                className="flex items-center w-full px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 transition-colors group"
                onClick={() => {
                  setShowDropdown(false);
                  navigate("/home");
                }}
              >
                <FiHome className="mr-3 text-pink-400 group-hover:text-pink-300" />
                Home
              </button>

              <button
                className="flex items-center w-full px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 transition-colors group"
                onClick={() => {
                  setShowDropdown(false);
                  navigate("/liked");
                }}
              >
                <FiHeart className="mr-3 text-pink-400 group-hover:text-pink-300" />
                Favourites
              </button>
              
              <button
                className="flex items-center w-full px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 transition-colors group"
                onClick={() => {
                  setShowDropdown(false);
                  navigate("/lists");
                }}
              >
                <FiBookmark className="mr-3 text-pink-400 group-hover:text-pink-300" />
                My Lists
              </button>
              
              <div className="px-4 py-3 border-t border-gray-700">
                <button
                  className="flex items-center w-full text-left text-sm text-gray-200 hover:bg-gray-700 transition-colors group"
                  onClick={handleSignOut}
                >
                  <FiLogOut className="mr-3 text-pink-400 group-hover:text-pink-300" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;