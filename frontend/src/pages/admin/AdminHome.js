import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import API from '../../api/axios';

const cardStyle = {
  background: '#fff',
  borderRadius: 12,
  padding: 20,
  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)'
};

export default function AdminHome() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    employees: 0,
    online: 0,
    projects: 0,
    inProgress: 0,
    logs: 0,
    totalHours: '0.00',
    pendingProjects: [],
    activeMembers: []
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [employeesRes, projectsRes, logsRes, statusRes] = await Promise.all([
          API.get('/admin/employees'),
          API.get('/admin/projects'),
          API.get('/admin/timelogs'),
          API.get('/admin/employee-status')
        ]);

        const employees = employeesRes.data || [];
        const projects = projectsRes.data || [];
        const logs = logsRes.data || [];
        const statuses = statusRes.data || [];

        const completedLogs = logs.filter(log => log.status === 'completed');
        const totalHours = completedLogs
          .reduce((sum, log) => sum + Number(log.hoursWorked || 0), 0)
          .toFixed(2);

        setSummary({
          employees: employees.length,
          online: statuses.filter(item => item.isOnline).length,
          projects: projects.length,
          inProgress: projects.filter(project => project.status === 'in-progress').length,
          logs: logs.length,
          totalHours,
          pendingProjects: projects
            .filter(project => project.status !== 'completed')
            .sort((a, b) => new Date(a.deadline || 0) - new Date(b.deadline || 0))
            .slice(0, 4),
          activeMembers: statuses
            .filter(item => item.currentProject)
            .sort((a, b) => Number(b.totalHoursToday) - Number(a.totalHoursToday))
            .slice(0, 4)
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ marginBottom: 8 }}>Welcome back, {user?.name}</h2>
          <p style={{ marginTop: 0, color: '#64748b' }}>
            Track team activity, project delivery, and time reporting from one place.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to="/admin/assign" style={{ background: '#2563eb', color: '#fff', textDecoration: 'none', padding: '10px 16px', borderRadius: 8 }}>
            Assign Project
          </Link>
          <Link to="/admin/create-user" style={{ background: '#0f172a', color: '#fff', textDecoration: 'none', padding: '10px 16px', borderRadius: 8 }}>
            Create User
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginTop: 24 }}>
        {[
          { label: 'Employees', value: summary.employees, tone: '#2563eb' },
          { label: 'Online Now', value: summary.online, tone: '#16a34a' },
          { label: 'Projects', value: summary.projects, tone: '#7c3aed' },
          { label: 'In Progress', value: summary.inProgress, tone: '#f59e0b' },
          { label: 'Time Logs', value: summary.logs, tone: '#0f766e' },
          { label: 'Hours Logged', value: `${summary.totalHours}h`, tone: '#dc2626' }
        ].map(item => (
          <div key={item.label} style={cardStyle}>
            <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>{item.label}</p>
            <h3 style={{ margin: '10px 0 0', color: item.tone, fontSize: 30 }}>{loading ? '...' : item.value}</h3>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20, marginTop: 24 }}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ marginTop: 0 }}>Pending Delivery Focus</h3>
            <Link to="/admin/projects" style={{ color: '#2563eb', textDecoration: 'none', fontSize: 14 }}>
              Open Project Board
            </Link>
          </div>
          {summary.pendingProjects.length === 0 && (
            <p style={{ color: '#64748b', marginBottom: 0 }}>All tracked projects are complete.</p>
          )}
          {summary.pendingProjects.map(project => (
            <div key={project._id} style={{ borderBottom: '1px solid #e2e8f0', padding: '12px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                <div>
                  <strong>{project.title}</strong>
                  <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 13 }}>
                    {project.assignedTo?.name || 'Unassigned'}
                  </p>
                </div>
                <span style={{ background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: 999, fontSize: 12 }}>
                  {project.status}
                </span>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: 13, color: '#475569' }}>
                Deadline: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Not set'}
              </p>
            </div>
          ))}
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ marginTop: 0 }}>Active Team Snapshot</h3>
            <Link to="/admin/insights" style={{ color: '#2563eb', textDecoration: 'none', fontSize: 14 }}>
              Open Insights
            </Link>
          </div>
          {summary.activeMembers.length === 0 && (
            <p style={{ color: '#64748b', marginBottom: 0 }}>No one is actively tracking work right now.</p>
          )}
          {summary.activeMembers.map(member => (
            <div key={member._id} style={{ background: '#f8fafc', borderRadius: 10, padding: 12, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <strong>{member.name}</strong>
                <span style={{ color: '#16a34a', fontSize: 12 }}>Online</span>
              </div>
              <p style={{ margin: '6px 0 0', color: '#475569', fontSize: 13 }}>{member.currentProject}</p>
              <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 12 }}>
                Today: {member.totalHoursToday}h
              </p>
            </div>
          ))}
          <div style={{ display: 'grid', gap: 10, marginTop: 8 }}>
            <Link to="/admin/status" style={{ textDecoration: 'none', color: '#0f172a', background: '#e2e8f0', padding: '10px 12px', borderRadius: 8 }}>
              Monitor employee status
            </Link>
            <Link to="/admin/timelogs" style={{ textDecoration: 'none', color: '#0f172a', background: '#e2e8f0', padding: '10px 12px', borderRadius: 8 }}>
              Review submitted time logs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
