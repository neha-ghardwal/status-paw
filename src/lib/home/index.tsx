import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../navbar";
import { FiHeart, FiMoreVertical } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { listenToUserLikes, toggleLikeStatus } from "../../firebase/services/liked";
import { useAuth } from "../auth/authProvider";
import toast from 'react-hot-toast';
import { addCodesToList, getUserLists } from '../../firebase/services/lists';
import { useNavigate } from 'react-router-dom';

const statusCodes = [
  100, 101, 102, 103, 200, 201, 202, 203, 204, 205, 206, 207, 208, 226,
  300, 301, 302, 303, 304, 305, 307, 308, 400, 401, 402, 403, 404, 405,
  406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 421,
  422, 423, 424, 425, 426, 428, 429, 431, 451, 500, 501, 502, 503, 504,
  505, 506, 507, 508, 510, 511
];

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const SearchPage: React.FC = () => {
  const [filter, setFilter] = useState("");
  const [filteredCodes, setFilteredCodes] = useState<number[]>(statusCodes);
  const [likedDogs, setLikedDogs] = useState<number[]>([]);
  const [isListMenuOpen, setIsListMenuOpen] = useState<number | null>(null);
  const [userLists, setUserLists] = useState<any[]>([]);
  const [selectedCode, setSelectedCode] = useState<number | null>(null);
  const { user } = useAuth();
  const debouncedFilter = useDebounce(filter, 300);
  const navigate = useNavigate();


  useEffect(() => {
    if (!user?.uid) {
      return;
    }
    const unsubscribe = listenToUserLikes(user.uid, (codes) => {
      setLikedDogs(codes);
    });
    return () => {
      unsubscribe();
    };
  }, [user?.uid]);

  useEffect(() => {
    const fetchLists = async () => {
      if (!user?.uid) {
        return;
      }
      try {
        const lists = await getUserLists(user.uid);
        setUserLists(lists);
      } catch (error) {
        toast.error('Failed to load your lists');
      }
    };
    fetchLists();
  }, [user?.uid]);

  //close if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.list-menu')) {
        setIsListMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //hanlding the like click
  const handleLikeClick = async (code: number) => {
    if (!user?.uid) {
      toast.error('Please login to like dogs');
      return;
    }
    try {
      const isCurrentlyLiked = likedDogs.includes(code);
      setLikedDogs(prev =>
        isCurrentlyLiked
          ? prev.filter(c => c !== code)
          : [...prev, code]
      );
      await toggleLikeStatus(user.uid, code, isCurrentlyLiked);
      toast.success(isCurrentlyLiked ? 'Removed from likes' : 'Added to likes');
    } catch (error) {
      setLikedDogs(prev =>
        likedDogs.includes(code)
          ? [...prev, code]
          : prev.filter(c => c !== code)
      );
      toast.error('Failed to update like');
    }
  };

  const toggleListMenu = (code: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCode(code);
    setIsListMenuOpen(prev => prev === code ? null : code);
  };

  const handleAddToList = async (listId: string) => {
    console.log('Adding code to list:', listId);
    if (selectedCode == null) return;
    
    try {
      await addCodesToList(user!.uid, listId, [selectedCode]);
      toast.success('Added to list!');
      setIsListMenuOpen(null);
    } catch (error) {
      toast.error('Failed to add to list');
    }
  };

  const handleViewAllLists = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsListMenuOpen(null);
    navigate('/lists');
  };

  const filterCodes = useCallback((filterValue: string) => {
    if (!filterValue) {
      setFilteredCodes(statusCodes);
      return;
    }

    const lowercaseFilter = filterValue.toLowerCase();
    let filtered: number[] = [];

    if (lowercaseFilter.includes("x")) {
      const regexPattern = lowercaseFilter
        .replace(/x/g, "\\d")
        .replace(/\*/g, "\\d*");
      const regex = new RegExp(`^${regexPattern}$`);
      filtered = statusCodes.filter(code => regex.test(code.toString()));
    } else {
      if (/^\d+$/.test(lowercaseFilter)) {
        const exactMatch = statusCodes.find(code => code.toString() === lowercaseFilter);
        if (exactMatch) {
          filtered = [exactMatch];
        } else {
          filtered = statusCodes.filter(code =>
            code.toString().startsWith(lowercaseFilter)
          );
        }
      } else {
        filtered = statusCodes.filter(code =>
          code.toString().includes(lowercaseFilter)
        );
      }
    }

    setFilteredCodes(filtered);
  }, []);

  useEffect(() => {
    filterCodes(debouncedFilter);
  }, [debouncedFilter, filterCodes]);

  return (
    <div className="p-4 max-w-9xl mx-auto">
      <Navbar filter={filter} setFilter={setFilter} page="home" />
      <h1 className="text-4xl font-bold text-center mb-6 underline underline-offset-2 decoration-8 decoration-blue-200">
        HTTP Status Dogs
      </h1>
      <div className="mb-4">
        {filter && (
          <p className="text-gray-600">
            Showing {filteredCodes.length} results for "{filter}"
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCodes.length > 0 ? (
          filteredCodes.map((code) => (
            <div
              key={code}
              className="flex flex-col items-center shadow-lg p-4 rounded-lg hover:shadow-xl transition-shadow relative"
            >
              <img
                src={`https://http.dog/${code}.jpg`}
                alt={`HTTP Status ${code}`}
                className="w-full h-auto rounded-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=Image+Not+Found';
                }}
              />
              <div className="flex items-center justify-between w-full mt-2">
                <span className="text-lg font-semibold">Status {code}</span>
                <div className="relative flex items-center gap-2">
                <div className="relative group">
                    <button 
                        onClick={() => handleLikeClick(code)}
                        aria-label={likedDogs.includes(code) ? "Unlike" : "Like"}
                        className="p-1 hover:scale-110 transition-transform"
                    >
                    {likedDogs.includes(code) ? (
                        <FaHeart className="text-red-500" />
                    ) : (
                        <FiHeart className="text-red-500" />
                    )}
                    </button>
                    <span className="absolute left-1/2 transform -translate-x-1/2 -top-7 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {likedDogs.includes(code) ? "Remove" : "Add to favorites"}
                    </span>
                </div>
                  <div className="relative">
                    <FiMoreVertical 
                      className="cursor-pointer hover:scale-110 transition-transform"
                      onClick={(e) => toggleListMenu(code, e)}
                    />
                    {isListMenuOpen === code && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200 list-menu">
                        <div className="py-1">
                          <div className="px-4 py-2 text-sm font-medium border-b">
                            Add to List
                          </div>
                          {userLists.length > 0 ? (
                            userLists.map((list) => (
                              <button
                                key={list.id}
                                onClick={() => {
                                  handleAddToList(list.id);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                {list.name}
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-sm text-gray-500">
                              No lists found
                            </div>
                          )}
                          <button
                            onClick={handleViewAllLists}
                            className="block w-full text-left px-4 py-2 text-sm text-blue-500 hover:bg-gray-100 border-t"
                          >
                            View All Lists
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center font-medium py-8 text-gray-500 bg-blue-200">
            No results found for "{filter}"
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;