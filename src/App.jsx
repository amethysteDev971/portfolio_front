// src/App.jsx
import React from 'react';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Home from './pages/Home';
import ProjectDetail from './Components/ProjectDetail/ProjectDetail';
import Footer from './Components/Footer/Footer';  // Import du Footer

function App() {
  document.documentElement.classList.add('dark');
  return (
    <AuthProvider>
      <Router>
        <div id="main">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projets/:id" element={<ProjectDetail />} />
          </Routes>
          <Footer /> {/* Footer visible sur toutes les pages */}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
