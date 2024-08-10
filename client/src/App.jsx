import { useState } from 'react';
// import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import PrincipalPage from './pages/PrincipalPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/principal" element={<PrincipalPage />} />
      </Routes>
    </Router>
  );
}

export default App;

