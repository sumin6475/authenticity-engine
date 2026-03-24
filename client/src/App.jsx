import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Capture from './pages/Capture';
import Reflection from './pages/Reflection';
import Insight from './pages/Insight';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Capture는 하단 네비 없이 전체 화면 */}
        <Route path="/capture" element={<Capture />} />
        {/* 나머지는 Layout(하단 네비) 포함 */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/reflection" element={<Reflection />} />
          <Route path="/insight" element={<Insight />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
