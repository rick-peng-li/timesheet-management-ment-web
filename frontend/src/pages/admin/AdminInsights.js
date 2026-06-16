import { useEffect, useState } from 'react';
import API from '../../api/axios';

const panelStyle = {
  background: '#fff',
  borderRadius: 12,
  padding: 20,
  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)'
};

export default function AdminInsights() {
  const [statusData, setStatusData] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [statusRes, logsRes] = await Promise.all([
        API.get('/admin/employee-status'),
        API.get('/admin/timelogs')
      ]);
      setStatusData(statusRes.data || []);
      setLogs(logsRes.data || []);
    };

    loadData();
  }, []);

  const todayHours = statusData
    .reduce((sum, employee) => sum + Number(employee.totalHoursToday || 0), 0)
    .toFixed(2);

  const recentReports = [...logs]
    .filter(log => log.report)
    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
    .slice(0, 5);

  const contributors = Object.values(
    logs.reduce((acc, log) => {
      const key = log.employee?._id || log.employee?.name || 'unknown';
      if (!acc[key]) {
        acc[key] = {
          name: log.employee?.name || 'Unknown',
          hours: 0,
          reports: 0
        };
      }
      acc[key].hours += Number(log.hoursWorked || 0);
      if (log.report) acc[key].reports += 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 5);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ marginBottom: 8 }}>Operations Insights</h2>
        <p style={{ marginTop: 0, color: '#64748b' }}>
          Keep an eye on today’s workload, contribution ranking, and the latest submitted reports.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {[
          { label: 'Employees Online', value: statusData.filter(item => item.isOnline).length, color: '#16a34a' },
          { label: 'Employees Offline', value: statusData.filter(item => !item.isOnline).length, color: '#64748b' },
          { label: 'Hours Logged Today', value: `${todayHours}h`, color: '#2563eb' },
          { label: 'Reports Submitted', value: logs.filter(log => log.report).length, color: '#7c3aed' }
        ].map(item => (
          <div key={item.label} style={panelStyle}>
            <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>{item.label}</p>
            <h3 style={{ margin: '12px 0 0', fontSize: 30, color: item.color }}>{item.value}</h3>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 24 }}>
        <div style={panelStyle}>
          <h3 style={{ marginTop: 0 }}>Top Contributors</h3>
          {contributors.length === 0 && <p style={{ color: '#64748b', marginBottom: 0 }}>No contribution data yet.</p>}
          {contributors.map((item, index) => (
            <div key={`${item.name}-${index}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '12px 0', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <strong>{item.name}</strong>
                <p style={{ margin: '6px 0 0', fontSize: 12, color: '#64748b' }}>{item.reports} reports submitted</p>
              </div>
              <span style={{ color: '#2563eb', fontWeight: 'bold' }}>{item.hours.toFixed(2)}h</span>
            </div>
          ))}
        </div>

        <div style={panelStyle}>
          <h3 style={{ marginTop: 0 }}>Recent Reports</h3>
          {recentReports.length === 0 && <p style={{ color: '#64748b', marginBottom: 0 }}>No reports submitted yet.</p>}
          {recentReports.map(log => (
            <div key={log._id} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 14, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <strong>{log.employee?.name || 'Unknown employee'}</strong>
                <span style={{ color: '#64748b', fontSize: 12 }}>
                  {new Date(log.date).toLocaleDateString()}
                </span>
              </div>
              <p style={{ margin: '8px 0 0', color: '#2563eb', fontSize: 13 }}>{log.project?.title || 'Unknown project'}</p>
              <p style={{ margin: '8px 0 0', color: '#475569', fontSize: 13, lineHeight: 1.6 }}>{log.report}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
