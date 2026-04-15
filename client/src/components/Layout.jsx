import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import BottomNav from "./BottomNav";
import BottomSheet from "./BottomSheet";
import Capture from "../pages/Capture";
import Fab from "./Fab";

/** 공통 레이아웃: 콘텐츠 + FAB(fixed) + 하단 네비 */
const Layout = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const headerTitleMap = {
    "/reflection": "Reflection",
    "/insight": "Insight",
  };
  const sharedHeaderTitle = headerTitleMap[location.pathname] || "";
  return (
    <div
      className="min-h-screen"
      style={{
        // 상단 safe area + 기본 여백을 공통 적용해서 페이지별 시작 위치를 맞춘다.
        "--app-top-space": "calc(env(safe-area-inset-top) + 16px)",
        // 하단 고정 UI 높이를 한 곳에서 관리해서 페이지별 겹침을 줄인다.
        "--bottom-nav-height": "80px",
        "--bottom-nav-gap": "16px",
        "--bottom-nav-safe-space":
          "calc(var(--bottom-nav-height) + var(--bottom-nav-gap) + env(safe-area-inset-bottom) + 10px)",
        paddingBottom: "var(--bottom-nav-safe-space)",
      }}
    >
      <div
        className="w-full min-h-full"
        style={{ paddingTop: "var(--app-top-space)" }}
      >
        {sharedHeaderTitle && (
          <div className="px-5 mb-2">
            {/* Reflection/Insight 공통 헤더를 Layout에서 관리해 중복 코드를 줄인다. */}
            <div className="flex justify-between items-center pb-2 px-5 border-b border-gray-100/80">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight m-0">
                {sharedHeaderTitle}
              </h1>
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors border-0 p-0"
                aria-label="Profile"
                onClick={() => navigate("/profile")}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z"
                    fill="#60a5fa"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
        <Outlet />
      </div>
      <Fab onClick={() => setSheetOpen(true)} />
      <BottomNav />
      <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)}>
        <Capture inBottomSheet onComplete={() => setSheetOpen(false)} />
      </BottomSheet>
    </div>
  );
};

export default Layout;
