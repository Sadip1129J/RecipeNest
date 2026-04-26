// Register.jsx — new user registration with chef checkbox
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChefHat } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', isChef: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const role = form.isChef ? 'Chef' : 'User';
      const user = await register(form.fullName, form.email, form.password, role);
      if (user.role === 'Chef') navigate('/chef-dashboard');
      else navigate('/user-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
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
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <ChefHat size={28} color="var(--primary)" />
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 700 }}>RecipeNest</span>
          </div>
          <p style={{ color: 'var(--muted-fg)', fontSize: '0.9rem' }}>Create your account to get started.</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="label">Full Name</label>
            <input className="input" type="text" placeholder="John Doe" value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="label">Email Address</label>
            <input className="input" type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input className="input" type="password" placeholder="Minimum 6 characters" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>

          {/* Chef Checkbox */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.875rem', borderRadius: '0.625rem', border: '1px solid var(--border)', background: form.isChef ? 'var(--primary-light)' : 'white' }}>
            <input type="checkbox" checked={form.isChef} onChange={e => setForm({ ...form, isChef: e.target.checked })}
              style={{ width: '1rem', height: '1rem', accentColor: 'var(--primary)' }} />
            <ChefHat size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.9rem', color: 'var(--foreground)', fontWeight: 500 }}>I am a Chef</span>
          </label>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--muted-fg)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>Sign In</Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: '0.75rem' }}>
          <Link to="/" style={{ fontSize: '0.8125rem', color: 'var(--muted-fg)' }}>← Back to Homepage</Link>
        </p>
      </div>
    </div>
  );
}
