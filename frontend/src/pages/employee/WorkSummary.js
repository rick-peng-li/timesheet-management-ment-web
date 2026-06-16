import { useEffect, useState } from 'react';
import API from '../../api/axios';

const panelStyle = {
  background: '#fff',
  borderRadius: 12,
  padding: 20,
  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)'
};

export default function WorkSummary() {
  const [logs, setLogs] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [logsRes, projectsRes] = await Promise.all([
        API.get('/employee/my-logs'),
        API.get('/employee/my-projects')
      ]);
      setLogs(logsRes.data || []);
      setProjects(projectsRes.data || []);
    };

    loadData();
  }, []);

  const completedLogs = logs.filter(log => log.status === 'completed');
  const activeLogs = logs.filter(log => log.status === 'active');
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);

  const weeklyHours = completedLogs
    .filter(log => new Date(log.date) >= weekStart)
    .reduce((sum, log) => sum + Number(log.hoursWorked || 0), 0)
    .toFixed(2);

  const totalHours = completedLogs
    .reduce((sum, log) => sum + Number(log.hoursWorked || 0), 0)
    .toFixed(2);

  const projectBreakdown = Object.values(
    completedLogs.reduce((acc, log) => {
      const projectId = log.project?._id || log.project || 'unknown';
      if (!acc[projectId]) {
        acc[projectId] = {
          title: log.project?.title || 'Unknown project',
          hours: 0,
          reports: 0
        };
      }
      acc[projectId].hours += Number(log.hoursWorked || 0);
      if (log.report) acc[projectId].reports += 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 5);

  const recentLogs = [...logs]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ marginBottom: 8 }}>Work Summary</h2>
        <p style={{ marginTop: 0, color: '#64748b' }}>
          Get a quick view of your weekly progress, submitted reports, and project contribution.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        {[
          { label: 'Assigned Projects', value: projects.length, color: '#2563eb' },
          { label: 'Active Sessions', value: activeLogs.length, color: '#16a34a' },
          { label: 'Completed Sessions', value: completedLogs.length, color: '#7c3aed' },
          { label: 'Reports Submitted', value: completedLogs.filter(log => log.report).length, color: '#f59e0b' },
          { label: 'Weekly Hours', value: `${weeklyHours}h`, color: '#0f766e' },
          { label: 'Total Hours', value: `${totalHours}h`, color: '#dc2626' }
        ].map(item => (
          <div key={item.label} style={panelStyle}>
            <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>{item.label}</p>
            <h3 style={{ margin: '12px 0 0', fontSize: 30, color: item.color }}>{item.value}</h3>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 24 }}>
        <div style={panelStyle}>
          <h3 style={{ marginTop: 0 }}>Project Contribution</h3>
          {projectBreakdown.length === 0 && <p style={{ color: '#64748b', marginBottom: 0 }}>No completed work yet.</p>}
          {projectBreakdown.map(item => (
            <div key={item.title} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '12px 0', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <strong>{item.title}</strong>
                <p style={{ margin: '6px 0 0', fontSize: 12, color: '#64748b' }}>{item.reports} reports</p>
              </div>
              <span style={{ color: '#2563eb', fontWeight: 'bold' }}>{item.hours.toFixed(2)}h</span>
            </div>
          ))}
        </div>

        <div style={panelStyle}>
          <h3 style={{ marginTop: 0 }}>Recent Activity</h3>
          {recentLogs.length === 0 && <p style={{ color: '#64748b', marginBottom: 0 }}>No activity available yet.</p>}
          {recentLogs.map(log => (
            <div key={log._id} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 14, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <strong>{log.project?.title || 'Unknown project'}</strong>
                <span style={{ fontSize: 12, color: '#64748b' }}>{new Date(log.date).toLocaleDateString()}</span>
              </div>
              <p style={{ margin: '8px 0 0', color: '#475569', fontSize: 13 }}>
                {log.status === 'active' ? 'Currently active' : `Logged ${Number(log.hoursWorked || 0).toFixed(2)} hours`}
              </p>
              <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: 12 }}>
                {log.report || 'No report submitted for this session yet.'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
