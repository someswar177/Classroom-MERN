import React, { useState, useEffect } from 'react';
import { FaSearch, FaRegEdit, FaPlus } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import AddStudent from '../components/AddStudent';
import '../assets/css/ViewStudent.css';

const ViewStudent = () => {
  const apiUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';
  const [students, setStudents] = useState([]);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [updatedStudent, setUpdatedStudent] = useState({});
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [StudentToDelete, setStudentToDelete] = useState(null);

  const navigate = useNavigate(); // Define navigate

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    fetch(`${apiUrl}/view/students`)
      .then(response => response.json())
      .then(data => {
        setStudents(data.students);
        console.log(data.students);
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const toggleAddStudent = () => {
    setShowAddStudent(!showAddStudent);
  };

  const handleEditClick = (student) => {
    setEditingStudentId(student._id);
    setUpdatedStudent({ ...student });
  };


  const handleUpdateClick = async (studentId) => {
    try {
      const response = await fetch(`${apiUrl}/update/student/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedStudent),
      });
      if (response.ok) {
        fetchStudents(); // Refetch data after update
        setEditingStudentId(null);
      } else {
        console.error('Failed to update student');
      }
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const handleInputChange = (e) => {
    setUpdatedStudent({ ...updatedStudent, [e.target.name]: e.target.value });
  };


  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`${apiUrl}/delete/student/${StudentToDelete._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchStudents(); // Refetch data after delete
        setShowDeletePopup(false);
        setStudentToDelete(null);
      } else {
        console.error('Failed to delete student');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
    setStudentToDelete(null);
  };

  const filteredStudents = students.filter(student =>
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssignClassroom = (studentId) => {
    navigate(`/assign/${studentId}`); // Navigate to the assign classroom route
  };

  return (
    <div className="container-ss container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <FaSearch className="text-gray-500" />
          <input
            className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
            onChange={(e) => handleSearchChange(e.target.value)}
            type="text"
            placeholder="Search Students"
          />
          <button className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-5 mx-4 rounded shadow'>Search</button>
        </div>
        <button
          onClick={toggleAddStudent}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded shadow flex items-center"
        >
          <FaPlus className="mr-2" /> <div className='font-bold'>Add New students</div>
        </button>
      </div>

      <AddStudent isOpen={showAddStudent} onClose={() => { toggleAddStudent(); fetchStudents(); }} />
      <h1 className="text-3xl font-bold mb-6 text-center">All Students</h1>

      {filteredStudents.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-gray-300 shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left py-2 px-4">Email</th>
                {/* <th className="text-left py-2 px-4">Id</th> */}
                <th className="text-left py-2 px-4">Password</th>
                <th className="text-left py-2 px-4">Classroom</th>
                <th className="text-left py-2 px-4">Teacher</th>
                <th className="text-left py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                  <td className="py-2 px-4">
                    {editingStudentId === student._id ? (
                      <input
                        type="text"
                        name="email"
                        value={updatedStudent.email}
                        onChange={handleInputChange}
                        className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      student.email
                    )}
                  </td>
                  {/* <td className="py-2 px-4">{student._id}</td> */}
                  <td className="py-2 px-4">
                    {editingStudentId === student._id ? (
                      <input
                        type="text"
                        name="password"
                        value={updatedStudent.password}
                        onChange={handleInputChange}
                        className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      student.password
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {(
                      student.classroom ? (
                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded shadow flex items-center"
                        >{student.classroom.name}</button>
                      ) : (
                        // <button 
                        //   onClick={() => handleAssignClassroom(student._id)} 
                        //   className="bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded shadow flex items-center"
                        //   >
                        //   &#x2022; Assign
                        // </button>
                        <div className='text-yellow-700'>Not Assigned</div>
                      )
                    )}
                  </td>
                  <td>{student.teacher ? (student.teacher.email) : (<div className='text-yellow-700'>Not Assigned</div>)}</td>
                  <td className="py-2 px-4 flex items-center space-x-4">
                    {editingStudentId === student._id ? (
                      <button
                        onClick={() => handleUpdateClick(student._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded shadow"
                      >
                        Update
                      </button>
                    ) : (
                      <div className="group relative flex items-center">
                        <span className="absolute right-full mr-2 text-xs font-medium text-white bg-gradient-to-r from-blue-400 to-purple-600 rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          Edit
                        </span>
                        <FaRegEdit
                          onClick={() => handleEditClick(student)}
                          className="text-2xl text-blue-500 cursor-pointer hover:text-blue-700"
                        />
                      </div>
                    )}
                    <div className="group relative flex items-center">
                      <MdDelete
                        onClick={() => handleDeleteClick(student)}
                        className="text-2xl text-red-500 cursor-pointer hover:text-red-700"
                      />
                      <span className="absolute left-full ml-2 text-xs font-medium text-white bg-gradient-to-r from-red-400 to-pink-600 rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Delete
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">No students found.</p>
      )}

      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Delete student</h2>
            <p>Are you sure you want to delete the following student?</p>
            <p><strong>Email:</strong> {StudentToDelete.email}</p>
            <p><strong>ID:</strong> {StudentToDelete._id}</p>
            <div className="flex justify-end mt-4 space-x-4">
              <button
                onClick={cancelDelete}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded shadow"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded shadow"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewStudent;
