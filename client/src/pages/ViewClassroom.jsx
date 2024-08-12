import React, { useState, useEffect } from 'react';
import { FaSearch, FaRegEdit, FaPlus } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import AddClassroom from '../components/AddClassroom';
import '../assets/css/ViewClassroom.css';

const ViewClassroom = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [showAddClassroom, setShowAddClassroom] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingClassroomId, setEditingClassroomId] = useState(null);
    const [updatedClassroom, setUpdatedClassroom] = useState({});
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [classroomToDelete, setClassroomToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchclassrooms();
    }, []);

    const fetchclassrooms = () => {
        fetch('http://localhost:8080/view/classrooms')
            .then(response => response.json())
            .then(data => setClassrooms(data.classrooms))
            .catch(error => console.error('Error fetching data:', error));
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    const toggleAddClassroom = () => {
        setShowAddClassroom(!showAddClassroom);
    };

    const handleEditClick = (classroom) => {
        setEditingClassroomId(classroom._id);
        setUpdatedClassroom({ ...classroom });
    };

    const handleUpdateClick = async (classroomId) => {
        try {
            const response = await fetch(`http://localhost:8080/update/classroom/${classroomId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedClassroom),
            });
            if (response.ok) {
                fetchclassrooms(); // Refetch data after update
                setEditingClassroomId(null);
            } else {
                console.error('Failed to update classroom');
            }
        } catch (error) {
            console.error('Error updating classroom:', error);
        }
    };

    const handleInputChange = (e) => {
        setUpdatedClassroom({ ...updatedClassroom, [e.target.name]: e.target.value });
    };


    const handleDeleteClick = (classroom) => {
        setClassroomToDelete(classroom);
        setShowDeletePopup(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8080/delete/classroom/${classroomToDelete._id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchclassrooms(); // Refetch data after delete
                setShowDeletePopup(false);
                setClassroomToDelete(null);
            } else {
                console.error('Failed to delete classroom');
            }
        } catch (error) {
            console.error('Error deleting classroom:', error);
        }
    };

    const cancelDelete = () => {
        setShowDeletePopup(false);
        setClassroomToDelete(null);
    };

    const filteredclassrooms = classrooms.filter(classroom =>
        classroom.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAssignTeacher = (classroom) => {
        navigate(`/assign/${classroom._id}/${0}/${classroom.name}`);
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
                        placeholder="Search Classrooms"
                    />
                    <button className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-5 mx-4 rounded shadow'>Search</button>
                </div>
                <button
                    onClick={toggleAddClassroom}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded shadow flex items-center"
                >
                    <FaPlus className="mr-2" /> <div className='font-bold'>Add New classroom</div>
                </button>
            </div>

            <AddClassroom isOpen={showAddClassroom} onClose={() => { toggleAddClassroom(); fetchclassrooms(); }} />
            <h1 className="text-3xl font-bold mb-6 text-center">All Classrooms</h1>


            {filteredclassrooms.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border-gray-300 shadow-lg rounded-lg overflow-hidden">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="text-left py-2 px-4">Name</th>
                                <th className="text-left py-2 px-4">Start Time</th>
                                <th className="text-left py-2 px-4">End Time</th>
                                <th className="text-left py-2 px-4">Days</th>
                                <th className="text-left py-2 px-4">Teacher</th>
                                <th className="text-left py-2 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredclassrooms.map((classroom, i) => (
                                <tr key={i} className={i % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                    <td className="py-2 px-4">
                                        {editingClassroomId === classroom._id ? (
                                            <input
                                                type="text"
                                                name="name"
                                                value={updatedClassroom.name}
                                                onChange={handleInputChange}
                                                className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                                            />
                                        ) : (
                                            classroom.name
                                        )}
                                    </td>
                                    <td className="py-2 px-4">
                                        {editingClassroomId === classroom._id ? (
                                            <input
                                                type="text"
                                                name="startTime"
                                                value={updatedClassroom.startTime}
                                                onChange={handleInputChange}
                                                className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                                            />
                                        ) : (
                                            classroom.startTime
                                        )}
                                    </td>
                                    <td className="py-2 px-4">
                                        {editingClassroomId === classroom._id ? (
                                            <input
                                                type="text"
                                                name="endTime"
                                                value={updatedClassroom.endTime}
                                                onChange={handleInputChange}
                                                className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                                            />
                                        ) : (
                                            classroom.endTime
                                        )}
                                    </td>
                                    <td className="py-2 px-4">
                                        {editingClassroomId === classroom._id ? (
                                            <input
                                                type="text"
                                                name="days"
                                                value={updatedClassroom.days}
                                                onChange={handleInputChange}
                                                className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                                            />
                                        ) : (
                                            classroom.days.join(', ')
                                        )}
                                    </td>
                                    <td className="py-2 px-4">
                                        {editingClassroomId === classroom._id ? (
                                            <input
                                                type="text"
                                                name="teacher"
                                                value={updatedClassroom.teacher?.email || ""}
                                                onChange={handleInputChange}
                                                className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                                            />
                                        ) : (
                                            classroom.teacher?.email || 
                                            <button
                                            onClick={() => handleAssignTeacher(classroom)}
                                            className="bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded shadow flex items-center"
                                          >
                                            &#x2022; Assign
                                          </button>
                                        )}
                                    </td>

                                    <td className="py-2 px-4 flex items-center space-x-4">
                                        {editingClassroomId === classroom._id ? (
                                            <button
                                                onClick={() => handleUpdateClick(classroom._id)}
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
                                                    onClick={() => handleEditClick(classroom)}
                                                    className="text-2xl text-blue-500 cursor-pointer hover:text-blue-700"
                                                />
                                            </div>
                                        )}
                                        <div className="group relative flex items-center">
                                            <MdDelete
                                                onClick={() => handleDeleteClick(classroom)}
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
                <p>No classrooms found.</p>
            )}

            {showDeletePopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <p>Are you sure you want to delete this classroom?</p>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                onClick={confirmDelete}
                                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded shadow"
                            >
                                Delete
                            </button>
                            <button
                                onClick={cancelDelete}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded shadow"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewClassroom;
