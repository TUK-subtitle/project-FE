import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MyPage from '@/pages/MyPage';
import RecordingPage from '@/pages/RecordingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/mypage" replace />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/recording" element={<RecordingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
