export default function SkillPill({ 
  skill, 
  variant = 'offered', 
  highlighted = false, 
  onRemove = null 
}) {
  const isOffered = variant === 'offered';
  const bgColor = isOffered ? 'var(--skill-offered-bg)' : 'var(--skill-needed-bg)';
  const textColor = isOffered ? 'var(--skill-offered-text)' : 'var(--skill-needed-text)';
  const borderColor = isOffered ? 'var(--skill-offered-border)' : 'var(--skill-needed-border)';

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 12px',
      borderRadius: 'var(--radius-full)',
      background: bgColor,
      color: textColor,
      border: highlighted ? `2px solid ${borderColor}` : `1px solid ${borderColor}`,
      fontSize: '13px',
      fontWeight: highlighted ? '600' : '500',
      margin: '4px',
      whiteSpace: 'nowrap'
    }}>
      {skill}
      {onRemove && (
        <button
          onClick={() => onRemove(skill)}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            fontSize: '16px',
            opacity: 0.6,
            padding: 0,
            marginLeft: '4px'
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
