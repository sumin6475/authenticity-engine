import { NavLink } from "react-router-dom";

/** Floating pill tab bar: Home, Reflection, Insight. */
const BottomNav = () => {
  return (
    <nav
      className="fixed left-1/2 -translate-x-1/2 z-50 w-[min(320px,78vw)] rounded-full px-2 py-0"
      style={{
        bottom: "calc(var(--bottom-nav-gap) + env(safe-area-inset-bottom))",
        background: "color-mix(in srgb, var(--ae-surface) 70%, transparent)",
        backdropFilter: "blur(40px) saturate(200%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        boxShadow: "var(--ae-card-shadow)",
      }}
    >
      <div className="flex items-center justify-around gap-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center justify-center gap-0.5 py-1 rounded-full transition-colors min-w-0 ${
              isActive ? "text-gray-600" : "text-gray-500 hover:text-gray-700"
            }`
          }
        >
          {({ isActive }) => (
            <div
              className={`w-full flex flex-col items-center justify-center rounded-full transition-colors ${
                isActive
                  ? "bg-white/85 backdrop-blur-md shadow-ae-card text-gray-800 py-1.5"
                  : "text-gray-500 py-1.5"
              }`}
            >
              <span
                className="flex h-9 items-center justify-center rounded-full text-4xl font-medium"
                aria-hidden="true"
              >
                ◆
              </span>
              <span className="text-xs font-medium">Home</span>
            </div>
          )}
        </NavLink>
        <NavLink
          to="/reflection"
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center justify-center gap-0.5 py-1 rounded-full transition-colors min-w-0 ${
              isActive ? "text-gray-600" : "text-gray-500 hover:text-gray-700"
            }`
          }
        >
          {({ isActive }) => (
            <div
              className={`w-full flex flex-col items-center justify-center rounded-full transition-colors ${
                isActive
                  ? "bg-white/85 backdrop-blur-md shadow-ae-card text-gray-800 py-1.5"
                  : "text-gray-500 py-1.5"
              }`}
            >
              <span
                className="flex h-9 items-center justify-center rounded-full text-3xl font-medium"
                aria-hidden="true"
              >
                ●
              </span>
              <span className="text-xs font-medium">Reflection</span>
            </div>
          )}
        </NavLink>
        <NavLink
          to="/insight"
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center justify-center gap-0.5 py-1 rounded-full transition-colors min-w-0 ${
              isActive ? "text-gray-600" : "text-gray-500 hover:text-gray-700"
            }`
          }
        >
          {({ isActive }) => (
            <div
              className={`w-full flex flex-col items-center justify-center rounded-full transition-colors ${
                isActive
                  ? "bg-white/85 backdrop-blur-md shadow-ae-card text-gray-800 py-1.5"
                  : "text-gray-500 py-1.5"
              }`}
            >
              <span
                className="flex h-9 items-center justify-center rounded-full text-4xl font-medium"
                aria-hidden="true"
              >
                ▲
              </span>
              <span className="text-xs font-medium">Insight</span>
            </div>
          )}
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;
