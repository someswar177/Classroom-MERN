import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddStudent = ({ isOpen, onClose, teacherId }) => {
    if (!isOpen) return null;
    const navigate = useNavigate();
  
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      role: 'student'
    });
  
    const [errors, setErrors] = useState({});
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
  
    const validateForm = () => {
      const newErrors = {};
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Invalid email format';
      }
  
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
      if (!formData.password.trim()) {
        newErrors.password = 'Password is required';
      }
  
      setErrors(newErrors);
  
      return Object.keys(newErrors).length === 0;
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      if (validateForm()) {
        try {
          const response = await fetch('http://localhost:8080/student/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...formData, teacher: teacherId }), // Include teacherId if available
          });
    
          const data = await response.json();
    
          if (data.message === "Student created successfully") {
            onClose();  // Close the modal
            if (teacherId) {
              navigate(`/teacher/${teacherId}`);  // Navigate to teacher page if teacherId is present
            } else {
              navigate('/view/students');  // Otherwise navigate to view students page
            }
          } else {
            console.error('Failed to create user:', data.message);
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
                  <div className="flex justify-center mb-6">
                    <span className="inline-block bg-gray-200 rounded-full p-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4"/>
                      </svg>
                    </span>
                  </div>
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
                    Add New Student
                  </h1>
                  <p className="text-gray-600 text-center mb-6">Enter student details.</p>
                  <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Student email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="name@company.com"
                        required
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Student Password</label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="••••••••"  
                        required
                      />
                      {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                    <button
                      type="submit"
                      className="w-full text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                      Add Student
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
export default AddStudent;
