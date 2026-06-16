import { useEffect, useState } from 'react';
import API from '../../api/axios';

export default function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [activeLogs, setActiveLogs] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    API.get('/employee/my-projects').then(r => setProjects(r.data));
    API.get('/employee/my-logs').then(r => {
      const active = r.data.filter(l => l.status === 'active');
      setActiveLogs(active);
    });
  }, []);

  const isActive = (projectId) =>
    activeLogs.some(l =>
      l.project?._id === projectId || l.project === projectId
    );

  const handleStart = async (projectId) => {
    try {
      await API.post('/employee/start-work', { projectId });
      setMsg('✅ Work started!');
      setActiveLogs([...activeLogs, { project: projectId }]);
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Error'));
    }
  };

  const handleStop = async (projectId) => {
    try {
      const res = await API.post('/employee/stop-work', { projectId });
      setMsg(`✅ Stopped! Hours logged: ${res.data.hoursWorked}h`);
      setActiveLogs(activeLogs.filter(l => l.project !== projectId));
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Error'));
    }
  };

  return (
    <div>
      <h2>📁 My Assigned Projects</h2>
      {msg && <p style={{ color: msg.startsWith('✅') ? 'green' : 'red' }}>{msg}</p>}
      {projects.length === 0 && <p>No projects assigned yet.</p>}
      {projects.map(p => (
        <div key={p._id} style={{
          background: '#fff', padding: 16, borderRadius: 8,
          marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          borderLeft: `4px solid ${isActive(p._id) ? '#22c55e' : '#e2e8f0'}`
        }}>
          <h3 style={{ margin: '0 0 6px' }}>{p.title}</h3>
          <p style={{ margin: '0 0 4px', color: '#64748b' }}>{p.description}</p>
          <p style={{ margin: '0 0 8px', fontSize: 13 }}>
            📅 Deadline: {new Date(p.deadline).toLocaleDateString()}
          </p>
          <span style={{
            background: p.status === 'completed' ? '#22c55e' : '#f59e0b',
            color: '#fff', padding: '2px 10px',
            borderRadius: 12, fontSize: 12
          }}>
            {p.status}
          </span>

          {/* Start / Stop buttons */}
          <div style={{ marginTop: 12 }}>
            {!isActive(p._id) ? (
              <button onClick={() => handleStart(p._id)}
                style={{
                  background: '#16a34a', color: '#fff',
                  border: 'none', padding: '8px 20px',
                  borderRadius: 4, cursor: 'pointer', fontSize: 14
                }}>
                ▶ Start Work
              </button>
            ) : (
              <button onClick={() => handleStop(p._id)}
                style={{
                  background: '#ef4444', color: '#fff',
                  border: 'none', padding: '8px 20px',
                  borderRadius: 4, cursor: 'pointer', fontSize: 14
                }}>
                ⏹ Stop Work
              </button>
            )}
          </div>

          {isActive(p._id) && (
            <p style={{ color: '#16a34a', fontSize: 13, marginTop: 8 }}>
              ⚡ Currently working...
            </p>
          )}
        </div>
      ))}
    </div>
  );
}