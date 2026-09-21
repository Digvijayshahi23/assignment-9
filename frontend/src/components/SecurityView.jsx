import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Html5QrcodeScanner } from 'html5-qrcode';

const SecurityView = () => {
  const [scanResult, setScanResult] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
    
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 5
    });

    scanner.render(onScanSuccess, onScanFailure);

    function onScanSuccess(decodedText, decodedResult) {
      try {
        const data = JSON.parse(decodedText);
        handleScan(data.passId);
      } catch (e) {
        setScanResult({ error: 'Invalid QR Code' });
      }
    }

    function onScanFailure(error) {
      // ignore
    }

    return () => {
      scanner.clear().catch(error => console.error('Failed to clear scanner', error));
    };
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('/api/passes/logs');
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleScan = async (passId) => {
    try {
      const res = await axios.post('/api/passes/scan', { passId });
      setScanResult({ success: res.data.message });
      fetchLogs();
      
      setTimeout(() => setScanResult(null), 3000);
    } catch (err) {
      setScanResult({ error: err.response?.data?.message || 'Scan failed' });
      setTimeout(() => setScanResult(null), 3000);
    }
  };

  return (
    <div className="grid-cards" style={{ gridTemplateColumns: '1fr 2fr' }}>
      <div>
        <h3 style={{ marginBottom: '15px' }}>Scan QR Code</h3>
        <div className="glass-panel" style={{ background: '#fff', color: '#000' }}>
           <div id="reader"></div>
        </div>
        {scanResult && (
          <div style={{
            marginTop: '15px', padding: '15px', borderRadius: '8px',
            background: scanResult.success ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            color: scanResult.success ? 'var(--success)' : 'var(--danger)',
            textAlign: 'center', fontWeight: 'bold'
          }}>
            {scanResult.success || scanResult.error}
          </div>
        )}
      </div>

      <div>
         <h3 style={{ marginBottom: '15px' }}>Recent Check-in/out Logs</h3>
         <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Visitor</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th>Scanned By</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log._id}>
                    <td>{log.visitor?.name}</td>
                    <td>
                      <span className={`badge ${log.status === 'checked_in' ? 'badge-approved' : 'badge-pending'}`}>
                        {log.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{new Date(log.status === 'checked_in' ? log.checkInTime : log.checkOutTime).toLocaleString()}</td>
                    <td>{log.scannedBy?.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default SecurityView;
