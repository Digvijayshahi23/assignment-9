import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Users, Calendar, QrCode, LogOut, FileText } from 'lucide-react';
import AdminView from '../components/AdminView';
import HostView from '../components/HostView';
import SecurityView from '../components/SecurityView';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ padding: '0 24px', marginBottom: '20px' }}>
          <h2 style={{ color: '#fff', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QrCode size={18} color="#fff" />
            </div>
            PassManager
          </h2>
          <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: 600 }}>{user?.name}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>Role: {user?.role}</p>
          </div>
        </div>

        <ul className="sidebar-nav">
          <li>
            <a href="#" className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
              <LayoutDashboard size={20} /> Overview
            </a>
          </li>
          
          {user?.role === 'admin' && (
            <li>
              <a href="#" className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
                <Users size={20} /> Users & Roles
              </a>
            </li>
          )}
          
          {(user?.role === 'host' || user?.role === 'admin') && (
            <li>
              <a href="#" className={activeTab === 'appointments' ? 'active' : ''} onClick={() => setActiveTab('appointments')}>
                <Calendar size={20} /> Appointments
              </a>
            </li>
          )}

          {(user?.role === 'security' || user?.role === 'admin') && (
            <li>
              <a href="#" className={activeTab === 'scanner' ? 'active' : ''} onClick={() => setActiveTab('scanner')}>
                <QrCode size={20} /> Pass Scanner
              </a>
            </li>
          )}
          
          {(user?.role === 'security' || user?.role === 'admin') && (
            <li>
              <a href="#" className={activeTab === 'logs' ? 'active' : ''} onClick={() => setActiveTab('logs')}>
                <FileText size={20} /> Check Logs
              </a>
            </li>
          )}
        </ul>

        <div style={{ marginTop: 'auto', padding: '24px' }}>
          <button onClick={handleLogout} className="btn" style={{ width: '100%', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <h1 className="page-title">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Dashboard
          </h1>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        <div className="content-area">
          {user?.role === 'admin' && activeTab === 'overview' && <AdminView />}
          {user?.role === 'host' && activeTab === 'overview' && <HostView />}
          {user?.role === 'security' && activeTab === 'overview' && <SecurityView />}
          
          {/* Other tabs would render specific components, for brevity we will inline or route them */}
          {activeTab === 'appointments' && <HostView />}
          {activeTab === 'scanner' && <SecurityView />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
