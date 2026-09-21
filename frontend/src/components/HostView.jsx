import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HostView = () => {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', purpose: '', scheduledDate: '', scheduledTime: ''
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      // 1. Create or get visitor
      const visitorRes = await axios.post('http://localhost:5001/api/visitors', {
        name: formData.name, email: formData.email, phone: formData.phone, company: formData.company
      });
      
      // 2. Create appointment
      await axios.post('http://localhost:5001/api/appointments', {
        visitorId: visitorRes.data._id,
        purpose: formData.purpose,
        scheduledDate: formData.scheduledDate,
        scheduledTime: formData.scheduledTime
      });
      
      setShowModal(false);
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.25rem' }}>My Appointments</h3>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Invite Visitor</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Visitor Name</th>
              <th>Company</th>
              <th>Purpose</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(apt => (
              <tr key={apt._id}>
                <td>{apt.visitor?.name}</td>
                <td>{apt.visitor?.company || '-'}</td>
                <td>{apt.purpose}</td>
                <td>{new Date(apt.scheduledDate).toLocaleDateString()} {apt.scheduledTime}</td>
                <td>
                  <span className={`badge badge-${apt.status}`}>
                    {apt.status}
                  </span>
                </td>
                <td>
                  {apt.status === 'pending' && (
                    <button className="btn btn-success" style={{ padding: '4px 8px', fontSize: '12px' }}
                      onClick={async () => {
                        await axios.put(`http://localhost:5001/api/appointments/${apt._id}`, { status: 'approved' });
                        // Issue pass
                        await axios.post('http://localhost:5001/api/passes/issue', {
                          appointmentId: apt._id,
                          validFrom: new Date(),
                          validUntil: new Date(new Date().setHours(23, 59, 59, 999)) // valid today
                        });
                        fetchAppointments();
                      }}>Approve & Issue Pass</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', background: 'var(--bg-color)' }}>
            <h3 style={{ marginBottom: '20px' }}>Invite Visitor</h3>
            <form onSubmit={handleCreate}>
              <div className="grid-cards" style={{ gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: 0 }}>
                <div className="input-group">
                  <label>Name</label>
                  <input type="text" className="input-field" required onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Email</label>
                  <input type="email" className="input-field" required onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Phone</label>
                  <input type="text" className="input-field" required onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Company</label>
                  <input type="text" className="input-field" onChange={e => setFormData({...formData, company: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Date</label>
                  <input type="date" className="input-field" required onChange={e => setFormData({...formData, scheduledDate: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Time</label>
                  <input type="time" className="input-field" required onChange={e => setFormData({...formData, scheduledTime: e.target.value})} />
                </div>
              </div>
              <div className="input-group">
                <label>Purpose of Visit</label>
                <input type="text" className="input-field" required onChange={e => setFormData({...formData, purpose: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Send Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostView;
