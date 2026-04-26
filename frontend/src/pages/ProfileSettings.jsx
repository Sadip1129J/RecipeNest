// ProfileSettings.jsx — standalone profile settings page
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';

export default function ProfileSettings() {
  const { user } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', profileImageUrl: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    userService.getProfile().then(p => setForm({ fullName: p.fullName, email: p.email, profileImageUrl: p.profileImageUrl || '' }));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await userService.updateProfile(form);
      setMsg('Profile updated successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch { setMsg('Error saving changes.'); }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Profile Settings</h1>
      <p style={{ color: 'var(--muted-fg)', marginBottom: '2rem' }}>Update your account information</p>
      <div className="card" style={{ maxWidth: '560px', padding: '2rem' }}>
        {msg && <div className={`alert ${msg.includes('Error') ? 'alert-error' : 'alert-success'}`}>{msg}</div>}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group"><label className="label">Full Name</label>
            <input className="input" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} /></div>
          <div className="form-group"><label className="label">Email</label>
            <input className="input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          <div className="form-group"><label className="label">Profile Image URL</label>
            <input className="input" value={form.profileImageUrl} onChange={e => setForm({ ...form, profileImageUrl: e.target.value })} placeholder="https://..." /></div>
          <button type="submit" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }}>Save Changes</button>
        </form>
      </div>
    </div>
  );
}
