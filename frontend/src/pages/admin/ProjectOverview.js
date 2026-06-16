import { useEffect, useState } from 'react';
import API from '../../api/axios';

const panelStyle = {
  background: '#fff',
  borderRadius: 12,
  padding: 20,
  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)'
};

export default function ProjectOverview() {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [projectsRes, employeesRes] = await Promise.all([
        API.get('/admin/projects'),
        API.get('/admin/employees')
      ]);
      setProjects(projectsRes.data || []);
      setEmployees(employeesRes.data || []);
    };

    loadData();
  }, []);

  const statusStats = {
    pending: projects.filter(project => project.status === 'pending').length,
    inProgress: projects.filter(project => project.status === 'in-progress').length,
    completed: projects.filter(project => project.status === 'completed').length
  };

  const upcomingProjects = [...projects]
    .filter(project => project.deadline)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  const workload = employees
    .map(employee => ({
      ...employee,
      assignedCount: projects.filter(project => project.assignedTo?._id === employee._id).length,
      activeCount: projects.filter(
        project => project.assignedTo?._id === employee._id && project.status === 'in-progress'
      ).length
    }))
    .sort((a, b) => b.assignedCount - a.assignedCount);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ marginBottom: 8 }}>Project Overview</h2>
        <p style={{ marginTop: 0, color: '#64748b' }}>
          Review delivery pipeline, deadlines, and employee workload in one board.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        {[
          { label: 'Total Projects', value: projects.length, color: '#2563eb' },
          { label: 'Pending', value: statusStats.pending, color: '#f59e0b' },
          { label: 'In Progress', value: statusStats.inProgress, color: '#7c3aed' },
          { label: 'Completed', value: statusStats.completed, color: '#16a34a' }
        ].map(item => (
          <div key={item.label} style={panelStyle}>
            <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>{item.label}</p>
            <h3 style={{ margin: '12px 0 0', color: item.color, fontSize: 30 }}>{item.value}</h3>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, marginTop: 24 }}>
        <div style={panelStyle}>
          <h3 style={{ marginTop: 0 }}>Project Delivery Board</h3>
          {projects.length === 0 && <p style={{ color: '#64748b' }}>No projects available yet.</p>}
          {projects.map(project => (
            <div key={project._id} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 14, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <strong>{project.title}</strong>
                  <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 13 }}>
                    {project.description || 'No description'}
                  </p>
                </div>
                <span style={{ background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: 999, fontSize: 12, height: 'fit-content' }}>
                  {project.status}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginTop: 12 }}>
                <div style={{ background: '#f8fafc', borderRadius: 8, padding: 10 }}>
                  <p style={{ margin: 0, color: '#64748b', fontSize: 12 }}>Assigned To</p>
                  <p style={{ margin: '6px 0 0' }}>{project.assignedTo?.name || 'Unassigned'}</p>
                </div>
                <div style={{ background: '#f8fafc', borderRadius: 8, padding: 10 }}>
                  <p style={{ margin: 0, color: '#64748b', fontSize: 12 }}>Deadline</p>
                  <p style={{ margin: '6px 0 0' }}>
                    {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Not set'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gap: 20 }}>
          <div style={panelStyle}>
            <h3 style={{ marginTop: 0 }}>Upcoming Deadlines</h3>
            {upcomingProjects.length === 0 && <p style={{ color: '#64748b', marginBottom: 0 }}>No deadline configured.</p>}
            {upcomingProjects.map(project => (
              <div key={project._id} style={{ padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
                <strong>{project.title}</strong>
                <p style={{ margin: '6px 0 0', color: '#475569', fontSize: 13 }}>
                  {project.assignedTo?.name || 'Unassigned'} · {new Date(project.deadline).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>

          <div style={panelStyle}>
            <h3 style={{ marginTop: 0 }}>Employee Workload</h3>
            {workload.length === 0 && <p style={{ color: '#64748b', marginBottom: 0 }}>No employees available.</p>}
            {workload.map(employee => (
              <div key={employee._id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
                <div>
                  <strong>{employee.name}</strong>
                  <p style={{ margin: '6px 0 0', fontSize: 12, color: '#64748b' }}>{employee.email}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0 }}>{employee.assignedCount} assigned</p>
                  <p style={{ margin: '6px 0 0', fontSize: 12, color: '#7c3aed' }}>{employee.activeCount} active</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
