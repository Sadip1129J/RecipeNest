// Login.jsx — matching Figma login/register form design
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChefHat } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const demoCreds = [
    { email: 'admin@recipenest.com', password: 'Admin123!', label: 'Admin', cls: 'badge-admin' },
    { email: 'chef@recipenest.com', password: 'Chef123!', label: 'Chef', cls: 'badge-chef' },
    { email: 'user@recipenest.com', password: 'User123!', label: 'User', cls: 'badge-user' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      // Redirect based on role
      if (user.role === 'Admin') navigate('/admin-dashboard');
      else if (user.role === 'Chef') navigate('/chef-dashboard');
      else navigate('/user-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `radial-gradient(circle at 25px 25px, #E2E8F0 2px, transparent 0) 0 0 / 50px 50px, #F8FAFC`,
      padding: '2rem 1rem'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem', borderRadius: '1.25rem' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <ChefHat size={28} color="var(--primary)" />
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 700 }}>RecipeNest</span>
          </div>
          <p style={{ color: 'var(--muted-fg)', fontSize: '0.9rem' }}>Welcome back! Sign in to continue.</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="label">Email Address</label>
            <input className="input" type="email" placeholder="you@example.com" value={email}
              onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input className="input" type="password" placeholder="Enter your password" value={password}
              onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--muted-fg)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 500 }}>Register</Link>
        </p>

        {/* Demo Credentials */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--subtle-fg)', textAlign: 'center', marginBottom: '0.75rem' }}>
            Demo Accounts (click to fill)
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {demoCreds.map(c => (
              <button key={c.email} type="button"
                onClick={() => { setEmail(c.email); setPassword(c.password); }}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1px solid var(--border)',
                  background: '#F8FAFC', cursor: 'pointer', transition: 'all 0.15s',
                  textAlign: 'left'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'var(--primary-light)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = '#F8FAFC'; }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--muted-fg)' }}>{c.email}</span>
                <span className={`badge ${c.cls}`}>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <Link to="/" style={{ fontSize: '0.8125rem', color: 'var(--muted-fg)' }}>← Back to Homepage</Link>
        </p>
      </div>
    </div>
  );
}
