import { useState, useEffect } from 'react';
import axios from 'axios';

const PrincipalPage = () => {
//   const [teachers, setTeachers] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [classrooms, setClassrooms] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const teachersRes = await axios.get('/api/principal/teachers');
//       const studentsRes = await axios.get('/api/principal/students');
//       const classroomsRes = await axios.get('/api/principal/classrooms');
//       setTeachers(teachersRes.data);
//       setStudents(studentsRes.data);
//       setClassrooms(classroomsRes.data);
//     };
//     fetchData();
//   }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Principal Dashboard</h1>
      <div className="mb-6">
        <a href='/view/teachers' className="text-2xl font-bold mb-4">Teachers</a>
        <table className="min-w-full bg-white">
          {/* Render teachers here */}
        </table>
      </div>
      <div className="mb-6">
        <a href='/view/students' className="text-2xl font-bold mb-4">Students</a>
        <table className="min-w-full bg-white">
          {/* Render students here */}
        </table>
      </div>
      <div>
        <a href='/view/classrooms' className="text-2xl font-bold mb-4">Classrooms</a>
        <table className="min-w-full bg-white">
          {/* Render classrooms here */}
        </table>
      </div>
    </div>
  );
};

export default PrincipalPage;
