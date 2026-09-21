import React, { useState } from 'react';
import axios from 'axios';
import { QrCode, Search } from 'lucide-react';

const VisitorPortal = () => {
  const [email, setEmail] = useState('');
  const [passes, setPasses] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // For demo, we are doing an open search by email. In production, an OTP would be better.
  const searchPasses = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // First get visitor by email, then get passes for that visitor.
      // Alternatively, just expose an endpoint /api/passes/visitor/:email
      // Since we don't have that endpoint, let's fetch all and filter for now (bad practice for prod, fine for demo without auth).
      const visitorRes = await axios.get('/api/visitors');
      const visitor = visitorRes.data.find(v => v.email === email);
      
      if (visitor) {
        const passRes = await axios.get('/api/passes');
        const visitorPasses = passRes.data.filter(p => p.visitor._id === visitor._id);
        setPasses(visitorPasses);
      } else {
        setPasses([]);
      }
      setSearched(true);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container" style={{ flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
         <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(79, 70, 229, 0.2)', color: 'var(--primary)', marginBottom: '20px' }}>
           <QrCode size={40} />
         </div>
         <h1 className="page-title">Visitor Portal</h1>
         <p style={{ color: 'var(--text-muted)' }}>Enter your email to view your digital passes</p>
      </div>

      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', marginBottom: '30px' }}>
        <form onSubmit={searchPasses} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="email" 
            className="input-field" 
            placeholder="visitor@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Search size={18} /> {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {searched && (
        <div style={{ width: '100%', maxWidth: '500px' }}>
          {passes.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {passes.map(pass => (
                <div key={pass._id} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '5px' }}>Meeting: {pass.appointment?.purpose}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      Valid: {new Date(pass.validFrom).toLocaleDateString()} - {new Date(pass.validUntil).toLocaleDateString()}
                    </p>
                    <span className={`badge ${pass.status === 'active' ? 'badge-approved' : 'badge-rejected'}`} style={{ marginTop: '10px', display: 'inline-block' }}>
                      {pass.status}
                    </span>
                  </div>
                  <div style={{ background: '#fff', padding: '10px', borderRadius: '8px' }}>
                    <img src={pass.qrCodeImageUrl} alt="QR Code" width="100" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="glass-panel" style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ color: 'var(--text-muted)' }}>No passes found for {email}</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VisitorPortal;
