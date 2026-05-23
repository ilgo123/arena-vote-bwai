import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Import semua halaman
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projector from './pages/Projector'; // <-- Pastikan ini sudah di-import!

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* The Arena (Peserta) */}
        <Route element={<ProtectedRoute requiredRole="voter" />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Live Leaderboard (Admin MC) */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/projector" element={<Projector />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;