import { useState, useEffect } from 'react';
import API from '../../api/axios';

export default function AssignProject() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ title:'', description:'', deadline:'', assignedTo:'' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    API.get('/admin/employees').then(r => setEmployees(r.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/assign-project', form);
      setMsg('✅ Project assigned!');
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Error'));
    }
  };

  return (
    <div>
      <h2>Assign Project</h2>
      {msg && <p>{msg}</p>}
      <form onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
        {['title','description'].map(field => (
          <input key={field} placeholder={field} value={form[field]}
            onChange={e => setForm({...form, [field]: e.target.value})}
            style={{ display:'block', width:'100%', marginBottom:12, padding:8 }} />
        ))}
        <input type="date" value={form.deadline}
          onChange={e => setForm({...form, deadline: e.target.value})}
          style={{ display:'block', width:'100%', marginBottom:12, padding:8 }} />
        <select value={form.assignedTo}
          onChange={e => setForm({...form, assignedTo: e.target.value})}
          style={{ display:'block', width:'100%', marginBottom:12, padding:8 }}>
          <option value="">-- Select Employee --</option>
          {employees.map(emp => (
            <option key={emp._id} value={emp._id}>{emp.name} ({emp.email})</option>
          ))}
        </select>
        <button type="submit" style={{ padding:'8px 20px', background:'#2563eb', color:'#fff', border:'none', borderRadius:4 }}>
          Assign
        </button>
      </form>
    </div>
  );
}