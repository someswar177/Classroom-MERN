import React, { useState, useEffect } from 'react';

const StudentTimetable = ({ teacherId, classroomId }) => {
    const [timetableData, setTimetableData] = useState([]);

    useEffect(() => {
        fetchTimetable();
    }, [teacherId, classroomId]);

    const fetchTimetable = async () => {
        try {
            const response = await fetch(`http://localhost:8080/view/timetable/${teacherId}/${classroomId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTimetableData(data.timetables || []);
        } catch (error) {
            console.error('Error fetching timetable:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-6 text-center">Timetable of Class</h2>

            {timetableData.length === 0 ? (
                <p>No timetable available.</p>
            ) : (
                <table className="min-w-full rounded-2xl mb-4">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="px-4 py-2 border-r">Subject</th>
                            <th className="px-4 py-2 border-r">Period</th>
                            <th className="px-4 py-2 border-r">Day</th>
                            <th className="px-4 py-2 border-r">Start Time</th>
                            <th className="px-4 py-2 border-r">End Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {timetableData.map((entry) => (
                            <tr key={entry._id}>
                                <td className="px-4 py-2 border-r">{entry.subject}</td>
                                <td className="px-4 py-2 border-r">{entry.period}</td>
                                <td className="px-4 py-2 border-r">{entry.day}</td>
                                <td className="px-4 py-2 border-r">{entry.startTime}</td>
                                <td className="px-4 py-2 border-r">{entry.endTime}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default StudentTimetable;
