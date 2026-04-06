const colors = ['#0066cc', '#00a374', '#ff6b6b', '#ffa940', '#722ed1'];

export default function Avatar({ name, size = 'md' }) {
  const initials = (name || '?')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const bgColor = colors[
    (name || '').charCodeAt(0) % colors.length
  ];

  const sizeMap = {
    sm: 28,
    md: 40,
    lg: 56
  };

  const fontSize = {
    sm: 12,
    md: 14,
    lg: 20
  };

  return (
    <div style={{
      width: sizeMap[size],
      height: sizeMap[size],
      borderRadius: '50%',
      background: bgColor,
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: fontSize[size],
      fontWeight: 'bold',
      flexShrink: 0
    }}>
      {initials}
    </div>
  );
}
