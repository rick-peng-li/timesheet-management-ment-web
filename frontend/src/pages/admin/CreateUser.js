import { useState } from 'react';
import API from '../../api/axios';

export default function CreateUser() {
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'employee' });
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/create-user', form);
      setMsg('✅ User created!');
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Error'));
    }
  };

  return (
    <div>
      <h2>Create Employee / Admin</h2>
      {msg && <p>{msg}</p>}
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        {['name','email','password'].map(field => (
          <input key={field} placeholder={field} type={field==='password'?'password':'text'}
            value={form[field]} onChange={e => setForm({...form, [field]:e.target.value})}
            style={{ display:'block', width:'100%', marginBottom:12, padding:8 }} />
        ))}
        <select value={form.role} onChange={e => setForm({...form, role:e.target.value})}
          style={{ display:'block', width:'100%', marginBottom:12, padding:8 }}>
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" style={{ padding:'8px 20px', background:'#16a34a', color:'#fff', border:'none', borderRadius:4 }}>
          Create User
        </button>
      </form>
    </div>
  );
}