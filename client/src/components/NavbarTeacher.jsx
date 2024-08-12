import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavbarTeacher = () => {
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const location = useLocation();
  
    const handleLogout = () => {
      logout();
    };
  
    return (
      <nav className="bg-gray-900 rounded-b-3xl">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex-shrink-0 flex items-center">
              <Link className="text-yellow-500 text-lg font-bold" to="/principal">
                Classroom
              </Link>
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                <NavLink to="/teacher">Home</NavLink>
                <NavLink to="/teacher/students">Students</NavLink>
                <NavLink to="/teacher/timetable">Timetables</NavLink>
                {/* <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded transition duration-300"
                >
                  Profile
                </button> */}
                <Link
                  to="/"
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white border rounded-md px-3 py-2 text-sm font-medium transition duration-300"
                >
                  Logout
                </Link>
              </div>
            </div>
            <div className="sm:hidden">
              <button
                type="button"
                className="bg-gray-900 text-white inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
  
        {/* Profile Modal */}
        {isProfileModalOpen && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-gray-100 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Profile</h3>
                      <AdminProfile />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    onClick={() => setIsProfileModalOpen(false)}
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-400 text-base font-medium text-white hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    );
  };
  
  const NavLink = ({ to, children, onClick }) => {
    const location = useLocation();
  
    return (
      <Link
        to={to}
        className={`text-gray-300 hover:text-white px-3 py-2 rounded transition duration-300 ${
          location.pathname === to ? 'font-bold border-b-2 border-yellow-500' : 'hover:bg-yellow-600'
        }`}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  };

export default NavbarTeacher
