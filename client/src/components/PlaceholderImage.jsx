/**
 * placeholder 이미지: 회색 박스 또는 Unsplash 랜덤
 * seed 있으면 동일 비율로 고정, 없으면 랜덤
 */
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
      className={`object-cover rounded-lg bg-gray-200 ${className}`}
      loading="lazy"
    />
  );
};

export default PlaceholderImage;
