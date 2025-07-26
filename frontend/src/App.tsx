import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Home from './pages/Home';
import NumberGame from './pages/NumberGame';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { cn } from './lib/utils';
import { useScrollToTop } from './hooks/useScrollToTop';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { user } = useAuth();
  
  // 使用滚动到顶部的 Hook
  useScrollToTop();
  
  console.log('AppRoutes渲染，用户状态:', user);
  
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }
  
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/number-game" element={<NumberGame />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  console.log('App组件渲染');
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 