// Chefs.jsx — chef directory with search
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { chefService } from '../services/chefService';
import ChefCard from '../components/ChefCard';
import Loading from '../components/Loading';

export default function Chefs() {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    chefService.getAll(search).then(data => {
      setChefs(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [search]);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Our Chefs</h1>
        <p style={{ color: 'var(--muted-fg)' }}>Discover talented culinary artists from around the world</p>
      </div>

      {/* Search */}
      <div className="search-bar" style={{ marginBottom: '2.5rem', maxWidth: '480px' }}>
        <Search size={18} className="search-icon" />
        <input className="input" type="text" placeholder="Search by name, specialty, or location..."
          value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.75rem' }} />
      </div>

      {loading ? <Loading /> : chefs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Search size={28} color="var(--primary)" /></div>
          <h3>No chefs found</h3>
          <p style={{ color: 'var(--muted-fg)' }}>Try adjusting your search.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {chefs.map(c => <ChefCard key={c.id} chef={c} />)}
        </div>
      )}
    </div>
  );
}
