import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">BTCtop</h1>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-gray-500">
              {new Date().toLocaleString('zh-CN')}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
