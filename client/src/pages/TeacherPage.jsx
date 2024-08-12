import React from 'react';
import { useParams } from 'react-router-dom';

const TeacherPage = () => {
  // Use useParams to access the dynamic URL parameters
  const { userId } = useParams();

  return (
    <div>
      Teacher Page for User ID: {userId}
    </div>
  );
}

export default TeacherPage;
