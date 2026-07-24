import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import MainPage from '@/pages/MainPage';
import MyPage from '@/pages/MyPage';
import NoteDetailPage from '@/pages/NoteDetailPage';
import RecordingPage from '@/pages/RecordingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/recording" element={<RecordingPage />} />
        <Route path="/contents/:contentId" element={<NoteDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
