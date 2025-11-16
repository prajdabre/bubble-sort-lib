import React from 'react';
import { useBubbleSort } from '../hooks/useBubbleSort';

const Controls: React.FC = () => {
  const { 
    isSorting, 
    isSorted, 
    isPaused, 
    startSorting, 
    pauseSorting, 
    resumeSorting, 
    generateNewArray, 
    reset, 
    arraySize, 
    setArraySize,
    speed,
    setSpeed,
    swapCount 
  } = useBubbleSort();

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArraySize(Number(e.target.value));
  };
  
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(Number(e.target.value));
  };

  const handleSortControlClick = () => {
    if (isSorting && !isPaused) {
      pauseSorting();
    } else if (isPaused) {
      resumeSorting();
    } else {
      startSorting();
    }
  }

  const getSortButtonText = () => {
    if (isSorting && !isPaused) return 'Pause';
    if (isPaused) return 'Resume';
    return 'Sort';
  }

  const buttonClasses = "px-4 py-2 rounded-md font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sortButtonColor = isSorting && !isPaused ? 'bg-yellow-600 hover:bg-yellow-500 focus:ring-yellow-500' : 'bg-green-600 hover:bg-green-500 focus:ring-green-500';

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-wrap items-center justify-center gap-4 md:gap-6">
      <button
        onClick={generateNewArray}
        disabled={isSorting}
        className={`${buttonClasses} bg-sky-600 hover:bg-sky-500 focus:ring-sky-500`}
      >
        New Array
      </button>
      <button
        onClick={handleSortControlClick}
        disabled={isSorted}
        className={`${buttonClasses} ${sortButtonColor}`}
      >
        {getSortButtonText()}
      </button>
      <button
        onClick={reset}
        className={`${buttonClasses} bg-red-600 hover:bg-red-500 focus:ring-red-500`}
      >
        Reset
      </button>

      <div className="flex items-center gap-3 text-gray-300">
        <label htmlFor="size" className="font-medium">Size</label>
        <input
          type="range"
          id="size"
          min="5"
          max="25"
          value={arraySize}
          onChange={handleSizeChange}
          disabled={isSorting}
          className="w-24 md:w-36 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <span className="font-mono font-bold text-sky-400 text-lg w-8 text-center">{arraySize}</span>
      </div>

      <div className="flex items-center gap-3 text-gray-300">
        <label htmlFor="speed" className="font-medium">Speed</label>
        <input
          type="range"
          id="speed"
          min="1"
          max="5"
          value={speed}
          onChange={handleSpeedChange}
          disabled={isSorting}
          className="w-24 md:w-36 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <span className="font-mono font-bold text-sky-400 text-lg w-8 text-center">{speed}</span>
      </div>

       <div className="flex items-center gap-2 text-gray-300 border-l-2 border-gray-700 pl-4">
        <span className="font-medium">Swaps:</span>
        <span className="font-mono font-bold text-sky-400 text-lg w-10 text-center">{swapCount}</span>
      </div>
    </div>
  );
};

export default Controls;