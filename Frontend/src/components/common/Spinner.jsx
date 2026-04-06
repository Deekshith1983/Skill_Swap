export default function Spinner({ size = 'md', fullPage = false }) {
  const sizeMap = { sm: 20, md: 32, lg: 48 };
  const dimension = sizeMap[size];

  if (fullPage) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999
      }}>
        <div style={{
          width: dimension,
          height: dimension,
          border: `4px solid rgba(0,102,204,0.1)`,
          borderTopColor: 'var(--primary-blue)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
      </div>
    );
  }

  return (
    <div style={{
      width: dimension,
      height: dimension,
      border: `3px solid rgba(0,102,204,0.1)`,
      borderTopColor: 'var(--primary-blue)',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
  );
}
