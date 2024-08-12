import React, { useEffect, useState } from 'react';
import AddTimeTable from '../components/AddTimeTable';

const TeacherTimetable = ({ id }) => {
  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const response = await fetch('http://localhost:8080/view/classrooms');
      const data = await response.json();
      
      // Filter the classrooms based on the teacher's ID
      const filteredClassrooms = data.classrooms.filter(classroom => classroom.teacher && classroom.teacher._id === id);
      setClassrooms(filteredClassrooms);
      console.log(filteredClassrooms);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
    }
  };

  return (
    <div>
      {classrooms.length > 0 ? (
        classrooms.map(classroom => (
          <div key={classroom._id}>
            <AddTimeTable teacherId={id} classroomId={classroom._id} />
          </div>
        ))
      ) : (
        <p>No classrooms available for this teacher.</p>
      )}
    </div>
  );
};

export default TeacherTimetable;
