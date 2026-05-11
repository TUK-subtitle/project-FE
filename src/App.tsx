import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import MyPage from '@/pages/MyPage';
import RecordingPage from '@/pages/RecordingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/recording" element={<RecordingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
