import { useEffect, useState } from 'react';
import API from '../../api/axios';

export default function TimeLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    API.get('/admin/timelogs').then(r => setLogs(r.data));
  }, []);

  return (
    <div>
      <h2>Employee Time Logs</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#e2e8f0' }}>
            {['Employee','Project','Hours','Report','Date'].map(h => (
              <th key={h} style={{ padding:8, textAlign:'left' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding:8 }}>{log.employee?.name}</td>
              <td style={{ padding:8 }}>{log.project?.title}</td>
              <td style={{ padding:8 }}>{log.hoursWorked}h</td>
              <td style={{ padding:8 }}>{log.report}</td>
              <td style={{ padding:8 }}>{new Date(log.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}