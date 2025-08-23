import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import BasicLayout from './layouts/BasicLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import RegistrationManagement from './pages/RegistrationManagement';
import ProjectManagement from './pages/ProjectManagement';
import EvaluationSystem from './pages/EvaluationSystem';
import ContentManagement from './pages/ContentManagement';
import DataStatistics from './pages/DataStatistics';
import SystemSettings from './pages/SystemSettings';
import useAuth from './hooks/useAuth';

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <BasicLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/registrations" element={<RegistrationManagement />} />
        <Route path="/projects" element={<ProjectManagement />} />
        <Route path="/evaluation" element={<EvaluationSystem />} />
        <Route path="/content" element={<ContentManagement />} />
        <Route path="/statistics" element={<DataStatistics />} />
        <Route path="/settings" element={<SystemSettings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BasicLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
