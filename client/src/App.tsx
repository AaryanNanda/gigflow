import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'));

  const handleLoginSuccess = (newToken: string, userRole: string) => {
    setToken(newToken);
    setRole(userRole);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
  };

  // Enforce structural route shielding
  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Mount the dashboard view and pass down session hooks cleanly
  return <Dashboard onLogout={handleLogout} role={role || 'Manager'} />;
}