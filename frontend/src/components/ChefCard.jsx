// ChefCard.jsx — matches Figma chef card design
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export default function ChefCard({ chef }) {
  return (
    <div className="card">
      <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
        <img
          src={chef.profileImageUrl || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400'}
          alt={chef.displayName}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400'; }}
        />
      </div>
      <div style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1.0625rem', marginBottom: '0.375rem', fontFamily: 'var(--font-serif)' }}>
          {chef.displayName}
        </h3>
        {chef.location && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--muted-fg)', fontSize: '0.8125rem', marginBottom: '0.75rem' }}>
            <MapPin size={13} color="var(--primary)" /> {chef.location}
          </div>
        )}
        <p style={{ color: 'var(--muted-fg)', fontSize: '0.8125rem', lineHeight: '1.5',
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          marginBottom: '1rem' }}>
          {chef.bio || 'Chef profile not filled yet.'}
        </p>
        {/* Specialties */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1rem' }}>
          {chef.specialties?.map(s => (
            <span key={s} style={{
              padding: '0.2rem 0.625rem', borderRadius: '9999px',
              background: 'var(--primary-light)', color: 'var(--primary)',
              fontSize: '0.75rem', fontWeight: 500
            }}>
              {s}
            </span>
          ))}
        </div>
        <Link to={`/chefs/${chef.id}`} className="btn btn-outline"
          style={{ width: '100%', justifyContent: 'center', borderRadius: '9999px', borderColor: 'var(--primary)', color: 'var(--primary)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--primary)'; }}>
          View Portfolio
        </Link>
      </div>
    </div>
  );
}
