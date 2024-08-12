import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddClassroom = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        startTime: '',
        endTime: '',
        days: [],
        teacher: ''
    });

    const [teachers, setTeachers] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const response = await fetch('http://localhost:8080/view/teachers');
            const data = await response.json();
            
            // Filter teachers who don't have a classroom assigned
            const availableTeachers = data.teachers.filter(teacher => !teacher.classroom);
            setTeachers(availableTeachers);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleDaysChange = (e) => {
        const { value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            days: value.split(',')
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Classroom name is required';
        }

        if (!formData.startTime.trim()) {
            newErrors.startTime = 'Start time is required';
        }

        if (!formData.endTime.trim()) {
            newErrors.endTime = 'End time is required';
        }

        if (!formData.days.length) {
            newErrors.days = 'At least one day is required';
        }

        if (!formData.teacher.trim()) {
            newErrors.teacher = 'Teacher selection is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const response = await fetch('http://localhost:8080/add/classroom', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (response.ok) {
                    onClose();
                    navigate('/view/classrooms'); 
                } else {
                    console.error('Failed to add classroom:', data.message);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    return (
        <div>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg relative">
                    <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-800" onClick={onClose}>
                        ✖
                    </button>
                    <div className="flex flex-col items-center justify-center px-8 py-8 mx-auto lg:py-0">
                        <div className="w-full bg-white rounded-lg md:mt-0 sm:max-w-md xl:p-0">
                            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                {/* <div className="flex justify-center mb-6">
                                    <span className="inline-block bg-gray-200 rounded-full p-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4"/>
                                        </svg>
                                    </span>
                                </div> */}
                                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
                                    Add New Classroom
                                </h1>
                                <p className="text-gray-600 text-center mb-6">Enter classroom details.</p>
                                <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Classroom Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            placeholder="Classroom name"
                                            required
                                        />
                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="startTime" className="block mb-2 text-sm font-medium text-gray-900">Start Time</label>
                                        <input
                                            type="text"
                                            id="startTime"
                                            name="startTime"
                                            value={formData.startTime}
                                            onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            placeholder="Start time (e.g., 09:00)"
                                            required
                                        />
                                        {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="endTime" className="block mb-2 text-sm font-medium text-gray-900">End Time</label>
                                        <input
                                            type="text"
                                            id="endTime"
                                            name="endTime"
                                            value={formData.endTime}
                                            onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            placeholder="End time (e.g., 17:00)"
                                            required
                                        />
                                        {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="days" className="block mb-2 text-sm font-medium text-gray-900">Days of the Week (comma-separated)</label>
                                        <input
                                            type="text"
                                            id="days"
                                            name="days"
                                            value={formData.days.join(',')}
                                            onChange={handleDaysChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            placeholder="e.g., Monday,Wednesday,Friday"
                                            required
                                        />
                                        {errors.days && <p className="text-red-500 text-xs mt-1">{errors.days}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="teacher" className="block mb-2 text-sm font-medium text-gray-900">Select Teacher</label>
                                        <select
                                            id="teacher"
                                            name="teacher"
                                            value={formData.teacher}
                                            onChange={handleChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            required
                                        >
                                            <option value="">Select a teacher</option>
                                            {teachers.map(teacher => (
                                                <option key={teacher._id} value={teacher._id}>
                                                    {teacher.email}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.teacher && <p className="text-red-500 text-xs mt-1">{errors.teacher}</p>}
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                    >
                                        Add Classroom
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddClassroom;
