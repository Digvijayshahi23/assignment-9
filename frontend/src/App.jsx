import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VisitorPortal from './pages/VisitorPortal';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div className="loader">Loading...</div>;
  
  if (!user) return <Navigate to="/login" />;
  
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/visitor" element={<VisitorPortal />} />
        <Route 
          path="/dashboard/*" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
