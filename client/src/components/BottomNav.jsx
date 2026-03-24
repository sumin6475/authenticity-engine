import { NavLink } from 'react-router-dom';

/**
 * 하단 탭 바: 플로팅 캡슐 형태
 * Home ◆ / Reflection ● / Insight ▲
 * 활성 탭은 아이콘만 연한 파란 원형 배경으로 강조
 */
const BottomNav = () => {
  return (
    <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[min(280px,70vw)] rounded-full bg-white shadow-lg px-4 py-2">
      <div className="flex items-center justify-around gap-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center justify-center gap-0.5 py-2 rounded-full transition-colors min-w-0 ${
              isActive ? 'text-sky-600' : 'text-gray-500 hover:text-gray-700'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-2xl font-medium ${
                  isActive ? 'bg-sky-100 text-sky-600' : ''
                }`}
                aria-hidden="true"
              >
                ◆
              </span>
              <span className="text-xs font-medium">Home</span>
            </>
          )}
        </NavLink>
        <NavLink
          to="/reflection"
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center justify-center gap-0.5 py-2 rounded-full transition-colors min-w-0 ${
              isActive ? 'text-sky-600' : 'text-gray-500 hover:text-gray-700'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-2xl font-medium ${
                  isActive ? 'bg-sky-100 text-sky-600' : ''
                }`}
                aria-hidden="true"
              >
                ●
              </span>
              <span className="text-xs font-medium">Reflection</span>
            </>
          )}
        </NavLink>
        <NavLink
          to="/insight"
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center justify-center gap-0.5 py-2 rounded-full transition-colors min-w-0 ${
              isActive ? 'text-sky-600' : 'text-gray-500 hover:text-gray-700'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-2xl font-medium ${
                  isActive ? 'bg-sky-100 text-sky-600' : ''
                }`}
                aria-hidden="true"
              >
                ▲
              </span>
              <span className="text-xs font-medium">Insight</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;
