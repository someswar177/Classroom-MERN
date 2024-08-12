import { useState, useEffect } from 'react';
import axios from 'axios';

const PrincipalPage = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-10 text-center">
        Principal Dashboard
      </h1>
      
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-blue-500 p-6 h-40 rounded-lg shadow-lg text-center hover:shadow-xl transition transform hover:scale-105">
          <a href='/view/teachers' className="text-2xl font-semibold text-white hover:text-blue-100 transition">
            Teachers
          </a>
        </div>

        <div className="bg-green-500 p-6 h-40 rounded-lg shadow-lg text-center hover:shadow-xl transition transform hover:scale-105">
          <a href='/view/students' className="text-2xl font-semibold text-white hover:text-green-100 transition">
            Students
          </a>
        </div>

        <div className="bg-yellow-500 p-6 h-40 rounded-lg shadow-lg text-center hover:shadow-xl transition transform hover:scale-105">
          <a href='/view/classrooms' className="text-2xl font-semibold text-white hover:text-yellow-100 transition">
            Classrooms
          </a>
        </div>

        <div className="bg-red-500 p-6 h-40 rounded-lg shadow-lg text-center hover:shadow-xl transition transform hover:scale-105">
          <a href='/view/timetables' className="text-2xl font-semibold text-white hover:text-red-100 transition">
            Timetables
          </a>
        </div>
      </div>
    </div>
  );
};

export default PrincipalPage;
