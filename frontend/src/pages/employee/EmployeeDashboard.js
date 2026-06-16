import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import MyProjects from './MyProjects';
import SubmitReport from './SubmitReport';
import MyLogs from './MyLogs';
import API from '../../api/axios';

export default function EmployeeDashboard() {
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
      <aside style={{ width: 220, background: '#1e3a5f', color: '#fff', padding: 24 }}>
        <h3>⏱ Timesheet</h3>
        <p style={{ fontSize: 12, color: '#93c5fd' }}>{user?.name}</p>
        <nav style={{ marginTop: 32 }}>
          {[
            { to: '/employee',        label: '📁 My Projects' },
            { to: '/employee/submit', label: '📝 Submit Report' },
            { to: '/employee/logs',   label: '🕐 My Logs' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} style={{ display:'block', color:'#bfdbfe',
              textDecoration:'none', padding:'10px 0',
              borderBottom:'1px solid #1e40af' }}>
              {label}
            </Link>
          ))}
        </nav>
        <button onClick={handleLogout}
          style={{ marginTop:40, background:'#ef4444', color:'#fff',
            border:'none', padding:'8px 16px', borderRadius:4, cursor:'pointer' }}>
          Logout
        </button>
      </aside>

      <main style={{ flex:1, padding:32, background:'#f0f9ff' }}>
        <Routes>
          <Route index element={<MyProjects />} />
          <Route path="submit" element={<SubmitReport />} />
          <Route path="logs" element={<MyLogs />} />
        </Routes>
      </main>
    </div>
  );
}