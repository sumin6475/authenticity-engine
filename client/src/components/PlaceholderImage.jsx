/** Picsum placeholder; optional `seed` for stable image per card. */
const PlaceholderImage = ({ width = 400, height = 200, seed, className = '', alt = '' }) => {
  const w = width || 400;
  const h = height || 200;
  const url = seed
    ? `https://picsum.photos/seed/${seed}/${w}/${h}`
    : `https://picsum.photos/${w}/${h}`;

  return (
    <img
      src={url}
      alt={alt || 'Placeholder'}
      className={`object-cover rounded-xl bg-ae-bg ${className}`}
      loading="lazy"
    />
  );
};

export default PlaceholderImage;
