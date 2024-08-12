import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StudentTimetable from '../components/StudentTimetable';

const StudentPage = () => {
  const { userId } = useParams(); // Extract the student's userId from URL
  const [student, setStudent] = useState(null);
  const [classmates, setClassmates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/view/students'); // Adjust API endpoint if necessary
        const data = await response.json();

        // Find the student data
        const filteredStudent = data.students.find(student => student._id === userId);
        if (filteredStudent) {
          setStudent(filteredStudent);

          // Find classmates in the same classroom
          const filteredClassmates = data.students.filter(
            classmate => classmate.classroom && classmate.classroom._id === filteredStudent.classroom._id
          );
          setClassmates(filteredClassmates);
        } else {
          console.error('No student data found');
          setStudent(null);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setStudent(null);
        setClassmates([]); // Ensure classmates is set to an empty array in case of an error
      }
    };

    fetchData();
  }, [userId]);

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {student.teacher && student.classroom ? (
        <div>
          <StudentTimetable
          teacherId={student.teacher._id}
          classroomId={student.classroom._id}
        />
        </div>
      ) : (
        <div className='text-2xl font-bold mb-6 text-center'>No timetable available.</div>
      )}
      
      <div className="container-ss container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Students of this Class</h1>

        {classmates.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-gray-300 shadow-lg rounded-lg overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left py-2 px-4">Email</th>
                  <th className="text-left py-2 px-4">ID</th>
                </tr>
              </thead>
              <tbody>
                {classmates.map((classmate, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                    <td className="py-2 px-4">
                      {classmate.email}
                      {classmate.email === student.email && (
                        <span style={{ color: 'red' }}> (You)</span>
                      )}
                    </td>                  <td className="py-2 px-4">{classmate._id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-4">No classmates found.</p>
        )}
      </div>
    </div>
  );
};

export default StudentPage;
