import { useState } from 'react';

export default function StarRating({ 
  value = 0, 
  readOnly = false, 
  onChange = null 
}) {
  const [hoverRating, setHoverRating] = useState(0);

  const stars = [1, 2, 3, 4, 5];
  const displayRating = hoverRating || value;

  return (
    <div style={{
      display: 'flex',
      gap: '4px',
      fontSize: '24px'
    }}>
      {stars.map(star => (
        <button
          key={star}
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          style={{
            background: 'none',
            border: 'none',
            cursor: readOnly ? 'default' : 'pointer',
            padding: 0,
            color: star <= displayRating ? '#ff9800' : '#ddd',
            transition: 'color 0.2s'
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}
