import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../navbar";
import { FiHeart, FiMoreVertical } from "react-icons/fi";

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

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const SearchPage: React.FC = () => {
  const [filter, setFilter] = useState("");
  const [filteredCodes, setFilteredCodes] = useState<number[]>(statusCodes);
  const debouncedFilter = useDebounce(filter, 300); // 300ms delay

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
    <div className="p-4">
      <Navbar filter={filter} setFilter={setFilter} />
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
              className="flex flex-col items-center shadow-lg p-4 rounded-lg"
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
                <div className="flex items-center gap-2">
                  <FiHeart className="text-red-500 cursor-pointer" />
                  <FiMoreVertical className="cursor-pointer" />
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