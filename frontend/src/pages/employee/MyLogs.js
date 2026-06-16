import { useEffect, useState } from 'react';
import API from '../../api/axios';

export default function MyLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    API.get('/employee/my-logs').then(r => setLogs(r.data));
  }, []);

  return (
    <div>
      <h2>My Time Logs</h2>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr style={{ background:'#e0f2fe' }}>
            {['Project','Hours','Report','Date'].map(h => (
              <th key={h} style={{ padding:8, textAlign:'left' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log._id} style={{ borderBottom:'1px solid #e2e8f0' }}>
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