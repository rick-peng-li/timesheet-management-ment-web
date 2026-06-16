import { useEffect, useState } from 'react';
import API from '../../api/axios';

export default function EmployeeStatus() {
  const [employees, setEmployees] = useState([]);

  const fetchStatus = () => {
    API.get('/admin/employee-status').then(r => setEmployees(r.data));
  };

  useEffect(() => {
    fetchStatus();
    // Auto refresh every 20 seconds
    const interval = setInterval(fetchStatus, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>👥 Employee Status</h2>
      <p style={{ color: '#64748b', fontSize: 14 }}>
        Auto-refreshes every 20 seconds
      </p>

      {employees.map(emp => (
        <div key={emp._id} style={{
          background: '#fff',
          padding: 20,
          borderRadius: 10,
          marginBottom: 16,
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          borderLeft: `5px solid ${emp.isOnline ? '#22c55e' : '#94a3b8'}`
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0 }}>👤 {emp.name}</h3>
              <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>{emp.email}</p>
            </div>
            {/* Online/Offline badge */}
            <span style={{
              background: emp.isOnline ? '#dcfce7' : '#f1f5f9',
              color: emp.isOnline ? '#16a34a' : '#64748b',
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 'bold'
            }}>
              {emp.isOnline ? '🟢 Online' : '🔴 Offline'}
            </span>
          </div>

          {/* Last seen */}
          {!emp.isOnline && emp.lastSeen && (
            <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 8 }}>
              Last seen: {new Date(emp.lastSeen).toLocaleString()}
            </p>
          )}

          {/* Currently working on */}
          {emp.currentProject && (
            <div style={{
              background: '#f0fdf4',
              padding: 10,
              borderRadius: 6,
              marginTop: 10
            }}>
              <p style={{ margin: 0, color: '#16a34a' }}>
                ⚡ Currently working on: <strong>{emp.currentProject}</strong>
              </p>
              <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
                Started at: {new Date(emp.workStartedAt).toLocaleTimeString()}
              </p>
            </div>
          )}

          {/* Today's hours */}
          <div style={{
            display: 'flex',
            gap: 16,
            marginTop: 12,
            flexWrap: 'wrap'
          }}>
            <div style={{
              background: '#eff6ff',
              padding: '8px 16px',
              borderRadius: 6,
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 'bold', color: '#2563eb' }}>
                {emp.totalHoursToday}h
              </p>
              <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>Today's Hours</p>
            </div>

            <div style={{
              background: '#fef9c3',
              padding: '8px 16px',
              borderRadius: 6,
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 'bold', color: '#ca8a04' }}>
                {emp.todayLogs.length}
              </p>
              <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>Sessions Today</p>
            </div>
          </div>

          {/* Today's project breakdown */}
          {emp.todayLogs.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <p style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 6 }}>
                Today's Work:
              </p>
              {emp.todayLogs.map(log => (
                <div key={log._id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '4px 0',
                  borderBottom: '1px solid #f1f5f9',
                  fontSize: 13
                }}>
                  <span>📋 {log.project?.title}</span>
                  <span style={{ color: '#2563eb' }}>{log.hoursWorked}h</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}