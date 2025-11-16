
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl md:text-3xl font-bold text-sky-400 tracking-tight">
          Bubble Sort Algorithm Visualizer
        </h1>
      </div>
    </header>
  );
};

export default Header;
