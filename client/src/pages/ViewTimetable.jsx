import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/css/ViewTimetable.css'

const ViewTimetable = () => {
    const [classrooms, setClassrooms] = useState([]);
    const apiUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';

    useEffect(() => {
        axios.get(`${apiUrl}/classrooms/timetables`)
            .then(response => {
                setClassrooms(response.data);
            })
            .catch(error => {
                console.error('Error fetching classrooms:', error);
            });
    }, []);

    return (
        <div className="container-ss p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">All Classroom Timetables</h1>
            <div className="space-y-8">
                {classrooms.map(classroom => (
                    <div key={classroom._id} className="bg-white border border-gray-300 rounded-lg shadow-md p-4">
                        <h2 className="text-2xl font-semibold mb-4">{classroom.name}</h2>
                        {classroom.timeTable && classroom.timeTable.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                                    <thead className="bg-gray-200 border-b border-gray-300">
                                        <tr>
                                            <th className="py-3 px-4 text-left text-gray-700 font-semibold">Subject</th>
                                            <th className="py-3 px-4 text-left text-gray-700 font-semibold">Period</th>
                                            <th className="py-3 px-4 text-left text-gray-700 font-semibold">Day</th>
                                            <th className="py-3 px-4 text-left text-gray-700 font-semibold">Start Time</th>
                                            <th className="py-3 px-4 text-left text-gray-700 font-semibold">End Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {classroom.timeTable.map(timetable => (
                                            <tr key={timetable._id}>
                                                <td className="py-2 px-4">{timetable.subject}</td>
                                                <td className="py-2 px-4">{timetable.period}</td>
                                                <td className="py-2 px-4">{timetable.day}</td>
                                                <td className="py-2 px-4">{timetable.startTime}</td>
                                                <td className="py-2 px-4">{timetable.endTime}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-600">No timetable created</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewTimetable;
