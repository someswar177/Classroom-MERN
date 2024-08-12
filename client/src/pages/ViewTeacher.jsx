import React, { useState, useEffect } from 'react';
import { FaSearch, FaRegEdit, FaPlus } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import AddTeacher from '../components/AddTeacher';
import '../assets/css/ViewTeacher.css';

const ViewTeacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [updatedTeacher, setUpdatedTeacher] = useState({});
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  const navigate = useNavigate(); // Define navigate

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = () => {
    fetch('http://localhost:8080/view/teachers')
      .then(response => response.json())
      .then(data => setTeachers(data.teachers))
      .catch(error => console.error('Error fetching data:', error));
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const toggleAddTeacher = () => {
    setShowAddTeacher(!showAddTeacher);
  };

  const handleEditClick = (teacher) => {
    setEditingTeacherId(teacher._id);
    setUpdatedTeacher({ ...teacher });
  };


  const handleUpdateClick = async (teacherId) => {
    try {
      const response = await fetch(`http://localhost:8080/update/teacher/${teacherId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTeacher),
      });
      if (response.ok) {
        fetchTeachers(); // Refetch data after update
        setEditingTeacherId(null);
      } else {
        console.error('Failed to update teacher');
      }
    } catch (error) {
      console.error('Error updating teacher:', error);
    }
  };

  const handleInputChange = (e) => {
    setUpdatedTeacher({ ...updatedTeacher, [e.target.name]: e.target.value });
  };


  const handleDeleteClick = (teacher) => {
    setTeacherToDelete(teacher);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/delete/teacher/${teacherToDelete._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchTeachers(); // Refetch data after delete
        setShowDeletePopup(false);
        setTeacherToDelete(null);
      } else {
        console.error('Failed to delete teacher');
      }
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
    setTeacherToDelete(null);
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssignClassroom = (teacher) => {
    navigate(`/assign/${teacher._id}`); // Pass the teacher's email directly
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
            placeholder="Search Teachers"
          />
          <button className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-5 mx-4 rounded shadow'>Search</button>
        </div>
        <button
          onClick={toggleAddTeacher}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded shadow flex items-center"
        >
          <FaPlus className="mr-2" /> <div className='font-bold'>Add New Teachers</div>
        </button>
      </div>

      <AddTeacher isOpen={showAddTeacher} onClose={() => { toggleAddTeacher(); fetchTeachers(); }} />
      <h1 className="text-3xl font-bold mb-6 text-center">All Teachers</h1>

      {filteredTeachers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-gray-300 shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left py-2 px-4">Email</th>
                {/* <th className="text-left py-2 px-4">Id</th> */}
                <th className="text-left py-2 px-4">Password</th>
                <th className="text-left py-2 px-4">Classroom</th>
                <th className="text-left py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((teacher, i) => (
                <tr 
                  key={i} 
                  className={`${i % 2 === 0 ? 'bg-gray-100' : 'bg-white'} `}
                >
                  <td className="py-2 px-4">
                    {editingTeacherId === teacher._id ? (
                      <input
                        type="text"
                        name="email"
                        value={updatedTeacher.email}
                        onChange={handleInputChange}
                        className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      teacher.email
                    )}
                  </td>
                  {/* <td className="py-2 px-4">{teacher._id}</td> */}
                  <td className="py-2 px-4">
                    {editingTeacherId === teacher._id ? (
                      <input
                        type="text"
                        name="password"
                        value={updatedTeacher.password}
                        onChange={handleInputChange}
                        className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      teacher.password
                    )}
                  </td>
                  <td className="py-2 px-4">
                   
                      {teacher.classroom ? (
                        <button
                          onClick={() => handleAssignClassroom(teacher)}
                          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded shadow flex items-center"
                        >
                          {teacher.classroom.name}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAssignClassroom(teacher)}
                          className="bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded shadow flex items-center"
                        >
                          &#x2022; Assign
                        </button>

                      )
                    }
                  </td>
                  <td className="py-2 px-4 flex items-center space-x-4">
                    {editingTeacherId === teacher._id ? (
                      <button
                        onClick={() => handleUpdateClick(teacher._id)}
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
                          onClick={() => handleEditClick(teacher)}
                          className="text-2xl text-blue-500 cursor-pointer hover:text-blue-700"
                        />
                      </div>
                    )}
                    <div className="group relative flex items-center">
                      <MdDelete
                        onClick={() => handleDeleteClick(teacher)}
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
        <p className="text-center text-gray-500 mt-4">No teachers found.</p>
      )}

      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl mb-4">Are you sure you want to delete this teacher?</h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
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

export default ViewTeacher;

