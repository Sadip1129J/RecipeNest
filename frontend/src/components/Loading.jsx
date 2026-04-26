// Loading.jsx — reusable loading spinner
export default function Loading({ text = 'Loading...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem', gap: '1rem' }}>
      <div className="spinner" />
      <p style={{ color: 'var(--muted-fg)', fontSize: '0.875rem' }}>{text}</p>
    </div>
  );
}
