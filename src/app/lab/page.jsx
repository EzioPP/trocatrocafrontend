'use client'
import { useState } from 'react';

export default function Lab() {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <>
      <div className="search flex flex-col mt-2 relative">
        <button
          className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-700 -mb-3 z-10"
        ></button>
        <input
          type="text"
          placeholder=""
          className={`px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${isFocused ? 'w-72' : 'w-32'} -mb-3 relative z-0`}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <button
          className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-700 -mt-3 z-10"
        ></button>
      </div>
    </>
  );
}