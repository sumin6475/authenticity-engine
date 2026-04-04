import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Capture from "./pages/Capture";
import Reflection from "./pages/Reflection";
import Insight from "./pages/Insight";
import CaptureDetail from "./pages/CaptureDetail";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Capture는 하단 네비 없이 전체 화면 */}
        <Route path="/capture" element={<Capture />} />
        {/* 나머지는 Layout(하단 네비) — RR7은 pathless+절대자식보다 / + 상대 경로가 안정적 */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="reflection" element={<Reflection />} />
          <Route path="insight" element={<Insight />} />
          <Route path="capture/:id" element={<CaptureDetail />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
