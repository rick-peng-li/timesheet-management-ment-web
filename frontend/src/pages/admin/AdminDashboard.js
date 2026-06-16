import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import AssignProject from './AssignProject';
import TimeLogs from './TimeLogs';
import CreateUser from './CreateUser';
import AdminHome from './AdminHome';
import EmployeeStatus from './EmployeeStatus';
import ProjectOverview from './ProjectOverview';
import AdminInsights from './AdminInsights';
import API from '../../api/axios';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (err) {
      console.log(err);
    }
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 240, background: '#1e293b', color: '#fff', padding: 24 }}>
        <h3>⏱ Timesheet</h3>
        <p style={{ fontSize: 12, color: '#94a3b8' }}>{user?.name}</p>
        <nav style={{ marginTop: 32 }}>
          {[
            { to: '/admin', label: '🏠 Dashboard' },
            { to: '/admin/projects', label: '📦 Project Overview' },
            { to: '/admin/insights', label: '📈 Insights' },
            { to: '/admin/status', label: '👥 Employee Status' },
            { to: '/admin/assign', label: '📋 Assign Project' },
            { to: '/admin/timelogs', label: '🕐 Time Logs' },
            { to: '/admin/create-user', label: '👤 Create User' }
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{
                display: 'block',
                color: '#cbd5e1',
                textDecoration: 'none',
                padding: '10px 0',
                borderBottom: '1px solid #334155'
              }}
            >
              {label}
            </Link>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          style={{
            marginTop: 40,
            background: '#ef4444',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </aside>

      <main style={{ flex: 1, padding: 32, background: '#f8fafc' }}>
        <Routes>
          <Route index element={<AdminHome />} />
          <Route path="projects" element={<ProjectOverview />} />
          <Route path="insights" element={<AdminInsights />} />
          <Route path="status" element={<EmployeeStatus />} />
          <Route path="assign" element={<AssignProject />} />
          <Route path="timelogs" element={<TimeLogs />} />
          <Route path="create-user" element={<CreateUser />} />
        </Routes>
      </main>
    </div>
  );
}
