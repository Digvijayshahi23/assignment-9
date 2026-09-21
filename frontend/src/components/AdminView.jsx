import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, UserCheck, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const AdminView = () => {
  const [stats, setStats] = useState({ users: 0, appointments: 0, passes: 0 });
  const [users, setUsers] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const usersRes = await axios.get('http://localhost:5001/api/users');
      setUsers(usersRes.data);
      
      const aptRes = await axios.get('http://localhost:5001/api/appointments');
      const passRes = await axios.get('http://localhost:5001/api/passes');
      
      setStats({
        users: usersRes.data.length,
        appointments: aptRes.data.length,
        passes: passRes.data.length
      });

      // Prepare simple analytics data
      setChartData([
        { name: 'Users', count: usersRes.data.length },
        { name: 'Appointments', count: aptRes.data.length },
        { name: 'Passes', count: passRes.data.length }
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="grid-cards">
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ padding: '16px', background: 'rgba(79, 70, 229, 0.2)', borderRadius: '12px', color: 'var(--primary)' }}>
            <Users size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.users}</h3>
            <p style={{ color: 'var(--text-muted)' }}>Total Users</p>
          </div>
        </div>
        
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '12px', color: 'var(--success)' }}>
            <Calendar size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.appointments}</h3>
            <p style={{ color: 'var(--text-muted)' }}>Appointments</p>
          </div>
        </div>
        
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.2)', borderRadius: '12px', color: 'var(--warning)' }}>
            <UserCheck size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.passes}</h3>
            <p style={{ color: 'var(--text-muted)' }}>Passes Issued</p>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ marginBottom: '32px', height: '300px' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '1.25rem' }}>System Analytics</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#94A3B8" />
            <YAxis stroke="#94A3B8" />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }} />
            <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3 style={{ marginBottom: '20px', fontSize: '1.25rem' }}>System Users</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><span className="badge badge-approved">{u.role}</span></td>
                <td>{u.department || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminView;
