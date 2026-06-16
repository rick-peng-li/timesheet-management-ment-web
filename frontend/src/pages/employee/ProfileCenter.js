import { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';
import API from '../../api/axios';

const panelStyle = {
  background: '#fff',
  borderRadius: 12,
  padding: 20,
  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)'
};

export default function ProfileCenter() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [projectsRes, logsRes] = await Promise.all([
        API.get('/employee/my-projects'),
        API.get('/employee/my-logs')
      ]);
      setProjects(projectsRes.data || []);
      setLogs(logsRes.data || []);
    };

    loadData();
  }, []);

  const activeLog = logs.find(log => log.status === 'active');
  const completedReports = logs.filter(log => log.report).length;
  const completedProjects = projects.filter(project => project.status === 'completed').length;
  const nextDeadline = [...projects]
    .filter(project => project.deadline)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ marginBottom: 8 }}>Profile Center</h2>
        <p style={{ marginTop: 0, color: '#64748b' }}>
          Review your role, current work status, and personal delivery snapshot.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 20 }}>
        <div style={panelStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0 }}>{user?.name}</h3>
              <p style={{ margin: '8px 0 0', color: '#64748b' }}>{user?.email}</p>
            </div>
            <span style={{ background: '#dbeafe', color: '#2563eb', padding: '6px 12px', borderRadius: 999, fontSize: 12 }}>
              {user?.role}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginTop: 20 }}>
            <div style={{ background: '#f8fafc', borderRadius: 10, padding: 14 }}>
              <p style={{ margin: 0, color: '#64748b', fontSize: 12 }}>Current Status</p>
              <p style={{ margin: '8px 0 0', color: activeLog ? '#16a34a' : '#64748b', fontWeight: 'bold' }}>
                {activeLog ? 'Working now' : 'Available'}
              </p>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: 10, padding: 14 }}>
              <p style={{ margin: 0, color: '#64748b', fontSize: 12 }}>Assigned Projects</p>
              <p style={{ margin: '8px 0 0', fontWeight: 'bold' }}>{projects.length}</p>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: 10, padding: 14 }}>
              <p style={{ margin: 0, color: '#64748b', fontSize: 12 }}>Completed Projects</p>
              <p style={{ margin: '8px 0 0', fontWeight: 'bold' }}>{completedProjects}</p>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: 10, padding: 14 }}>
              <p style={{ margin: 0, color: '#64748b', fontSize: 12 }}>Reports Submitted</p>
              <p style={{ margin: '8px 0 0', fontWeight: 'bold' }}>{completedReports}</p>
            </div>
          </div>

          <div style={{ marginTop: 20, background: '#eff6ff', borderRadius: 10, padding: 16 }}>
            <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Current Focus</p>
            <p style={{ margin: '8px 0 0', fontWeight: 'bold', color: '#1d4ed8' }}>
              {activeLog?.project?.title || 'No active project at the moment'}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 20 }}>
          <div style={panelStyle}>
            <h3 style={{ marginTop: 0 }}>Next Milestone</h3>
            {!nextDeadline && <p style={{ color: '#64748b', marginBottom: 0 }}>No upcoming deadlines configured.</p>}
            {nextDeadline && (
              <div>
                <strong>{nextDeadline.title}</strong>
                <p style={{ margin: '8px 0 0', color: '#475569' }}>{nextDeadline.description || 'No description'}</p>
                <p style={{ margin: '8px 0 0', color: '#2563eb', fontSize: 13 }}>
                  Deadline: {new Date(nextDeadline.deadline).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          <div style={panelStyle}>
            <h3 style={{ marginTop: 0 }}>Recent Sessions</h3>
            {logs.length === 0 && <p style={{ color: '#64748b', marginBottom: 0 }}>No work sessions yet.</p>}
            {[...logs]
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 4)
              .map(log => (
                <div key={log._id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '12px 0', borderBottom: '1px solid #e2e8f0' }}>
                  <div>
                    <strong>{log.project?.title || 'Unknown project'}</strong>
                    <p style={{ margin: '6px 0 0', fontSize: 12, color: '#64748b' }}>
                      {log.report || 'No report content'}
                    </p>
                  </div>
                  <span style={{ color: '#2563eb', fontSize: 12 }}>
                    {log.status === 'active' ? 'Active' : `${Number(log.hoursWorked || 0).toFixed(2)}h`}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
