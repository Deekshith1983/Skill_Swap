import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// Import CSS styles (centralized)
import "./styles/global.css";
import "./styles/index.css";

import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import RequestsPage from "./pages/RequestsPage";
import SchedulePage from "./pages/SchedulePage";

import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./AuthContext";
import Navbar from "./components/common/Navbar";
import useAuth from "./useAuth";

function AppContent() {
  const { isLoggedIn, logout, user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <>
      {isLoggedIn && <Navbar user={user} onLogout={handleLogout} />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage key={refreshKey} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/me"
          element={
            <ProtectedRoute>
              <ProfilePage key={refreshKey} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <RequestsPage key={refreshKey} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <SchedulePage key={refreshKey} />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
