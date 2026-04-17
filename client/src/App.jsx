/** App routes: full-screen capture vs tab shell (`Layout`). */
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
        <Route path="/capture" element={<Capture />} />
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
