// ProfileSettings.jsx — standalone profile settings page
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { uploadService } from '../services/uploadService';
import { Upload } from 'lucide-react';

export default function ProfileSettings() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', profileImageUrl: '' });
  const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    userService.getProfile().then(p => {
      setForm({ fullName: p.fullName, email: p.email, profileImageUrl: p.profileImageUrl || '' });
      setImagePreview(p.profileImageUrl || '');
    });
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const { imageUrl } = await uploadService.uploadImage(file);
      setForm(prev => ({ ...prev, profileImageUrl: imageUrl }));
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await userService.updateProfile(form);
      // Sync the AuthContext so navbar and other components reflect the changes immediately
      updateUser({ fullName: form.fullName, email: form.email, profileImageUrl: form.profileImageUrl });
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
          <div className="form-group">
            <label className="label">Profile Photo</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {imagePreview && (
                <img src={imagePreview} alt="Profile" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-border)' }} />
              )}
              <label
                className="input"
                style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: uploading ? 'var(--color-subtle)' : 'var(--color-muted)', width: 'auto', flex: 1 }}
              >
                <Upload size={16} />
                {uploading ? 'Uploading...' : form.profileImageUrl ? 'Change Photo' : 'Choose Photo'}
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading} />
              </label>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }} disabled={uploading}>Save Changes</button>
        </form>
      </div>
    </div>
  );
}
