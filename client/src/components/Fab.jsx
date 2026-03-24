import { Link } from 'react-router-dom';

/**
 * 플로팅 + 버튼: position fixed, 스크롤해도 항상 같은 위치
 * 430px 모바일 컨테이너 오른쪽 기준으로 배치 (네비 바로 위, 오른쪽 16px)
 * right = 50vw - 215px + 16px (컨테이너 오른쪽에서 16px 안쪽)
 */
const Fab = () => {
  return (
    <Link
      to="/capture"
      className="fixed z-40 flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-2xl font-light text-white shadow-lg hover:bg-sky-600"
      style={{
        bottom: '100px',
        right: 'max(1rem, calc(50vw - 215px + 16px))',
      }}
      aria-label="New capture"
    >
      +
    </Link>
  );
};

export default Fab;
