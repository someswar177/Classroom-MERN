import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AddTimeTable from '../components/AddTimeTable';

const Assign = () => {
  const apiUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';
  const { id, email } = useParams(); // Getting teacherId and email from params
  const [classrooms, setClassrooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentsAssigned, setStudentsAssigned] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [timetable, setTimetable] = useState({
    classroom: '',
    startTime: '',
    endTime: '',
    days: []
  });

  useEffect(() => {
    fetchClassrooms();
    fetchStudents();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const response = await fetch(`${apiUrl}/view/classrooms`);
      const data = await response.json();
      setClassrooms(data.classrooms);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${apiUrl}/view/students`);
      const data = await response.json();
      setStudentsAssigned(data.students);
      setStudents(data.students.filter(s => !s.teacher)); // Filter students not assigned to any teacher
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleAssignStudent = async () => {
    try {
      const teacherClassroom = classrooms.find(c => c.teacher && c.teacher._id === id);

      await fetch(`${apiUrl}/assign/student`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student: selectedStudent,
          teacher: id,
          classroom: teacherClassroom ? teacherClassroom._id : null,
        }),
      });
      alert('Student assigned successfully');
      fetchStudents(); // Refresh data
    } catch (error) {
      console.error('Error assigning student:', error);
    }
  };

  const handleCreateTimetable = async () => {
    try {
      await fetch(`${apiUrl}/create/timetable`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(timetable),
      });
      alert('Timetable created successfully');
    } catch (error) {
      console.error('Error creating timetable:', error);
    }
  };

  // Filter students who are assigned to the teacher with the current ID
  const assignedStudents = studentsAssigned.filter(student => student.teacher && student.teacher._id === id);
  
  // Get classroom ID for the teacher
  const teacherClassroom = classrooms.find(c => c.teacher && c.teacher._id === id);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Assign Student to Teacher: {email}</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Assign Student to Classroom</h2>
        <div className="flex space-x-4">
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          >
            <option value="">Select Student</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>{student.email}</option>
            ))}
          </select>
          <button
            onClick={handleAssignStudent}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Assign Student
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Assigned Students - {assignedStudents.length}</h2>
        <div>
          {assignedStudents.length > 0 ? (
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-2 border-r">Email</th>
                  <th className="px-4 py-2 border-r">Password</th>
                  <th className="px-4 py-2 border-r">Classroom</th>
                </tr>
              </thead>
              <tbody>
                {assignedStudents.map(student => (
                  <tr key={student._id}>
                    <td className="px-4 py-2 border-r">{student.email}</td>
                    <td className="px-4 py-2 border-r">{student.password}</td>
                    <td className="px-4 py-2">{student.classroom ? student.classroom.name : 'Not assigned'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No students assigned to this teacher yet.</p>
          )}
        </div>
      </div>

      <AddTimeTable teacherId={id} classroomId={teacherClassroom ? teacherClassroom._id : null} />

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Create Timetable</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Classroom ID"
            value={timetable.classroom}
            onChange={(e) => setTimetable({ ...timetable, classroom: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Start Time"
            value={timetable.startTime}
            onChange={(e) => setTimetable({ ...timetable, startTime: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="End Time"
            value={timetable.endTime}
            onChange={(e) => setTimetable({ ...timetable, endTime: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Days (comma separated)"
            value={timetable.days}
            onChange={(e) => setTimetable({ ...timetable, days: e.target.value.split(',') })}
            className="border border-gray-300 p-2 rounded w-full"
          />
          <button
            onClick={handleCreateTimetable}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Create Timetable
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assign;