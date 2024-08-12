import React, { useState, useEffect } from 'react';

const AddTimeTable = ({ teacherId, classroomId }) => {
    const [timetableData, setTimetableData] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [newRow, setNewRow] = useState({
        subject: '',
        period: '',
        day: '',
        startTime: '',
        endTime: ''
    });

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

    const handleCreate = async () => {
        console.log("Creating timetable");
        try {
            await fetch('http://localhost:8080/create/timetable', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newRow, teacher: teacherId, classroom: classroomId })
            }).then(res=>res.json())
            .then(data=>console.log(data));
            
            fetchTimetable();
            setNewRow({
                subject: '',
                period: '',
                day: '',
                startTime: '',
                endTime: ''
            });
        } catch (error) {
            console.error('Error creating timetable:', error);
        }
    };

    const handleUpdate = async () => {
        console.log("Updating timetable");
        for (const entry of timetableData) {
            try {
                await fetch(`http://localhost:8080/update/timetable/${entry._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(entry)
                });
            } catch (error) {
                console.error('Error updating timetable:', error);
            }
        }
        setIsEditing(false);
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:8080/delete/timetable/${id}`, { method: 'DELETE' });
            fetchTimetable();
        } catch (error) {
            console.error('Error deleting timetable:', error);
        }
    };

    const handleChange = (e, index, field) => {
        const updatedData = [...timetableData];
        updatedData[index][field] = e.target.value;
        setTimetableData(updatedData);
    };

    const handleNewRowChange = (e) => {
        setNewRow({ ...newRow, [e.target.name]: e.target.value });
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-xl font-semibold mb-2">Timetable</h2>

            {timetableData.length === 0 && !isEditing ? (
                <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded mb-4"
                >
                    Add Timetable
                </button>
            ) : (
                <>
                    <table className="min-w-full border border-gray-300 mb-4">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="px-4 py-2 border-r">Subject</th>
                                <th className="px-4 py-2 border-r">Period</th>
                                <th className="px-4 py-2 border-r">Day</th>
                                <th className="px-4 py-2 border-r">Start Time</th>
                                <th className="px-4 py-2 border-r">End Time</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {timetableData.map((entry, index) => (
                                <tr key={entry._id}>
                                    <td className="px-4 py-2 border-r">
                                        <input
                                            type="text"
                                            value={entry.subject}
                                            onChange={(e) => handleChange(e, index, 'subject')}
                                            className="border border-gray-300 p-1 rounded"
                                            disabled={!isEditing}
                                        />
                                    </td>
                                    <td className="px-4 py-2 border-r">
                                        <input
                                            type="text"
                                            value={entry.period}
                                            onChange={(e) => handleChange(e, index, 'period')}
                                            className="border border-gray-300 p-1 rounded"
                                            disabled={!isEditing}
                                        />
                                    </td>
                                    <td className="px-4 py-2 border-r">
                                        <input
                                            type="text"
                                            value={entry.day}
                                            onChange={(e) => handleChange(e, index, 'day')}
                                            className="border border-gray-300 p-1 rounded"
                                            disabled={!isEditing}
                                        />
                                    </td>
                                    <td className="px-4 py-2 border-r">
                                        <input
                                            type="text"
                                            value={entry.startTime}
                                            onChange={(e) => handleChange(e, index, 'startTime')}
                                            className="border border-gray-300 p-1 rounded"
                                            disabled={!isEditing}
                                        />
                                    </td>
                                    <td className="px-4 py-2 border-r">
                                        <input
                                            type="text"
                                            value={entry.endTime}
                                            onChange={(e) => handleChange(e, index, 'endTime')}
                                            className="border border-gray-300 p-1 rounded"
                                            disabled={!isEditing}
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleDelete(entry._id)}
                                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {isEditing && (
                                <tr>
                                    <td className="px-4 py-2 border-r">
                                        <input
                                            type="text"
                                            name="subject"
                                            value={newRow.subject}
                                            onChange={handleNewRowChange}
                                            placeholder="New Subject"
                                            className="border border-gray-300 p-1 rounded"
                                        />
                                    </td>
                                    <td className="px-4 py-2 border-r">
                                        <input
                                            type="text"
                                            name="period"
                                            value={newRow.period}
                                            onChange={handleNewRowChange}
                                            placeholder="New Period"
                                            className="border border-gray-300 p-1 rounded"
                                        />
                                    </td>
                                    <td className="px-4 py-2 border-r">
                                        <input
                                            type="text"
                                            name="day"
                                            value={newRow.day}
                                            onChange={handleNewRowChange}
                                            placeholder="New Day"
                                            className="border border-gray-300 p-1 rounded"
                                        />
                                    </td>
                                    <td className="px-4 py-2 border-r">
                                        <input
                                            type="text"
                                            name="startTime"
                                            value={newRow.startTime}
                                            onChange={handleNewRowChange}
                                            placeholder="New Start Time"
                                            className="border border-gray-300 p-1 rounded"
                                        />
                                    </td>
                                    <td className="px-4 py-2 border-r">
                                        <input
                                            type="text"
                                            name="endTime"
                                            value={newRow.endTime}
                                            onChange={handleNewRowChange}
                                            placeholder="New End Time"
                                            className="border border-gray-300 p-1 rounded"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={handleCreate}
                                            className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded"
                                        >
                                            Save New
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <button
                        onClick={isEditing ? handleUpdate : () => setIsEditing(true)}
                        className={`bg-${isEditing ? 'green' : 'blue'}-500 hover:bg-${isEditing ? 'green' : 'blue'}-600 text-white py-1 px-2 rounded mb-4`}
                    >
                        {isEditing ? 'Save Changes' : 'Edit Timetable'}
                    </button>
                    {isEditing && (
                        <button
                            onClick={() => setIsEditing(false)}
                            className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-2 rounded mb-4"
                        >
                            Cancel
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default AddTimeTable;
