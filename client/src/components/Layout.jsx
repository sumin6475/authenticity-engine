import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import Fab from './Fab';

/** 공통 레이아웃: 콘텐츠 + FAB(fixed) + 하단 네비 */
const Layout = () => {
  return (
    <div className="min-h-screen pb-20">
      <div className="w-full min-h-full">
        <Outlet />
      </div>
      <Fab />
      <BottomNav />
    </div>
  );
};

export default Layout;
