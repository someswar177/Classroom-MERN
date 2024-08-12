import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import PrincipalPage from './pages/PrincipalPage';
import TeacherPage from './pages/TeacherPage';
import ViewTeacher from './pages/ViewTeacher';
import ViewClassroom from './pages/ViewClassroom';
import ViewStudent from './pages/ViewStudent';
import Assign from './pages/Assign';
import ViewTimetable from './pages/ViewTimetable';
import Navbar from './components/Navbar';
import NavbarTeacher from './components/NavbarTeacher';
import StudentPage from './pages/StudentPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<LoginPage />}
        />
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/principal" element={<PrincipalPage />} />
                {/* <Route path="/teacher" element={<TeacherPage />} /> */}
                <Route path="/view/teachers" element={<ViewTeacher />} />
                <Route path="/view/classrooms" element={<ViewClassroom />} />
                <Route path="/view/students" element={<ViewStudent />} />
                <Route path="/view/timetables" element={<ViewTimetable />} />
                <Route path="/assign/:id" element={<Assign />} />
              </Routes>
            </>
          }
        />
        <Route
          path='/teacher/:userId'
          element={
            <>
            <NavbarTeacher/>
              <Routes>
                <Route path="/" element={<TeacherPage />} />
              </Routes>
            </>
          }
        />
        <Route
          path='/student/:userId'
          element={
            <>
            <NavbarTeacher/>
              <Routes>
                <Route path="/" element={<StudentPage />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
