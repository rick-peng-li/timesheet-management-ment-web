import { useAuth } from '../../context/authContext';

export default function AdminHome() {
  const { user } = useAuth();
  return (
    <div>
      <h2>Welcome, {user?.name} 🙏</h2>
      <p>Use the sidebar to manage projects, employees, and time logs.</p>
    </div>
  );
}