import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import API from '../api/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', { email, password });
      login(data.user, data.token);
      navigate(data.user.role === 'admin' ? '/admin' : '/employee');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 24 }}>
      <h2>Timesheet Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" value={email}
          onChange={e => setEmail(e.target.value)} style={{ display:'block', width:'100%', marginBottom:12, padding:8 }} />
        <input placeholder="Password" type="password" value={password}
          onChange={e => setPassword(e.target.value)} style={{ display:'block', width:'100%', marginBottom:12, padding:8 }} />
        <button type="submit" style={{ padding:'8px 24px' }}>Login</button>
      </form>
    </div>
  );
}