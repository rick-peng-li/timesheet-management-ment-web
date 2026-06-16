import { useState, useEffect } from 'react';
import API from '../../api/axios';

export default function SubmitReport() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ projectId: '', report: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    API.get('/employee/my-projects').then(r => setProjects(r.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/employee/submit-report', form);
      setMsg('✅ Report submitted!');
      setForm({ projectId: '', report: '' });
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Error submitting'));
    }
  };

  return (
    <div>
      <h2>📝 Submit Work Report</h2>
      {msg && <p>{msg}</p>}
      <form onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
        <select value={form.projectId}
          onChange={e => setForm({ ...form, projectId: e.target.value })}
          style={{ display:'block', width:'100%', marginBottom:12, padding:8 }}>
          <option value="">-- Select Project --</option>
          {projects.map(p => (
            <option key={p._id} value={p._id}>{p.title}</option>
          ))}
        </select>
        <textarea placeholder="Write your report..."
          value={form.report}
          onChange={e => setForm({ ...form, report: e.target.value })}
          rows={5}
          style={{ display:'block', width:'100%', marginBottom:12, padding:8 }} />
        <button type="submit"
          style={{ padding:'8px 20px', background:'#2563eb',
            color:'#fff', border:'none', borderRadius:4 }}>
          Submit
        </button>
      </form>
    </div>
  );
}