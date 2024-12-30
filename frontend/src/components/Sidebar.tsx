import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-white shadow-sm h-screen">
      <div className="p-4">
        <nav>
          <ul>
            <li>
              <Link 
                to="/" 
                className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
              >
                指标概览
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
